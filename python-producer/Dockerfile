FROM python:3.11-slim
WORKDIR /app
COPY producer.py .
RUN pip install kafka-python flask
ENV KAFKA_BROKER=kafka:9092
ENV KAFKA_TOPIC=python-topic
EXPOSE 5002
CMD ["python", "producer.py"]
