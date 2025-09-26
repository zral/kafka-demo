
import os
import time
from kafka import KafkaProducer
from kafka.admin import KafkaAdminClient, NewTopic
from flask import Flask, request, jsonify

KAFKA_BROKER = os.environ.get('KAFKA_BROKER', 'kafka:9092')
TOPIC = os.environ.get('KAFKA_TOPIC', 'python-topic')

# Wait for Kafka broker to be available
def wait_for_kafka(max_retries=10, delay=5):
    for attempt in range(max_retries):
        try:
            admin = KafkaAdminClient(bootstrap_servers=KAFKA_BROKER)
            admin.close()
            return True
        except Exception:
            print(f"Kafka broker not available, retrying in {delay}s...")
            time.sleep(delay)
    print("Kafka broker not available after retries, exiting.")
    exit(1)

wait_for_kafka()

# Create topic if not exists
def create_topic():
    admin = KafkaAdminClient(bootstrap_servers=KAFKA_BROKER)
    try:
        admin.create_topics([NewTopic(name=TOPIC, num_partitions=1, replication_factor=1)])
    except Exception:
        pass  # Topic exists
    finally:
        admin.close()

create_topic()
producer = KafkaProducer(bootstrap_servers=KAFKA_BROKER)

app = Flask(__name__)

@app.route('/send', methods=['POST'])
def send():
    data = request.get_json()
    msg = data.get('message', '')
    producer.send(TOPIC, msg.encode('utf-8'))
    producer.flush()
    return jsonify({'status': 'sent', 'message': msg})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
