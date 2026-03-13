package com.SplitSmart.FraudDetectionService.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fraud_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID expenseId;
    private UUID groupId;

    private int riskScore; // 0-100
    private String riskLevel; // LOW, MEDIUM, HIGH

    @Column(length = 2000)
    private String findings; // JSON or text summary of flags

    private boolean requiresForcedApproval;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
