# Detaljert Forklaring av Løsningen

Denne løsningen demonstrerer hvordan to små programmer (mikrotjenester) kan kommunisere med hverandre ved hjelp av Apache Kafka, som er et verktøy for å sende og motta meldinger mellom systemer. I tillegg er det en enkel nettside laget i React hvor du kan sende meldinger og se dem komme inn. Alt kjører i Docker-containere for enkel oppsett.

## Hva Løsningen Gjør

Løsningen simulerer et enkelt meldingssystem:
- Du skriver inn en melding på nettsiden.
- Meldingen sendes til en "produsent"-tjeneste, som legger den på en "kø" (Kafka topic).
- En "konsument"-tjeneste henter meldingen fra køen og lagrer den.
- Nettsiden viser alle mottatte meldinger i en liste.

Dette er nyttig for å forstå hvordan store systemer kan dele informasjon uten å være direkte koblet til hverandre.

## Hva Er Apache Kafka?

Kafka er som en postkasse eller en kø hvor meldinger kan legges inn og hentes ut. Tenk deg det som en stor postboks hvor folk kan legge brev (meldinger), og andre kan komme og hente dem når de er klare.

- **Produsenter** (producers): De som legger meldinger i køen.
- **Konsumenter** (consumers): De som henter meldinger fra køen.
- **Topics**: Dette er som forskjellige postbokser. Hver topic har sitt eget navn, og meldinger legges i spesifikke topics.
- **Brokers**: Servere som håndterer køen. I vår løsning bruker vi en broker.
- **Zookeeper**: Et hjelpeverktøy som hjelper Kafka med å holde styr på ting som topics og brokers.

I vår løsning oppretter tjenestene automatisk en topic kalt "test-topic" hvis den ikke finnes.


## Komponenter i Løsningen

### 1. Node.js Producer-Service (Produsent-Tjeneste)
- **Hva det gjør**: Node.js webserver som venter på forespørsler om å sende meldinger.
- **Hvordan det fungerer**:
  - Lytter på port 3000.
  - POST til `/send` med en melding legger den på Kafka topic "test-topic".
  - Oppretter topicet ved oppstart hvis nødvendig.
- **Teknologi**: Node.js med Express og KafkaJS.

### 2. Node.js Consumer-Service (Konsument-Tjeneste)
- **Hva det gjør**: Node.js webserver som henter meldinger fra Kafka og lagrer dem i minnet.
- **Hvordan det fungerer**:
  - Lytter på port 3001.
  - Konsumerer fra "test-topic" og lagrer meldinger.
  - GET til `/messages` gir listen over mottatte meldinger.
- **Teknologi**: Node.js med Express og KafkaJS.

### 3. Python Producer-Service
- **Hva det gjør**: Python Flask-app som sender meldinger til Kafka.
- **Hvordan det fungerer**:
  - Lytter på port 5002.
  - POST til `/send` med en melding legger den på Kafka topic "python-topic".
  - Oppretter topicet ved oppstart hvis nødvendig.
- **Teknologi**: Python med Flask og kafka-python.

### 4. Python Consumer-Service
- **Hva det gjør**: Python Flask-app som mottar meldinger fra Kafka og lagrer dem i minnet.
- **Hvordan det fungerer**:
  - Lytter på port 5001.
  - Konsumerer fra "python-topic" og lagrer meldinger.
  - GET til `/messages` gir listen over mottatte meldinger.
- **Teknologi**: Python med Flask og kafka-python.

### 5. Web-UI (Nettside)
- **Hva det gjør**: En React-basert nettside hvor du kan skrive inn meldinger og se dem komme inn, for både Node.js og Python tjenester.
- **Hvordan det fungerer**:
  - Input-felt og send-knapp for Node.js og Python produserende tjenester.
  - Viser mottatte meldinger fra begge konsumenter i separate lister.
  - API-kall til `/api/node-producer/send`, `/api/node-consumer/messages`, `/api/producer/send`, `/api/consumer/messages`.
  - Kjører på port 3005, servert av Nginx.
- **Teknologi**: React og Nginx.

### 6. Kafka UI
- **Hva det gjør**: Webgrensesnitt for å overvåke Kafka topics og meldinger.
- **Hvordan det fungerer**:
  - Tilgjengelig på http://localhost:8081.
- **Teknologi**: provectuslabs/kafka-ui Docker image.


### 8. C# Producer-Service
- **Hva det gjør**: C# webserver som sender meldinger til Kafka.
- **Hvordan det fungerer**:
  - Lytter på port 3002.
  - POST til `/send` med en melding legger den på Kafka topic "test-topic".
- **Teknologi**: C# med ASP.NET og Confluent.Kafka.

### 9. C# Consumer-Service
- **Hva det gjør**: C# webserver som mottar meldinger fra Kafka og lagrer dem i minnet.
- **Hvordan det fungerer**:
  - Lytter på port 3003.
  - Konsumerer fra "test-topic" og lagrer meldinger.
  - GET til `/messages` gir listen over mottatte meldinger.
- **Teknologi**: C# med ASP.NET og Confluent.Kafka.

### 10. Java Producer-Service
- **Hva det gjør**: Java Spring Boot-app som sender meldinger til Kafka.
- **Hvordan det fungerer**:
  - Lytter på port 8082.
  - POST til `/api/java-producer/send?message=din_melding` legger meldingen på Kafka topic "demo-topic".
- **Teknologi**: Java med Spring Boot og spring-kafka.

### 11. Java Consumer-Service
- **Hva det gjør**: Java Spring Boot-app som mottar meldinger fra Kafka og lagrer dem i minnet.
- **Hvordan det fungerer**:
  - Lytter på port 8083.
  - Konsumerer fra "demo-topic" og lagrer meldinger.
  - GET til `/api/java-consumer/poll` gir neste mottatte melding.
- **Teknologi**: Java med Spring Boot og spring-kafka.

- **Støtte for flere språk**: Node.js, Python, C#, og Java tjenester kan sammenlignes og brukes parallelt.
- **React**: Frontend.
- **Docker**: Containerisering.
- **Docker Compose**: Orkestrering.
- **Nginx**: Webserver og proxy.
- **Kafka UI**: Webgrensesnitt for Kafka.

### 3. Web-UI (Nettside)
- **Hva det gjør**: En enkel nettside hvor du kan skrive inn meldinger og se dem komme inn.
- **Hvordan det fungerer**:
  - Bygget med React, som er et bibliotek for å lage interaktive nettsider.
  - Har et input-felt for å skrive melding og en knapp for å sende.
  - Sender meldingen til producer-service via en API-kall.
  - Henter listen over mottatte meldinger fra consumer-service hvert sekund og viser dem i en liste.
  - Kjører på port 3002, servert av Nginx (en webserver).
- **Teknologi**: React for frontend, Nginx som proxy for å videresende API-kall til de interne tjenestene.

### 4. Kafka og Zookeeper
- **Kafka**: Håndterer meldingene som beskrevet ovenfor.
- **Zookeeper**: Hjelper Kafka med konfigurasjon og koordinering.

### 5. Docker Compose
- Dette er en fil (`docker-compose.yml`) som definerer hvordan alle delene skal kjøres sammen.
- Hver komponent kjører i sin egen "container" (som en virtuell maskin), så de ikke forstyrrer hverandre.
- Starter Zookeeper først, så Kafka, så de to tjenestene, og til slutt web-UI.
- Porter: 3000 (Node.js produsent), 3001 (Node.js konsument), 5002 (Python produsent), 5001 (Python konsument), 3005 (web-UI), 8081 (Kafka UI).

- **Node.js**: Backend for Node.js tjenester.
- **Express**: Webserver for Node.js.
- **KafkaJS**: Kafka-klient for Node.js.
- **Python**: Backend for Python tjenester.
- **Flask**: Webserver for Python.
- **kafka-python**: Kafka-klient for Python.
- **React**: Frontend.
- **Docker**: Containerisering.
- **Docker Compose**: Orkestrering.
- **Nginx**: Webserver og proxy.
- **Kafka UI**: Webgrensesnitt for Kafka.

## Hvordan Kjøre Løsningen
1. Sørg for at Docker og Docker Compose er installert på maskinen din.
2. Åpne en terminal og naviger til mappen hvor løsningen ligger (f.eks. `/Users/larssoraas/Dev/2025/kafka/kafka-demo`).
3. Kjør kommandoen: `docker-compose up --build -d`.
4. Vent til alt er startet (du kan sjekke med `docker ps`).
5. Åpne nettleseren og gå til:
  - Web UI: http://localhost:3005
  - Kafka UI: http://localhost:8081
6. Skriv inn en melding i Node.js eller Python seksjonen, trykk "Send", og se den dukke opp i riktig liste.

- **Mikrotjenester**: Hver del er uavhengig, så du kan endre en uten å påvirke de andre.
- **Kafka**: Gir pålitelig meldingsoverføring, selv om noen deler er nede.
- **Docker**: Gjør det enkelt å kjøre på forskjellige maskiner uten å installere alt manuelt.
- **Støtte for flere språk**: Node.js og Python tjenester kan sammenlignes og brukes parallelt.

Hvis du har spørsmål eller vil endre noe, er det bare å si ifra!