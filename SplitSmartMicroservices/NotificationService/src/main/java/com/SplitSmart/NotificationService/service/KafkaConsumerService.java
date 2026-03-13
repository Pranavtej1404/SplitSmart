package com.SplitSmart.NotificationService.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerService {

    private final NotificationService notificationService;

    @KafkaListener(topics = "expense-created", groupId = "notification-group")
    public void consumeExpenseCreated(String message) {
        log.info("Consumed expense-created event: {}", message);
        // Message format assumed: userId:message
        String[] parts = message.split(":", 2);
        if (parts.length == 2) {
            notificationService.createNotification(UUID.fromString(parts[0]), parts[1], "EXPENSE_CREATED");
        }
    }

    @KafkaListener(topics = "expense-approved", groupId = "notification-group")
    public void consumeExpenseApproved(String message) {
        log.info("Consumed expense-approved event: {}", message);
        String[] parts = message.split(":", 2);
        if (parts.length == 2) {
            notificationService.createNotification(UUID.fromString(parts[0]), parts[1], "EXPENSE_APPROVED");
        }
    }

    @KafkaListener(topics = "fraud-detected", groupId = "notification-group")
    public void consumeFraudDetected(String message) {
        log.info("Consumed fraud-detected event: {}", message);
        String[] parts = message.split(":", 2);
        if (parts.length == 2) {
            notificationService.createNotification(UUID.fromString(parts[0]), parts[1], "FRAUD_ALERT");
        }
    }

    @KafkaListener(topics = "settlement-recorded", groupId = "notification-group")
    public void consumeSettlementRecorded(String message) {
        log.info("Consumed settlement-recorded event: {}", message);
        String[] parts = message.split(":", 2);
        if (parts.length == 2) {
            notificationService.createNotification(UUID.fromString(parts[0]), parts[1], "SETTLEMENT");
        }
    }
}
