package com.SplitSmart.BalanceService.service;

import com.SplitSmart.BalanceService.entity.Balance;
import com.SplitSmart.BalanceService.entity.Settlement;
import com.SplitSmart.BalanceService.repository.BalanceRepository;
import com.SplitSmart.BalanceService.repository.SettlementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BalanceService {

    private final BalanceRepository balanceRepository;
    private final SettlementRepository settlementRepository;
    private final KafkaProducerService kafkaProducer;

    public List<Balance> getBalancesByGroupId(UUID groupId) {
        return balanceRepository.findByGroupId(groupId);
    }

    @Transactional
    public Balance updateBalance(UUID groupId, UUID debtorId, UUID creditorId, BigDecimal amountChange) {
        Optional<Balance> existingBalance = balanceRepository.findByGroupIdAndDebtorIdAndCreditorId(groupId, debtorId,
                creditorId);

        Balance balance;
        if (existingBalance.isPresent()) {
            balance = existingBalance.get();
            balance.setAmount(balance.getAmount().add(amountChange));
        } else {
            balance = Balance.builder()
                    .groupId(groupId)
                    .debtorId(debtorId)
                    .creditorId(creditorId)
                    .amount(amountChange)
                    .build();
        }

        return balanceRepository.save(balance);
    }

    @Transactional
    public Settlement recordSettlement(UUID groupId, UUID fromUser, UUID toUser, BigDecimal amount) {
        // Record the settlement
        Settlement settlement = Settlement.builder()
                .groupId(groupId)
                .fromUser(fromUser)
                .toUser(toUser)
                .amount(amount)
                .build();
        settlementRepository.save(settlement);

        // Update the balance (reduce debt)
        updateBalance(groupId, fromUser, toUser, amount.negate());

        // Notify both parties
        kafkaProducer.sendMessage("settlement-recorded",
                fromUser + ":You have settled " + amount + " to " + toUser);
        kafkaProducer.sendMessage("settlement-recorded",
                toUser + ":" + fromUser + " has recorded a settlement of " + amount + " to you");

        return settlement;
    }

    @Transactional
    public void simplifyDebts(UUID groupId) {
        List<Balance> currentBalances = balanceRepository.findByGroupId(groupId);

        // 1. Calculate net balance for each user
        java.util.Map<UUID, BigDecimal> netAmounts = new java.util.HashMap<>();
        for (Balance b : currentBalances) {
            netAmounts.put(b.getDebtorId(),
                    netAmounts.getOrDefault(b.getDebtorId(), BigDecimal.ZERO).subtract(b.getAmount()));
            netAmounts.put(b.getCreditorId(),
                    netAmounts.getOrDefault(b.getCreditorId(), BigDecimal.ZERO).add(b.getAmount()));
        }

        // 2. Separate into debtors and creditors
        java.util.List<UserBalance> debtors = new java.util.ArrayList<>();
        java.util.List<UserBalance> creditors = new java.util.ArrayList<>();

        for (java.util.Map.Entry<UUID, BigDecimal> entry : netAmounts.entrySet()) {
            if (entry.getValue().compareTo(BigDecimal.ZERO) < 0) {
                debtors.add(new UserBalance(entry.getKey(), entry.getValue().abs()));
            } else if (entry.getValue().compareTo(BigDecimal.ZERO) > 0) {
                creditors.add(new UserBalance(entry.getKey(), entry.getValue()));
            }
        }

        // Sort to optimize matching (optional but good)
        debtors.sort((a, b) -> b.amount.compareTo(a.amount));
        creditors.sort((a, b) -> b.amount.compareTo(a.amount));

        // 3. Clear old balances
        balanceRepository.deleteAll(currentBalances);

        // 4. Greedily match
        int d = 0, c = 0;
        while (d < debtors.size() && c < creditors.size()) {
            UserBalance debtor = debtors.get(d);
            UserBalance creditor = creditors.get(c);

            BigDecimal settleAmount = debtor.amount.min(creditor.amount);

            if (settleAmount.compareTo(BigDecimal.ZERO) > 0) {
                balanceRepository.save(Balance.builder()
                        .groupId(groupId)
                        .debtorId(debtor.userId)
                        .creditorId(creditor.userId)
                        .amount(settleAmount)
                        .build());
            }

            debtor.amount = debtor.amount.subtract(settleAmount);
            creditor.amount = creditor.amount.subtract(settleAmount);

            if (debtor.amount.compareTo(BigDecimal.ZERO) == 0)
                d++;
            if (creditor.amount.compareTo(BigDecimal.ZERO) == 0)
                c++;
        }
    }

    private static class UserBalance {
        UUID userId;
        BigDecimal amount;

        UserBalance(UUID userId, BigDecimal amount) {
            this.userId = userId;
            this.amount = amount;
        }
    }
}
