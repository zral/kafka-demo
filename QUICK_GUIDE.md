
# Veiledning for Kafka-demo

Denne veiledningen gir deg en oversikt over hvordan prosjektet fungerer, og hvordan du kan komme i gang. Den er tilpasset alle som ønsker en enkel introduksjon til Kafka og meldingsbasert arkitektur.

---


## Om prosjektet

Dette prosjektet demonstrerer hvordan ulike applikasjoner kan sende og motta meldinger ved hjelp av Apache Kafka. I tillegg finnes det et web-grensesnitt hvor du kan visualisere meldingene.

---


## Hva er Apache Kafka?

Apache Kafka er en plattform for distribuerte meldinger. Den fungerer som et meldingssystem der flere applikasjoner kan publisere og abonnere på data i sanntid. Kafka brukes ofte til å bygge robuste og skalerbare systemer for dataflyt mellom tjenester.

---




- **producer-service/**: Produsentapplikasjon som sender meldinger til Kafka (JavaScript).
- **consumer-service/**: Konsumentapplikasjon som mottar meldinger fra Kafka (JavaScript).
- **python-producer/**: Produsentapplikasjon i Python.
- **python-consumer/**: Konsumentapplikasjon i Python.
- **csharp-producer/**: Produsentapplikasjon i C#.
- **csharp-consumer/**: Konsumentapplikasjon i C#.
- **java-producer/**: Produsentapplikasjon i Java (Spring Boot).
- **java-consumer/**: Konsumentapplikasjon i Java (Spring Boot).
- **web-ui/**: Webapplikasjon for visualisering av meldinger fra alle språk.
- **docker-compose.yml**: Konfigurasjonsfil for å starte alle tjenester samlet.
- **Kafka Web UI**: Et webgrensesnitt for å overvåke Kafka, topics og meldinger i sanntid.

---


## Hvordan fungerer det?

1. **Produsenter** genererer og sender meldinger til Kafka.
2. **Kafka** mottar og lagrer meldingene i såkalte "topics" (eller "tema" på Norsk).
3. **Konsumenter** abonnerer på topics og henter meldingene for videre behandling.
4. **Web-UI** presenterer meldingene i et brukervennlig grensesnitt.

---

## Hvordan komme i gang

1. Sørg for at Docker er installert på din maskin.
2. Åpne en terminal og naviger til prosjektmappen.
3. Start alle tjenester med følgende kommando:
   ```bash
   docker-compose up
   ```
4. Vent til alle tjenester er oppe og kjører.
5. Åpne webapplikasjonen i nettleseren på http://localhost:3000 (eller http://localhost:3005 hvis du bruker React-UI).
6. **Åpne Kafka Web UI** i nettleseren på http://localhost:8081 for å få innsikt i topics og meldinger.

---



## Hva kan du gjøre?

- Send meldinger fra en av produsentapplikasjonene.
- Observer hvordan konsumentene mottar og behandler meldingene.
- Visualiser meldingene i webapplikasjonen.
- **Bruk Kafka Web UI for å se hvilke topics som finnes, hvilke meldinger som sendes og leses, og få full innsikt i meldingsflyten i systemet.**

---


## Hvorfor bruke Kafka?

- Gir innsikt i hvordan moderne systemer kommuniserer asynkront.
- Viser hvordan ulike teknologier kan integreres via meldingsbasert arkitektur.
- Mulighet for å eksperimentere med distribuerte systemer og dataflyt.

---



## Tips

- Hvis noe ikke fungerer, stopp alle tjenester med `Ctrl+C` i terminalen og start på nytt med `docker-compose up`.
- Sjekk loggene i terminalen for feilmeldinger.
- **Kafka Web UI** er et nyttig verktøy for å feilsøke og forstå hvordan meldinger flyter mellom tjenester. Her kan du se innholdet i topics, meldingshistorikk og status på Kafka-systemet.

---


Lykke til med prosjektet!
