package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"
	"github.com/segmentio/kafka-go"
)

var (
	kafkaBroker = getEnv("KAFKA_BROKER", "kafka:9092")
	kafkaTopic  = getEnv("KAFKA_TOPIC", "go-topic")
	messages    = []string{}
	mu          sync.Mutex
)

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func main() {
	go consumeKafka()

	http.HandleFunc("/messages", func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		defer mu.Unlock()
		json.NewEncoder(w).Encode(messages)
	})

	log.Println("Go consumer listening on :7001")
	log.Fatal(http.ListenAndServe(":7001", nil))
}

func consumeKafka() {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{kafkaBroker},
		Topic:   kafkaTopic,
		GroupID: "go-consumer-group",
	})
	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			log.Println("Kafka read error:", err)
			continue
		}
		mu.Lock()
		messages = append(messages, string(m.Value))
		if len(messages) > 100 {
			messages = messages[len(messages)-100:]
		}
		mu.Unlock()
	}
}
