FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src src
RUN mvn -q -DskipTests package
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/target/bugflow-api-1.0.0.jar app.jar
RUN mkdir -p /app/data
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
