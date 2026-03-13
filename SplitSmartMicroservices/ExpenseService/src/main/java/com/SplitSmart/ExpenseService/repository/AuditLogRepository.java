package com.SplitSmart.ExpenseService.repository;

import com.SplitSmart.ExpenseService.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    List<AuditLog> findByGroupIdOrderByTimestampDesc(UUID groupId);

    List<AuditLog> findByExpenseIdOrderByTimestampDesc(UUID expenseId);
}
