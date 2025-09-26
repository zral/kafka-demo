# Kafka Microservices Demo

A solution with Node.js and Python microservices communicating via Kafka, a React web UI for sending and receiving messages, and Kafka UI for monitoring.

## Structure

- `producer-service/`: Node.js service that sends messages to Kafka topic.
- `consumer-service/`: Node.js service that receives messages from Kafka topic and stores them.
- `python-producer/`: Python service that sends messages to Kafka topic.
- `python-consumer/`: Python service that receives messages from Kafka topic and stores them.
- `web-ui/`: React app that allows the user to send messages and display received messages for both Node.js and Python services.
- `docker-compose.yml`: Docker Compose file for deploying everything.
- `Kafka UI`: Web interface for monitoring Kafka topics and messages (http://localhost:8081).

## To run

1. Ensure Docker and Docker Compose are installed.
2. Navigate to the project folder.
3. Run `docker-compose up --build -d`.

Web UI will be available at http://localhost:3005.
Kafka UI will be available at http://localhost:8081.

## Functionality

- All microservices create Kafka topic 'test-topic' if it doesn't exist on startup.
- Node.js and Python producer services expose POST /send for sending messages.
- Node.js and Python consumer services expose GET /messages for retrieving received messages.
- Web UI allows sending and viewing messages for both Node.js and Python services, with separate UI sections.

## API Endpoints


### Node.js Producer Service (http://localhost:3000)
- `POST /send` - Send a message
  - Body: `{"message": "your message"}`

### Node.js Consumer Service (http://localhost:3004)
- `GET /messages` - Get all received messages


### Python Producer Service (http://localhost:5002)
- `POST /send` - Send a message
  - Body: `{ "message": "your message" }`

### Python Consumer Service (http://localhost:5001)
- `GET /messages` - Get all received messages

### Kafka UI (http://localhost:8081)
- Web interface for monitoring Kafka topics and messages

#### Web UI API Proxy Endpoints
- `/api/node-producer/send` → Node.js producer
- `/api/node-consumer/messages` → Node.js consumer
- `/api/producer/send` → Python producer
- `/api/consumer/messages` → Python consumer

## Services and port mappings

- Web UI (host -> container): http://localhost:3005 -> container:80 (served by nginx)
- Node.js Producer API: http://localhost:3000 -> container:3000
- Node.js Consumer API: http://localhost:3004 -> container:3001
- Python Producer API: http://localhost:5002 -> container:5002
- Python Consumer API: http://localhost:5001 -> container:5001
- Kafka UI: http://localhost:8081 -> container:8080


Nginx inside the `web-ui` container proxies API paths as follows:

- `/api/node-producer/*` → `http://producer-service:3000/`
- `/api/node-consumer/*` → `http://consumer-service:3001/`
- `/api/producer/*` → `http://python-producer:5002/`
- `/api/consumer/*` → `http://python-consumer:5001/`

Kafka broker is reachable to services on the Docker network as `kafka:9092` (broker is not published to the host in this Compose setup).