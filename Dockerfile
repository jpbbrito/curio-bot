FROM maven:3.9.7-eclipse-temurin-11 as build
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN mvn clean compile assembly:single

FROM eclipse-temurin:11-jdk
EXPOSE 8443
EXPOSE 88
EXPOSE 443
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/target/curiobot-1.0-jar-with-dependencies.jar app.jar
CMD ["java", "-jar", "app.jar"]