# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["OmniFinance.csproj", "./"]
RUN dotnet restore "OmniFinance.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "OmniFinance.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "OmniFinance.csproj" -c Release -o /app/publish

# Run Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OmniFinance.dll"]
