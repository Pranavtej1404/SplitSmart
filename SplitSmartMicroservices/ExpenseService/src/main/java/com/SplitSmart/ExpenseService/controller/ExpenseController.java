package com.SplitSmart.ExpenseService.controller;

import com.SplitSmart.ExpenseService.entity.Expense;
import com.SplitSmart.ExpenseService.entity.ExpenseParticipant;
import com.SplitSmart.ExpenseService.service.ExpenseService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final com.SplitSmart.ExpenseService.service.AuditLogService auditLogService;

    @GetMapping("/group/{groupId}/audit")
    public ResponseEntity<List<com.SplitSmart.ExpenseService.entity.AuditLog>> getGroupAuditLogs(
            @PathVariable UUID groupId) {
        return ResponseEntity.ok(auditLogService.getLogsByGroupId(groupId));
    }

    @GetMapping("/{expenseId}/audit")
    public ResponseEntity<List<com.SplitSmart.ExpenseService.entity.AuditLog>> getExpenseAuditLogs(
            @PathVariable UUID expenseId) {
        return ResponseEntity.ok(auditLogService.getLogsByExpenseId(expenseId));
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody ExpenseRequest request) {
        Expense expense = Expense.builder()
                .groupId(request.getGroupId())
                .createdBy(request.getCreatedBy())
                .title(request.getTitle())
                .description(request.getDescription())
                .amount(request.getAmount())
                .build();

        return ResponseEntity.ok(expenseService.createExpense(expense, request.getParticipants()));
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpense(@PathVariable UUID expenseId) {
        Expense expense = expenseService.getExpenseById(expenseId);
        List<ExpenseParticipant> participants = expenseService.getParticipantsByExpenseId(expenseId);

        ExpenseResponse response = new ExpenseResponse();
        response.setExpense(expense);
        response.setParticipants(participants);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Expense>> getGroupExpenses(@PathVariable UUID groupId) {
        return ResponseEntity.ok(expenseService.getExpensesByGroupId(groupId));
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<Expense> updateExpense(@PathVariable UUID expenseId, @RequestBody ExpenseRequest request) {
        Expense expense = expenseService.getExpenseById(expenseId);
        expense.setTitle(request.getTitle());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        // Simple update for now
        return ResponseEntity.ok(expenseService.updateExpense(expense));
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable UUID expenseId) {
        expenseService.deleteExpense(expenseId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{expenseId}/approve")
    public ResponseEntity<Void> approve(@PathVariable UUID expenseId) {
        expenseService.finalizeApproval(expenseId);
        return ResponseEntity.ok().build();
    }

    @Data
    public static class ExpenseRequest {
        private UUID groupId;
        private UUID createdBy;
        private String title;
        private String description;
        private BigDecimal amount;
        private List<ExpenseParticipant> participants;
    }

    @Data
    public static class ExpenseResponse {
        private Expense expense;
        private List<ExpenseParticipant> participants;
    }
}
