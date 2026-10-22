import React from 'react';
import {
  Calendar,
  Sparkles,
  Activity,
  FileText,
  Users,
  Languages,
  CheckCircle2,
  ArrowRight,
  Shield,
  Printer,
  Heart,
} from 'lucide-react';

interface FeaturesPageProps {
  onNavigate: (page: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  const featureBlocks = [
    {
      title: 'Smart Care Planner & Treatment Cycles',
      tagline: 'Track chemotherapy cycles, blood tests, and resting intervals with zero confusion.',
      icon: Calendar,
      accent: 'text-indigo-600 bg-indigo-50',
      action: 'care-planner',
      actionLabel: 'Explore Care Planner',
      highlights: [
        'Visual cycle progress bar (e.g. Cycle 2 of 6 Paclitaxel & Carboplatin).',
        'Unified view of clinical appointments, routine diagnostic labs, and personal reminders.',
        'In-app reminders designed specifically around infusion recovery schedules.',
        'Keyboard and screen-reader accessible calendar interface.',
      ],
      previewContent: (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Current Regimen</p>
              <p className="text-base font-bold text-slate-900">Paclitaxel & Carboplatin</p>
            </div>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
              Cycle 2 of 6 · 33%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-rose-400 h-2.5 rounded-full w-1/3"></div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <span className="text-emerald-600 font-bold block">✓ Cycle 1</span>
              <span className="text-[10px] text-slate-400">Completed</span>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200">
              <span className="text-indigo-600 font-bold block">Cycle 2</span>
              <span className="text-[10px] text-indigo-500">In Progress</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-400 font-bold block">Cycle 3</span>
              <span className="text-[10px] text-slate-400">Nov 11</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Evidence-Grounded AI Health Assistant',
      tagline: 'Get medical explanations in plain, supportive language — backed by real sources.',
      icon: Sparkles,
      accent: 'text-purple-600 bg-purple-50',
      action: 'ai-assistant',
      actionLabel: 'Chat with Assistant',
      highlights: [
        'Curated responses grounded in National Cancer Institute (NCI) and Mayo Clinic literature.',
        'Active links to original source materials for every medical statement.',
        'Conservative emergency guards that immediately flag fever or acute symptoms.',
        'Full privacy: chat history can be reviewed, cleared, or deleted by the user.',
      ],
      previewContent: (
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="p-3 bg-indigo-600 text-white rounded-xl text-xs max-w-xs ml-auto">
            What are evidence-based ways to cope with nausea after my infusion?
          </div>
          <div className="p-3.5 bg-white text-slate-800 rounded-xl text-xs border border-slate-200 space-y-2">
            <p className="font-semibold text-slate-900">Key strategies from oncology guidelines:</p>
            <p>1. Take antiemetics strictly on schedule before meals, not just when nausea peaks.</p>
            <p>2. Choose small, room-temperature snacks (ginger tea, bland crackers) to reduce scent triggers.</p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-indigo-600 font-medium">
              <span>Source: Mayo Clinic & American Cancer Society</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Symptom & Wellbeing Journal',
      tagline: 'Track symptoms, discomfort ratings, and daily mood without medical complexity.',
      icon: Activity,
      accent: 'text-rose-600 bg-rose-50',
      action: 'symptom-journal',
      actionLabel: 'Open Symptom Journal',
      highlights: [
        '5 friendly mood rating faces: Great 😄, Good 🙂, Okay 😐, Bad 🙁, Very Bad 😣.',
        'Quick checklist for common side effects: nausea, fatigue, headache, peripheral tingling.',
        '1-to-10 severity slider with descriptive clinical anchors (Mild, Moderate, Severe).',
        'Accessible trend view and complete patient data ownership with edit/delete.',
      ],
      previewContent: (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-around py-2 bg-white rounded-xl border border-slate-200">
            <span className="text-xl opacity-50">😄</span>
            <span className="text-xl opacity-50">🙂</span>
            <span className="text-2xl scale-125 bg-amber-100 p-1.5 rounded-full border border-amber-300">😐</span>
            <span className="text-xl opacity-50">🙁</span>
            <span className="text-xl opacity-50">😣</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Reported Discomfort Severity</span>
              <span className="text-indigo-600">3 / 10 (Mild)</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-2 rounded-full w-[30%]"></div>
            </div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 italic">
            "Mild nausea around noon. Antiemetic helped. Rested 45 min."
          </div>
        </div>
      ),
    },
    {
      title: 'Doctor Visit Preparation Summary',
      tagline: 'Never leave the consultation room wishing you had remembered to ask.',
      icon: FileText,
      accent: 'text-teal-600 bg-teal-50',
      action: 'doctor-visit-prep',
      actionLabel: 'Prepare Next Visit',
      highlights: [
        'Synthesizes your recent journal entries into a clean 1-page clinical agenda.',
        'Pre-curated question bank tailored to chemotherapy, radiation, and medication review.',
        'Editable before finalizing: add personal priorities and caregiver observations.',
        'Print-friendly layout & PDF export formatted for quick oncologist review.',
      ],
      previewContent: (
        <div className="bg-white p-5 rounded-2xl border-2 border-indigo-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-900">Patient-Prepared Consultation Summary</p>
              <p className="text-[10px] text-slate-400">Dr. Saman Ali · Oct 28, 2026</p>
            </div>
            <Printer className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-[11px] text-slate-600 space-y-1.5">
            <p><strong>Chief Priority:</strong> Review Cycle 2 tolerance and mild intermittent nausea.</p>
            <p><strong>Medications:</strong> Paclitaxel IV, Ondansetron 8mg PRN.</p>
            <p><strong>Key Questions:</strong> Are blood counts recovering on schedule? What red flags should trigger 24/7 triage?</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide uppercase">
          Comprehensive Feature Suite
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Purpose-Built Tools for Every Day of Care
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          Every screen in CareBridge AI has been engineered to relieve mental strain, protect patient dignity, and enhance clinical collaboration.
        </p>
      </div>
      <div className="space-y-16">
        {featureBlocks.map((feat, idx) => {
          const Icon = feat.icon;
          const isEven = idx % 2 === 1;
          return (
            <div
              key={idx}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={`lg:col-span-6 space-y-5 ${isEven ? 'lg:order-2' : ''}`}>
                <div className={`w-12 h-12 rounded-2xl ${feat.accent} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {feat.title}
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">{feat.tagline}</p>

                <ul className="space-y-2.5 pt-2">
                  {feat.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3">
                  <button
                    onClick={() => onNavigate(feat.action)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                  >
                    <span>{feat.actionLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : ''}`}>
                {feat.previewContent}
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-gradient-to-tr from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-xl">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-rose-300 font-script text-xl">
            <Heart className="w-4 h-4 fill-rose-300" />
            <span>Inclusive & Multilingual Support</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold">English & Urdu (اردو) Supported</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Healthcare communication is most effective in one’s native language. CareBridge AI provides instantaneous language toggles with verified translations and RTL layout support.
          </p>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Consent-Based Caregiver Access</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold">Collaborate with Loved Ones</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Invite family members or primary caregivers with customized, granular permissions. Patients always retain full control to view or revoke access at any time.
          </p>
        </div>
      </div>
    </div>
  );
};
