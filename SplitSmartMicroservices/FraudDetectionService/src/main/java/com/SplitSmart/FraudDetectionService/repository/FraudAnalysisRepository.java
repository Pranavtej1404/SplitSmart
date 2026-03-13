package com.SplitSmart.FraudDetectionService.repository;

import com.SplitSmart.FraudDetectionService.entity.FraudAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FraudAnalysisRepository extends JpaRepository<FraudAnalysis, UUID> {
    Optional<FraudAnalysis> findByExpenseId(UUID expenseId);
}
