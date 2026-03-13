package com.SplitSmart.NotificationService.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic expenseCreatedTopic() {
        return TopicBuilder.name("expense-created").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic expenseApprovedTopic() {
        return TopicBuilder.name("expense-approved").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic fraudDetectedTopic() {
        return TopicBuilder.name("fraud-detected").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic settlementRecordedTopic() {
        return TopicBuilder.name("settlement-recorded").partitions(3).replicas(1).build();
    }
}
