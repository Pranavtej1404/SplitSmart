package com.SplitSmart.ExpenseService.service;

import com.SplitSmart.ExpenseService.entity.ExpenseParticipant;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ExpenseSplitService {

    public List<ExpenseParticipant> splitEqually(UUID expenseId, BigDecimal totalAmount, List<UUID> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            throw new RuntimeException("Participants list cannot be empty");
        }

        int count = userIds.size();
        BigDecimal share = totalAmount.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);

        // Handle remainder if any
        BigDecimal totalCalculated = share.multiply(BigDecimal.valueOf(count));
        BigDecimal remainder = totalAmount.subtract(totalCalculated);

        List<ExpenseParticipant> participants = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            BigDecimal amount = share;
            if (i == 0) {
                amount = share.add(remainder);
            }
            participants.add(ExpenseParticipant.builder()
                    .expenseId(expenseId)
                    .userId(userIds.get(i))
                    .shareAmount(amount)
                    .build());
        }
        return participants;
    }

    public List<ExpenseParticipant> splitCustom(UUID expenseId, List<ExpenseParticipant> manualSplits,
            BigDecimal totalAmount) {
        BigDecimal sum = manualSplits.stream()
                .map(ExpenseParticipant::getShareAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (sum.compareTo(totalAmount) != 0) {
            throw new RuntimeException(
                    "The sum of custom splits (" + sum + ") does not match the total amount (" + totalAmount + ")");
        }

        for (ExpenseParticipant p : manualSplits) {
            p.setExpenseId(expenseId);
        }
        return manualSplits;
    }
}
