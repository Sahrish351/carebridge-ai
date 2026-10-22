import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  AlertCircle,
  Heart,
} from 'lucide-react';

interface ContactFAQPageProps {
  initialTab?: 'contact' | 'faq' | 'privacy' | 'terms';
  onNavigate: (page: string) => void;
}

export const ContactFAQPage: React.FC<ContactFAQPageProps> = ({ initialTab = 'contact', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'contact' | 'faq' | 'privacy' | 'terms'>(initialTab);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Support');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 5000);
  };

  const faqs = [
    {
      q: 'Is CareBridge AI a licensed medical device or diagnostic system?',
      a: 'No. CareBridge AI is strictly an organizational, educational, and appointment-preparation companion. It never makes clinical diagnoses, predicts cancer stages, alters prescription dosages, or provides emergency triage. All health observations must be discussed directly with your oncology team.',
    },
    {
      q: 'Where does the AI retrieve its guidance and health citations?',
      a: 'CareBridge AI utilizes evidence-based clinical literature from verified oncology institutions: the National Cancer Institute (NCI), American Cancer Society (ACS), Mayo Clinic, and World Health Organization (WHO). Citations and source links accompany all factual recommendations.',
    },
    {
      q: 'How does caregiver sharing work? Will they see all my private data?',
      a: 'Caregiver access is 100% consent-based and managed by you. Caregivers cannot access your account until you explicitly authorize them. You control granular permissions (such as viewing appointments vs reading personal journal notes) and you can revoke access at any second.',
    },
    {
      q: 'What should I do if I develop a fever or severe symptoms during chemotherapy?',
      a: 'During chemotherapy, a fever ≥ 100.4°F (38.0°C), severe shivering, acute chest pain, or shortness of breath is a potential medical emergency (such as neutropenic fever). Do NOT rely on an app — contact your cancer center’s 24/7 on-call triage line or emergency services immediately.',
    },
    {
      q: 'Is CareBridge AI available in languages other than English?',
      a: 'Yes. CareBridge AI includes built-in support for both English and Urdu (اردو), with verified terminology and RTL layout support to assist South Asian patients and multicultural families.',
    },
    {
      q: 'How do I generate a doctor-visit preparation agenda?',
      a: 'Navigate to "Doctor Visit Prep", select your upcoming appointment, check which recent symptoms and questions to include, and click "Generate Summary". You can edit the text and click "Print / Save PDF" to bring it into your clinic room.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex items-center justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Contact Us
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'faq'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Frequently Asked Questions
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'terms'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Terms of Service
          </button>
        </div>
      </div>
      {activeTab === 'contact' && (
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Get in Touch with Our Team
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Have questions, feedback, or need assistance? Our patient support team is dedicated to helping you navigate the platform with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-xl">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300 font-script text-xl">
                  Stronger Together ♡
                </span>
                <h3 className="text-xl font-bold">Contact Information</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  CareBridge AI was created for the CodeTheCure 2026 hackathon. We welcome clinical feedback and patient inquiries.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Email Support</span>
                    <span className="font-semibold">support@carebridgeai.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Helpline</span>
                    <span className="font-semibold">+92 300 1234567</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Headquarters</span>
                    <span className="font-semibold">Lahore, Pakistan</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-indigo-700/60 text-[11px] text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted transmission & zero data brokering.</span>
              </div>
            </div>
            <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Send Us a Message</h3>

              {submitted && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Thank you! Your message has been received by our support team.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Areeba Khan"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  >
                    <option value="General Support">General Support</option>
                    <option value="Clinical Feedback">Clinical Feedback</option>
                    <option value="Account & Data Question">Account & Data Question</option>
                    <option value="Hackathon Inquiry">Hackathon Inquiry (CodeTheCure 2026)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="How can we assist you today?..."
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'faq' && (
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm">
              Answers regarding patient safety, medical boundaries, caregiver sharing, and evidence sources.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'transform rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {activeTab === 'privacy' && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xs space-y-6 max-w-3xl mx-auto text-slate-700 text-sm leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">Privacy Policy</h2>
          <p className="text-xs text-slate-400">Effective Date: October 21, 2026</p>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900">1. Patient-First Privacy Principles</h3>
            <p>
              CareBridge AI was built with strict ethical guidelines. We believe that health observations, appointments, and questions belong entirely to the patient. We do not sell user data, run third-party advertising networks, or monetize personal health profiles.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900">2. What Information We Collect</h3>
            <p>
              We collect only the minimal data necessary to provide service: your name, email address, password hash, user-entered appointment dates, self-reported symptom journal entries, and chat prompts.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900">3. Caregiver Access & Explicit Consent</h3>
            <p>
              Caregiver collaboration requires an explicit, revocable grant of authorization initiated by the patient. No caregiver is granted access without verified user action.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900">4. Your Right to Delete and Export</h3>
            <p>
              In accordance with modern privacy standards, you have the right to download a full copy of your data at any time via the Settings page, or delete all records permanently from our servers.
            </p>
          </section>
        </div>
      )}
      {activeTab === 'terms' && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xs space-y-6 max-w-3xl mx-auto text-slate-700 text-sm leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">Terms of Service & Medical Disclaimer</h2>
          <p className="text-xs text-slate-400">Effective Date: October 21, 2026</p>

          <section className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
            <h4 className="font-bold text-amber-800">Medical Disclaimer:</h4>
            <p>
              CareBridge AI is not a medical device, diagnostic engine, or prescription tool. It does not replace the expert clinical assessment of a qualified oncologist or healthcare professional. In any emergency or acute change in condition, contact your oncology clinic or emergency medical services immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900">1. Acceptance of Terms</h3>
            <p>
              By creating an account or accessing CareBridge AI, you agree to these Terms. If you do not agree, please do not use the application.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900">2. Educational & Organizational Scope</h3>
            <p>
              The application is provided to assist cancer patients and caregivers in organizing schedules, recording personal observations, and preparing questions for clinician visits. Generated summaries represent patient-compiled notes.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold text-slate-900">3. Limitation of Liability</h3>
            <p>
              CareBridge AI is provided on an "as is" and "as available" basis for the CodeTheCure 2026 Hackathon. Users are solely responsible for discussing all medical decisions directly with their licensed physicians.
            </p>
          </section>
        </div>
      )}
    </div>
  );
};
