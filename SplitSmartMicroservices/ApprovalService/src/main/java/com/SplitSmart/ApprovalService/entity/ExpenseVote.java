package com.SplitSmart.ApprovalService.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "expense_votes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseVote {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID voteId;

    @Column(nullable = false)
    private UUID expenseId;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 10)
    private String vote; // APPROVE, REJECT

    @CreationTimestamp
    private LocalDateTime votedAt;
}
