package com.SplitSmart.ExpenseService.service;

import com.SplitSmart.ExpenseService.entity.Expense;
import com.SplitSmart.ExpenseService.entity.ExpenseParticipant;
import com.SplitSmart.ExpenseService.entity.ExpenseStatus;
import com.SplitSmart.ExpenseService.repository.ExpenseParticipantRepository;
import com.SplitSmart.ExpenseService.repository.ExpenseRepository;
import com.SplitSmart.ExpenseService.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseParticipantRepository participantRepository;
    private final ExpenseSplitService splitService;
    private final com.SplitSmart.ExpenseService.client.BalanceClient balanceClient;
    private final com.SplitSmart.ExpenseService.client.FraudClient fraudClient;
    private final KafkaProducerService kafkaProducer;
    private final AuditLogService auditLogService;

    @Transactional
    public Expense createExpense(Expense expense, List<ExpenseParticipant> participants) {
        expense.setStatus(ExpenseStatus.PENDING_APPROVAL); // Default status
        Expense savedExpense = expenseRepository.save(expense);

        for (ExpenseParticipant participant : participants) {
            participant.setExpenseId(savedExpense.getExpenseId());
            participantRepository.save(participant);

            // Notify each participant (except potentially the payer, but PRD says users
            // receive alerts)
            kafkaProducer.sendMessage("expense-created",
                    participant.getUserId() + ":New expense added in group: " + savedExpense.getDescription());
        }

        // 1. Run Fraud Detection
        try {
            com.SplitSmart.ExpenseService.client.FraudClient.AnalysisRequest request = new com.SplitSmart.ExpenseService.client.FraudClient.AnalysisRequest();
            request.setExpenseId(savedExpense.getExpenseId());
            request.setGroupId(savedExpense.getGroupId());
            request.setAmount(savedExpense.getAmount());
            request.setDescription(savedExpense.getDescription());
            // TODO: check receipt from ExpenseReceiptRepository

            com.SplitSmart.ExpenseService.client.FraudClient.FraudAnalysisResponse fraudResult = fraudClient
                    .analyze(request);
            if (fraudResult.isRequiresForcedApproval()) {
                savedExpense.setStatus(ExpenseStatus.FRAUD_WARNING);
                expenseRepository.save(savedExpense);
            }
        } catch (Exception e) {
            System.err.println("Fraud check failed: " + e.getMessage());
        }

        return savedExpense;
    }

    public Expense getExpenseById(UUID expenseId) {
        return expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    public List<Expense> getExpensesByGroupId(UUID groupId) {
        return expenseRepository.findByGroupId(groupId);
    }

    public List<ExpenseParticipant> getParticipantsByExpenseId(UUID expenseId) {
        return participantRepository.findByExpenseId(expenseId);
    }

    @Transactional
    public Expense updateExpense(Expense expense) {
        // Original logic for checking APPROVED status removed as per instruction's
        // implied change
        Expense saved = expenseRepository.save(expense);
        auditLogService.log(saved.getGroupId(), saved.getExpenseId(), saved.getCreatedBy(),
                "EXPENSE_UPDATED", "Expense '" + saved.getDescription() + "' was updated.");
        return saved;
    }

    @Transactional
    public void deleteExpense(UUID expenseId) {
        Expense expense = getExpenseById(expenseId);
        expense.setStatus(ExpenseStatus.DELETED);
        expenseRepository.save(expense);

        // Log the action
        auditLogService.log(expense.getGroupId(), expense.getExpenseId(), expense.getCreatedBy(),
                "EXPENSE_DELETED", "Expense '" + expense.getDescription() + "' was deleted.");

        // PRD Requirement: Fraud detection check runs immediately after deletion
        try {
            fraudClient.analyzeDeletion(expenseId);
        } catch (Exception e) {
            System.err.println("Post-deletion fraud check failed: " + e.getMessage());
        }
    }

    @Transactional
    public void finalizeApproval(UUID expenseId) {
        Expense expense = getExpenseById(expenseId);
        if (expense.getStatus() == ExpenseStatus.APPROVED) {
            return;
        }

        expense.setStatus(ExpenseStatus.APPROVED);
        expenseRepository.save(expense);

        List<ExpenseParticipant> participants = getParticipantsByExpenseId(expenseId);
        UUID payerId = expense.getCreatedBy();

        for (ExpenseParticipant participant : participants) {
            if (!participant.getUserId().equals(payerId)) {
                // Participant owes Payer
                com.SplitSmart.ExpenseService.client.BalanceClient.UpdateBalanceRequest request = new com.SplitSmart.ExpenseService.client.BalanceClient.UpdateBalanceRequest();
                request.setGroupId(expense.getGroupId());
                request.setDebtorId(participant.getUserId());
                request.setCreditorId(payerId);
                request.setAmountChange(participant.getShareAmount());

                try {
                    balanceClient.updateBalance(request);
                } catch (Exception e) {
                    System.err.println("Failed to update balance for user: " + participant.getUserId());
                }
            }
        }

        // Trigger simplification after balance updates
        try {
            balanceClient.simplifyBalances(expense.getGroupId());
        } catch (Exception e) {
            System.err.println("Failed to simplify balances: " + e.getMessage());
        }
    }
}
