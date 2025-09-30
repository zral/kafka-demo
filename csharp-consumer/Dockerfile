FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 3003

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["csharp-consumer.csproj", "./"]
RUN dotnet restore "./csharp-consumer.csproj"
COPY . ./
RUN dotnet publish "./csharp-consumer.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish ./
ENTRYPOINT ["dotnet", "csharp-consumer.dll"]
