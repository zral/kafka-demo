import os
from kafka import KafkaProducer
from kafka.admin import KafkaAdminClient, NewTopic
from flask import Flask, request, jsonify

KAFKA_BROKER = os.environ.get('KAFKA_BROKER', 'kafka:9092')
TOPIC = os.environ.get('KAFKA_TOPIC', 'python-topic')

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
