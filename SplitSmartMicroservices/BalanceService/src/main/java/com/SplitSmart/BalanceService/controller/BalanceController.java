package com.SplitSmart.BalanceService.controller;

import com.SplitSmart.BalanceService.entity.Balance;
import com.SplitSmart.BalanceService.entity.Settlement;
import com.SplitSmart.BalanceService.service.BalanceService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/balances")
@RequiredArgsConstructor
public class BalanceController {

    private final BalanceService balanceService;

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Balance>> getGroupBalances(@PathVariable UUID groupId) {
        return ResponseEntity.ok(balanceService.getBalancesByGroupId(groupId));
    }

    @PostMapping("/settle")
    public ResponseEntity<Settlement> settle(@RequestBody SettlementRequest request) {
        return ResponseEntity.ok(balanceService.recordSettlement(
                request.getGroupId(),
                request.getFromUser(),
                request.getToUser(),
                request.getAmount()));
    }

    @PostMapping("/update")
    public ResponseEntity<Balance> update(@RequestBody UpdateBalanceRequest request) {
        return ResponseEntity.ok(balanceService.updateBalance(
                request.getGroupId(),
                request.getDebtorId(),
                request.getCreditorId(),
                request.getAmountChange()));
    }

    @Data
    public static class UpdateBalanceRequest {
        private UUID groupId;
        private UUID debtorId;
        private UUID creditorId;
        private BigDecimal amountChange;
    }

    @Data
    public static class SettlementRequest {
        private UUID groupId;
        private UUID fromUser;
        private UUID toUser;
        private BigDecimal amount;
    }
}
