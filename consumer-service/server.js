const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
const messages = [];

const kafka = new Kafka({
  clientId: 'consumer-service',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group' });
const admin = kafka.admin();

let isInitialized = false;

// Retry helper with exponential backoff (same behavior as producer)
async function retry(fn, { attempts = 12, minDelay = 1000, maxDelay = 30000 } = {}) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts) throw err;
      const delay = Math.min(minDelay * 2 ** (i - 1), maxDelay);
      console.warn(`Attempt ${i} failed, retrying in ${delay}ms...`, err.message || err);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

async function init() {
  try {
    await retry(async () => {
      await admin.connect();
      return true;
    });

    const topics = await admin.listTopics();
    if (!topics.includes('test-topic')) {
      await admin.createTopics({ topics: [{ topic: 'test-topic', numPartitions: 1, replicationFactor: 1 }] });
    }
    await admin.disconnect();

    await retry(async () => {
      await consumer.connect();
      await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          messages.push(message.value.toString());
        }
      });
      return true;
    });

    isInitialized = true;
    console.log('Consumer initialized successfully');
  } catch (error) {
    console.error('Failed to initialize consumer after retries:', error);
    // Keep server running; API will return 503 until ready
  }
}

init();

app.get('/messages', (req, res) => {
  if (!isInitialized) {
    return res.status(503).json({ error: 'Consumer not ready' });
  }
  res.json(messages);
});

app.listen(3001, '0.0.0.0', () => console.log('Consumer service listening on port 3001'));