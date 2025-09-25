const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
app.use(express.json());

const kafka = new Kafka({
  clientId: 'producer-service',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();
const admin = kafka.admin();

let isInitialized = false;

// Retry helper with exponential backoff
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

    // Ensure topic exists (safe to call repeatedly)
    const topics = await admin.listTopics();
    if (!topics.includes('test-topic')) {
      await admin.createTopics({ topics: [{ topic: 'test-topic', numPartitions: 1, replicationFactor: 1 }] });
    }
    await admin.disconnect();

    // Connect producer with retries
    await retry(async () => {
      await producer.connect();
      return true;
    });

    isInitialized = true;
    console.log('Producer initialized successfully');
  } catch (error) {
    console.error('Failed to initialize producer after retries:', error);
    // Keep the server running; requests will return 503 until isInitialized === true
  }
}

// Start init immediately; retry loop will wait for Kafka to become available
init();

app.post('/send', async (req, res) => {
  if (!isInitialized) {
    return res.status(503).send('Producer not ready');
  }
  const { message } = req.body;
  try {
    await producer.send({
      topic: 'test-topic',
      messages: [{ value: message }]
    });
    res.send('Message sent');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Error sending message');
  }
});

app.listen(3000, '0.0.0.0', () => console.log('Producer service listening on port 3000'));