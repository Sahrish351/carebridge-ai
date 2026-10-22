import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Heart,
  Calendar,
  Sparkles,
  Activity,
  FileText,
  Shield,
  Languages,
  ArrowRight,
  Play,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  X,
  Lock,
  Clock,
  BookOpen,
  Users,
  Smile,
  ShieldCheck,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activePreviewTab, setActivePreviewTab] = useState<'planner' | 'assistant' | 'journal' | 'prep'>('planner');

  const partnerOrganizations = [
    { name: 'National Cancer Institute', role: 'Curated Evidence Source', url: 'https://www.cancer.gov' },
    { name: 'American Cancer Society', role: 'Support Guidelines', url: 'https://www.cancer.org' },
    { name: 'Mayo Clinic', role: 'Evidence-Based Care', url: 'https://www.mayoclinic.org' },
    { name: 'World Health Organization', role: 'Global Standards', url: 'https://www.who.int' },
    { name: 'Cancer Research UK', role: 'Patient Research', url: 'https://www.cancerresearchuk.org' },
  ];

  const quickFeaturePills = [
    {
      title: 'Smart Care Planner',
      desc: 'Appointments & daily routine',
      icon: Calendar,
      action: 'care-planner',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'AI Health Assistant',
      desc: 'Educational oncology answers',
      icon: Sparkles,
      action: 'ai-assistant',
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      title: 'Symptom Journal',
      desc: 'Track wellbeing & energy',
      icon: Activity,
      action: 'symptom-journal',
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
    {
      title: 'Doctor Visit Prep',
      desc: '1-page consultation agenda',
      icon: FileText,
      action: 'doctor-visit-prep',
      color: 'text-teal-600 bg-teal-50 border-teal-100',
    },
  ];

  const supportCards = [
    {
      title: 'Manage Appointments',
      desc: 'Keep track of your medical appointments, chemotherapy cycles, and treatment schedule in one unified view.',
      icon: Calendar,
      action: 'care-planner',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      title: 'Get Trusted Information',
      desc: 'AI answers based strictly on reliable, published medical sources, explained in simple, plain language.',
      icon: Sparkles,
      action: 'ai-assistant',
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      title: 'Track Your Symptoms',
      desc: 'Log your daily symptoms, energy levels, and emotional wellbeing over time without clinical complexity.',
      icon: Activity,
      action: 'symptom-journal',
      color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
    {
      title: 'Prepare for Doctor Visits',
      desc: 'Synthesize your personal observations and prioritize questions into a concise 1-page summary for your next visit.',
      icon: FileText,
      action: 'doctor-visit-prep',
      color: 'bg-teal-50 text-teal-600 border-teal-100',
    },
  ];

  const howItWorksSteps = [
    {
      number: '1',
      title: 'Create an Account',
      desc: 'Set up your private profile with preferred language and accessibility options in less than two minutes.',
    },
    {
      number: '2',
      title: 'Organize Appointments & Personal Notes',
      desc: 'Keep your clinical schedule, doctor contact details, and daily medication reminders in one calm place.',
    },
    {
      number: '3',
      title: 'Explore Reliable Educational Information',
      desc: 'Ask questions about side-effect management and terminology, grounded in NCI and Mayo Clinic literature.',
    },
    {
      number: '4',
      title: 'Prepare for Conversations with Your Care Team',
      desc: 'Generate a focused, patient-prepared agenda to make every precious minute of your consultation count.',
    },
  ];

  const faqs = [
    {
      q: 'Does CareBridge AI diagnose cancer or recommend treatments?',
      a: 'No. CareBridge AI is strictly an organization, educational support, and appointment-preparation tool. It never diagnoses conditions, prescribes medication, alters dosages, or replaces your licensed oncologist or clinical team.',
    },
    {
      q: 'Where does the AI get its medical answers?',
      a: 'Our assistant draws exclusively from verified, evidence-based sources including the National Cancer Institute (NCI), American Cancer Society (ACS), Mayo Clinic, and the World Health Organization (WHO). Every educational answer includes active citations and source links.',
    },
    {
      q: 'Can my family caregiver help manage my appointments?',
      a: 'Yes. With your explicit permission, you can invite a trusted caregiver and grant specific access rights (such as viewing appointments or helping log daily tasks). You can modify or revoke their access at any time.',
    },
    {
      q: 'What should I do if I get a fever during chemotherapy?',
      a: 'During active cancer therapy (especially chemotherapy and immunotherapy), a fever ≥ 100.4°F (38.0°C), severe shivering, acute chest pain, or shortness of breath is an urgent medical situation. Do not rely on an app — contact your cancer center’s 24/7 on-call triage line or emergency services immediately.',
    },
    {
      q: 'How does the Doctor Visit Summary work?',
      a: 'Before your oncology appointment, you select your recent symptom logs and preferred questions. CareBridge AI generates a clear, concise 1-page summary labeled "Patient-prepared summary—not a clinical assessment" that you can review, edit, and print or save as a PDF.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION WITH BALANCED TWO-COLUMN LAYOUT */}
      <section className="relative pt-8 md:pt-14 pb-12 overflow-hidden">
        {/* Soft, warm ambient backdrops */}
        <div className="absolute top-0 right-1/4 w-[480px] h-[480px] bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/4 left-6 w-[420px] h-[420px] bg-gradient-to-tr from-rose-100/30 via-pink-50/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Clear Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-100 shadow-2xs">
                <span className="text-indigo-700 text-xs font-bold tracking-wider uppercase">
                  COMPASSIONATE SUPPORT. SMARTER CARE.
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Your Cancer Journey,{' '}
                <span className="text-indigo-600">
                  Made Easier.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-lg sm:text-xl text-slate-600 max-w-xl font-normal leading-relaxed">
                Organize appointments, understand trusted health information, and prepare for conversations with your care team — all in one supportive place.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate(user ? 'dashboard' : 'signup')}
                  className="px-8 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-2xl shadow-md shadow-indigo-200 transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer"
                >
                  <span>{user ? 'Open Patient Workspace' : 'Get Started'}</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>

                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="px-6 py-3.5 text-base font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore How It Works</span>
                </button>
              </div>

              {/* Small Trust Statement Beneath Buttons */}
              <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Designed for patients and caregivers. Built around privacy, accessibility, and responsible AI.
                </span>
              </div>
            </div>

            {/* Right Column: High-Quality Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Decorative Soft Glow Container */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-indigo-50/80 via-white to-rose-50/80 p-3 sm:p-4 shadow-xl border border-indigo-100/70">
                  {/* Floating Script Accent Badge */}
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-rose-100 flex items-center gap-1.5 text-xs font-semibold text-rose-600 z-10">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span className="font-script text-base">Stronger Together ♡</span>
                  </div>

                  {/* Clean Healthcare Support Photograph Frame */}
                  <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-4/3 relative flex items-center justify-center">
                    <img
                      src="/assets/hero_patient_clean.png"
                      alt="Uplifting healthcare support portrait representing hope, resilience, and compassionate oncology care"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Supportive Reassurance Bar */}
                  <div className="mt-3.5 p-3.5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-rose-300 shrink-0">
                        <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">Compassionate Care Companion</p>
                        <p className="text-[11px] text-indigo-100 mt-0.5">Every step, appointment, and note organized</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('features')}
                      className="px-3 py-1.5 bg-white text-indigo-900 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors shadow-2xs shrink-0 cursor-pointer"
                    >
                      Features
                    </button>
                  </div>
                </div>

                {/* Subtle trust tags */}
                <div className="mt-3 flex items-center justify-between px-2 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-indigo-500" />
                    Private & Consent-Driven
                  </span>
                  <span className="flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5 text-purple-500" />
                    English & اردو
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Feature Navigation Pills */}
          <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickFeaturePills.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onNavigate(feat.action)}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-xl ${feat.color} flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{feat.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{feat.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. CLINICAL SOURCES & PARTNERS TICKER */}
      <section className="border-y border-slate-200/80 bg-slate-50/60 py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="shrink-0 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Evidence-Grounded In
              </span>
              <span className="text-sm font-bold text-slate-800">
                World-Leading Oncology Guidelines
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-bold text-slate-600">
              {partnerOrganizations.map((p, idx) => (
                <a
                  key={idx}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white border border-slate-200/90 rounded-xl hover:border-indigo-300 hover:text-indigo-600 shadow-2xs transition-all flex items-center gap-1.5"
                >
                  <span>{p.name}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. A WARM, SUPPORTIVE INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold tracking-wide uppercase">
              Compassionate Understanding
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Technology Designed to Ease the Weight of Cancer Care
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Facing cancer involves more than clinical appointments; it brings cognitive fatigue, emotional uncertainty, and the constant stress of coordinating multi-week treatment cycles.
            </p>
            <p className="text-slate-600 text-base leading-relaxed">
              CareBridge AI acts as a gentle, grounded companion. We strip away clinical complexity and replace it with calm organization: clear timelines, plain-language answers, and structured agendas for your doctor consultations.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 text-indigo-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Zero High-Pressure Demands
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600">
                <Heart className="w-4 h-4 text-rose-500" />
                Built for Low-Energy Days
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600">
                <Lock className="w-4 h-4 text-indigo-600" />
                Strict Patient Privacy
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden bg-gradient-to-tr from-rose-50 via-indigo-50 to-purple-50 p-3 shadow-lg border border-rose-100/80">
              <div className="rounded-2xl overflow-hidden aspect-4/3 relative">
                <img
                  src="/assets/ribbon_hands_clean.png"
                  alt="Compassionate hands holding awareness ribbon with warmth and care"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="mt-3 p-3 bg-white rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Patient Dignity & Support</p>
                  <p className="text-[11px] text-slate-500">You are never alone on this journey</p>
                </div>
                <span className="font-script text-rose-500 text-sm">Stronger Together ♡</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE THE FEATURES (VARIED VISUAL DESIGNS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide uppercase">
            Support at Every Step
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore the Core CareBridge Features
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Every feature is purpose-built to take cognitive load off patients and their families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Care Planner with calendar highlight */}
          <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Cycles & Labs
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Smart Care Planner</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Keep track of medical appointments, chemotherapy cycles, and rest periods in one unified view.
                </p>
              </div>

              {/* Unique Visual Snippet: Mini Calendar Schedule Pill */}
              <div className="bg-indigo-50/70 p-3 rounded-2xl border border-indigo-100/80 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900">
                  <span>Cycle 4 · Day 1</span>
                  <span className="text-emerald-700 font-semibold">Confirmed</span>
                </div>
                <p className="text-[11px] text-slate-600">Chemotherapy Infusion · 9:30 AM</p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigate('care-planner')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                <span>Open Care Planner</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: AI Health Assistant with conversational snippet */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  Evidence-Sourced
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">AI Health Assistant</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Plain-language oncology education grounded in NCI, ACS, and Mayo Clinic literature.
                </p>
              </div>

              {/* Unique Visual Snippet: Question & Verified Badge */}
              <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-100/80 text-xs space-y-1">
                <p className="text-[11px] text-purple-950 font-semibold italic">"Tips for taste changes?"</p>
                <div className="flex items-center gap-1 text-[10px] text-purple-700 font-bold">
                  <ExternalLink className="w-3 h-3" />
                  <span>Sourced: Mayo Clinic Oncology</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigate('ai-assistant')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
              >
                <span>Ask the Assistant</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 3: Symptom Journal with mood/energy selector preview */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  Low-Effort Logs
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Symptom Journal</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Log your daily symptoms, energy levels, and emotional wellbeing over time without clinical complexity.
                </p>
              </div>

              {/* Unique Visual Snippet: Mini Wellbeing Scale */}
              <div className="bg-rose-50/70 p-2.5 rounded-2xl border border-rose-100/80 flex items-center justify-around text-xs">
                <span className="opacity-40">😄</span>
                <span className="opacity-40">🙂</span>
                <span className="px-2 py-0.5 rounded-full bg-white shadow-2xs text-amber-700 font-bold text-[11px]">😐 Steady</span>
                <span className="opacity-40">🙁</span>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigate('symptom-journal')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
              >
                <span>Track Symptoms</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 4: Doctor Visit Prep with checklist summary preview */}
          <div className="bg-white rounded-3xl p-6 border border-teal-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                  1-Page Agenda
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Doctor Visit Prep</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Synthesize your personal observations and prioritize questions into a concise 1-page summary for your next visit.
                </p>
              </div>

              {/* Unique Visual Snippet: Mini Agenda Check */}
              <div className="bg-teal-50/70 p-3 rounded-2xl border border-teal-100/80 text-xs space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-teal-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>3 Prioritized Questions Ready</span>
                </div>
                <p className="text-[10px] text-slate-500">PDF & Print friendly format</p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigate('doctor-visit-prep')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-800 transition-colors cursor-pointer"
              >
                <span>Prepare Agenda</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW CAREBRIDGE WORKS — 4-STEP PROCESS WITH LINK TO FULL JOURNEY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold tracking-wide uppercase">
            Four Simple Steps
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How CareBridge Works
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            A clear, four-step journey designed to ease cognitive overload and make every clinical interaction more productive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((st, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3 relative"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {st.number}
              </div>
              <h3 className="text-base font-bold text-slate-900">{st.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>

        {/* Link to Full 7-Step User Journey */}
        <div className="text-center pt-10">
          <button
            onClick={() => onNavigate('how-it-works')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm border border-indigo-200 transition-colors cursor-pointer"
          >
            <span>Explore the Detailed 7-Step Patient & Caregiver Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. SECTION D: PRODUCT PREVIEW SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
              Interactive Product Preview
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              A Thoughtful, Calm Patient Workspace
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Explore the actual tools designed for cancer patients and caregivers to manage daily care and visit prep.
            </p>

            {/* Interactive Preview Tabs */}
            <div className="pt-2 flex items-center justify-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActivePreviewTab('planner')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePreviewTab === 'planner'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                Care Planner
              </button>
              <button
                onClick={() => setActivePreviewTab('assistant')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePreviewTab === 'assistant'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                AI Health Assistant
              </button>
              <button
                onClick={() => setActivePreviewTab('journal')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePreviewTab === 'journal'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                Symptom Journal
              </button>
              <button
                onClick={() => setActivePreviewTab('prep')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePreviewTab === 'prep'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                Doctor Visit Prep
              </button>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-inner">
            {activePreviewTab === 'planner' && (
              <div className="bg-[#F8FAFD] rounded-xl p-5 text-slate-900 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-bold text-sm">October 2026 — Care Calendar & Schedules</h4>
                    <p className="text-xs text-slate-500">Coordinate appointments, scans, and recovery periods</p>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 font-bold rounded-lg text-xs">
                    In-App Reminders Active
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-indigo-600 font-bold block">Oncology Follow-up</span>
                    <span className="text-[11px] text-slate-500">Oct 28 · 10:00 AM (Clinic Consultation)</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-purple-600 font-bold block">Complete Blood Count (CBC)</span>
                    <span className="text-[11px] text-slate-500">Nov 04 · 2:00 PM (Outpatient Lab)</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-teal-600 font-bold block">Support Group Meeting</span>
                    <span className="text-[11px] text-slate-500">Nov 11 · 11:00 AM (Community Room)</span>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'assistant' && (
              <div className="bg-[#F8FAFD] rounded-xl p-5 text-slate-900 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-xs">AI Health Assistant Live Interface</span>
                  <span className="ml-auto text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    Grounded in NCI & Mayo Clinic Literature
                  </span>
                </div>
                <div className="p-3 bg-indigo-600 text-white rounded-xl text-xs max-w-sm ml-auto">
                  What are practical, evidence-based ways to relieve mild nausea after an infusion?
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <p className="font-bold text-slate-900">Key recommendations from oncology guidelines:</p>
                  <p>1. Take antiemetic medications strictly on schedule as prescribed by your team, not just when symptoms peak.</p>
                  <p>2. Eat small, frequent room-temperature snacks (ginger tea, bland toast) to reduce scent triggers.</p>
                  <p>3. Stay well-hydrated throughout recovery days with clear broths and electrolyte solutions.</p>
                  <div className="pt-2 text-[10px] text-indigo-600 font-semibold border-t border-slate-100">
                    Sources: Mayo Clinic & American Cancer Society · Informational only, consult your oncologist
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'journal' && (
              <div className="bg-[#F8FAFD] rounded-xl p-5 text-slate-900 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-xs">Symptom & Energy Tracker</span>
                  <span className="text-xs text-slate-500">Oct 27, 2026</span>
                </div>
                <div className="flex items-center justify-around py-2 bg-white rounded-xl border border-slate-200">
                  <span className="text-xs opacity-50">😄 Great</span>
                  <span className="text-xs opacity-50">🙂 Good</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">😐 Okay</span>
                  <span className="text-xs opacity-50">🙁 Bad</span>
                  <span className="text-xs opacity-50">😣 Severe</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-slate-900">Observation: Mild nausea & low morning energy</p>
                  <p className="text-slate-600 italic">"Took ondansetron at 11am; had a 20-minute rest and felt steady by dinner."</p>
                </div>
              </div>
            )}

            {activePreviewTab === 'prep' && (
              <div className="bg-[#F8FAFD] rounded-xl p-5 text-slate-900 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-xs">Patient-Prepared Consultation Agenda</span>
                  <span className="text-xs text-indigo-600 font-bold">Print & PDF Ready</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <p><strong>Appointment:</strong> Clinical Follow-up with Oncology Team</p>
                  <p><strong>Chief Priority:</strong> Review lab counts and mild nausea response.</p>
                  <p><strong>Top Questions:</strong> When should I contact triage immediately? Are blood counts recovering on schedule?</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. SUPPORT FOR PATIENTS AND CAREGIVERS (TWO-SIDED PERSPECTIVE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide uppercase">
            The Circle of Care
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Support for Patients and Family Caregivers
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Cancer care is a collaborative journey. CareBridge AI creates seamless coordination while preserving the patient’s absolute privacy and independence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Patient Perspective */}
          <div className="bg-white rounded-3xl p-8 border border-indigo-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Heart className="w-6 h-6 fill-indigo-600/20" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Patient Control
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">For the Patient</h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Stay in total command of your care without feeling overwhelmed. Log observations when energy allows, and choose exactly what to share.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-600 pt-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Effortless 30-second symptom and fatigue logs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Private notes and reflections remain strictly hidden from caregivers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Synthesized 1-page agendas ready for your next doctor consultation.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigate(user ? 'dashboard' : 'signup')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                <span>{user ? 'Open Patient Workspace' : 'Start as a Patient'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Caregiver Perspective */}
          <div className="bg-white rounded-3xl p-8 border border-purple-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    Family Delegation
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">For Family Caregivers</h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Provide dependable support without constantly asking about appointments or treatment dates.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-600 pt-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Real-time view of treatment schedules, infusion labs, and rest days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Log practical tasks (rides, pharmacy pick-up, meal prep) collaboratively.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Granular permissions that the patient can adjust or revoke at any time.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigate(user ? 'caregiver-access' : 'signup')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
              >
                <span>{user ? 'Manage Caregiver Access' : 'Join as Caregiver'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION H & I: PRIVACY, RESPONSIBLE AI & ACCESSIBLE DESIGN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-rose-50/60 rounded-3xl p-8 sm:p-12 border border-indigo-100 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Patient-Controlled Privacy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never sell your health logs or share personal observations. Caregiver access is strictly consent-based and revocable with one click.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Responsible AI Boundaries</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our AI never claims medical certainty, diagnoses cancer, or alters medication. All answers are educational and grounded in verified oncology literature.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Inclusive & Bilingual</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Built to support patients and diverse families with clear typography, screen-reader support, and real-time toggle between English and Urdu (اردو).
            </p>
          </div>
        </div>
      </section>

      {/* 8. SECTION J: FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Clear answers regarding medical boundaries, emergency triage, and data privacy.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. SECTION K: FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-rose-300">
              CodeTheCure Hackathon 2026
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Begin your organized, supported care path today.
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">
              Join patients and caregivers who are bringing calm, clarity, and preparation to their cancer journey.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate(user ? 'dashboard' : 'signup')}
              className="px-7 py-3.5 bg-white text-indigo-900 hover:bg-slate-100 rounded-2xl font-bold text-sm shadow-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              {user ? 'Go to Workspace' : 'Get Started'}
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              Explore How It Works
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
