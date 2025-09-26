FROM python:3.11-slim
WORKDIR /app
COPY consumer.py .
RUN pip install kafka-python flask
ENV KAFKA_BROKER=kafka:9092
ENV KAFKA_TOPIC=python-topic
ENV KAFKA_GROUP_ID=python-consumer-group
EXPOSE 5001
CMD ["python", "consumer.py"]
