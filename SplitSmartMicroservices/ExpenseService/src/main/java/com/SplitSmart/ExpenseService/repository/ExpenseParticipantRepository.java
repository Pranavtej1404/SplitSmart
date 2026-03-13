package com.SplitSmart.ExpenseService.repository;

import com.SplitSmart.ExpenseService.entity.ExpenseParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseParticipantRepository extends JpaRepository<ExpenseParticipant, UUID> {
    List<ExpenseParticipant> findByExpenseId(UUID expenseId);

    void deleteByExpenseId(UUID expenseId);
}
