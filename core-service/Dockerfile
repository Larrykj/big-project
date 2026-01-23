# -----------------
# BUILD STAGE
# -----------------
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the application skipping tests to save time
RUN mvn clean package -DskipTests

# -----------------
# RUN STAGE
# -----------------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/core-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
