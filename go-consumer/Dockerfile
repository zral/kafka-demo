FROM golang:1.23-alpine AS build
WORKDIR /src
COPY . .
RUN go mod init go-consumer && go get github.com/segmentio/kafka-go && go build -o app .

FROM scratch
COPY --from=build /src/app /app
EXPOSE 7001
ENTRYPOINT ["/app"]
