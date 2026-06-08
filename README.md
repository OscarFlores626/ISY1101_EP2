# Innovatech Chile — ISY1101 EP2

Proyecto de contenedorizacion y CI/CD para la empresa Innovatech Chile.
Desarrollado como parte de la asignatura ISY1101 Introduccion a Herramientas DevOps en DuocUC.

## Descripcion

Sistema de gestion de despachos compuesto por tres servicios:

- **front-despacho**: Frontend React/Vite servido por Nginx en puerto 80
- **back-ventas**: API REST Spring Boot para gestion de ordenes de compra en puerto 8080
- **back-despachos**: API REST Spring Boot para gestion de despachos en puerto 8081
- **MySQL 8.0**: Base de datos relacional con dos schemas (ventas, despachos)

## Arquitectura

    Internet
        |
    EC2 Frontend (subred publica) — Nginx reverse proxy
        |
    EC2 Backend (subred privada) — back-ventas :8080 + back-despachos :8081
        |
    EC2 Data (subred privada) — MySQL :3306

Todo desplegado en AWS con VPC, subredes publica y privada, NAT Gateway y Security Groups por capa.

## Tecnologias

- Docker + Docker Compose
- GitHub Actions (CI/CD)
- Amazon ECR (registro de imagenes)
- Amazon ECS Fargate (orquestacion en produccion)
- Amazon EC2 + SSM (infraestructura base)
- Spring Boot (Java 17)
- React + Vite + Nginx
- MySQL 8.0

## Estructura del repositorio

    ISY1101_EP2/
    |-- back-Ventas_SpringBoot/
    |   |-- Springboot-API-REST/
    |       |-- Dockerfile
    |-- back-Despachos_SpringBoot/
    |   |-- Springboot-API-REST-DESPACHO/
    |       |-- Dockerfile
    |-- front_despacho/
    |   |-- Dockerfile
    |   |-- nginx.conf
    |   |-- src/
    |-- docker-compose.backend.yml
    |-- docker-compose.frontend.yml
    |-- .github/
        |-- workflows/
            |-- github-pipeline.yml

## Pipeline CI/CD

El pipeline se activa automaticamente en cada push a main y ejecuta 5 jobs:

| Job | Descripcion |
|-----|-------------|
| build-back-ventas | Maven build + push a ECR |
| build-back-despachos | Maven build + push a ECR |
| build-front-despacho | Vite build + push a ECR |
| deploy-backend | ECS update-service back-ventas + back-despachos |
| deploy-frontend | ECS update-service front-despacho |

## Cluster ECS Fargate

Los servicios en produccion corren en Amazon ECS Fargate:

| Servicio | Task Definition | Subred | Puerto |
|----------|----------------|--------|--------|
| back-ventas | innovatech-back-ventas | privada | 8080 |
| back-despachos | innovatech-back-despachos | privada | 8081 |
| front-despacho | innovatech-front-despacho | publica | 80 |

## Variables y Secretos

### GitHub Secrets (sensibles)

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_SESSION_TOKEN
- DB_PASSWORD

### GitHub Variables (no sensibles)

- AWS_ACCOUNT_ID
- EC2_BACKEND_INSTANCE_ID
- EC2_FRONTEND_INSTANCE_ID
- EC2_BACKEND_PRIVATE_IP
- EC2_FRONTEND_PUBLIC_IP
- DB_ENDPOINT
- DB_PORT
- DB_NAME_VENTAS
- DB_NAME_DESPACHOS
- DB_USERNAME
- FRONTEND_API_BASE_URL

## Estudiante

Oscar Ignacio Flores Donoso
DuocUC — Escuela de Informatica y Telecomunicaciones
2026
