import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  UserPlus,
  Calendar,
  Activity,
  Sparkles,
  ExternalLink,
  FileText,
  Users,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Clock,
  Heart,
  ChevronRight,
  Stethoscope,
  Smile,
  Info,
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (page: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: 'Create Your Account & Secure Sign-In',
      tagline: 'Simple, private onboarding with instant language preference',
      description:
        'Get started in under two minutes. Select your role as a patient or family caregiver, set your communication language (English or Urdu), and establish your encrypted private account. No intrusive medical background questions required upfront.',
      icon: UserPlus,
      color: 'from-indigo-600 to-blue-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      mockupType: 'account',
      takeaway: 'Full data ownership with end-to-end privacy and zero marketing tracking.',
    },
    {
      step: 2,
      title: 'Organize Appointments & Daily Care Tasks',
      tagline: 'Chemotherapy cycles, infusion labs, and restorative rest intervals',
      description:
        'Log your oncology appointments, infusion sessions, blood draws, and medication reminders in a calm, unified schedule. Group dates by treatment cycle to visualize resting intervals and anticipate demanding days with clear advance notice.',
      icon: Calendar,
      color: 'from-blue-600 to-cyan-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      mockupType: 'planner',
      takeaway: 'Never miss an infusion appointment, lab test, or pre-medication dose.',
    },
    {
      step: 3,
      title: 'Record Symptoms & Wellbeing Observations',
      tagline: 'Fast, non-clinical logging designed for low-energy days',
      description:
        'Track daily observations like fatigue, nausea, tingling, sleep quality, and mood with intuitive 1-tap selectors. On days when energy is low, logging takes under 30 seconds, generating longitudinal trends for your oncology team without burdensome paperwork.',
      icon: Activity,
      color: 'from-rose-500 to-pink-600',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      mockupType: 'journal',
      takeaway: 'Transforms scattered memory into an accurate, objective record over weeks.',
    },
    {
      step: 4,
      title: 'Ask the AI Assistant Educational Questions',
      tagline: 'Plain-language oncology guidance available 24/7',
      description:
        'Ask about side-effect coping strategies (e.g., taste alterations, mild fatigue), dietary adjustments during treatment, or confusing clinical acronyms. The assistant replies in clear, empathetic language, always framed as educational support rather than clinical diagnosis.',
      icon: Sparkles,
      color: 'from-purple-600 to-indigo-600',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      mockupType: 'assistant',
      takeaway: 'Reliable explanations anytime you or your caregiver need clarity.',
    },
    {
      step: 5,
      title: 'Review Reliable Source Links & Citations',
      tagline: 'Every answer backed by verified oncology literature',
      description:
        'CareBridge AI grounds responses in authoritative medical registries—including the National Cancer Institute (NCI), American Cancer Society (ACS), and Mayo Clinic. Every educational answer provides active reference links so you can inspect the clinical source directly.',
      icon: ExternalLink,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      mockupType: 'sources',
      takeaway: 'Zero AI hallucinations or speculative home remedies; evidence you can inspect.',
    },
    {
      step: 6,
      title: 'Prepare Questions & Summary for Doctor Visits',
      tagline: 'Turn weeks of observations into a concise 1-page agenda',
      description:
        'Oncology appointments are brief and stressful. With one click, synthesize your recent symptom trends and prioritized questions into a neat, 1-page PDF agenda clearly labeled “Patient-prepared summary—not a clinical assessment.” Bring it directly to your doctor to ensure nothing critical gets forgotten.',
      icon: FileText,
      color: 'from-teal-600 to-emerald-600',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      mockupType: 'prep',
      takeaway: 'Maximizes every minute of your clinical consultation with focused clarity.',
    },
    {
      step: 7,
      title: 'Share Selected Access with Trusted Caregivers',
      tagline: 'Consent-based delegation that keeps the patient in total control',
      description:
        'Invite a spouse, adult child, or close friend to assist you. With granular consent toggles, you decide exactly what they can see or edit—whether it’s viewing the appointment calendar, logging grocery tasks, or reviewing visit notes. Revoke or edit permissions anytime with immediate effect.',
      icon: Users,
      color: 'from-indigo-700 to-purple-800',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      mockupType: 'caregiver',
      takeaway: 'Caregivers stay informed and helpful without compromising patient autonomy.',
    },
  ];

  const features = [
    {
      title: 'Smart Care Planner',
      subtitle: 'Schedule & Infusion Cycles',
      desc: 'Keep track of appointments, lab dates, and cycle days with gentle reminders.',
      page: user ? 'care-planner' : 'features',
      icon: Calendar,
      accent: 'border-l-indigo-500 hover:border-indigo-500',
    },
    {
      title: 'AI Health Assistant',
      subtitle: 'Verified Oncology Education',
      desc: 'Instant, compassionate explanations with direct citations to NCI and Mayo Clinic.',
      page: user ? 'ai-assistant' : 'features',
      icon: Sparkles,
      accent: 'border-l-purple-500 hover:border-purple-500',
    },
    {
      title: 'Symptom & Mood Journal',
      subtitle: 'Gentle Wellbeing Tracking',
      desc: 'Effortless daily logs that map your physical and emotional journey over time.',
      page: user ? 'symptom-journal' : 'features',
      icon: Activity,
      accent: 'border-l-rose-500 hover:border-rose-500',
    },
    {
      title: 'Doctor Visit Prep',
      subtitle: '1-Page Consultation Agenda',
      desc: 'Organize symptoms, medication questions, and goals into a printable clinic summary.',
      page: user ? 'doctor-visit-prep' : 'features',
      icon: FileText,
      accent: 'border-l-teal-500 hover:border-teal-500',
    },
    {
      title: 'Caregiver Coordination',
      subtitle: 'Consent-Driven Support',
      desc: 'Share selected schedule access with family members while retaining complete control.',
      page: user ? 'caregiver-access' : 'features',
      icon: Users,
      accent: 'border-l-blue-500 hover:border-blue-500',
    },
  ];

  return (
    <div className="bg-[#F8FAFD] min-h-screen pb-24">
      {/* 1. Header & Hero */}
      <section className="relative pt-12 pb-16 overflow-hidden border-b border-slate-200/80 bg-white">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-rose-50/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wider uppercase">
            <span>The CareBridge AI User Journey</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            How CareBridge AI Supports Your Care Every Day
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From your very first account setup to your next doctor consultation, follow this simple 7-step path to feeling organized, informed, and in control.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              7 Step-by-Step Milestones
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Patient-Governed Privacy
            </span>
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-purple-600" />
              Evidence-Based References
            </span>
          </div>
        </div>
      </section>

      {/* 2. Interactive 7-Step Visual Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            The 7-Step Patient & Caregiver Journey
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Click any step to inspect the realistic workflow and see how CareBridge AI simplifies each moment.
          </p>
        </div>

        {/* Step Selector Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-10">
          {steps.map((s) => {
            const Icon = s.icon;
            const isSelected = activeStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                  isSelected
                    ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-600/20'
                    : 'bg-white/80 border-slate-200/90 hover:bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    0{s.step}
                  </span>
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {s.title.split('&')[0]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Showcase Box */}
        {(() => {
          const current = steps.find((s) => s.step === activeStep) || steps[0];
          const StepIcon = current.icon;
          return (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 mb-16">
              {/* Left Column: Context & Narrative */}
              <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                      {current.step}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${current.badgeColor}`}>
                      Step {current.step} of 7
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {current.title}
                  </h3>
                  <p className="text-indigo-600 text-sm font-semibold">
                    {current.tagline}
                  </p>

                  <p className="text-slate-600 text-base leading-relaxed pt-1">
                    {current.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-start gap-3 bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100/80">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                        Key Benefit
                      </p>
                      <p className="text-sm text-indigo-900 mt-0.5">
                        {current.takeaway}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() =>
                        setActiveStep((prev) => (prev > 1 ? prev - 1 : 7))
                      }
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      ← Previous Step
                    </button>
                    <button
                      onClick={() =>
                        setActiveStep((prev) => (prev < 7 ? prev + 1 : 1))
                      }
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Next: Step {current.step < 7 ? current.step + 1 : 1}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Realistic Application Preview Component */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between text-xs text-indigo-200 border-b border-indigo-800/60 pb-3">
                    <span className="font-semibold uppercase tracking-wider">Live Workspace Preview</span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Active Component
                    </span>
                  </div>

                  {current.mockupType === 'account' && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold">
                          AR
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Areeba Khan</p>
                          <p className="text-xs text-indigo-200">Patient Profile · Lahore</p>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10 space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>Language:</span>
                          <span className="text-white font-semibold">English & اردو</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Data Storage:</span>
                          <span className="text-emerald-400 font-semibold">Local & Consent Encrypted</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {current.mockupType === 'planner' && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-200 uppercase">Upcoming Cycle Event</span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                          Day 1 of Cycle 4
                        </span>
                      </div>
                      <p className="text-base font-bold text-white">Chemotherapy Infusion · Session 4</p>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Thursday, Oct 24 · 09:30 AM</span>
                      </div>
                      <p className="text-xs text-indigo-100 bg-white/5 p-2.5 rounded-xl border border-white/10">
                        Reminder: Take prescribed pre-medication antiemetic 30 mins before arrival.
                      </p>
                    </div>
                  )}

                  {current.mockupType === 'journal' && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300">Today's Quick Log</span>
                        <span className="text-xs text-amber-300 font-medium">Mild Fatigue</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                          <p className="text-[10px] text-slate-400 uppercase">Energy</p>
                          <p className="text-sm font-bold text-amber-300 mt-0.5">3 / 5</p>
                        </div>
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                          <p className="text-[10px] text-slate-400 uppercase">Mood</p>
                          <p className="text-sm font-bold text-indigo-300 mt-0.5">Calm 🙂</p>
                        </div>
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                          <p className="text-[10px] text-slate-400 uppercase">Nausea</p>
                          <p className="text-sm font-bold text-emerald-400 mt-0.5">None</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 italic">
                        "Resting well after lunch, drinking ginger tea."
                      </p>
                    </div>
                  )}

                  {current.mockupType === 'assistant' && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2.5">
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-xs text-indigo-100">
                        "How can I manage metallic taste changes from chemotherapy?"
                      </div>
                      <div className="bg-indigo-900/40 p-3 rounded-xl border border-indigo-700/50 text-xs space-y-1.5 text-slate-200">
                        <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                          <span>CareBridge AI Guidance</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          Try using plastic or bamboo utensils, seasoning food with tart herbs or lemon slices, and rinsing with baking soda water before meals.
                        </p>
                      </div>
                    </div>
                  )}

                  {current.mockupType === 'sources' && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Direct Evidence Citations
                      </span>
                      <div className="space-y-2 text-xs">
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-white">National Cancer Institute (NCI)</p>
                            <p className="text-[11px] text-slate-300">Chemotherapy Side Effects Management</p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-white">Mayo Clinic Oncology Library</p>
                            <p className="text-[11px] text-slate-300">Nutrition & Fatigue Support Guidelines</p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                      </div>
                    </div>
                  )}

                  {current.mockupType === 'prep' && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2.5">
                      <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                        <span className="font-bold text-white">Visit Agenda: Dr. Saman</span>
                        <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-mono">
                          1-PAGE READY
                        </span>
                      </div>
                      <ul className="text-xs space-y-1.5 text-slate-200">
                        <li className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                          1. Review Cycle 4 fatigue duration (Days 3–6)
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                          2. Clarify if mild hand tingling is expected neuropathy
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                          3. Confirm date of next chest CT restaging scan
                        </li>
                      </ul>
                      <p className="text-[10px] text-slate-400 italic">
                        Clearly labeled: "Patient-prepared summary—not a clinical assessment"
                      </p>
                    </div>
                  )}

                  {current.mockupType === 'caregiver' && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-200 uppercase">Delegated Permissions</span>
                        <span className="text-[11px] text-emerald-400 font-bold">Active</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">Tariq Khan (Spouse)</p>
                          <p className="text-[11px] text-slate-300">Access: View Calendar & Tasks</p>
                        </div>
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <p className="text-[11px] text-indigo-200">
                        Private clinical notes and personal mood entries remain strictly hidden from caregiver view.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 3. Visual Timeline: The Full Sequential Roadmap */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Step-by-Step Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            Complete Journey at a Glance
          </h2>
        </div>

        <div className="relative border-l-2 border-indigo-200 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div key={st.step} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-9 h-9 rounded-full bg-white border-2 border-indigo-600 text-indigo-600 flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {st.step}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {st.title}
                    </h3>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                      Step {st.step}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-3">
                    {st.description}
                  </p>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{st.takeaway}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Explore the Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-8 sm:p-12">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Ready to Explore
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Explore the CareBridge AI Modules
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Every tool works together harmoniously to take cognitive load off patients and their families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className={`bg-[#F8FAFD] rounded-2xl p-6 border-l-4 border-y border-r border-slate-200 transition-all hover:shadow-md hover:bg-white flex flex-col justify-between ${f.accent}`}
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {f.title}
                      </h3>
                      <p className="text-xs text-indigo-600 font-medium">
                        {f.subtitle}
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate(f.page)}
                    className="mt-5 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors cursor-pointer group"
                  >
                    <span>{user ? 'Open in Workspace' : 'Learn More'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              );
            })}

            {/* Quick Summary Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-2xl p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-rose-300">
                  <Heart className="w-5 h-5 fill-rose-400 text-rose-400" />
                </div>
                <h3 className="text-base font-bold text-white">Built for True Empathy</h3>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  Every feature is designed with patient cognitive load in mind: large touch targets, readable contrast, zero confusing clinical jargon, and bilingual support.
                </p>
              </div>

              <button
                onClick={() => onNavigate(user ? 'dashboard' : 'signup')}
                className="mt-5 px-4 py-2.5 rounded-xl bg-white text-indigo-900 text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{user ? 'Go to Dashboard' : 'Get Started Free'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Clear Final Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-10 text-white shadow-xl space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-white/15 mx-auto flex items-center justify-center">
            <Heart className="w-6 h-6 fill-white text-white" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Ready to Experience Better-Supported Care?
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Take the first step toward calmer appointments, organized treatment cycles, and source-grounded answers.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate(user ? 'dashboard' : 'signup')}
              className="px-8 py-3.5 rounded-2xl bg-white text-indigo-900 text-sm font-bold hover:bg-indigo-50 shadow-md transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <span>{user ? 'Open Your Workspace' : 'Get Started with CareBridge AI'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!user && (
              <button
                onClick={() => onNavigate('login')}
                className="px-6 py-3.5 rounded-2xl bg-indigo-800/80 hover:bg-indigo-800 text-white text-sm font-semibold border border-indigo-400/40 transition-colors cursor-pointer"
              >
                Sign In to Existing Account
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
