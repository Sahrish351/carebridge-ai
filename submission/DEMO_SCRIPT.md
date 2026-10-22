# CareBridge AI — 3-Minute Video Demo Script

**Target Duration:** 2 minutes 45 seconds to 3 minutes  
**Tone:** Calm, compassionate, empathetic, and professional  
**Presenter:** Screen recording with voiceover  

---

## Video Timeline & Visual Cues

### 0:00 – 0:30 | The Problem & Patient Reality (30s)

- **Visual:** Open on the CareBridge AI landing page (`http://localhost:3000/#/home`). Slowly scroll past the hero visual and mission statement.
- **Voiceover:**  
  *"Receiving a cancer diagnosis turns a person's life upside down. Suddenly, patients and families are faced with complex multi-week chemotherapy cycles, scattered appointments across different specialists, unpredictable side effects, and rushed 15-minute doctor visits.*  
  *In the middle of physical and emotional fatigue, keeping everything organized is overwhelming. Late-night web searches often amplify anxiety with alarming, unvetted information.*  
  *This is why we built **CareBridge AI** — a serene, evidence-grounded companion designed to make the cancer care journey easier."*

---

### 0:30 – 1:05 | Patient Workspace & Care Planner (35s)

- **Visual:** Click **"Sign In"** -> click **"Patient Demo (Areeba Khan)"** -> redirect to `/#/dashboard`.
- **Action:** Show the welcoming dashboard:
  - Highlight the treatment progress banner: *"Cycle 2 of 6: Paclitaxel & Carboplatin (33% completed)"*.
  - Toggle a daily self-care task (e.g., *"Drink water - Hydration goal: 2 liters"*).
  - Navigate to **"Care Planner"** tab (`/#/care-planner`). Show the timeline of upcoming appointments and cycle resting days.
- **Voiceover:**  
  *"Let's sign in as Areeba, who is currently undergoing chemotherapy. CareBridge AI immediately greets her with a calm, high-readability workspace.*  
  *At a glance, Areeba sees her exact treatment progress: Cycle 2 of 6. Her Care Planner organizes oncology reviews, blood draws, and resting intervals in one unified schedule, paired with simple daily tasks like staying hydrated and light resting walks."*

---

### 1:05 – 1:35 | Low-Energy Symptom Logging (30s)

- **Visual:** Navigate to **"Symptom Journal"** (`/#/symptom-journal`).
- **Action:**
  - Select mood: *"Okay"*.
  - Select symptoms: *"Mild nausea"*, *"Low energy / Fatigue"*.
  - Adjust severity slider to `3/10`.
  - Type a brief note: *"Slight nausea around noon; managed with prescribed antiemetic."*
  - Click **"Save Entry"** -> show instant appearance in the history list.
- **Voiceover:**  
  *"Tracking symptoms shouldn't feel like a medical chore, especially on low-energy days.*  
  *In the Symptom Journal, Areeba can record nausea, fatigue, or peripheral tingling in under 30 seconds. By tracking severity and mood longitudinally, she builds an objective record of how she tolerates each cycle — so she doesn't have to rely on memory during appointments."*

---

### 1:35 – 2:15 | Evidence-Grounded AI Assistant (40s)

- **Visual:** Navigate to **"AI Assistant"** (`/#/ai-assistant`).
- **Action:**
  - Click prompt: *"What are common side effects of chemotherapy and how can I manage them?"* or type it.
  - Watch the assistant respond with clear, formatted bullet points.
  - Scroll down to show the **Verified Sources** section: clickable badges for *American Cancer Society*, *National Cancer Institute*, and *Mayo Clinic*.
  - Point to the clear disclaimer at the bottom: *"Educational information only — does not replace your oncology team."*
  - Demonstrate urgent triage: Type *"I have a fever of 101F during chemo"*. Show the AI immediately prioritizing urgent emergency contact instructions.
- **Voiceover:**  
  *"When questions arise between visits, patients turn to the CareBridge AI Health Assistant, powered by Google Gemini.*  
  *Unlike generic chatbots, CareBridge AI is strictly bound by responsible oncology guidelines. Every answer is presented in plain, supportive language, complete with direct links to verified literature from the National Cancer Institute, American Cancer Society, and Mayo Clinic.*  
  *Crucially, if a patient reports concerning red flags — like a fever during chemotherapy — CareBridge AI immediately escalates to urgent emergency triage advice, directing them to call their oncology team without delay."*

---

### 2:15 – 2:40 | 1-Page Doctor Visit Preparation (25s)

- **Visual:** Navigate to **"Doctor Visit Prep"** (`/#/doctor-visit-prep`).
- **Action:**
  - Select the upcoming appointment: *"Cycle 2 Follow-up & Review with Dr. Saman Ali"*.
  - Click **"Generate Summary"**.
  - Review the synthesized agenda: Chief concerns, symptom summaries, current medications, and prioritized questions.
  - Click **"Print / Save PDF"** to display the clean 1-page printable summary format.
- **Voiceover:**  
  *"Before her next appointment, Areeba visits Doctor Visit Prep. With one click, the system synthesizes her recent symptom trends, medications, and top questions into a concise 1-page consultation agenda.*  
  *She can print this or bring it on her phone, ensuring her precious 15 minutes with the oncologist address what matters most."*

---

### 2:40 – 3:00 | Caregiver Sharing, Urdu Bilingual Support & Closing (20s)

- **Visual:**
  - Click language toggle: switch from English to **Urdu (اردو)** -> show seamless RTL orientation and translated interface.
  - Return to English and show the **Caregiver Access** tab (`/#/caregiver-access`) with granular, revocable consent controls.
- **Voiceover:**  
  *"Caregiver access is completely consent-driven, allowing loved ones to coordinate care without compromising privacy. And with native bilingual support in English and Urdu, CareBridge AI reaches diverse families often left behind by English-only digital tools.*  
  *CareBridge AI: Less confusion. Better preparation. More supported care. Thank you."*

---

## Presenter Preparation Checklist

1. Start server locally using `npm run dev`.
2. Clear any browser clutter, bookmarks, or notifications.
3. Keep screen resolution at standard 1080p (1920x1080) for crisp video playback.
4. Have demo accounts pre-seeded (already done in `data/carebridge.json`).
5. Ensure audio is clear and quiet.

