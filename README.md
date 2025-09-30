# Kafka Microservices Demo

A solution with Node.js, Python, C#, and Java microservices communicating via Kafka, a React web UI for sending and receiving messages, and Kafka UI for monitoring.

## Structure

- `producer-service/`: Node.js service that sends messages to Kafka topic.
- `consumer-service/`: Node.js service that receives messages from Kafka topic and stores them.
- `python-producer/`: Python service that sends messages to Kafka topic.
- `python-consumer/`: Python service that receives messages from Kafka topic and stores them.
- `csharp-producer/`: C# service that sends messages to Kafka topic.
- `csharp-consumer/`: C# service that receives messages from Kafka topic and stores them.
- `java-producer/`: Java Spring Boot service that sends messages to Kafka topic.
- `java-consumer/`: Java Spring Boot service that receives messages from Kafka topic and stores them.
- `web-ui/`: React app that allows the user to send messages and display received messages for Node.js, Python, C#, and Java services.
- `docker-compose.yml`: Docker Compose file for deploying everything.
- `Kafka UI`: Web interface for monitoring Kafka topics and messages (http://localhost:8081).

## Docker Image Sizes

| Service                   | Image Tag | Size   |
|--------------------------|-----------|--------|
| java-consumer            | latest    | 734MB  |
| java-producer            | latest    | 734MB  |
| csharp-consumer          | local     | 454MB  |
| csharp-producer          | local     | 454MB  |
| python-consumer          | latest    | 243MB  |
| python-producer          | latest    | 243MB  |
| consumer-service (Node)  | latest    | 1.29GB |
| producer-service (Node)  | latest    | 1.29GB |
| web-ui                   | latest    | 80.9MB |

## To run

1. Ensure Docker and Docker Compose are installed.
2. Navigate to the project folder.
3. Run `docker-compose up --build -d`.

Web UI will be available at http://localhost:3005.
Kafka UI will be available at http://localhost:8081.

## Functionality

- All microservices create Kafka topic 'test-topic' (or language-specific topic) if it doesn't exist on startup.
- Node.js, Python, C#, and Java producer services expose POST /send for sending messages.
- Node.js, Python, C#, and Java consumer services expose GET /messages (or /poll for Java) for retrieving received messages.
- Web UI allows sending and viewing messages for all supported services, with separate UI sections.

## API Endpoints

### Node.js Producer Service (http://localhost:3000)
- `POST /send` - Send a message
  - Body: `{ "message": "your message" }`

### Node.js Consumer Service (http://localhost:3004)
- `GET /messages` - Get all received messages

### Python Producer Service (http://localhost:5002)
- `POST /send` - Send a message
  - Body: `{ "message": "your message" }`

### Python Consumer Service (http://localhost:5001)
- `GET /messages` - Get all received messages

### C# Producer Service (http://localhost:3002)
- `POST /send` - Send a message
  - Body: `{ "message": "your message" }`

### C# Consumer Service (http://localhost:3003)
- `GET /messages` - Get all received messages

### Java Producer Service (http://localhost:8082)
- `POST /api/java-producer/send?message=your_message` - Send a message

### Java Consumer Service (http://localhost:8083)
- `GET /api/java-consumer/poll` - Get the next received message

### Kafka UI (http://localhost:8081)
- Web interface for monitoring Kafka topics and messages

#### Web UI API Proxy Endpoints
- `/api/node-producer/send` → Node.js producer
- `/api/node-consumer/messages` → Node.js consumer
- `/api/producer/send` → Python producer
- `/api/consumer/messages` → Python consumer
- `/api/csharp-producer/send` → C# producer
- `/api/csharp-consumer/messages` → C# consumer
- `/api/java-producer/send` → Java producer
- `/api/java-consumer/poll` → Java consumer

## Services and port mappings

- Web UI (host -> container): http://localhost:3005 -> container:80 (served by nginx)
- Node.js Producer API: http://localhost:3000 -> container:3000
- Node.js Consumer API: http://localhost:3004 -> container:3001
- Python Producer API: http://localhost:5002 -> container:5002
- Python Consumer API: http://localhost:5001 -> container:5001
- C# Producer API: http://localhost:3002 -> container:3002
- C# Consumer API: http://localhost:3003 -> container:3003
- Java Producer API: http://localhost:8082 -> container:8080
- Java Consumer API: http://localhost:8083 -> container:8080
- Kafka UI: http://localhost:8081 -> container:8080

Nginx inside the `web-ui` container proxies API paths as follows:

- `/api/node-producer/*` → `http://producer-service:3000/`
- `/api/node-consumer/*` → `http://consumer-service:3001/`
- `/api/producer/*` → `http://python-producer:5002/`
- `/api/consumer/*` → `http://python-consumer:5001/`
- `/api/csharp-producer/*` → `http://csharp-producer:3002/`
- `/api/csharp-consumer/*` → `http://csharp-consumer:3003/`
- `/api/java-producer/*` → `http://java-producer:8080/`
- `/api/java-consumer/*` → `http://java-consumer:8080/`

Kafka broker is reachable to services on the Docker network as `kafka:9092` (broker is not published to the host in this Compose setup).