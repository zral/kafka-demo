using Confluent.Kafka;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Collections.Concurrent;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ConsumerConfig>(sp => new ConsumerConfig
{
    BootstrapServers = "kafka:9092",
    GroupId = "csharp-consumer-group",
    AutoOffsetReset = AutoOffsetReset.Earliest,
    EnableAutoCommit = true
});

var messages = new ConcurrentQueue<string>();

var app = builder.Build();

// Background consumer with reconnect/backoff
var lifetime = app.Lifetime;
var consumerConfig = app.Services.GetRequiredService<ConsumerConfig>();

_ = Task.Run(async () =>
{
    var backoffMs = 1000;
    while (!lifetime.ApplicationStopping.IsCancellationRequested)
    {
        try
        {
            using var consumer = new ConsumerBuilder<Ignore, string>(consumerConfig).Build();
            consumer.Subscribe("test-topic");
            backoffMs = 1000; // reset backoff on successful connect

            while (!lifetime.ApplicationStopping.IsCancellationRequested)
            {
                try
                {
                    var cr = consumer.Consume(TimeSpan.FromSeconds(1));
                    if (cr != null && cr.Message != null)
                    {
                        messages.Enqueue(cr.Message.Value);
                    }
                }
                catch (ConsumeException)
                {
                    // swallow to continue loop
                }
            }

            try { consumer.Close(); } catch { }
        }
        catch (Exception)
        {
            // Could not create/subscribe consumer - broker may be starting. Wait with backoff and retry.
            await Task.Delay(backoffMs);
            backoffMs = Math.Min(backoffMs * 2, 30000);
        }
    }
});

app.MapGet("/messages", () => Results.Ok(messages.ToArray()));
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();
