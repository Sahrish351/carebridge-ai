import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar,
  Sparkles,
  Activity,
  FileText,
  Lock,
  ArrowRight,
  Stethoscope,
  BookOpen,
  Eye,
  Languages,
  Check,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
  initialTab?: string;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const principles = [
    {
      title: 'Compassion First',
      tagline: 'Built around human dignity & low energy days',
      desc: 'Cancer care is not simply medical data; it is an emotional and physical marathon. We design interfaces that are gentle on cognitive load, with warm tones, high readability, and simple actions that respect fatigue.',
      icon: Heart,
      accent: 'from-rose-500 to-pink-600',
      badge: 'Dignity & Warmth',
    },
    {
      title: 'Radical Accessibility',
      tagline: 'Multi-language, legible type, clear contrast',
      desc: 'Crucial health tools should never be restricted to the tech-savvy. CareBridge AI provides bilingual English & Urdu support, high-contrast layouts, large touch targets, and plain-language phrasing that everyone can navigate.',
      icon: Languages,
      accent: 'from-indigo-600 to-purple-600',
      badge: 'Universal Reach',
    },
    {
      title: 'Strict Patient Privacy',
      tagline: 'You own your data; zero third-party monetization',
      desc: 'Your health observations and treatment timelines belong exclusively to you. We practice strict consent boundaries—caregiver delegation is granular, revocable in 1 click, and never sold or shared with advertisers.',
      icon: Lock,
      accent: 'from-teal-600 to-emerald-600',
      badge: 'Consent-Driven',
    },
    {
      title: 'Responsible, Grounded AI',
      tagline: 'Educational assistance strictly grounded in verified literature',
      desc: 'We never allow speculative AI diagnosis or treatment prescribing. Every educational insight is grounded in published literature from NCI, ACS, and Mayo Clinic, accompanied by active citations and clear medical boundaries.',
      icon: Sparkles,
      accent: 'from-amber-500 to-orange-600',
      badge: 'Zero Hallucinations',
    },
  ];

  const targetAudiences = [
    {
      title: 'For Patients',
      role: 'Navigating active therapy, remission, or survivorship',
      points: [
        'Organize confusing multi-cycle chemotherapy schedules and infusion dates.',
        'Track daily fatigue, nausea, appetite, and emotional wellbeing in seconds.',
        'Ask questions anytime about terminology, nutrition, or side-effect relief.',
        'Arrive at consultations with an organized 1-page agenda so questions are heard.',
      ],
      icon: Heart,
      bgColor: 'bg-white',
      borderColor: 'border-indigo-100',
    },
    {
      title: 'For Family Caregivers',
      role: 'Spouses, adult children, and trusted friends providing support',
      points: [
        'Stay aligned on critical clinic dates without asking the patient repeatedly.',
        'Coordinate logistical support such as transportation, meals, and medication pickups.',
        'Review doctor-visit prep questions together prior to important consultations.',
        'Respect patient autonomy through clear, transparent, and revocable permissions.',
      ],
      icon: Users,
      bgColor: 'bg-white',
      borderColor: 'border-purple-100',
    },
  ];

  return (
    <div className="bg-[#F8FAFD] min-h-screen pb-24">
      {/* 1. HERO SECTION WITH MEANINGFUL HEADING AND HEALTHCARE VISUAL */}
      <section className="relative pt-12 pb-16 overflow-hidden bg-white border-b border-slate-200/80">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-rose-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and Editorial Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wider uppercase">
                <span>Our Mission & Purpose · CodeTheCure 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Making the Cancer Care Journey{' '}
                <span className="text-indigo-600">Easier.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
                CareBridge AI was created with a single heartfelt mission: to replace the overwhelm and fragmentation of cancer care with clarity, calm organization, and compassionate support.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  CodeTheCure Patient Experience Entry
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Patient & Caregiver Centered
                </span>
                <span className="flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-indigo-600" />
                  Bilingual English & اردو
                </span>
              </div>
            </div>

            {/* Right Column: Meaningful Healthcare Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                <div className="rounded-3xl overflow-hidden bg-gradient-to-tr from-indigo-50 via-white to-rose-50 p-3 sm:p-4 shadow-xl border border-indigo-100/70">
                  <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-4/3 relative">
                    <img
                      src="/assets/hero_patient_clean.png"
                      alt="Compassionate healthcare setting showing a patient and caregiver sharing a warm, supportive conversation"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="mt-3.5 p-3.5 bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-2xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-rose-300">
                        <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">Patient Support Philosophy</p>
                        <p className="text-[11px] text-indigo-100 mt-0.5">Empowering people through evidence & dignity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM CAREBRIDGE AI AIMS TO SOLVE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-8 sm:p-12">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              The Reality of Cancer Care
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Why CareBridge AI Exists
            </h2>
            <p className="text-slate-600 text-base mt-3 leading-relaxed">
              When a person receives a cancer diagnosis, they are suddenly thrust into an unfamiliar medical world filled with complex terminology, rigid infusion schedules, multi-week cycles, and unpredictable side effects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F8FAFD] p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Cognitive Overload & Fragmentation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patients receive pamphlets, portal logins, lab schedules, and medication bottles across multiple clinics. In the middle of chemotherapy fatigue, keeping dates straight becomes an overwhelming chore.
              </p>
            </div>

            <div className="bg-[#F8FAFD] p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Rushed 15-Minute Consultations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clinic visits are brief and high-pressure. Patients frequently forget subtle symptoms or critical questions they wanted to raise, leaving the appointment without the peace of mind they needed.
              </p>
            </div>

            <div className="bg-[#F8FAFD] p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Misinformation Anxiety
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Searching online late at night often yields alarming, unverified claims that amplify fear. Patients need clear, sourced, non-alarmist health information grounded directly in authoritative oncology literature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT MISSION AND VISION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Mission Box */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold uppercase tracking-wider">
                Our Mission
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                Empowering Patients Through Clarity, Dignity, and Evidence
              </h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                To ease the cognitive and emotional burdens of cancer by giving every patient and caregiver a serene, trustworthy companion to organize appointments, track observations gently, understand verified health information, and arrive at doctor visits fully prepared.
              </p>
            </div>

            <div className="pt-4 border-t border-indigo-700/60 flex items-center gap-3 text-xs text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Created for the CodeTheCure 2026 Patient Support Track</span>
            </div>
          </div>

          {/* Vision Box */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider">
                Our Vision
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                A Healthcare System Where No Patient Feels Lost
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We envision a world where technology acts as an empathetic bridge between clinical encounters and daily home recovery. A world where patients are active partners in their care, caregivers feel coordinated, and doctor consultations are collaborative, productive dialogues.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500 font-semibold">
              <Heart className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Your Cancer Journey, Made Easier · Stronger Together</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE PRINCIPLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Guiding Philosophy
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Our Four Core Principles
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Every feature, interaction, and policy in CareBridge AI is held to these strict standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((pr, i) => {
            const Icon = pr.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    {pr.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {pr.title}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                    {pr.tagline}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pr.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. WHO THE PLATFORM IS DESIGNED FOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Target Community
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Designed for Patients & Caregivers Alike
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Cancer touches the entire circle of care. CareBridge AI provides dedicated value to both perspectives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {targetAudiences.map((aud, i) => {
            const Icon = aud.icon;
            return (
              <div
                key={i}
                className={`bg-white rounded-3xl p-8 border ${aud.borderColor} shadow-xs space-y-6 flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {aud.title}
                      </h3>
                      <p className="text-xs text-indigo-600 font-medium">
                        {aud.role}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-600">
                    {aud.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Seamless role collaboration</span>
                  <button
                    onClick={() => onNavigate('how-it-works')}
                    className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors cursor-pointer"
                  >
                    See how it works →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. ETHICAL BOUNDARIES & CLINICAL LIMITATIONS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-amber-50/70 rounded-3xl border border-amber-200/90 p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 text-amber-900">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0" />
            <div>
              <h3 className="text-xl font-bold">
                Our Ethical Boundaries & Medical Limitations
              </h3>
              <p className="text-xs text-amber-800 font-medium">
                Transparent communication is fundamental to patient safety.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-amber-950 leading-relaxed">
            <p>
              <strong>CareBridge AI is not a medical device, diagnostic engine, or emergency service.</strong> The application is purposefully engineered as an educational companion, organization planner, and communication preparation tool.
            </p>
            <p>
              It does not diagnose illness, recommend surgical or pharmaceutical protocols, adjust prescription dosages, or evaluate medical emergencies. In the event of high fevers during chemotherapy, sudden breathlessness, severe pain, or bleeding, patients must immediately contact emergency services or their hospital’s 24/7 on-call triage team.
            </p>
            <p>
              Every educational explanation is accompanied by primary source links to verified organizations (National Cancer Institute, American Cancer Society, Mayo Clinic) so that patients can review authoritative guidelines directly.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-10 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 mx-auto flex items-center justify-center text-indigo-600">
            <Heart className="w-6 h-6 fill-indigo-600" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Join Us on the Journey
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explore how CareBridge AI can bring organization, clarity, and peace of mind to your cancer care routine.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate(user ? 'dashboard' : 'signup')}
              className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <span>{user ? 'Open Workspace' : 'Get Started with CareBridge AI'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('how-it-works')}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 transition-colors cursor-pointer"
            >
              See the 7-Step Journey
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
