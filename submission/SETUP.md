# CareBridge AI — Setup & Deployment Guide

This guide describes how to install, configure, test, and deploy CareBridge AI locally and on Vercel with Supabase PostgreSQL.

---

## 1. System Requirements

- **Node.js:** `v20.0.0` or higher (`v22.x` or `v26.x` recommended; tested on Node `v26.1.0`)
- **npm:** `v10.0.0` or higher (tested on npm `11.13.0`)
- **Operating System:** Cross-platform (Windows 10/11, macOS, Ubuntu / Linux)
- **Browser:** Any modern evergreen browser (Chrome, Firefox, Safari, Edge)

---

## 2. Quick Start (Local Development)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Sahrish351/carebridge-ai.git
cd carebridge-ai
```

### Step 2: Install Dependencies

Use `--legacy-peer-deps` to handle React 19 peer dependencies:

```bash
npm install --legacy-peer-deps
```

### Step 3: Configure Environment Variables (Optional)

CareBridge AI operates out of the box with an embedded, transactional local storage engine and an offline, evidence-grounded knowledge bank.

To enable live Google Gemini AI generation or connect to Supabase:

1. Copy the template file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in any desired credentials:
   ```ini
   # Optional: Google Gemini API key
   GEMINI_API_KEY="AIzaSy..."

   # Optional: Supabase PostgreSQL (Required only for Vercel production deployment)
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

   # Server port
   PORT=3000
   ```

### Step 4: Start the Development Server

```bash
npm run dev
```

The application will start on:
👉 **`http://localhost:3000`**

---

## 3. Production Deployment on Vercel with Supabase

CareBridge AI is designed with a serverless architecture ready for Vercel and Supabase PostgreSQL.

### Step 1: Initialize Supabase Database

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** -> Click **New Query**.
3. Open [`supabase/schema.sql`](../supabase/schema.sql) in this repository, copy its entire contents, and paste it into the Supabase SQL Editor.
4. Click **Run**. This creates:
   - All 9 core tables (`users`, `sessions`, `appointments`, `journal_entries`, `daily_tasks`, `caregiver_permissions`, `chat_sessions`, `visit_summaries`, `password_reset_tokens`).
   - Indexes and Row Level Security (RLS) policies.
   - Pre-seeded demo accounts (`areeba@example.com`, `tariq@example.com`, `saman@example.com`).
5. In Supabase, go to **Project Settings** -> **API**:
   - Copy **Project URL** (`SUPABASE_URL`).
   - Copy **service_role secret key** (`SUPABASE_SERVICE_ROLE_KEY`).

### Step 2: Configure Vercel Project

1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Under **Project Settings** -> **Environment Variables**, add:
   - `SUPABASE_URL`: Your Supabase Project URL.
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Secret Key.
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API Key.
   - `NODE_ENV`: `production`
3. Click **Deploy**.

Vercel will build the frontend via `vite build` to `dist/`, deploy the backend serverless function via `api/index.ts`, and handle all routing seamlessly according to `vercel.json`.

---

## 4. Pre-Configured Demo Accounts

CareBridge AI comes pre-seeded with sample profiles so evaluators can test workflows immediately without manual registration:

| Role | Email | Password | What You Can Explore |
|---|---|---|---|
| **Patient** | `areeba@example.com` | `password123` | Active Chemotherapy cycle tracking (Paclitaxel & Carboplatin), symptom logs, doctor visit prep, caregiver sharing |
| **Caregiver** | `tariq@example.com` | `password123` | Shared patient overview, appointment reminders, care recipient status |
| **Doctor / Nurse** | `saman@example.com` | `password123` | Clinical schedule, patient consultation prep agendas, oncology guidelines |

> **Quick Demo Login:** On the login page, you can also click the quick-login pills at the top to populate any demo profile instantly.

---

## 5. Verification & Testing

### Run Automated Unit & Logic Tests (44 assertions)

```bash
npm test
```

### Run Live End-to-End HTTP Protocol Tests (30 assertions)

Tests live registration, duplicate email handling, session issuance, dashboard access, appointment persistence, logout, second login, and demo accounts:

```bash
npm run test:e2e
```

### Run Static TypeScript Linting

```bash
npm run lint
```

### Run Production Build

```bash
npm run build
```

---

## 6. Architecture Overview

```
carebridge-ai/
├── api/
│   └── index.ts             # Vercel Serverless Function entry point
├── data/
│   └── carebridge.json      # Local transactional JSON database
├── public/
│   └── assets/              # Static images and brand marks
├── server/
│   ├── aiService.ts         # Google Gemini & grounded evidence fallback
│   ├── app.ts               # Express application with CORS & health handlers
│   ├── db.ts                # Dual-engine DB (Supabase PostgreSQL + local JSON)
│   └── routes.ts            # REST API endpoints for auth, care, journal, prep
├── src/
│   ├── components/layout/   # AppLayout, Navbar, Footer
│   ├── context/             # AuthContext, LanguageContext (English & Urdu)
│   ├── pages/               # Dashboard, CarePlanner, Journal, AI Assistant, etc.
│   ├── services/api.ts      # Frontend API client
│   ├── App.tsx              # Application router & protected routes
│   └── main.tsx             # React DOM entry point
├── supabase/
│   └── schema.sql           # Complete Supabase PostgreSQL migration & seed SQL
├── tests/
│   ├── api.test.ts          # Core database & domain test suite (44 assertions)
│   └── e2e-http.test.ts     # Live HTTP protocol test suite (30 assertions)
├── package.json             # Scripts & dependencies
├── server.ts                # Express backend + Vite dev middleware (local dev)
├── tsconfig.json            # TypeScript compiler configuration
├── vercel.json              # Vercel serverless routing & SPA rewrites
└── vite.config.ts           # Vite build configuration
```
