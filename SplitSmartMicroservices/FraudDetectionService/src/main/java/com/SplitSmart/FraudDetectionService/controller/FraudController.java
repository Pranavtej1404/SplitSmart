package com.SplitSmart.FraudDetectionService.controller;

import com.SplitSmart.FraudDetectionService.entity.FraudAnalysis;
import com.SplitSmart.FraudDetectionService.service.FraudService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/fraud")
@RequiredArgsConstructor
public class FraudController {

    private final FraudService fraudService;

    @PostMapping("/analyze")
    public ResponseEntity<FraudAnalysis> analyze(@RequestBody AnalysisRequest request) {
        return ResponseEntity.ok(fraudService.analyzeExpense(
                request.getExpenseId(),
                request.getGroupId(),
                request.getAmount(),
                request.getDescription(),
                request.isHasReceipt()));
    }

    @GetMapping("/test-ai")
    public ResponseEntity<String> testAi() {
        try {
            return ResponseEntity.ok(fraudService.testConnection());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Gemini Connection Failed: " + e.getMessage());
        }
    }

    @GetMapping("/expense/{expenseId}")
    public ResponseEntity<FraudAnalysis> getAnalysis(@PathVariable UUID expenseId) {
        return ResponseEntity.ok(fraudService.getAnalysisByExpenseId(expenseId)
                .orElseThrow(() -> new RuntimeException("Analysis not found")));
    }

    @GetMapping("/records")
    public ResponseEntity<java.util.List<FraudAnalysis>> getRecords() {
        return ResponseEntity.ok(fraudService.getAllAnalyses());
    }

    @PostMapping("/analyze-deletion/{expenseId}")
    public ResponseEntity<Void> analyzeDeletion(@PathVariable UUID expenseId) {
        fraudService.analyzeDeletion(expenseId);
        return ResponseEntity.ok().build();
    }

    @Data
    public static class AnalysisRequest {
        private UUID expenseId;
        private UUID groupId;
        private BigDecimal amount;
        private String description;
        private boolean hasReceipt;
    }
}
