# Website Enquiry & Lead Management System

A production-ready full-stack web application designed to collect website visitor enquiries and manage prospective leads through a complete sales and follow-up pipeline.

Built with **Java (Spring Boot)**, **React.js**, and **MySQL**.

---

## 🛠️ Tech Stack & Architecture

- **Backend**:
  - Java 21, Spring Boot, Spring Security (Stateless JWT Authentication)
  - Spring Data JPA, Hibernate ORM, MySQL
  - MapStruct (DTO-entity mapping), Lombok
  - Global centralized exception handling & unified `ApiResponse<T>` / `ApiErrorResponse` envelopes
- **Frontend**:
  - React 18, Vite 6, React Router DOM v6
  - Tailwind CSS (minimalist slate/gray design system)
  - Axios with automated JWT injection & 401 interception
  - Lucide React icons

---

## 📋 Prerequisites

Before running the project locally, ensure you have the following installed:

1. **Java Development Kit (JDK)**: Version 21 or higher (`java -version`)
2. **Node.js**: Version 18.x or higher and `npm` (`node -v`, `npm -v`)
3. **MySQL Server**: Running on `localhost:3306` (or accessible via network)

---

## ⚙️ Environment Configuration (`.env`)

### 1. Backend Configuration

Create a `.env` file in the `backend/` directory (you can copy `backend/.env.example`):

```bash
# In backend/ directory
cp .env.example .env
```

Ensure the values in `backend/.env` match your MySQL setup:

```env
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/lead_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# JWT Authentication
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
```

> **Note**: If the `lead_db` database does not exist, Spring Boot will automatically create it on startup via `createDatabaseIfNotExist=true`, and Hibernate will auto-create and update all schema tables (`ddl-auto: update`).

### 2. Frontend Configuration

Create a `.env` file in the `frontend/` directory (optional for local development):

```bash
# In frontend/ directory
cp .env.example .env
```

```env
# Optional: Leave unset to use Vite's built-in /api reverse proxy
# VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🚀 Running the Application

### 1. Start the Backend (Spring Boot)

Open a terminal in the project root:

```bash
cd backend

# On Windows (PowerShell / Command Prompt):
.\mvnw spring-boot:run

# On Linux / macOS:
./mvnw spring-boot:run
```

The Spring Boot backend will start on **`http://localhost:8080`**.  
On initial startup, `DataInitializer` automatically provisions default administrator accounts and sample leads.

### 2. Start the Frontend (React + Vite)

Open a second terminal in the project root:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The React frontend will start on **`http://localhost:5173`**.

---

## 🔐 Default Admin Credentials

To access the administrative Lead Management Dashboard (`http://localhost:5173/admin/leads`):

- **Email**: `admin@example.com`
- **Password**: `admin123`

---

## 🌟 Key Application Features

1. **Public Enquiry Form (`/`)**:
   - Collects visitor full name, email, phone (optional), service of interest (strictly mapped enum), and message (20–2000 characters with live character counter).
   - Validates inputs on client and server before persistence.
   - Clean, immediate confirmation screen with reset capability.

2. **Lead Dashboard & Table (`/admin/leads`)**:
   - Organized responsive table displaying incoming leads with contact details, service tag, current status badge, and submission date.
   - Full server-side pagination and column sorting.
   - Chronological follow-up timeline badges (Due Today, Overdue, Upcoming).

3. **Lead Lifecycle Tracking**:
   - Supports 5 statuses: `NEW`, `CONTACTED`, `FOLLOW_UP`, `CONVERTED`, and `LOST`.
   - Changing status to `FOLLOW_UP` mandates scheduling a follow-up date and time.
   - Marking a lead as `CONVERTED` or `LOST` automatically closes and excludes active follow-up reminders.

4. **Follow-up Interaction Management**:
   - Log timestamped interaction notes with quick presets (+2h, Tomorrow, In 3 Days, Next Week).
   - Enforces a mandatory follow-up date both on frontend and backend.
   - Automatically advances `NEW` and `CONTACTED` leads to `FOLLOW_UP` upon logging interactions.

5. **Search & Filtering**:
   - Real-time debounced search by contact name.
   - Filter by Service of interest (including `'Other'`).
   - Clean status filter aligned with the 5 core lead statuses.

6. **Summary KPI Metrics**:
   - Real-time counts for Total Enquiries, New Leads, In Follow-up, and Converted Leads (with conversion rate calculation).
   - One-click interactive filtering from any KPI card or pill.

---

## 📡 REST API Reference

All responses follow a consistent envelope: `{ "message": "...", "data": ..., "status": 200 }`.

| Method | Endpoint | Access | Description |
|---|---|:---:|---|
| `POST` | `/api/auth/login` | Public | Admin login; returns JWT token |
| `POST` | `/api/enquiries` | Public | Submit visitor enquiry |
| `GET` | `/api/leads/dashboard` | Admin | Retrieve summary KPI metrics |
| `GET` | `/api/leads` | Admin | Get paginated enquiries |
| `GET` | `/api/leads/search` | Admin | Search by name, service, and status |
| `GET` | `/api/leads/{id}` | Admin | Get single lead with follow-up history |
| `PATCH` | `/api/leads/{id}/status` | Admin | Update status (requires date if `FOLLOW_UP`) |
| `POST` | `/api/leads/{id}/follow-ups`| Admin | Add follow-up note (mandatory schedule date) |
| `DELETE`| `/api/leads/{id}` | Admin | Delete lead record |
