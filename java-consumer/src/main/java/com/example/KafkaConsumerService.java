package com.example;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

@Service
public class KafkaConsumerService {
    private final BlockingQueue<String> messages = new LinkedBlockingQueue<>();

    @KafkaListener(topics = "demo-topic", groupId = "java-consumer-group")
    public void listen(String message) {
        messages.add(message);
    }

    public String pollMessage() {
        if (messages.isEmpty()) {
            return "No messages available";
        }
        return String.join("\n", messages);
    }
}
