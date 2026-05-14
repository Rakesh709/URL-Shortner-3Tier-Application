# URL Shortener - Project Documentation

## Overview

A full-stack URL shortener application built with Spring Boot (backend) and React + Vite (frontend). The application allows users to create shortened URLs with optional expiration dates and tracks click counts.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React + Vite)                  │
│                  Port: http://localhost:5173                    │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP (REST API)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Spring Boot)                      │
│                  Port: http://localhost:8080                   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ JDBC
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Database (PostgreSQL)                         │
│               Port: localhost:5432                             │
│               Database: urlshortener                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backend

**Tech Stack:** Java 17, Spring Boot 3.x, Spring Data JPA, PostgreSQL

### Project Structure

```
backend/src/main/java/com/urlshortner/
├── UrlShortenerApplication.java      # Main entry point
├── controller/
│   └── UrlController.java             # REST endpoints
├── service/
│   └── UrlService.java               # Business logic
├── repository/
│   └── UrlRepository.java            # Data access (Spring Data JPA)
├── model/
│   └── Url.java                      # JPA Entity
├── dto/
│   ├── CreateUrlRequest.java         # Request DTO
│   └── UrlResponse.java              # Response DTO
└── config/
    ├── WebConfig.java                # CORS configuration
    ├── GlobalExceptionHandler.java   # Exception handling
    └── TimeZoneConfig.java           # Time zone (Asia/Kolkata)
```

### Database Schema

**Table: `urls`**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| original_url | VARCHAR(2048) | NOT NULL | Original long URL |
| short_code | VARCHAR(10) | NOT NULL, UNIQUE | Short code (6 chars, Base62) |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| click_count | INTEGER | NOT NULL, DEFAULT 0 | Number of clicks |
| expires_at | TIMESTAMP | NULLABLE | Expiration date |

**Indexes:**
- `idx_short_code` on `short_code` column

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/urls` | Create a new short URL |
| GET | `/api/urls` | Get all URLs |
| GET | `/api/urls/{shortCode}` | Get URL details (increments click count) |
| DELETE | `/api/urls/{shortCode}` | Delete a URL |
| GET | `/api/urls/redirect/{shortCode}` | Redirect to original URL |

#### POST /api/urls
**Request Body:**
```json
{
  "originalUrl": "https://example.com/very-long-url",
  "expiresInDays": 30
}
```
**Response:**
```json
{
  "id": 1,
  "originalUrl": "https://example.com/very-long-url",
  "shortCode": "Ab3dEf",
  "shortUrl": "/r/Ab3dEf",
  "createdAt": "2026-05-15T10:30:00",
  "clickCount": 0,
  "expiresAt": "2026-06-14T10:30:00"
}
```

### Short Code Generation

- Algorithm: Base62 encoding (0-9, A-Z, a-z)
- Length: 6 characters
- Collision handling: Regenerate if code already exists

### Configuration

**application.yml:**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/urlshortener
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
server:
  port: 8080
```

### CORS Configuration

- Allowed origins: `http://localhost:5173`, `http://localhost:3000`
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: *
- Credentials: enabled

---

## Frontend

**Tech Stack:** React 18, Vite, React Router

### Project Structure

```
frontend/src/
├── main.jsx              # React entry point
├── App.jsx               # Root component with routing
├── pages/
│   ├── Home.jsx          # Main page with form and list
│   └── RedirectPage.jsx # Redirect handler
├── components/
│   ├── UrlForm.jsx       # URL creation form
│   └── UrlList.jsx       # URL list with delete
├── services/
│   └── api.js           # API client
└── App.css              # Global styles
```

### Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Main page with create/list UI |
| `/r/:code` | RedirectPage | Redirects to original URL |

### API Client (api.js)

All API calls are made to `http://localhost:8080/api`

| Function | Method | Endpoint |
|----------|--------|----------|
| createShortUrl(url, expiresInDays) | POST | /urls |
| getAllUrls() | GET | /urls |
| getUrl(shortCode) | GET | /urls/{shortCode} |
| deleteUrl(shortCode) | DELETE | /urls/{shortCode} |
| getOriginalUrl(shortCode) | GET | /urls/redirect/{shortCode} |

### Features

**Home Page:**
- URL input form with optional expiration (days)
- Create short URL button with loading state
- Copy to clipboard functionality
- Display created short URL with click count
- Table of all URLs with original URL, clicks, dates, delete button

**Redirect Page:**
- Extracts short code from URL path
- Redirects to backend redirect endpoint
- Shows "Redirecting..." message during transition

---

## Running the Application

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+

### Database Setup
```sql
CREATE DATABASE urlshortener;
```

### Backend
```bash
cd backend
mvn spring-boot:run
```
Runs on `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`



#DB

docker run -d --name url-shortener-db \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=urlshortener \
-e TZ=Asia/Kolkata \
-p 5432:5432 \
postgres:16