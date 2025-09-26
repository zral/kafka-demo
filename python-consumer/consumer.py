import os
from kafka import KafkaConsumer
from flask import Flask, jsonify
from threading import Thread

KAFKA_BROKER = os.environ.get('KAFKA_BROKER', 'kafka:9092')
TOPIC = os.environ.get('KAFKA_TOPIC', 'python-topic')
GROUP_ID = os.environ.get('KAFKA_GROUP_ID', 'python-consumer-group')

messages = []

app = Flask(__name__)

@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

def consume():
    consumer = KafkaConsumer(
        TOPIC,
        bootstrap_servers=KAFKA_BROKER,
        group_id=GROUP_ID,
        auto_offset_reset='earliest',
        enable_auto_commit=True
    )
    for msg in consumer:
        messages.append(msg.value.decode('utf-8'))

if __name__ == '__main__':
    Thread(target=consume, daemon=True).start()
    app.run(host='0.0.0.0', port=5001)
