import React from 'react';
import { Heart, Mail, Phone, MapPin, ShieldCheck, HeartHandshake } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-rose-400 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white/90" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                CareBridge <span className="text-indigo-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Your Cancer Journey, Made Easier. An AI-powered companion for cancer patients, caregivers, and healthcare support teams — because you’re not alone.
            </p>
            <div className="flex items-center gap-2 text-rose-300 font-script text-xl pt-1">
              <span>Stronger Together</span>
              <Heart className="w-4 h-4 fill-rose-300 text-rose-300 inline" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-slate-200 uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('features')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-white transition-colors"
                >
                  Trusted Resources
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Key Capabilities */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-slate-200 uppercase mb-4">
              Care Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('care-planner')}
                  className="hover:text-white transition-colors"
                >
                  Smart Care Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-assistant')}
                  className="hover:text-white transition-colors"
                >
                  AI Health Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('symptom-journal')}
                  className="hover:text-white transition-colors"
                >
                  Symptom Journal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doctor-visit-prep')}
                  className="hover:text-white transition-colors"
                >
                  Doctor Visit Prep
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('caregiver-access')}
                  className="hover:text-white transition-colors"
                >
                  Caregiver Permissions
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-slate-200 uppercase mb-4">
              Contact Info
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>support@carebridgeai.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Lahore, Pakistan</span>
              </li>
              <li className="pt-1 flex items-center gap-2 text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>CodeTheCure 2026 Hackathon</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="py-6 border-b border-slate-800/60 text-xs text-slate-400 leading-relaxed">
          <p>
            <strong className="text-slate-300">Medical & Safety Notice:</strong> CareBridge AI is an organization and educational support platform for cancer patients and caregivers. It is not a medical device, diagnostic system, or treatment prescribing tool. Always consult your oncologist or licensed physician for personal medical decisions. If you have fever &ge; 100.4&deg;F (38.0&deg;C), severe pain, or shortness of breath, contact your oncology triage line or local emergency services immediately.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CareBridge AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('privacy-policy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('terms-of-service')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-slate-300 transition-colors"
            >
              Clinical Boundaries
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
