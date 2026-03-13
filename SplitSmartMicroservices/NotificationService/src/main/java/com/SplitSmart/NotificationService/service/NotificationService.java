package com.SplitSmart.NotificationService.service;

import com.SplitSmart.NotificationService.entity.Notification;
import com.SplitSmart.NotificationService.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository repository;

    public Notification createNotification(UUID userId, String message, String type) {
        Notification notification = Notification.builder()
                .userId(userId)
                .message(message)
                .type(type)
                .build();
        return repository.save(notification);
    }

    public List<Notification> getNotificationsForUser(UUID userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(UUID notificationId) {
        repository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            repository.save(notification);
        });
    }
}
