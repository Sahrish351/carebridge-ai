# CareBridge AI — Cancer Care Companion

<div align="center">

**Your Cancer Care Journey, Made Easier — Calm Organization, Trusted Evidence & Supported Care.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4.svg)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-43%20Passed-brightgreen.svg)]()

*Submitted to CodeTheCure Hackathon 2026 | Patient Experience & Support Track*

</div>

---

## 💡 About CareBridge AI

A cancer diagnosis plunges patients and their families into an overwhelming world of complex multi-week chemotherapy cycles, scattered appointments across multiple clinics, unpredictable side effects, and rushed 15-minute consultations.

**CareBridge AI** is a compassionate, privacy-first digital companion that replaces fragmentation and anxiety with serene organization and evidence-based clarity. It offers a cycle-aware care planner, a 30-second low-energy symptom journal, an educational AI health assistant powered by Google Gemini and grounded in verified oncology guidelines, and an automatic 1-page doctor visit agenda generator.

CareBridge AI also features native **Urdu (اردو) and English bilingual support** with dynamic RTL layout to ensure diverse families are fully supported.

---

## ✨ Key Capabilities

- **🗓️ Smart Care Planner & Cycle Tracker:** Visual progress bars for multi-cycle chemotherapy regimens (e.g., Cycle 2 of 6 Paclitaxel & Carboplatin), diagnostic blood panel reminders, and daily self-care checklists (hydration, rest, gentle movement).
- **📝 Low-Energy Symptom Journal:** Log daily discomfort, fatigue ratings, and emotional mood in under 30 seconds, generating objective longitudinal trends for oncologists.
- **✨ Evidence-Grounded AI Health Assistant:** Explains cancer concepts, nutrition hints, and side-effect coping strategies in plain, compassionate language. Every factual answer includes verified citations to the National Cancer Institute (NCI), American Cancer Society (ACS), and Mayo Clinic.
- **🚨 Responsible Urgent Triage Safety:** Conservative clinical guards automatically flag red-flag symptoms (such as fever $\ge 100.4^\circ\text{F}$ / $38.0^\circ\text{C}$ during chemotherapy) with immediate guidance to contact the oncology center's 24/7 hotline or emergency services.
- **📋 1-Page Doctor Visit Preparation:** Synthesizes recent symptom entries, current medications, and prioritized questions into a clean, printable 1-page agenda to bring directly to consultations.
- **👥 Granular Caregiver Collaboration:** 100% patient consent-driven. Patients decide exactly which records caregivers can see and can revoke access with one click.
- **🌐 Bilingual & Accessible:** Instant switching between English and Urdu (اردو), with high-contrast mode, legible font sizes, and low cognitive load styling.
- **🔒 Privacy & GDPR Ready:** One-click JSON health data export and complete, permanent account data purge.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 SPA, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Framer Motion |
| **Backend** | Express.js, Node.js v22/v26, TypeScript (executed via `tsx`), Cookie-Parser |
| **Database** | Embedded transactional JSON database (`server/db.ts`) with PBKDF2 hashing |
| **AI Integration** | Google Gen AI SDK (`@google/genai`) with Gemini 2.5 Flash + Grounded Fallback Engine |
| **Testing** | Automated TypeScript test suite (`tests/api.test.ts`), 43 assertions passing |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v20.0.0 or higher (tested on Node v26.1.0)
- **npm:** v10.0.0 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sahrish351/carebridge-ai.git
   cd carebridge-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables (Optional):**
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key from [Google AI Studio](https://aistudio.google.com/):
   ```ini
   GEMINI_API_KEY="AIzaSy..."
   PORT=3000
   ```
   *(If no API key is provided, the application runs seamlessly using its built-in, evidence-grounded knowledge base.)*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open **`http://localhost:3000`** in your browser.

---

## 🧪 Verification & Testing

CareBridge AI includes a verified test harness:

```bash
# Run automated test suite (43 assertions)
npm test

# Run TypeScript static check
npm run lint

# Build production bundle
npm run build

# Start production server
npm start
```

---

## 🧑‍⚕️ Pre-Seeded Demo Accounts

| Role | Email | Password | Features to Explore |
|---|---|---|---|
| **Patient** | `areeba@example.com` | `password123` | Active chemotherapy cycle tracking, symptom journal, doctor visit prep |
| **Caregiver** | `tariq@example.com` | `password123` | Shared patient overview, appointment reminders |
| **Doctor** | `saman@example.com` | `password123` | Clinical schedule, patient consultation prep agendas |

---

## ⚠️ Healthcare Safety & Medical Boundaries

- **Educational Purpose:** CareBridge AI provides general supportive health information and organizational tools. It is **not** a diagnostic device, clinical decision support system, or medical provider.
- **No Diagnosis or Prescribing:** The system never determines whether a patient has cancer, never alters dosages, and never predicts prognosis.
- **Emergency Situations:** In case of emergency or neutropenic fever, patients are directed to call their hospital's 24/7 on-call triage line or emergency services immediately.
- **Data Sovereignty:** All personal health records remain private to the patient; no patient data is shared or sold.

---

## 📄 Submission Documents

See the [`submission/`](./submission/) directory for full hackathon submission documents:
- [`submission/PROJECT_DESCRIPTION.md`](./submission/PROJECT_DESCRIPTION.md) — Comprehensive Devpost project description.
- [`submission/FEATURES_AND_STATUS.md`](./submission/FEATURES_AND_STATUS.md) — Feature-by-feature verification matrix.
- [`submission/SETUP.md`](./submission/SETUP.md) — Setup and deployment documentation.
- [`submission/DEMO_SCRIPT.md`](./submission/DEMO_SCRIPT.md) — 3-minute video presentation walkthrough.
- [`submission/FINAL_CHECKLIST.md`](./submission/FINAL_CHECKLIST.md) — Pre-submission verification checklist.

- **🗓️ Smart Care Planner & Cycle Tracker:** Visual progress bars for multi-cycle chemotherapy regimens (e.g., Cycle 2 of 6 Paclitaxel & Carboplatin), diagnostic blood panel reminders, and daily self-care checklists (hydration, rest, gentle movement).
- **📝 Low-Energy Symptom Journal:** Log daily discomfort, fatigue ratings, and emotional mood in under 30 seconds, generating objective longitudinal trends for oncologists.
- **✨ Evidence-Grounded AI Health Assistant:** Explains cancer concepts, nutrition hints, and side-effect coping strategies in plain, compassionate language. Every factual answer includes verified citations to the National Cancer Institute (NCI), American Cancer Society (ACS), and Mayo Clinic.
- **🚨 Responsible Urgent Triage Safety:** Conservative clinical guards automatically flag red-flag symptoms (such as fever $\ge 100.4^\circ\text{F}$ / $38.0^\circ\text{C}$ during chemotherapy) with immediate guidance to contact the oncology center's 24/7 hotline or emergency services.
- **📋 1-Page Doctor Visit Preparation:** Synthesizes recent symptom entries, current medications, and prioritized questions into a clean, printable 1-page agenda to bring directly to consultations.
- **👥 Granular Caregiver Collaboration:** 100% patient consent-driven. Patients decide exactly which records caregivers can see and can revoke access with one click.
- **🌐 Bilingual & Accessible:** Instant switching between English and Urdu (اردو), with high-contrast mode, legible font sizes, and low cognitive load styling.
- **🔒 Privacy & GDPR Ready:** One-click JSON health data export and complete, permanent account data purge.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 SPA, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Framer Motion |
| **Backend** | Express.js, Node.js v22/v26, TypeScript (executed via `tsx`), Cookie-Parser |
| **Database** | Embedded transactional JSON database (`server/db.ts`) with PBKDF2 hashing |
| **AI Integration** | Google Gen AI SDK (`@google/genai`) with Gemini 2.5 Flash + Grounded Fallback Engine |
| **Testing** | Automated TypeScript test suite (`tests/api.test.ts`), 43 assertions passing |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v20.0.0 or higher (tested on Node v26.1.0)
- **npm:** v10.0.0 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sahrish351/carebridge-ai.git
   cd carebridge-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables (Optional):**
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key from [Google AI Studio](https://aistudio.google.com/):
   ```ini
   GEMINI_API_KEY="AIzaSy..."
   PORT=3000
   ```
   *(If no API key is provided, the application runs seamlessly using its built-in, evidence-grounded knowledge base.)*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open **`http://localhost:3000`** in your browser.

---

## 🧪 Verification & Testing

CareBridge AI includes a verified test harness:

```bash
# Run automated test suite (43 assertions)
npm test

# Run TypeScript static check
npm run lint

# Build production bundle
npm run build

# Start production server
npm start
```

---

## 🧑‍⚕️ Pre-Seeded Demo Accounts

| Role | Email | Password | Features to Explore |
|---|---|---|---|
| **Patient** | `areeba@example.com` | `password123` | Active chemotherapy cycle tracking, symptom journal, doctor visit prep |
| **Caregiver** | `tariq@example.com` | `password123` | Shared patient overview, appointment reminders |
| **Doctor** | `saman@example.com` | `password123` | Clinical schedule, patient consultation prep agendas |

---

## ⚠️ Healthcare Safety & Medical Boundaries

- **Educational Purpose:** CareBridge AI provides general supportive health information and organizational tools. It is **not** a diagnostic device, clinical decision support system, or medical provider.
- **No Diagnosis or Prescribing:** The system never determines whether a patient has cancer, never alters dosages, and never predicts prognosis.
- **Emergency Situations:** In case of emergency or neutropenic fever, patients are directed to call their hospital's 24/7 on-call triage line or emergency services immediately.
- **Data Sovereignty:** All personal health records remain private to the patient; no patient data is shared or sold.

---

## 📄 Submission Documents

See the [`submission/`](./submission/) directory for full hackathon submission documents:
- [`submission/PROJECT_DESCRIPTION.md`](./submission/PROJECT_DESCRIPTION.md) — Comprehensive Devpost project description.
- [`submission/FEATURES_AND_STATUS.md`](./submission/FEATURES_AND_STATUS.md) — Feature-by-feature verification matrix.
- [`submission/SETUP.md`](./submission/SETUP.md) — Setup and deployment documentation.
- [`submission/DEMO_SCRIPT.md`](./submission/DEMO_SCRIPT.md) — 3-minute video presentation walkthrough.
- [`submission/FINAL_CHECKLIST.md`](./submission/FINAL_CHECKLIST.md) — Pre-submission verification checklist.

