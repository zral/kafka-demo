package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"github.com/segmentio/kafka-go"
)

var (
	kafkaBroker = getEnv("KAFKA_BROKER", "kafka:9092")
	kafkaTopic  = getEnv("KAFKA_TOPIC", "go-topic")
)

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func main() {
	writer := &kafka.Writer{
		Addr:     kafka.TCP(kafkaBroker),
		Topic:    kafkaTopic,
	}

	http.HandleFunc("/send", func(w http.ResponseWriter, r *http.Request) {
		var req struct { Message string `json:"message"` }
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		msg := kafka.Message{Value: []byte(req.Message)}
		if err := writer.WriteMessages(r.Context(), msg); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

	log.Println("Go producer listening on :7002")
	log.Fatal(http.ListenAndServe(":7002", nil))
}
