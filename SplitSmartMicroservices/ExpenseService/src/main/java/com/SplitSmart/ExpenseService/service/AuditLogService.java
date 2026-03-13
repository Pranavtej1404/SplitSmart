package com.SplitSmart.ExpenseService.service;

import com.SplitSmart.ExpenseService.entity.AuditLog;
import com.SplitSmart.ExpenseService.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    private final AuditLogRepository repository;

    public void log(UUID groupId, UUID expenseId, UUID userId, String action, String details) {
        AuditLog auditLog = AuditLog.builder()
                .groupId(groupId)
                .expenseId(expenseId)
                .userId(userId)
                .action(action)
                .details(details)
                .build();
        repository.save(auditLog);
    }

    public List<AuditLog> getLogsByGroupId(UUID groupId) {
        return repository.findByGroupIdOrderByTimestampDesc(groupId);
    }

    public List<AuditLog> getLogsByExpenseId(UUID expenseId) {
        return repository.findByExpenseIdOrderByTimestampDesc(expenseId);
    }
}
