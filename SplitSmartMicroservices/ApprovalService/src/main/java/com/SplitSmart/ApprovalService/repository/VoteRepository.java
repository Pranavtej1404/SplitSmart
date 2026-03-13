package com.SplitSmart.ApprovalService.repository;

import com.SplitSmart.ApprovalService.entity.ExpenseVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VoteRepository extends JpaRepository<ExpenseVote, UUID> {
    List<ExpenseVote> findByExpenseId(UUID expenseId);

    List<ExpenseVote> findByUserId(UUID userId);
}
