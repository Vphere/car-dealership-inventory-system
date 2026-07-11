# 🚗 Car Dealership Inventory System

A full-stack **Car Dealership Inventory System** built as a TDD kata. The backend is a production-grade REST API built with **Spring Boot 3**, **PostgreSQL**, **Flyway**, and **JWT authentication**. The frontend (React) is covered in the next phase.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [API Reference](#api-reference)
- [Local Setup](#local-setup)
- [Running Tests](#running-tests)
- [Environment Variables](#environment-variables)
- [TDD Commit History](#tdd-commit-history)
- [My AI Usage](#my-ai-usage)

---

## Architecture Overview

```
┌──────────────┐     JWT      ┌─────────────────────────────────┐
│   Frontend   │ ──Bearer──▶  │  Spring Boot API  (port 8080)   │
│   (React)    │              │                                  │
└──────────────┘              │  AuthController  /api/auth/**   │
                              │  VehicleController /api/vehicles│
                              └────────────┬────────────────────┘
                                           │  JPA + Flyway
                                           ▼
                              ┌─────────────────────────────────┐
                              │   PostgreSQL 16  (port 5433)    │
                              │   users | vehicles              │
                              │   flyway_schema_history         │
                              └─────────────────────────────────┘
```

**Security flow:** Every request passes through `JwtAuthFilter` → extracts the Bearer token → validates it via `JwtService` → populates `SecurityContext` → route-level rules in `SecurityConfig` decide whether the authenticated principal may proceed.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.5 |
| Security | Spring Security 6 + JJWT 0.12 |
| Persistence | Spring Data JPA + Hibernate 6 |
| Migrations | Flyway 11 |
| Database | PostgreSQL 16 |
| Build | Maven (Maven Wrapper included) |
| Testing | JUnit 5, Mockito, Spring MockMvc |
| Containers | Docker + Docker Compose |

---

## API Reference

### Auth (public)

| Method | Path | Body | Response |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{ email, password }` | `201` `{ token, email, role }` |
| `POST` | `/api/auth/login` | `{ email, password }` | `200` `{ token, email, role }` |

### Vehicles (requires `Authorization: Bearer <token>`)

| Method | Path | Auth | Body / Params | Response |
|---|---|---|---|---|
| `GET` | `/api/vehicles` | Any | — | `200` list |
| `GET` | `/api/vehicles/search` | Any | `?make=&model=&category=&minPrice=&maxPrice=` | `200` filtered list |
| `POST` | `/api/vehicles` | Any | `{ make, model, category, price, quantity }` | `201` vehicle |
| `PUT` | `/api/vehicles/{id}` | Any | `{ make, model, category, price, quantity }` | `200` vehicle |
| `DELETE` | `/api/vehicles/{id}` | **ADMIN** | — | `204` |
| `POST` | `/api/vehicles/{id}/purchase` | Any | — | `200` updated vehicle |
| `POST` | `/api/vehicles/{id}/restock` | **ADMIN** | `{ quantity }` | `200` updated vehicle |

### Error responses

All errors follow a consistent shape:

```json
{
  "timestamp": "2026-07-11T10:00:00",
  "status": 409,
  "error": "Conflict",
  "message": "Insufficient stock for vehicle id 1: requested 1, available 0",
  "path": "/api/vehicles/1/purchase"
}
```

| Status | Trigger |
|---|---|
| `400` | Bean Validation failure |
| `401` | Wrong password on login |
| `403` | Missing token or insufficient role |
| `404` | Vehicle / user not found |
| `409` | Duplicate email on register, or zero stock on purchase |

---

## Local Setup

### Prerequisites

- Docker & Docker Compose
- Java 17+ (Eclipse Temurin / OpenJDK)
- Maven (or use the included `mvnw` wrapper)

### 1. Start the database

```bash
docker-compose up -d
```

This starts PostgreSQL 16 on **port 5433** (non-default to avoid clashing with a local install).

### 2. Run the backend

```bash
cd backend
./mvnw spring-boot:run        # Linux/macOS
.\mvnw.cmd spring-boot:run    # Windows PowerShell
```

Flyway automatically runs all three migrations on first boot:

| Migration | What it does |
|---|---|
| `V1__create_users_table.sql` | Creates `users` table |
| `V2__create_vehicles_table.sql` | Creates `vehicles` table |
| `V3__seed_admin_user.sql` | Seeds an admin account |

**Seeded admin credentials:**

| Field | Value |
|---|---|
| Email | `admin@dealership.com` |
| Password | `Admin@1234` |

### 3. Verify it works

```bash
# Register
curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}' | jq

# Login — copy the token
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dealership.com","password":"Admin@1234"}' | jq
```

---

## Running Tests

Unit and slice tests run **without a database** (all DB interactions are mocked):

```bash
cd backend
./mvnw test                   # Linux/macOS
.\mvnw.cmd test               # Windows PowerShell
```

**Test suite breakdown:**

| Test class | Type | Tests |
|---|---|---|
| `AuthServiceTest` | Unit (Mockito) | 4 |
| `AuthControllerTest` | Web slice (@WebMvcTest) | 2 |
| `VehicleServiceTest` | Unit (Mockito) | 6 |
| `VehicleControllerTest` | Web slice (@WebMvcTest) | 3 |
| **Total** | | **15** |

The default `InventoryApplicationTests` context test is `@Disabled` because it requires a live PostgreSQL connection. To run it manually:

```bash
docker-compose up -d
./mvnw test -Dtest=InventoryApplicationTests
```

---

## Environment Variables

All sensitive values are externalised via env vars with local dev defaults:

| Variable | Default | Description |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5433/dealership` | JDBC connection string |
| `DB_USER` | `dealership_user` | Database username |
| `DB_PASS` | `dealership_pass` | Database password |
| `JWT_SECRET` | *(dev key — see application.yml)* | Base64-encoded 256-bit HMAC-SHA256 key |
| `JWT_EXPIRATION_MS` | `3600000` | Token TTL in milliseconds (1 hour) |
| `PORT` | `8080` | HTTP server port |

**Generate a production JWT secret:**

```bash
openssl rand -base64 32
```

---