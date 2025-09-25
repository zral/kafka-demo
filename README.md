# Kafka Microservices Demo

A simple solution with two Node.js microservices communicating via Kafka, and a React web UI for sending and receiving messages.

## Structure

- `producer-service/`: Node.js service that sends messages to Kafka topic.
- `consumer-service/`: Node.js service that receives messages from Kafka topic and stores them.
- `web-ui/`: React app that allows the user to send messages and display received messages.
- `docker-compose.yml`: Docker Compose file for deploying everything.

## To run

1. Ensure Docker and Docker Compose are installed.
2. Navigate to the project folder.
3. Run `docker-compose up --build -d`.

Web UI will be available at http://localhost:3005.

## Functionality

- Microservices create Kafka topic 'test-topic' if it doesn't exist on startup.
- Producer-service exposes POST /send for sending messages.
- Consumer-service exposes GET /messages for retrieving received messages.
- Web UI updates the message list every second.

## API Endpoints

### Producer Service (http://localhost:3000)
- `POST /send` - Send a message
  - Body: `{"message": "your message"}`

### Consumer Service (http://localhost:3004)
- `GET /messages` - Get all received messages

## Services

- Web UI: http://localhost:3005
- Producer API: http://localhost:3000
- Consumer API: http://localhost:3004