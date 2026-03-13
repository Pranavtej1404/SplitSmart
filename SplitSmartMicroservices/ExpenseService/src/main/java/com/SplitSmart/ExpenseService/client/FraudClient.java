package com.SplitSmart.ExpenseService.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@FeignClient(name = "fraud-detection-service")
public interface FraudClient {

    @PostMapping("/api/fraud/analyze")
    FraudAnalysisResponse analyze(@RequestBody AnalysisRequest request);

    @PostMapping("/api/fraud/analyze-deletion/{expenseId}")
    void analyzeDeletion(@PathVariable("expenseId") UUID expenseId);

    @Data
    class AnalysisRequest {
        private UUID expenseId;
        private UUID groupId;
        private BigDecimal amount;
        private String description;
        private boolean hasReceipt;
    }

    @Data
    class FraudAnalysisResponse {
        private UUID id;
        private int riskScore;
        private String riskLevel;
        private String findings;
        private boolean requiresForcedApproval;
    }
}
