# ─────────────────────────────────────────────────────────────
# STAGE 1 — BUILD
# Usamos la imagen completa de Maven con JDK 17 para compilar.
# Esta imagen NO llega a producción, solo sirve para construir el JAR.
# ─────────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Directorio de trabajo dentro del contenedor de build
WORKDIR /app

# Copiamos primero solo el pom.xml para aprovechar el cache de Docker.
# Si el código fuente cambia pero el pom.xml no, Docker reutiliza
# la capa de dependencias sin volver a descargarlas (optimización de capas).
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Ahora copiamos el código fuente
COPY src ./src

# Compilamos saltando los tests (los tests corren en CI antes del build)
RUN mvn package -DskipTests -B

# ─────────────────────────────────────────────────────────────
# STAGE 2 — RUNTIME
# Usamos solo el JRE (no el JDK completo), imagen mucho más liviana.
# eclipse-temurin:17-jre-alpine pesa ~85MB vs ~500MB del JDK.
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine AS runtime

WORKDIR /app

# Creamos un usuario no root para ejecutar la aplicación.
# Buena práctica de seguridad: si el contenedor es comprometido,
# el atacante no tiene privilegios de root en el host.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiamos SOLO el JAR desde el stage de build, no todo el proyecto.
# Esto mantiene la imagen de producción limpia y pequeña.
COPY --from=builder /app/target/*.jar app.jar

# Cambiamos la propiedad del JAR al usuario no root
RUN chown appuser:appgroup app.jar

# Cambiamos al usuario no root
USER appuser

# Puerto en el que escucha back-Ventas (default Spring Boot)
EXPOSE 8080

# Opciones de JVM optimizadas para contenedores:
# -XX:+UseContainerSupport → respeta los límites de CPU/RAM del contenedor
# -XX:MaxRAMPercentage=75  → usa máximo 75% de la RAM asignada al contenedor
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-jar", "app.jar"]
