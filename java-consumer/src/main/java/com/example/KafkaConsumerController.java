package com.example;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/java-consumer")
public class KafkaConsumerController {
    @Autowired
    private KafkaConsumerService consumerService;

    @GetMapping("/poll")
    public List<String> pollMessage() {
        return consumerService.pollMessage();
    }
}
