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

### 1. Producer-Service (Produsent-Tjeneste)
- **Hva det gjør**: Dette er en liten webserver laget i Node.js som venter på forespørsler om å sende meldinger.
- **Hvordan det fungerer**:
  - Den lytter på port 3000.
  - Når noen sender en POST-forespørsel til `/send` med en melding, legger den meldingen på Kafka topic "test-topic".
  - Ved oppstart kobler den seg til Kafka og oppretter topicet hvis nødvendig.
- **Teknologi**: Node.js med Express (for webserver) og KafkaJS (for å snakke med Kafka).

### 2. Consumer-Service (Konsument-Tjeneste)
- **Hva det gjør**: En annen Node.js webserver som henter meldinger fra Kafka og lagrer dem i minnet.
- **Hvordan det fungerer**:
  - Den lytter på port 3001.
  - Den kobler seg til Kafka som en konsument og abonnerer på "test-topic".
  - Når en melding kommer, legger den den til i en liste.
  - Via GET-forespørsel til `/messages` kan du hente listen over alle mottatte meldinger.
  - Også den oppretter topicet ved oppstart hvis nødvendig.
- **Teknologi**: Samme som produsenten, men fokuserer på å motta i stedet for å sende.

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
- Porter: 3000 (produsent), 3001 (konsument), 3002 (web-UI).

## Teknologier Brukt
- **Node.js**: Et miljø for å kjøre JavaScript på serveren.
- **Express**: Et bibliotek for å lage webservere i Node.js.
- **KafkaJS**: Et bibliotek for å bruke Kafka i JavaScript.
- **React**: For å lage den interaktive nettsiden.
- **Docker**: For å pakke hver del i containere.
- **Docker Compose**: For å kjøre flere containere sammen.
- **Nginx**: En webserver som serverer React-appen og videresender API-kall.

## Hvordan Kjøre Løsningen
1. Sørg for at Docker og Docker Compose er installert på maskinen din.
2. Åpne en terminal og naviger til mappen hvor løsningen ligger (f.eks. `c:\Users\lsoraas\Dev\kafka`).
3. Kjør kommandoen: `docker-compose up --build`.
4. Vent til alt er startet (du ser logger i terminalen).
5. Åpne nettleseren og gå til http://localhost:3002.
6. Skriv inn en melding, trykk "Send", og se den dukke opp i listen.

## Hvorfor Denne Arkitekturen?
- **Mikrotjenester**: Hver del er uavhengig, så du kan endre en uten å påvirke de andre.
- **Kafka**: Gir pålitelig meldingsoverføring, selv om noen deler er nede.
- **Docker**: Gjør det enkelt å kjøre på forskjellige maskiner uten å installere alt manuelt.

Hvis du har spørsmål eller vil endre noe, er det bare å si ifra!