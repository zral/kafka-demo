package com.example;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/java-consumer")
public class KafkaConsumerController {
    @Autowired
    private KafkaConsumerService consumerService;

    @GetMapping("/poll")
    public String pollMessage() {
        String msg = consumerService.pollMessage();
        return msg != null ? msg : "No messages available";
    }
}
