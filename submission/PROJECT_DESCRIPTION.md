# CareBridge AI — Devpost Project Submission

## Project Overview

- **Project Name:** CareBridge AI
- **Tagline:** Your Cancer Care Journey, Made Easier — Calm Organization, Trusted Evidence & Supported Care.
- **Track / Category:** Patient Experience & Support (CodeTheCure Hackathon 2026)
- **Repository:** [https://github.com/Sahrish351/carebridge-ai](https://github.com/Sahrish351/carebridge-ai)

---

## 300-Word Pitch / Hackathon Abstract

A cancer diagnosis places immense emotional and logistical strain on patients and their loved ones. Between complex multi-week chemotherapy cycles, scattered appointments across multiple specialists, fluctuating side effects, and rushed 15-minute clinical visits, patients often experience acute cognitive fatigue and overwhelming anxiety. Late-night internet searches frequently return alarmist or unverified information, further elevating stress.

**CareBridge AI** is a compassionate, privacy-first digital companion designed to bring calm organization, evidence-grounded education, and structured appointment preparation to people affected by cancer. Built with a gentle, accessible interface supporting both English and Urdu (اردو), CareBridge AI focuses on three essential pillars of the patient journey:

1. **Smart Care Planner:** Organizes oncology consultations, diagnostic blood panels, and infusion appointments grouped by treatment cycle, pairing dates with daily hydration, rest, and medication tracking.
2. **Symptom & Wellbeing Journal:** Enables frictionless 30-second logging of discomfort severity, energy, and mood trends so patients never have to rely on strained memory.
3. **Evidence-Grounded AI Assistant & Doctor Visit Prep:** Powered by Google Gemini and backed by authoritative oncology guidelines (National Cancer Institute, American Cancer Society, Mayo Clinic, and WHO). It explains side effects in clear, supportive language, attaches verified citations, immediately flags red-flag symptoms (such as neutropenic fever $\ge 100.4^\circ\text{F}$), and synthesizes longitudinal observations into a concise, 1-page consultation agenda for oncologists.

CareBridge AI enforces strict clinical boundaries: it never diagnoses cancer, prescribes medications, or predicts prognoses. Caregiver access is 100% consent-driven and revocable in one click. By replacing chaos with clarity and evidence, CareBridge AI ensures no patient walks their journey alone or unprepared.

---

## The Problem Statement

Cancer treatment is rarely linear. A single regimen (such as Paclitaxel & Carboplatin) can involve pre-medication regimens, multi-hour infusions, nadir periods of extreme fatigue or low blood counts, and varying supportive medications.

1. **Cognitive Overload & Fragmentation:** Patients receive paper packets, portal logins, and appointment cards across separate departments. Keeping track of resting intervals and infusion dates during peak fatigue is an exhausting burden.
2. **Rushed Clinical Consultations:** In 15-minute consultations, patients often forget subtle symptoms or critical questions they wanted to discuss, leaving appointments anxious and without needed adjustments.
3. **Misinformation & Nighttime Fear:** Unvetted web searches provide speculative or alarmist remedies. Patients need reassuring, plain-language explanations accompanied by verifiable clinical citations.
4. **Caregiver Misalignment:** Family members want to help but struggle to stay informed without repeatedly asking the patient, inadvertently creating emotional friction.

---

## Target Users

1. **Cancer Patients:** Navigating active chemotherapy, radiation, surgery recovery, or monitoring in survivorship.
2. **Family Caregivers & Support Persons:** Spouses, adult children, or trusted friends managing logistics, transportation, and scheduling.
3. **Oncology Clinical Teams:** Oncologists and oncology nurses who benefit from structured, patient-prepared consultation agendas highlighting prioritized concerns and symptom timelines.

---

## Proposed Solution: How CareBridge AI Works

CareBridge AI brings day-to-day oncology self-care and clinical preparation together into an integrated, serene application:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CareBridge AI Platform                        │
├─────────────────────┬────────────────────┬─────────────────────────────┤
│  Care Organization  │  Symptom Tracking  │     Evidence & AI Prep      │
├─────────────────────┼────────────────────┼─────────────────────────────┤
│ • Treatment Cycles  │ • 1-Tap Loggers    │ • Google Gemini (Gemini 2.5)│
│ • Blood Tests & CBC │ • Discomfort Scale │ • NCI, ACS, Mayo Citations  │
│ • Daily Tasks       │ • Mood Trends      │ • Doctor Visit 1-Page Agenda│
│ • Caregiver Sharing │ • Energy Tracking  │ • Urgent Triage Escalation  │
└─────────────────────┴────────────────────┴─────────────────────────────┘
```

1. **Cycle-Aware Care Planner:** Tracks active cycle milestones (e.g., Cycle 2 of 6) with visual progress indicators, upcoming oncology visits, and daily self-care tasks.
2. **Low-Energy Symptom Journal:** Designed for fatigue days. Patients log nausea, neuropathy, appetite, and mood in seconds.
3. **Responsible AI Health Assistant:** Interacts empathetically, answers side-effect questions, cites original medical sources, and triggers emergency alerts when fever or acute symptoms are reported.
4. **1-Page Doctor Visit Agenda Generator:** Synthesizes symptom logs, current medications, and patient concerns into a printable consultation summary.
5. **Granular Caregiver Consent:** Patients can invite caregivers with fine-grained permissions (e.g., view appointments only, or view journal) and revoke access instantly.
6. **Bilingual & Accessible Design:** English and Urdu (اردو) with automatic RTL orientation, high-contrast options, and calming color palettes.

---

## Verified Technology Stack

- **Frontend:** React 19 (SPA), TypeScript, Vite 8, Tailwind CSS v4, Lucide React icons, Motion animations.
- **Backend:** Express.js, TypeScript, Node.js v22/v26, Cookie-Parser, Dotenv.
- **Database Engine:** Embedded transactional JSON database (`server/db.ts`) with PBKDF2 password hashing, session tokens, relational foreign key constraints, and seed data.
- **AI Engine:** Google Gen AI SDK (`@google/genai`) with Gemini 2.5 Flash, temperature 0.3, strict system instructions, grounded fallback database, and authoritative oncology citations.
- **Testing:** Custom automated TypeScript test suite (`tests/api.test.ts`) covering 43 test assertions across auth, appointments, symptom tracking, caregiver delegation, visit prep, and AI grounding.

---

## AI Implementation & Responsible Healthcare Boundaries

Because CareBridge AI supports people experiencing serious illness, safety and medical integrity are prioritized:

- **Non-Diagnostic Educational Scope:** The AI assistant strictly explains general oncology concepts, comfort strategies, and terminology. It explicitly never diagnoses cancer or prescribes treatments.
- **Active Citations:** Responses include verified citations to the National Cancer Institute (NCI), American Cancer Society (ACS), Mayo Clinic, and WHO.
- **Conservative Emergency Triage:** Queries mentioning fever ($\ge 100.4^\circ\text{F}$ / $38.0^\circ\text{C}$), severe chills, chest pain, or uncontrollable vomiting immediately return urgent triage instructions to contact the oncology center's 24/7 hotline or emergency services.
- **Dual Mode Operation:** Runs live with `GEMINI_API_KEY`, or falls back gracefully to a curated, grounded clinical knowledge bank if external API access is offline.
- **User Privacy:** Conversations can be reviewed, exported, or permanently erased at any time.

---

## Distinctive Features

| Feature | CareBridge AI | Generic Health Portals / Chatbots |
|---|---|---|
| **Cycle-Aware Planning** | Highlights chemotherapy cycles, nadir intervals, and labs | Static calendar grids with no oncology context |
| **Consultation Synthesis** | Generates a 1-page printable agenda with symptom trends | Unstructured notes or raw data exports |
| **Bilingual Support** | English + Native Urdu (اردو) with full RTL layout | English-only |
| **Responsible AI Guards** | Cites verified oncology literature; urgent triage prompts | Ungrounded, potentially hallucinated answers |
| **Caregiver Delegation** | Granular, revocable consent per feature | All-or-nothing or absent |

---

## Challenges Encountered & Solutions

1. **Balancing Rich Functionality with Low Cognitive Load:** Cancer patients often experience "chemo brain" and severe fatigue. We avoided dense dashboards, opting for gentle pastel tones, large touch targets, 1-tap selectors, and a 30-second journal workflow.
2. **Safe Fallback AI Architecture:** Relying solely on live cloud APIs can create vulnerabilities during offline testing or when keys expire. We implemented a dual-mode engine: live Gemini 2.5 Flash when configured, and a grounded knowledge bank when offline.
3. **Cross-Platform ESM Execution:** Resolving TypeScript module paths across dev Vite middleware, standard Node, and `tsx` required configuring explicit start scripts and relative path aliases.

---

## Future Improvements

1. **Audio & Voice Journaling:** Speech-to-text logging for days when peripheral neuropathy or fatigue makes typing difficult.
2. **Direct EHR / FHIR Integration:** Bi-directional sync with SMART on FHIR patient portals (Epic, Cerner) to automatically import lab results.
3. **Medication Interaction Checkers:** Cross-referencing non-prescription supplements with active chemotherapy regimens using oncology pharmacopeia databases.
4. **Expanded Regional Languages:** Adding Hindi, Punjabi, and Arabic to broaden international access for underserved communities.

