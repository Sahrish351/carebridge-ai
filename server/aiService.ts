import { GoogleGenAI } from '@google/genai';
import { Appointment, JournalEntry } from './db.js';

interface Source {
  title: string;
  url: string;
  organization: string;
}

interface AiResponse {
  content: string;
  sources: Source[];
  disclaimer: string;
}

// Curated verified sources bank
const TRUSTED_SOURCES: Record<string, Source> = {
  nci_chemo: {
    title: 'Chemotherapy and You: Support for People With Cancer',
    url: 'https://www.cancer.gov/publications/patient-education/chemotherapy-and-you',
    organization: 'National Cancer Institute',
  },
  acs_chemo_side_effects: {
    title: 'Managing Chemotherapy Side Effects',
    url: 'https://www.cancer.org/treatment/treatments-and-side-effects/treatment-types/chemotherapy/chemotherapy-side-effects.html',
    organization: 'American Cancer Society',
  },
  mayo_chemo: {
    title: 'Chemotherapy Side Effects & Prevention Strategies',
    url: 'https://www.mayoclinic.org/tests-procedures/chemotherapy/in-depth/chemotherapy-side-effects/art-20047335',
    organization: 'Mayo Clinic',
  },
  nci_fatigue: {
    title: 'Cancer-Related Fatigue: Causes and Management',
    url: 'https://www.cancer.gov/about-cancer/treatment/side-effects/fatigue',
    organization: 'National Cancer Institute',
  },
  acs_nausea: {
    title: 'Nausea and Vomiting Related to Cancer Treatment',
    url: 'https://www.cancer.org/treatment/treatments-and-side-effects/physical-side-effects/nausea-and-vomiting.html',
    organization: 'American Cancer Society',
  },
  cruk_neuropathy: {
    title: 'Peripheral Neuropathy from Cancer Drugs',
    url: 'https://www.cancerresearchuk.org/about-cancer/coping/physically/nerve-damage-peripheral-neuropathy',
    organization: 'Cancer Research UK',
  },
  nci_nutrition: {
    title: 'Eating Hints: Before, During, and After Cancer Treatment',
    url: 'https://www.cancer.gov/publications/patient-education/eatinghints.pdf',
    organization: 'National Cancer Institute',
  },
  who_cancer: {
    title: 'World Health Organization: Cancer Fact Sheet and Patient Care',
    url: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
    organization: 'World Health Organization',
  },
  acs_doctor_visit: {
    title: 'Questions to Ask Your Doctor About Cancer Treatment',
    url: 'https://www.cancer.org/treatment/finding-and-paying-for-treatment/choosing-your-treatment-team/questions-to-ask-your-doctor.html',
    organization: 'American Cancer Society',
  },
};

const MEDICAL_DISCLAIMER =
  'CareBridge AI provides educational health information and organizational support. It does not provide medical diagnoses, treatment prescriptions, or emergency triage. Always discuss all treatment decisions and symptoms directly with your oncology team.';

// Fallback knowledge base for offline/no-key evaluation
function getCuratedResponse(prompt: string): AiResponse {
  const lower = prompt.toLowerCase();

  if (lower.includes('chemo') || lower.includes('side effect') || lower.includes('nausea') || lower.includes('vomit')) {
    return {
      content: `Managing chemotherapy side effects is a foundational part of supportive oncology care. While individual responses depend on your exact regimen and cycle, here are evidence-based recommendations:

1. **Nausea & Appetite Support**
   - Take your prescribed antiemetics (e.g. ondansetron, prochlorperazine) strictly on schedule as instructed by your team, rather than waiting for nausea to peak.
   - Favor small, frequent room-temperature snacks (crackers, toast, ginger broths, bananas) over 3 heavy hot meals.
   - Avoid strong aromas and spicy, greasy foods on infusion days and the subsequent 48 hours.

2. **Fatigue & Energy Preservation**
   - Cancer-related fatigue is biological, not laziness. Plan demanding activities during your peak energy hours.
   - Incorporate 5–15 minutes of light, rhythmic movement (like a gentle morning walk) which clinical trials show reduces treatment fatigue more effectively than prolonged bed rest alone.
   - Protect a steady sleep schedule with resting periods under 45 minutes to avoid disrupting nocturnal sleep.

3. **Infection Prevention**
   - Check your temperature if you feel chilled, flushed, or unwell. A fever ($\ge 38.0^\\circ\\text{C}$ or $100.4^\\circ\\text{F}$) during chemotherapy is an urgent reason to call your oncology triage line immediately.
   - Wash hands frequently and avoid crowded indoor spaces during nadir periods (usually 7–14 days post-infusion).`,
      sources: [TRUSTED_SOURCES.acs_chemo_side_effects, TRUSTED_SOURCES.nci_chemo, TRUSTED_SOURCES.mayo_chemo],
      disclaimer: MEDICAL_DISCLAIMER,
    };
  }

  if (lower.includes('radiation') || lower.includes('radiotherapy')) {
    return {
      content: `Radiation therapy is a localized treatment designed to target tumor cells with high-energy rays. Here is helpful preparation and skin care guidance:

1. **Skin Care During Radiation**
   - Treat the treatment field gently: wash with lukewarm water and mild, fragrance-free soap using your hands rather than rough washcloths.
   - Do not apply lotions, deodorants, perfumes, or powders within 2 to 4 hours prior to your radiation session unless specifically approved by your radiation oncologist.
   - Wear loose, breathable 100% cotton clothing over the marked area.

2. **Hydration & Fatigue**
   - Radiation fatigue tends to accumulate progressively over weeks 2 through 6. Hydration is vital for cellular repair.
   - Maintain a minimum of 2 liters (64-80 oz) of fluids daily unless your physician has placed you on fluid restriction.

3. **Questions to Ask Your Radiation Team**
   - What specific skin barrier cream do you recommend for my treatment site?
   - How many sessions are planned and what are the daily time commitments?
   - How soon after completing radiation can I resume normal swimming or sun exposure?`,
      sources: [TRUSTED_SOURCES.nci_chemo, TRUSTED_SOURCES.acs_doctor_visit],
      disclaimer: MEDICAL_DISCLAIMER,
    };
  }

  if (lower.includes('nutrition') || lower.includes('eat') || lower.includes('diet') || lower.includes('food')) {
    return {
      content: `Maintaining optimal nutrition during cancer treatment helps protect your lean muscle mass, supports immune recovery, and improves treatment tolerance:

1. **Prioritize Protein & Caloric Density**
   - Cells require extra protein to repair tissue between cycles. Good tolerated options include eggs, Greek yogurt, lentils, nut butters, and gentle protein smoothies.
   - If solid foods feel unappealing, calorie-dense liquids and purees are easier to digest.

2. **Managing Taste Alterations (Dysgeusia)**
   - Metallic tastes are common with certain platinum-based agents (e.g., Carboplatin). Using bamboo or plastic utensils instead of stainless steel often relieves this sensation.
   - Light tart flavors (lemon drops, cranberry water) can refresh the palate before meals.

3. **Hydration Discipline**
   - Sip small amounts throughout the day. Herbal infusions like peppermint or chamomile are soothing.`,
      sources: [TRUSTED_SOURCES.nci_nutrition, TRUSTED_SOURCES.who_cancer],
      disclaimer: MEDICAL_DISCLAIMER,
    };
  }

  if (lower.includes('urgent') || lower.includes('emergency') || lower.includes('fever') || lower.includes('red flag') || lower.includes('call')) {
    return {
      content: `⚠️ **When to Contact Your Oncology Care Team or Emergency Services Immediately:**

During active cancer therapy (especially chemotherapy and immunotherapy), certain symptoms require prompt medical assessment and should not be delayed:

1. **Fever ($\ge 100.4^\circ\\text{F}$ or $38.0^\circ\\text{C}$)** or severe chills/shivering (potential neutropenic fever, which is a medical emergency).
2. **Shortness of breath, chest pain, or rapid heartbeat**.
3. **Severe, persistent vomiting or diarrhea** that prevents keeping fluids down for more than 12–24 hours.
4. **Sudden confusion, speech difficulty, or severe unyielding headache**.
5. **New or uncontrolled severe pain, bleeding, or rash**.
6. **Redness, swelling, heat, or discharge around a central line or PICC port**.

*Always have your cancer center's 24/7 on-call triage phone number saved and accessible on your phone.*`,
      sources: [TRUSTED_SOURCES.nci_chemo, TRUSTED_SOURCES.acs_chemo_side_effects],
      disclaimer: MEDICAL_DISCLAIMER,
    };
  }

  // General cancer journey response
  return {
    content: `Navigating a cancer diagnosis involves coordinating many medical, emotional, and logistical details. Here is practical guidance on this topic:

1. **Document Observations in Real Time**
   - Tracking daily symptoms and energy levels in your CareBridge journal gives your care team concrete data to adjust supportive medications.
   - Note what time of day symptoms occur and what provides relief.

2. **Communicate Clearly with Your Clinicians**
   - No question or symptom is too small to mention. Often, minor medication adjustments can significantly improve comfort.
   - Write down your top 3 concerns before your appointments so they receive primary focus.

3. **Lean on Your Support Circle**
   - Give family and caregivers specific tasks (e.g., driving to appointments, preparing light meals, or taking notes).
   - Use the Caregiver Access tab to share your appointments and reminders securely.`,
    sources: [TRUSTED_SOURCES.nci_chemo, TRUSTED_SOURCES.acs_doctor_visit, TRUSTED_SOURCES.who_cancer],
    disclaimer: MEDICAL_DISCLAIMER,
  };
}

export async function askAiAssistant(params: {
  prompt: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userName?: string;
  regimen?: string;
}): Promise<AiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Return curated grounded response
    return getCuratedResponse(params.prompt);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are CareBridge AI, a compassionate, medically grounded, and safe digital companion for cancer patients and caregivers.
Your core objectives:
1. Explain general cancer concepts, side-effect management, and wellness support in clear, calming, empathetic, plain language.
2. NEVER diagnose, prescribe medications, alter dosages, or predict prognosis/survival.
3. If the user mentions concerning symptoms (fever >= 100.4F/38C, chest pain, uncontrollable vomiting, severe bleeding), immediately advise them to contact their oncology emergency triage line or emergency services.
4. Keep answers organized with short headers or bullet points.
5. Emphasize that your answers are educational and that personal decisions must always be discussed with the patient's oncologist.
6. The patient is ${params.userName || 'a cancer patient'} currently on: ${params.regimen || 'an oncology treatment plan'}.`;

    const chatHistory = (params.history || []).slice(-6).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...chatHistory,
        {
          role: 'user',
          parts: [{ text: params.prompt }],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const text = response.text || '';
    if (!text) {
      return getCuratedResponse(params.prompt);
    }

    // Attach relevant verified cancer citations
    const sources: Source[] = [
      TRUSTED_SOURCES.nci_chemo,
      TRUSTED_SOURCES.acs_chemo_side_effects,
      TRUSTED_SOURCES.mayo_chemo,
    ];

    return {
      content: text,
      sources,
      disclaimer: MEDICAL_DISCLAIMER,
    };
  } catch (error) {
    console.error('Gemini API call failed, using curated fallback:', error);
    return getCuratedResponse(params.prompt);
  }
}

export async function generateDoctorVisitSummary(params: {
  appointment: Appointment;
  journalEntries: JournalEntry[];
  medications: string[];
  patientNotes?: string;
  customQuestions?: string[];
  patientName?: string;
}): Promise<{
  chiefConcerns: string;
  symptomsSummary: string;
  questionsForDoctor: string[];
}> {
  const { appointment, journalEntries, medications, patientNotes, customQuestions } = params;

  // Synthesize symptom trends from entries
  const symptomFrequency: Record<string, number> = {};
  let maxSeverity = 0;
  const recentNotes: string[] = [];

  journalEntries.forEach((entry) => {
    if (entry.severity > maxSeverity) maxSeverity = entry.severity;
    if (entry.notes) recentNotes.push(`${entry.date}: ${entry.notes}`);
    entry.symptoms.forEach((s) => {
      symptomFrequency[s] = (symptomFrequency[s] || 0) + 1;
    });
  });

  const frequentSymptoms = Object.entries(symptomFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([symptom, count]) => `${symptom} (${count} reported log${count > 1 ? 's' : ''})`)
    .join(', ');

  const symptomsSummary =
    journalEntries.length > 0
      ? `Recent user-reported logs (${journalEntries.length} entries tracked). Most frequent: ${frequentSymptoms || 'None explicitly specified'}. Maximum reported discomfort severity was ${maxSeverity}/10. ${
          recentNotes.length > 0 ? 'Observations: ' + recentNotes.slice(0, 3).join('; ') : ''
        }`
      : 'No recent symptom logs recorded prior to this visit.';

  const chiefConcerns = `Follow-up evaluation for ${appointment.title} with ${appointment.doctor} on ${appointment.date}. Patient wishes to review treatment tolerance, recent side effects, and confirm timeline for subsequent care cycles.`;

  const standardQuestions = [
    'How do my most recent blood counts compare with my baseline and previous cycle?',
    'Are my current side effects (including nausea and fatigue) within expected parameters for this regimen?',
    'Should any supportive medications (anti-nausea, pain relief, hydration) be adjusted before the next round?',
    'What symptoms should trigger an immediate call to the triage nurse versus waiting for my next clinic visit?',
    'Are there any physical activity or dietary recommendations tailored to my recovery phase right now?',
  ];

  const mergedQuestions = Array.from(
    new Set([...(customQuestions || []), ...standardQuestions])
  ).slice(0, 6);

  return {
    chiefConcerns,
    symptomsSummary,
    questionsForDoctor: mergedQuestions,
  };
}
