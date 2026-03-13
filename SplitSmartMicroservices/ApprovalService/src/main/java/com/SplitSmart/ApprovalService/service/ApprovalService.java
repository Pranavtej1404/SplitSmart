package com.SplitSmart.ApprovalService.service;

import com.SplitSmart.ApprovalService.entity.ExpenseVote;
import com.SplitSmart.ApprovalService.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApprovalService {

    private final VoteRepository voteRepository;
    private final com.SplitSmart.ApprovalService.client.ExpenseClient expenseClient;
    private final KafkaProducerService kafkaProducer;

    @Transactional
    public ExpenseVote castVote(UUID expenseId, UUID userId, String vote) {
        ExpenseVote expenseVote = ExpenseVote.builder()
                .expenseId(expenseId)
                .userId(userId)
                .vote(vote)
                .build();
        ExpenseVote savedVote = voteRepository.save(expenseVote);

        // Check if now approved or rejected
        try {
            com.SplitSmart.ApprovalService.client.ExpenseClient.ExpenseResponse details = expenseClient
                    .getExpenseDetails(expenseId);
            boolean isFraud = "FRAUD_WARNING".equals(details.getExpense().getStatus());
            int total = details.getParticipants().size();

            if (isApproved(expenseId, total, isFraud)) {
                expenseClient.finalizeApproval(expenseId);
                // Notify payer and participants
                kafkaProducer.sendMessage("expense-approved",
                        details.getExpense().getPayerId() + ":Your expense has been approved: "
                                + details.getExpense().getDescription());
            } else if ("REJECT".equals(vote)) {
                // Simplification: if one reject, we might mark as rejected or just notify?
                // PRD says "Expense rejected" notifications. Let's assume one reject is enough
                // for notification if it blocks approval.
                kafkaProducer.sendMessage("expense-approved", // Reusing topic or adding specific logic
                        details.getExpense().getPayerId() + ":Your expense has received a rejection vote: "
                                + details.getExpense().getDescription());
            }
        } catch (Exception e) {
            System.err.println("Failed to check approval status: " + e.getMessage());
        }

        return savedVote;
    }

    public List<ExpenseVote> getVotesForExpense(UUID expenseId) {
        return voteRepository.findByExpenseId(expenseId);
    }

    public boolean isApproved(UUID expenseId, int totalParticipants, boolean isFraudFlagged) {
        List<ExpenseVote> votes = getVotesForExpense(expenseId);
        long approveCount = votes.stream().filter(v -> "APPROVE".equals(v.getVote())).count();

        if (isFraudFlagged) {
            return approveCount == totalParticipants; // Unanimous for fraud
        } else {
            return approveCount > totalParticipants / 2; // Majority
        }
    }
}
