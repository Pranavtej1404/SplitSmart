package com.SplitSmart.BalanceService.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "balances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Balance {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID groupId;

    @Column(nullable = false)
    private UUID debtorId;

    @Column(nullable = false)
    private UUID creditorId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;
}
