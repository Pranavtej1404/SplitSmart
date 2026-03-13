package com.SplitSmart.BalanceService.repository;

import com.SplitSmart.BalanceService.entity.Balance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BalanceRepository extends JpaRepository<Balance, UUID> {
    List<Balance> findByGroupId(UUID groupId);

    Optional<Balance> findByGroupIdAndDebtorIdAndCreditorId(UUID groupId, UUID debtorId, UUID creditorId);

    List<Balance> findByDebtorIdOrCreditorId(UUID userId, UUID userId2);
}
