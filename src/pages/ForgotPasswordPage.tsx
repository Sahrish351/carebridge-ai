import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Heart,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState<'request' | 'reset' | 'completed'>('request');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your account email.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const res = await api.forgotPassword(email);
      if (res.resetToken) {
        setResetToken(res.resetToken);
        setStatusMessage('Password reset authorization generated successfully.');
        setStep('reset');
      } else {
        setStatusMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not generate reset request.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await api.resetPassword(resetToken!, newPassword);
      setStep('completed');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password. Token may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* 1. Standalone Top Navigation Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pb-4">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-400 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
            <Heart className="w-5 h-5 fill-white/90" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              CareBridge <span className="text-indigo-600">AI</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">Cancer Care Companion</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer py-1.5 px-3 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* 2. Centered Card Form */}
      <div className="w-full max-w-xl mx-auto my-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/70 border border-slate-200/90 p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {step === 'completed' ? 'Password Updated!' : 'Account Recovery'}
            </h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {step === 'request'
                ? 'Enter your registered email address to receive password reset authorization.'
                : step === 'reset'
                ? 'Create a secure new password for your CareBridge AI workspace.'
                : 'Your password has been successfully reset. You can now log into your account.'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {statusMessage && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-700">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Step 1: Request Reset */}
          {step === 'request' && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. areeba@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? <span>Generating Token...</span> : <span>Send Reset Authorization</span>}
              </button>
            </form>
          )}

          {/* Step 2: Set New Password */}
          {step === 'reset' && (
            <form onSubmit={handleApplyNewPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? <span>Saving New Password...</span> : <span>Update Password</span>}
              </button>
            </form>
          )}

          {/* Step 3: Success Screen */}
          {step === 'completed' && (
            <div className="text-center space-y-4 pt-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-600">
                You can now log in using your new credentials.
              </p>
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Links */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('login')}
              className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors cursor-pointer"
            >
              ← Back to Sign In
            </button>
            <button
              onClick={() => onNavigate('signup')}
              className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* 3. Small Clean Copyright & Privacy Note Only */}
      <div className="w-full max-w-5xl mx-auto pt-6 text-center text-xs text-slate-400">
        <p>© 2026 CareBridge AI · CodeTheCure Hackathon · Patient Dignity & Privacy First</p>
      </div>
    </div>
  );
};
