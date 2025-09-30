package com.example;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.List;
import java.util.ArrayList;

@Service
public class KafkaConsumerService {
    private final BlockingQueue<String> messages = new LinkedBlockingQueue<>();

    @KafkaListener(topics = "demo-topic", groupId = "java-consumer-group")
    public void listen(String message) {
        System.out.println("Mottatt melding: " + message);
        messages.add(message);
    }

    public List<String> pollMessage() {
        return new ArrayList<>(messages);
    }
}
