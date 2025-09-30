using Confluent.Kafka;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ProducerConfig>(sp => new ProducerConfig
{
    BootstrapServers = "kafka:9092",
    // acks=all for durability
    Acks = Acks.All
});

var app = builder.Build();

// Keep a singleton producer and a lightweight connectivity check.
var producerHolder = new Lazy<IProducer<Null, string>>(() => new ProducerBuilder<Null, string>(app.Services.GetRequiredService<ProducerConfig>()).Build());

async Task<bool> CanConnectToBroker(ProducerConfig cfg, int timeoutMs = 2000)
{
    try
    {
        // AdminClient exposes GetMetadata reliably across client versions
        using var admin = new AdminClientBuilder(new AdminClientConfig { BootstrapServers = cfg.BootstrapServers }).Build();
        var meta = admin.GetMetadata(TimeSpan.FromMilliseconds(timeoutMs));
        return meta.Brokers != null && meta.Brokers.Count > 0;
    }
    catch
    {
        return false;
    }
}

app.MapPost("/send", async (ProducerConfig config, IDictionary<string, object> body) =>
{
    var topic = body.ContainsKey("topic") ? body["topic"]?.ToString() ?? "test-topic" : "test-topic";
    var message = body.ContainsKey("message") ? body["message"]?.ToString() ?? string.Empty : string.Empty;

    // Quick connectivity check; if Kafka isn't reachable, return 503 so callers can retry
    if (!await CanConnectToBroker(config))
    {
        return Results.StatusCode(503);
    }

    var producer = producerHolder.Value;
    try
    {
        var dr = await producer.ProduceAsync(topic, new Message<Null, string> { Value = message });
        return Results.Ok(new { topic = dr.Topic, partition = dr.Partition.Value, offset = dr.Offset.Value });
    }
    catch (ProduceException<Null, string> ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();
