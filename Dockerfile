# Multi-stage build for Spring Boot application

# Stage 1: Build the application
FROM maven:3.8.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy parent POM
COPY pom.xml .

# Copy module POMs
COPY shoedata/pom.xml ./shoedata/
COPY shoebiz/pom.xml ./shoebiz/
COPY sbshoems/pom.xml ./sbshoems/

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY shoedata/src ./shoedata/src
COPY shoebiz/src ./shoebiz/src
COPY sbshoems/src ./sbshoems/src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/sbshoems/target/sbshoems-1.0-SNAPSHOT.jar app.jar

# Copy static resources (shoe images)
COPY sbshoems/src/main/resources/static/shoe_images /app/static/shoe_images

# Expose port 8080
EXPOSE 8080

# Set environment variables (can be overridden by docker-compose)
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/running_shoe_db?allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true&useSSL=false
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=Damian_123

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/api/shoes || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]



