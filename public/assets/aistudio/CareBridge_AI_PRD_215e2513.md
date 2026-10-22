# CareBridge AI — Product Requirements Document (PRD)
## CodeTheCure Hackathon 2026 | Patient Experience & Support

> **Tagline:** Your Cancer Journey, Made Easier.  
> **Product type:** Responsive AI-powered web application  
> **Primary audience:** Cancer patients, caregivers, and people supporting a patient  
> **Hackathon category:** Patient Experience & Support  
> **Status:** Build specification for Google AI Studio  
> **Important:** CareBridge AI is a support and organization tool, not a medical device, diagnostic system, or replacement for a licensed clinician.

![CareBridge AI visual direction and UI reference](CareBridge_AI_UI_Reference.png)

---

## 1. Product Vision

Create a polished, trustworthy, accessible digital companion that helps people affected by cancer organize day-to-day care, understand reliable health information in plain language, prepare for appointments, and share relevant notes with their care team or an authorized caregiver.

The product must feel like a real, thoughtfully designed healthcare product—not a generic AI-generated dashboard or a static landing page. The core experience must work end-to-end, with real persistence and clear loading, empty, success, and error states.

### Product promise
**Less confusion. Better preparation. More supported care.**

### What success looks like
A first-time user can create an account, explore a calm and clear patient workspace, add an appointment, record a symptom entry, ask the assistant a health-information question, inspect its sources and limitations, and generate a concise doctor-visit summary.

---

## 2. Problem Statement

Cancer care can involve many appointments, treatment instructions, symptoms, questions, and sources of information. Patients and caregivers may struggle to keep information organized, understand unfamiliar terminology, and remember what to ask during a short clinical appointment.

CareBridge AI brings practical organization and source-grounded education together in one accessible place. It does **not** determine whether a person has cancer, recommend an individual treatment plan, or replace professional medical advice.

---

## 3. Goals and Non-Goals

### Goals
1. Help users organize appointments, reminders, personal notes, and questions.
2. Offer an AI assistant that explains general cancer-related information in plain language and provides source links.
3. Let users record symptoms and wellbeing observations over time.
4. Generate a shareable appointment-preparation summary from user-entered information.
5. Support caregiver collaboration only with clear patient permission.
6. Deliver a responsive, accessible, polished interface on desktop, tablet, and mobile.
7. Protect sensitive information and avoid unsupported medical claims.

### Non-goals
- Diagnosing cancer or estimating an individual's cancer probability.
- Recommending, prescribing, or changing treatment or medication.
- Predicting survival, treatment outcomes, or prognosis.
- Replacing emergency services, oncologists, nurses, therapists, or other clinicians.
- Claiming regulatory approval, clinical validation, or HIPAA compliance unless formally verified.
- Using fabricated patient stories, medical credentials, testimonials, statistics, or clinical results.

---

## 4. Target Users

### A. Patient
Needs to organize appointments, track personal observations, understand general information, and prepare questions for clinicians.

### B. Caregiver / Trusted Support Person
Needs to help with practical organization after the patient grants access. The caregiver must not automatically gain access to private patient information.

### C. Demo / Evaluation User
Needs to understand the product quickly and try its main workflows using clearly labelled sample data. Demo data must be fictional and must never be presented as a real patient's medical record.

---

## 5. Information Architecture and Pages

Build a complete application with these routes or equivalent page-level views:

1. **Public Landing Page**
   - Hero section with clear value proposition and two calls to action: “Get Started” and “Explore Features”.
   - Product preview/mockup, benefits, workflow, accessibility statement, privacy explanation, FAQs, and footer.
   - Do not place a wall of cards above the fold. Use a strong visual hierarchy and purposeful whitespace.

2. **Sign Up**
   - Name, email, password, confirm password, consent acknowledgement.
   - Inline validation, password visibility toggle, accessible errors.
   - Do not collect unnecessary health data during registration.

3. **Log In**
   - Email/password, show/hide password, forgot-password flow, and clear error states.
   - OAuth may be added only if fully configured and tested. Never display fake social-login success.

4. **Forgot / Reset Password**
   - Functional reset flow appropriate to the chosen authentication provider.
   - If email delivery is not configured, clearly label the limitation rather than pretending a message was sent.

5. **Onboarding**
   - Short, skippable setup: preferred name, language, accessibility preferences, and optional care-planning preferences.
   - Explain why any requested information is needed. Do not ask for diagnosis or detailed medical history unless genuinely necessary for a specific feature.

6. **Patient Home / Dashboard**
   - Welcome and next-step summary.
   - Upcoming appointments, today's tasks/reminders, recent journal entries, quick actions, and recent assistant conversations.
   - Clear empty states for new users.
   - Use visual hierarchy and a small number of meaningful modules; avoid dense analytics dashboards.

7. **Care Planner**
   - Create, view, edit, and delete appointments and personal reminders.
   - Fields: title, date/time, location (optional), notes (optional), reminder preference.
   - Validate date/time and timezone; show upcoming and past items.
   - If browser notifications or email reminders are not fully implemented, do not imply that reminders will be delivered. In-app reminders must work.

8. **AI Support Assistant**
   - Conversational interface with suggested prompts.
   - Plain-language explanations for general educational questions.
   - Show citations/links for retrieved sources and distinguish sourced information from generated wording.
   - Provide a visible disclaimer: informational support only, not diagnosis or personalized treatment advice.
   - Include loading, retry, network error, empty, and safety-escalation states.
   - Let users clear a conversation and, where feasible, delete stored chat history.

9. **Symptom & Wellbeing Journal**
   - Record date/time, selected symptom or free-text note, severity scale, optional impact/context, and optional mood/wellbeing entry.
   - Users can edit/delete their own entries.
   - Show a simple, accessible history view and a basic trend visualization only when sufficient user-entered data exists.
   - Do not infer a diagnosis or claim that a trend identifies treatment complications.

10. **Doctor Visit Preparation**
    - Build a summary from user-selected appointments, questions, and journal entries.
    - Let the user review and edit before exporting.
    - Provide print-friendly layout and, if feasible, PDF download.
    - Label it “Patient-prepared summary—not a clinical assessment.”
    - Never automatically send data to a clinician.

11. **Caregiver Access**
    - Patient can invite a trusted person or grant/revoke access through a secure, explicit consent flow.
    - Show exactly what will be shared.
    - Allow access to be revoked.
    - If full invitation/email functionality cannot be safely implemented, provide a working permission-management prototype and clearly label demo-only behavior. Do not expose data through a guessed URL or shared identifier.

12. **Trusted Resources**
    - Curated resources from reputable organizations, such as the National Cancer Institute, World Health Organization, and relevant national cancer organizations.
    - Show resource title, publisher, topic, last-verified date if known, and external link.
    - Do not fabricate citations or source dates.

13. **Profile, Privacy & Settings**
    - Update basic profile and language/accessibility preferences.
    - View consent and data-sharing settings.
    - Delete journal entries, chats, or account data where supported.
    - Include privacy notice, terms/disclaimer, and sign-out.

14. **Helpful States**
    - Custom not-found page, offline/network error state, loading skeletons, empty states, and friendly recovery actions.

---

## 6. Functional Requirements

### FR-01: Authentication and route protection
- Use a real authentication provider and server-verified sessions.
- Public pages: landing, sign-up, login, password recovery, public resources.
- Private pages: dashboard, care planner, journal, assistant history, visit summaries, profile.
- Unauthenticated visitors who access a private route must be redirected to login.
- A frontend-only boolean or `localStorage` flag is not authentication.
- Protect server/database queries as well as UI routes.
- Users may only read or modify records they own or have explicitly been granted permission to access.
- Provide logout and handle expired sessions.

### FR-02: Persistent records
- Store user-created appointments, journal entries, preferences, and conversations in the configured database.
- Show loading, success, validation, and failure feedback.
- Do not silently discard changes or use hard-coded sample values as if they were live records.
- Provide a clearly labelled optional demo mode with fictional data if useful.

### FR-03: Care planning
- Create, read, update, and delete appointments and reminders.
- Validate required fields and date/time.
- Keep the interface usable with keyboard and screen reader.

### FR-04: AI responses
- Call the model through a secure server-side endpoint or approved server-side integration.
- Never expose API keys in client code, repository commits, browser bundles, or public logs.
- Use retrieval-augmented generation (RAG) from a curated, reputable source collection when feasible.
- Return source titles and URLs alongside relevant answers.
- If no reliable source is available, say so and suggest asking a qualified professional.
- Clearly separate general educational information from personal medical decisions.
- Avoid presenting generated information as certainty.

### FR-05: Symptom journal
- Save entries with ownership checks.
- Support edit/delete and chronological history.
- Export only after user review and confirmation.
- Do not present symptom logs as diagnosis, triage certainty, or a substitute for a clinician.

### FR-06: Visit summary
- Generate a concise draft from records selected by the user.
- Let the user inspect, edit, and confirm before printing or exporting.
- Include creation date and a clear “patient-prepared” label.
- Exclude unrelated or unselected private data.

### FR-07: Caregiver permissions
- Default to private.
- Require explicit patient action to grant access.
- Provide a clear permission scope and revoke option.
- Enforce access rules in the backend, not only in the UI.

### FR-08: Accessibility and localization
- Support responsive layouts and keyboard navigation.
- Build a language-ready structure. English is the initial language; Urdu may be included if translations can be reviewed for accuracy.
- Never rely on color alone to communicate status.
- Respect reduced-motion preferences.

### FR-09: Error handling
- Show understandable error messages and recovery actions.
- Never fake successful saves, AI replies, email delivery, authentication, or exports.
- Log technical errors safely without exposing sensitive patient text or secrets.

---

## 7. AI Safety, Health Content, and Privacy

This is a high-priority requirement.

### AI must
- Explain general information in clear, non-alarming language.
- Prefer reputable, verifiable sources.
- Cite source links when making factual health-information claims.
- Acknowledge uncertainty and gaps in available evidence.
- Encourage patients to discuss personal medical decisions with their care team.
- Avoid collecting more sensitive information than needed.

### AI must not
- Diagnose cancer or rule it out.
- Recommend medication doses, prescribe treatments, or tell users to stop treatment.
- Promise a cure or guarantee outcomes.
- invent medical references, statistics, clinical trials, doctors, or institutional affiliations.
- Shame, blame, or frighten patients.
- Treat symptom severity scores as a reliable clinical triage system.

### Concerning or urgent symptoms
Use conservative, clearly worded safety guidance. Encourage users to follow their care team's emergency instructions and contact local emergency services or their oncology team when appropriate. Do not claim the app can reliably identify every emergency. Do not delay urgent care with a long chatbot interview.

### Data protection
- Collect minimal data and explain its purpose.
- Use HTTPS in deployment and the selected provider's security controls.
- Enforce row-level or equivalent server-side authorization.
- Keep secrets in environment variables/server-side secret storage.
- Never commit `.env` files or credentials.
- Do not include real patient data in screenshots, seed data, logs, or demo recordings.
- Provide a privacy notice and clear delete/export controls where supported.
- Do not claim HIPAA/GDPR compliance without an appropriate legal and technical review.

---

## 8. Visual Design System

### Desired impression
Premium, human, calm, modern, credible, inclusive, emotionally supportive, and technically polished.

### Visual direction
- Light-first interface with a warm off-white background.
- Deep navy for readable headings and navigation.
- Blue and violet as primary accent colors, with restrained teal/green for positive states.
- Soft lavender or pale blue section backgrounds.
- Rounded corners, subtle borders, gentle shadows, elegant spacing, and restrained gradients.
- Use genuine, appropriately licensed photography or carefully selected illustrations where they improve understanding.
- Use consistent icons from one icon library.
- Use a modern readable sans-serif for UI text and optionally a distinctive display font for the hero heading.
- Maintain WCAG-oriented contrast and visible keyboard focus.

### Suggested design tokens
- Background: `#F8FAFF`
- Surface: `#FFFFFF`
- Primary: `#4055D9`
- Secondary: `#7856D8`
- Heading: `#17233F`
- Body: `#526078`
- Accent: `#2BAE9A`
- Border: `#E3E9F4`
- Warning: `#B7791F`
- Error: `#B42318`

These are initial suggestions. Check contrast and adjust where necessary.

### Animation
Use subtle, purposeful motion:
- Short fade/slide-in on page content.
- Gentle hover and press feedback on buttons.
- Small transitions when tabs, filters, and dialogs change.
- Skeleton loading for data fetches.
- Lightweight chart drawing only if it remains accessible.
- Avoid constant pulsing, excessive parallax, distracting backgrounds, and animation on every element.
- Honor `prefers-reduced-motion`.

### Avoid
- Generic AI-looking dashboards made entirely of identical cards.
- Excessive gradients, glowing borders, neon colors, and huge empty hero areas.
- Dark backgrounds across every page.
- Tiny text, low contrast, clutter, fake statistics, and fake testimonials.
- Decorative imagery that competes with patient tasks.
- Buttons that look functional but do nothing.

---

## 9. Responsive Requirements

Implement and test at these approximate viewport widths:
- Small mobile: 320–390 px
- Large mobile: 391–480 px
- Tablet: 768 px
- Laptop: 1024–1440 px
- Wide desktop: 1440 px and above

Requirements:
- No horizontal overflow.
- Mobile navigation should be simple and touch-friendly.
- Forms should fit small screens and display errors close to their fields.
- Dashboard modules should reflow naturally.
- Tables must become mobile-friendly lists or scroll safely.
- Dialogs and menus must fit the viewport.
- Main actions must be reachable without precise pointer control.

---

## 10. Suggested Technical Architecture

Use a maintainable, modern stack that Google AI Studio can generate and that can be tested locally.

### Preferred implementation
- Frontend: React + TypeScript + Vite (or another fully supported modern React setup).
- Styling: Tailwind CSS with a coherent design system.
- Components: accessible component primitives such as shadcn/ui or equivalent.
- Animation: Framer Motion / Motion, used sparingly.
- Icons: Lucide.
- Backend/data/auth: Supabase Auth + PostgreSQL + Row Level Security, or a comparably secure backend that is actually configured.
- AI: Gemini API called through a secure server-side function; do not put the API key in browser code.
- Source-grounded answers: curated resources and retrieval pipeline; if full RAG is out of scope, implement a small verified source catalogue and be transparent about limitations.
- Charts: a lightweight accessible chart library only where it adds value.
- Deployment: Vercel or another compatible platform; configure environment variables through deployment settings.

### Architecture rules
1. Keep UI, data-access, AI, and shared types in separate modules.
2. Use TypeScript types for all important entities and API payloads.
3. Validate data at both client and server boundaries.
4. Protect private data with server-side authorization / database policies.
5. Add a `.env.example` containing placeholder names only.
6. Include migrations/schema and clear setup instructions.
7. Do not claim a backend is connected until a real test confirms it.
8. If a service needs credentials, provide clear setup instructions and a graceful configuration error state.
9. Avoid overengineering. Complete and test core workflows before adding optional features.

### Example environment variable names
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
```
The Gemini key must be used **only on the server side**. Public frontend variables may contain only credentials explicitly designed to be public, such as a provider's public/anonymous client key with proper database policies. Prefer a serverless function or backend proxy for AI calls.

---

## 11. Data Model (Suggested)

Use appropriate IDs, timestamps, ownership, and foreign-key constraints.

### `profiles`
- `id` (matches auth user ID)
- `display_name`
- `preferred_language`
- `accessibility_preferences` (JSON)
- `created_at`, `updated_at`

### `appointments`
- `id`
- `user_id`
- `title`
- `starts_at`
- `location` (nullable)
- `notes` (nullable)
- `reminder_setting`
- `created_at`, `updated_at`

### `journal_entries`
- `id`
- `user_id`
- `recorded_at`
- `symptom_label` (nullable)
- `severity` (optional user-reported scale)
- `mood` (nullable)
- `notes` (nullable)
- `created_at`, `updated_at`

### `chat_sessions`
- `id`
- `user_id`
- `title`
- `created_at`, `updated_at`

### `chat_messages`
- `id`
- `session_id`
- `role`
- `content`
- `source_references` (JSON, nullable)
- `created_at`

### `caregiver_permissions`
- `id`
- `patient_user_id`
- `caregiver_user_id` or a securely managed invitation record
- `permission_scope`
- `status`
- `created_at`, `revoked_at`

### `visit_summaries`
- `id`
- `user_id`
- `appointment_id` (nullable)
- `content`
- `created_at`

**Security:** Define row-level security policies for every private table. Verify that one user cannot read, update, or delete another user's records. Caregiver permissions must be checked explicitly. Avoid storing unnecessary detailed health history.

---

## 12. Primary User Journey

1. Visitor opens the landing page and understands the product within a few seconds.
2. Visitor selects “Get Started” and creates an account.
3. User verifies or establishes a session and completes minimal onboarding.
4. User reaches a helpful, uncluttered dashboard with useful empty states.
5. User adds an upcoming appointment and a reminder.
6. User records a symptom or wellbeing observation.
7. User asks the AI assistant a general information question.
8. Assistant returns a cautious, plain-language response with real source links where available.
9. User selects relevant journal entries and questions to create a doctor-visit summary.
10. User reviews and edits the summary, then prints or exports it.
11. User can optionally grant and revoke caregiver access.
12. User can inspect privacy settings and securely sign out.

---

## 13. Acceptance Criteria / Definition of Done

The project is not complete until all critical checks pass.

### Core functionality
- [ ] Landing page explains the product and links work.
- [ ] Registration and login work with the configured provider.
- [ ] Private routes reject unauthenticated users.
- [ ] Database authorization prevents cross-user access.
- [ ] Appointment create/edit/delete persists after refresh.
- [ ] Journal create/edit/delete persists after refresh.
- [ ] AI assistant handles loading, errors, and successful responses.
- [ ] Source links are real and open the referenced resources.
- [ ] Visit summary uses only selected records and can be edited before export.
- [ ] Caregiver access is consent-based and revocable, or clearly labelled as a non-production prototype.
- [ ] Logout clears the active session.
- [ ] No fake success messages or dead primary buttons remain.

### Quality and accessibility
- [ ] Responsive on phone, tablet, laptop, and desktop.
- [ ] No horizontal overflow at 320 px width.
- [ ] Keyboard navigation and focus states work.
- [ ] Form fields have labels and understandable validation.
- [ ] Motion respects reduced-motion preferences.
- [ ] Color contrast is checked.
- [ ] Empty, loading, error, and success states are designed.
- [ ] No secrets or real patient data are committed to GitHub.
- [ ] Build and lint/type checks pass, or any known limitation is documented honestly.

### Hackathon readiness
- [ ] Public demo URL works without requiring developer access.
- [ ] GitHub repository contains a useful README and setup instructions.
- [ ] `.env` is ignored by Git and `.env.example` contains placeholders only.
- [ ] Demo uses fictional data and avoids exposing personal information.
- [ ] A demo video no longer than 3 minutes is ready.
- [ ] Abstract is no longer than 300 words.
- [ ] Every claim in the submission matches the actual implementation.

---

## 14. Suggested Seven-Day Build Plan

### Day 1 — Foundation
- Confirm hackathon eligibility before investing the full build time.
- Scaffold the app, design system, navigation, and responsive landing page.
- Set up repository and environment variable handling.

### Day 2 — Authentication and persistence
- Configure auth and database.
- Implement protected routes and database authorization.
- Add onboarding and profile settings.

### Day 3 — Care planner and journal
- Implement appointment CRUD and journal CRUD.
- Test persistence and ownership rules.

### Day 4 — AI assistant
- Configure secure server-side Gemini access.
- Add source-grounded responses, disclaimers, error handling, and safety behavior.

### Day 5 — Visit summaries and caregiver permissions
- Build summary generation, editing, and print/export.
- Implement consent and permissions or explicitly scope a clearly labelled prototype.

### Day 6 — Polish and quality
- Responsive testing, accessibility, loading/empty/error states, and bug fixes.
- Prepare fictional demo data and test the entire user journey.

### Day 7 — Submission
- Deploy and verify the public demo.
- Finish README, abstract, screenshots, and a maximum 3-minute demo video.
- Submit early enough to handle deployment or Devpost issues.

---

## 15. Three-Minute Demo Script

**0:00–0:20 — Problem**  
“Cancer care can involve many appointments, questions, and personal notes. CareBridge AI helps patients organize these details and prepare for conversations with their care team.”

**0:20–0:45 — Product overview**  
Show the landing page, accessibility choices, and sign-in flow. Use a prepared demo account only if the authentication setup is secure.

**0:45–1:15 — Care planner**  
Add an appointment and show it persisting in the dashboard.

**1:15–1:40 — Journal**  
Record a fictional symptom/wellbeing note and open the history.

**1:40–2:10 — AI support**  
Ask a general educational question. Show the answer, source links, and the limitation that the assistant does not diagnose or prescribe.

**2:10–2:40 — Visit preparation**  
Select notes/questions, generate the patient-prepared summary, edit it, and show the print/export view.

**2:40–3:00 — Impact and close**  
“CareBridge AI does not replace clinicians. It helps people stay organized, access understandable information, and prepare for more informed conversations.”

Only demonstrate features that are actually working in the final build.

---

## 16. Final Instructions to the AI Builder

Build the actual working application described in this document. Do not respond with a plan only, a static mockup, or a single-page dashboard pretending to be a finished product.

Before coding:
1. Inspect the available project files and identify the existing framework.
2. Create a short implementation plan and then proceed with the implementation.
3. Keep the architecture simple enough to complete and test by the deadline.

While coding:
- Prioritize authentication, data security, persistence, and the primary user journey.
- Use reusable components and consistent design tokens.
- Build all required page states, including mobile, loading, empty, error, and success states.
- Use genuine source links and truthful product copy.
- Never hard-code API secrets, invent patient information, or simulate success for unimplemented services.
- Keep the interface visually distinctive, warm, polished, and easy to use.

Before finishing:
1. Run the available build, lint, and type checks.
2. Fix errors rather than merely reporting them.
3. Test the primary journey end-to-end.
4. Check mobile layouts and private-route protection.
5. Report what is genuinely implemented, what requires environment credentials, and what remains incomplete.
6. Provide exact local setup and deployment steps.
7. Do not claim deployment, testing, security compliance, or integrations succeeded unless verified.

**Priority order:**  
P0 — secure authentication, authorization, persistent care planner, journal, safe AI assistant, responsive UI.  
P1 — visit summary/export, trusted resources, profile/privacy settings.  
P2 — caregiver invitation workflow, optional reminder integrations, additional languages.

A smaller, secure, end-to-end product is better than a large collection of unfinished features.
