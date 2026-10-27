# Website Enquiry & Lead Management System - Frontend

Modern, high-performance React frontend for the **Website Enquiry & Lead Management System** built with React 18, Vite, Tailwind CSS, Lucide Icons, and Axios.

---

## Features

### 1. Public Website Enquiry Portal
- **Interactive Enquiry Form**: Collects visitor's name, email, phone (optional), service of interest, and project message.
- **Client-Side Validation**: Immediate feedback on required fields, email formatting, and character limits.
- **Confirmation Screen**: Displays reference ID, status preview, and option to submit another enquiry.
- **Capabilities Showcase**: Modern SaaS hero section, trust indicators, and service highlights.

### 2. Lead Management CRM Dashboard (Admin)
- **Live KPI Summary Metrics**:
  - Total Enquiries
  - Pending Follow-ups (with action required alerts)
  - Converted Leads (with conversion rate percentage calculation)
  - New Leads
  - Pipeline funnel status badges (Contacted, In Follow-up, Lost)
  - Interactive click-to-filter capability on metric cards
- **Search & Filtering**:
  - Instant debounced search by contact name
  - Filter by Service of Interest
  - Filter by Lead Status (`NEW`, `CONTACTED`, `FOLLOW_UP`, `CONVERTED`, `LOST`)
  - Clear / reset filter action with active filter chips
- **Data Table & Pagination**:
  - Responsive table with client name, contact channels, service, status, follow-up status, and submission date
  - Sorting support on timestamp
  - Full Spring Boot pagination (`page`, `size`, `totalPages`, `totalElements`)
- **Follow-up Management**:
  - Modal to log follow-up notes and schedule the next follow-up date and time
  - Interactive indicator for overdue vs. due today vs. upcoming follow-up appointments
  - Complete chronological timeline of follow-up interactions in the Lead Details view
- **Lead Status Tracking**:
  - One-click inline status switcher directly from the table or details drawer
  - Immediate visual badge updates with distinct color codes:
    - `NEW`: Blue
    - `CONTACTED`: Purple
    - `FOLLOW_UP`: Amber
    - `CONVERTED`: Emerald
    - `LOST`: Rose
- **Security & Route Protection**:
  - Protected administrative routes via `ProtectedRoute`
  - JWT storage in `localStorage` with automated `Authorization: Bearer <token>` injection
  - Automatic session expiration and redirect handling on 401 Unauthorized
  - Preconfigured demo credentials shortcut (`admin@example.com` / `admin123`)

---

## Tech Stack
- **Library**: React 18
- **Build Tool**: Vite 6
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios with interceptors

---

## Getting Started

### 1. Prerequisites
- Node.js >= 18
- Backend running on `http://localhost:8080`

### 2. Installation
```bash
cd frontend
npm install
```

### 3. Development Server
```bash
npm run dev
```
The frontend will start at `http://localhost:5173`.
Vite dev server is preconfigured with a proxy to forward all `/api` requests directly to `http://localhost:8080`, avoiding CORS restrictions.

### 4. Build for Production
```bash
npm run build
```
Build output is generated in `frontend/dist`.

---

## Default Admin Credentials
- **Email**: `admin@example.com`
- **Password**: `admin123`
*(A convenient "Auto-fill" button is provided on `/login` for quick testing)*
