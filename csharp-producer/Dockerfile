FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 3002

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["csharp-producer.csproj", "./"]
RUN dotnet restore "./csharp-producer.csproj"
COPY . ./
RUN dotnet publish "./csharp-producer.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish ./
ENTRYPOINT ["dotnet", "csharp-producer.dll"]
