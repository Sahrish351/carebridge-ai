import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Shield,
  Stethoscope,
  Smile,
  ArrowLeft,
} from 'lucide-react';

interface SignUpPageProps {
  onNavigate: (page: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();

  const [role, setRole] = useState<'patient' | 'caregiver' | 'doctor'>('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (!consentAccepted) {
      setErrorMessage('Please acknowledge the clinical consent and privacy terms to proceed.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await register({
        name,
        email,
        password,
        role,
      });
      onNavigate('dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pb-4 gap-2">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-400 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0">
            <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-white/90" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-none">
              CareBridge <span className="text-indigo-600">AI</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5">Cancer Care Companion</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer py-1.5 px-2.5 sm:px-3 rounded-xl hover:bg-slate-100 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>
      <div className="w-full max-w-5xl mx-auto my-auto">
        <div className="w-full bg-white rounded-3xl shadow-xl shadow-indigo-100/70 border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 p-8 text-white flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="space-y-2">
                <span className="inline-block text-xs font-semibold text-rose-300 font-script text-xl">
                  Begin with Confidence ♡
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight leading-snug">
                  Join a Supportive Community
                </h2>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  Start organizing your care appointments, tracking daily symptoms, and getting source-grounded answers.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden aspect-16/10 border border-white/10 shadow-md relative mt-4">
                <img
                  src="/assets/ribbon_hands_clean.png"
                  alt="Compassionate hands holding awareness ribbon"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="pt-2 space-y-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free & private account setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full control over caregiver access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified medical sources with citations</span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-indigo-800/80 relative z-10 text-[11px] text-indigo-200 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>We never sell health data or monetize your personal observations.</span>
            </div>
          </div>
          <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 space-y-5 sm:space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Create Your Free Account
                </h1>
                <p className="text-xs text-slate-500">
                  Select your primary role to customize your CareBridge AI experience.
                </p>
              </div>
              <div className="bg-slate-100 p-1 rounded-2xl grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    role === 'patient'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole('caregiver')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    role === 'caregiver'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Caregiver
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    role === 'doctor'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Clinician
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Areeba Khan"
                      required
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 chars"
                        required
                        className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        required
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="leading-tight">
                      I understand that CareBridge AI provides educational guidance and organization support, not medical diagnosis or clinical treatment.
                    </span>
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
                >
                  {loading ? (
                    <span>Creating your account...</span>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
            <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
              <span>Already have an account? </span>
              <button
                onClick={() => onNavigate('login')}
                className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-5xl mx-auto pt-6 text-center text-xs text-slate-400">
        <p>© 2026 CareBridge AI · CodeTheCure Hackathon · Patient Dignity & Privacy First</p>
      </div>
    </div>
  );
};
