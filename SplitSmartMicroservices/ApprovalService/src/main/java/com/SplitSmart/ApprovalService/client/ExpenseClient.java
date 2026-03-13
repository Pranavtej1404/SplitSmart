package com.SplitSmart.ApprovalService.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.UUID;

@FeignClient(name = "expense-service")
public interface ExpenseClient {

    @PostMapping("/expenses/{expenseId}/approve")
    void finalizeApproval(@PathVariable("expenseId") UUID expenseId);

    @org.springframework.web.bind.annotation.GetMapping("/expenses/{expenseId}")
    ExpenseResponse getExpenseDetails(@PathVariable("expenseId") UUID expenseId);

    @lombok.Data
    class ExpenseResponse {
        private Expense expense;
        private java.util.List<ExpenseParticipant> participants;
    }

    @lombok.Data
    class Expense {
        private UUID expenseId;
        private String status;
    }

    @lombok.Data
    class ExpenseParticipant {
        private UUID userId;
    }
}
