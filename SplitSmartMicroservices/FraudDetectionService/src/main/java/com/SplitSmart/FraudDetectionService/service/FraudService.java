package com.SplitSmart.FraudDetectionService.service;

import com.SplitSmart.FraudDetectionService.entity.FraudAnalysis;
import com.SplitSmart.FraudDetectionService.repository.FraudAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.ai.chat.client.ChatClient;

@Service
public class FraudService {

    private final FraudAnalysisRepository repository;
    private final ChatClient chatClient;
    private final KafkaProducerService kafkaProducer;

    public FraudService(FraudAnalysisRepository repository, ChatClient.Builder chatClientBuilder,
            KafkaProducerService kafkaProducer) {
        this.repository = repository;
        this.chatClient = chatClientBuilder.build();
        this.kafkaProducer = kafkaProducer;
    }

    public String testConnection() {
        return chatClient.prompt("Respond with 'Hello from Gemini!' if you can hear me.")
                .call()
                .content();
    }

    public FraudAnalysis analyzeExpense(UUID expenseId, UUID groupId, BigDecimal amount, String description,
            boolean hasReceipt) {
        int score = 0;
        StringBuilder findings = new StringBuilder();

        // 1. Rule: Large expense without receipt
        if (amount.compareTo(new BigDecimal("1000")) > 0 && !hasReceipt) {
            score += 40;
            findings.append("Large expense (>1000) without receipt. ");
        }

        // 2. AI Analysis: Evaluate description credibility and risk signals
        try {
            String aiResponse = chatClient.prompt()
                    .user("Analyze this expense for potential fraud:\n" +
                            "Amount: " + amount + "\n" +
                            "Description: " + description + "\n" +
                            "Has Receipt: " + hasReceipt + "\n\n" +
                            "Return only a single integer representing additional risk score (0-60) and a brief reason.")
                    .call()
                    .content();

            findings.append("AI Feedback: ").append(aiResponse);
            // Simplified parsing: find first number
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("\\d+").matcher(aiResponse);
            if (m.find()) {
                score += Integer.parseInt(m.group());
            }
        } catch (Exception e) {
            findings.append("AI Analysis failed: ").append(e.getMessage());
        }

        // Finalize score
        String riskLevel = (score >= 70) ? "HIGH" : (score >= 30) ? "MEDIUM" : "LOW";

        FraudAnalysis analysis = FraudAnalysis.builder()
                .expenseId(expenseId)
                .groupId(groupId)
                .riskScore(Math.min(score, 100))
                .riskLevel(riskLevel)
                .findings(findings.toString())
                .requiresForcedApproval(score >= 70)
                .build();

        FraudAnalysis savedAnalysis = repository.save(analysis);

        if ("HIGH".equals(riskLevel)) {
            // Notify participants (simplified: using groupId)
            kafkaProducer.sendMessage("fraud-detected",
                    groupId + ":Suspicious expense detected: " + description + ". Review required.");
        }

        return savedAnalysis;
    }

    public java.util.List<FraudAnalysis> getAllAnalyses() {
        return repository.findAll();
    }

    public java.util.Optional<FraudAnalysis> getAnalysisByExpenseId(UUID expenseId) {
        return repository.findByExpenseId(expenseId);
    }

    public void analyzeDeletion(UUID expenseId) {
        // PRD Requirement: Analyze suspicious deletion behavior
        System.out.println("AI analyzing deletion for expense: " + expenseId);

        try {
            String aiResponse = chatClient.prompt()
                    .user("Analyze the deletion of expense ID: " + expenseId
                            + ". Is this deletion suspicious? Consider if the user might be trying to hide a large or duplicate transaction. Provide a risk score (0-100) and reasoning.")
                    .call()
                    .content();

            System.out.println("AI Deletion Analysis: " + aiResponse);
            // In a real system, we'd store this in an 'AuditLog' or 'DeletionAnalysis'
            // table.
            // For now, we'll log it for transparency as per F17/F29.
            kafkaProducer.sendMessage("fraud-detected",
                    "SYSTEM: Deletion analysis for " + expenseId + ": " + aiResponse);
        } catch (Exception e) {
            System.err.println("AI Deletion Analysis failed: " + e.getMessage());
        }
    }
}
