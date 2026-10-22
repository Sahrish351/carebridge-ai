# CareBridge AI — Setup & Deployment Guide

This guide describes how to install, configure, test, and run CareBridge AI from a fresh clone.

---

## 1. System Requirements

- **Node.js:** `v20.0.0` or higher (`v22.x` or `v26.x` recommended; tested on Node `v26.1.0`)
- **npm:** `v10.0.0` or higher (tested on npm `11.13.0`)
- **Operating System:** Cross-platform (Windows 10/11, macOS, Ubuntu / Linux)
- **Browser:** Any modern evergreen browser (Chrome, Firefox, Safari, Edge)

---

## 2. Quick Start

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

### Step 3: Configure Environment Variables (Optional for Live Gemini)

CareBridge AI includes an offline, evidence-grounded fallback mode that works immediately without any API keys.

To enable live Google Gemini AI generation:

1. Copy the template file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and add your Gemini API key from [Google AI Studio](https://aistudio.google.com/):
   ```ini
   # Server-side Gemini API key
   GEMINI_API_KEY="AIzaSy..."

   # Server port (default: 3000)
   PORT=3000
   ```

> **Note:** Never commit `.env` or `.env.local` to Git. These are excluded by `.gitignore`.

### Step 4: Start the Development Server

```bash
npm run dev
```

The application will start on:
👉 **`http://localhost:3000`**

---

## 3. Pre-Configured Demo Accounts

CareBridge AI comes pre-seeded with sample profiles so evaluators can test workflows immediately without manual registration:

| Role | Email | Password | What You Can Explore |
|---|---|---|---|
| **Patient** | `areeba@example.com` | `password123` | Active Chemotherapy cycle tracking (Paclitaxel & Carboplatin), symptom logs, doctor visit prep, caregiver sharing |
| **Caregiver** | `tariq@example.com` | `password123` | Shared patient overview, appointment reminders, care recipient status |
| **Doctor / Nurse** | `saman@example.com` | `password123` | Clinical schedule, patient consultation prep agendas, oncology guidelines |

> **Quick Demo Login:** On the login page, you can also click the quick-login pills at the top to populate any demo profile instantly.

---

## 4. Verification & Testing

### Run Automated Tests

To execute the test suite (43 assertions covering database operations, auth, appointments, journal, caregiver permissions, and AI fallback):

```bash
npm test
```

### Run Static TypeScript Linting

```bash
npm run lint
```

### Run Production Build

```bash
npm run build
```

The production assets will be built to the `dist/` directory.

### Run in Production Mode

```bash
npm start
```

---

## 5. Technology Architecture

```
carebridge-ai/
├── data/
│   └── carebridge.json      # Persistent local database (auto-created if missing)
├── public/
│   └── assets/              # Static images and brand marks
├── server/
│   ├── aiService.ts         # Google Gemini & grounded evidence fallback
│   ├── db.ts                # Transactional database engine with PBKDF2 hashing
│   └── routes.ts            # REST API endpoints for auth, care, journal, prep
├── src/
│   ├── components/layout/   # AppLayout, Navbar, Footer
│   ├── context/             # AuthContext, LanguageContext (English & Urdu)
│   ├── pages/               # Dashboard, CarePlanner, Journal, AI Assistant, etc.
│   ├── services/api.ts      # Frontend API client
│   ├── App.tsx              # Application router & protected routes
│   └── main.tsx             # React DOM entry point
├── tests/
│   └── api.test.ts          # Automated verification test suite
├── package.json             # Scripts & dependencies
├── server.ts                # Express backend + Vite dev middleware
├── tsconfig.json            # TypeScript compiler configuration
└── vite.config.ts           # Vite build configuration
```

---

## 6. Known Limitations & Hackathon Boundaries

1. **Non-Clinical Software:** CareBridge AI is an organizational and educational support companion. It is **not** a certified medical device, does not diagnose cancer, and does not prescribe treatments.
2. **Offline vs. Online AI:** When `GEMINI_API_KEY` is not provided, the AI Assistant relies on a curated knowledge bank grounded in published NCI, ACS, and Mayo Clinic guidance. It does not invent answers.
3. **Local JSON Database:** For hackathon portability and ease of evaluation, the application uses an embedded JSON file database (`data/carebridge.json`). For hospital-scale deployment, this would be migrated to PostgreSQL with HIPAA-compliant row-level security.

