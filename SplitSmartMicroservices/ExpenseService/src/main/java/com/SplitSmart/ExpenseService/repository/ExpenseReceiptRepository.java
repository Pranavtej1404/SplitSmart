package com.SplitSmart.ExpenseService.repository;

import com.SplitSmart.ExpenseService.entity.ExpenseReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseReceiptRepository extends JpaRepository<ExpenseReceipt, UUID> {
    List<ExpenseReceipt> findByExpenseId(UUID expenseId);
}
