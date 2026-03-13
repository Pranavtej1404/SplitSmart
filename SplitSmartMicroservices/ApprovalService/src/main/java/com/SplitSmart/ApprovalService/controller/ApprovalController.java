package com.SplitSmart.ApprovalService.controller;

import com.SplitSmart.ApprovalService.entity.ExpenseVote;
import com.SplitSmart.ApprovalService.service.ApprovalService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/approvals")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService approvalService;

    @PostMapping("/vote")
    public ResponseEntity<ExpenseVote> vote(@RequestBody VoteRequest request) {
        return ResponseEntity.ok(approvalService.castVote(
                request.getExpenseId(),
                request.getUserId(),
                request.getVote()));
    }

    @GetMapping("/expense/{expenseId}/check")
    public ResponseEntity<Boolean> checkApproval(
            @PathVariable UUID expenseId,
            @RequestParam int totalParticipants,
            @RequestParam(defaultValue = "false") boolean isFraudFlagged) {
        return ResponseEntity.ok(approvalService.isApproved(expenseId, totalParticipants, isFraudFlagged));
    }

    @GetMapping("/expense/{expenseId}/votes")
    public ResponseEntity<List<ExpenseVote>> getVotes(@PathVariable UUID expenseId) {
        return ResponseEntity.ok(approvalService.getVotesForExpense(expenseId));
    }

    @Data
    public static class VoteRequest {
        private UUID expenseId;
        private UUID userId;
        private String vote;
    }
}
