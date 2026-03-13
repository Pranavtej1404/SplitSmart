package com.SplitSmart.GroupService.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID groupId;

    @Column(nullable = false, length = 100)
    private String groupName;

    @Column(nullable = false)
    private UUID createdBy;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
