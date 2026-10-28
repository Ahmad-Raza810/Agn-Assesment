# Lead Management System - Backend API

A Spring Boot backend for managing website enquiries and lead tracking with JWT authentication.

## Features

- **JWT Authentication**: Secure token-based authentication and authorization
- **Public Enquiry Submission**: Visitors can submit enquiries without authentication
- **Lead Dashboard**: Admins can view and manage all enquiries
- **Lead Status Tracking**: NEW, CONTACTED, FOLLOW_UP, CONVERTED, LOST
- **Follow-up Management**: Add notes and schedule follow-up dates
- **Search & Filtering**: Search by name, filter by service or status
- **Dashboard Summary**: View statistics on total enquiries, pending follow-ups, and conversions
- **Auto-initialization**: Test data and admin users created on first run

## Tech Stack

- Java 21
- Spring Boot 4.1.2
- Spring Data JPA
- Spring Security (with JWT Authentication)
- JWT (JSON Web Tokens)
- MySQL Database
- Lombok

## Prerequisites

- Java 21
- MySQL Server running on localhost:3306
- MySQL user: `admin` with password: `ahmad1234`
- Copy `.env.example` to `.env` and configure your environment variables

## Database Setup

The application will automatically create the database `lead_db` on first run if it doesn't exist. The tables will be created automatically by Hibernate.

### Default Users Created on Startup

**Admin Users:**
1. Email: `admin@example.com` / Password: `admin123`
2. Email: `superadmin@example.com` / Password: `admin123`

**Regular User:**
- Email: `user@example.com` / Password: `user123`

### Sample Enquiries Created on Startup

The application initializes with 6 sample enquiries with different statuses:
- 2 NEW enquiries
- 1 CONTACTED enquiry
- 1 FOLLOW_UP enquiry (with follow-up notes)
- 1 CONVERTED enquiry
- 1 LOST enquiry

## Running the Application

### Setup Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lead_db
DB_USERNAME=admin
DB_PASSWORD=ahmad1234

# JWT Configuration
JWT_SECRET=mySecretKeyForJwtTokenGenerationThatIsLongEnoughForHS256Algorithm
JWT_EXPIRATION=86400000

# Server Configuration
SERVER_PORT=8080

# JPA Configuration
JPA_HIBERNATE_DDL_AUTO=update
JPA_SHOW_SQL=true
```

### Start the Application

```bash
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication Endpoints (No Authentication Required)

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### Public Endpoints (No Authentication Required)

#### Submit Enquiry
```http
POST /api/enquiries
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "serviceOfInterest": "Web Development",
  "message": "I'm interested in your services"
}
```

### Admin Endpoints (JWT Token Required)

All admin endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

#### Dashboard Summary
```http
GET /api/leads/dashboard
```

Response:
```json
{
  "totalEnquiries": 10,
  "pendingFollowUps": 5,
  "convertedLeads": 3,
  "newLeads": 2,
  "contactedLeads": 2,
  "followUpLeads": 2,
  "lostLeads": 1
}
```

#### Get All Leads (Paginated)
```http
GET /api/leads?page=0&size=10&sortBy=createdAt&sortDir=desc
```

#### Search Leads
```http
GET /api/leads/search?name=John&service=Web Development&status=NEW&page=0&size=10
```

#### Get Lead by ID
```http
GET /api/leads/{id}
```

Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "serviceOfInterest": "Web Development",
  "message": "I'm interested in your services",
  "status": "NEW",
  "createdAt": "2026-10-27T12:00:00",
  "updatedAt": "2026-10-27T12:00:00",
  "followUps": []
}
```

#### Update Lead Status
```http
PATCH /api/leads/{id}/status
Content-Type: application/json

{
  "status": "CONTACTED"
}
```

#### Add Follow-up Note
```http
POST /api/leads/{id}/follow-ups
Content-Type: application/json

{
  "notes": "Called the client, they are interested",
  "nextFollowUpDate": "2026-11-01T10:00:00"
}
```

#### Delete Lead
```http
DELETE /api/leads/{id}
```

## Lead Status Values

- `NEW` - Newly submitted enquiry
- `CONTACTED` - Initial contact made
- `FOLLOW_UP` - Follow-up scheduled
- `CONVERTED` - Successfully converted to customer
- `LOST` - Lead lost/closed

## Database Schema

### Enquiries Table
- `id` (Long, Primary Key)
- `name` (String, 100 chars)
- `email` (String, 150 chars)
- `phone` (String, 20 chars, optional)
- `serviceOfInterest` (String, 100 chars)
- `message` (Text)
- `status` (Enum: NEW, CONTACTED, FOLLOW_UP, CONVERTED, LOST)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Follow-ups Table
- `id` (Long, Primary Key)
- `enquiry_id` (Long, Foreign Key to Enquiries)
- `notes` (Text)
- `nextFollowUpDate` (Timestamp, optional)
- `createdAt` (Timestamp)

### Users Table
- `id` (Long, Primary Key)
- `name` (String, 100 chars)
- `email` (String, 150 chars, unique)
- `password` (String, 255 chars, BCrypt encrypted)
- `role` (Enum: ADMIN, USER)
- `createdAt` (Timestamp)

## Testing with cURL

### Login and get JWT token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Save the token from the response as `TOKEN`.

### Submit an enquiry (no auth)
```bash
curl -X POST http://localhost:8080/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "serviceOfInterest": "Web Development",
    "message": "I need a website"
  }'
```

### Get dashboard summary (with JWT token)
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/leads/dashboard
```

### Get all leads (with JWT token)
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/leads
```

### Logout
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

## Configuration

The application uses environment variables loaded from a `.env` file in the project root. All configuration is managed through the `.env` file.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 3306 |
| `DB_NAME` | Database name | lead_db |
| `DB_USERNAME` | Database username | admin |
| `DB_PASSWORD` | Database password | ahmad1234 |
| `JWT_SECRET` | Secret key for JWT signing | (see .env.example) |
| `JWT_EXPIRATION` | Token expiration in ms | 86400000 (24h) |
| `SERVER_PORT` | Server port | 8080 |
| `JPA_HIBERNATE_DDL_AUTO` | Hibernate DDL mode | update |
| `JPA_SHOW_SQL` | Show SQL queries | true |

### Security Notes

- **JWT_SECRET**: In production, use a long, random string (at least 256 bits)
- **DB_PASSWORD**: Never commit the `.env` file to version control
- The `.env` file is already in `.gitignore`

## Production Deployment

For production:
1. Update the `.env` file with production database credentials
2. Use a strong, randomly generated `JWT_SECRET`
3. Set `JPA_HIBERNATE_DDL_AUTO=validate` to prevent accidental schema changes
4. Set `JPA_SHOW_SQL=false` to disable SQL logging
5. Configure proper logging levels
6. Set up proper backups for the MySQL database
7. Use environment-specific `.env` files (e.g., `.env.production`)
