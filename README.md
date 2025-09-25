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

Note: on the container the consumer listens on port 3001; the Compose file maps host port 3004 -> container port 3001.

## Services and port mappings

- Web UI (host -> container): http://localhost:3005 -> container:80 (served by nginx)
- Producer API (host -> container): http://localhost:3000 -> container:3000
- Consumer API (host -> container): http://localhost:3004 -> container:3001

Nginx inside the `web-ui` container proxies API paths as follows:

- `/api/producer/*` -> `http://producer-service:3000/`
- `/api/consumer/*` -> `http://consumer-service:3001/`

Kafka broker is reachable to services on the Docker network as `kafka:9092` (broker is not published to the host in this Compose setup).