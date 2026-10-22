import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Settings,
  User as UserIcon,
  Languages,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  LogOut,
} from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { user, updateProfile, logout } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [highContrast, setHighContrast] = useState(user?.accessibility?.highContrast || false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>(user?.accessibility?.fontSize || 'normal');
  const [reducedMotion, setReducedMotion] = useState(user?.accessibility?.reducedMotion || false);

  const [regimen, setRegimen] = useState(user?.treatmentPlan?.regimen || 'Paclitaxel & Carboplatin');
  const [currentCycle, setCurrentCycle] = useState(user?.treatmentPlan?.currentCycle || 2);
  const [totalCycles, setTotalCycles] = useState(user?.treatmentPlan?.totalCycles || 6);
  const [oncologist, setOncologist] = useState(user?.treatmentPlan?.oncologist || 'Dr. Saman Ali');

  const [saveStatus, setSaveStatus] = useState('');
  const [exporting, setExporting] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving changes...');
    try {
      await updateProfile({
        name,
        language,
        accessibility: {
          highContrast,
          fontSize,
          reducedMotion,
        },
        treatmentPlan: {
          regimen,
          currentCycle,
          totalCycles,
          startDate: user?.treatmentPlan?.startDate || '2026-09-14',
          nextDoseDate: user?.treatmentPlan?.nextDoseDate || '2026-10-28',
          oncologist,
          clinic: user?.treatmentPlan?.clinic || 'Lahore Comprehensive Cancer Care Center',
          status: 'in_progress',
        },
      });

      setSaveStatus('Preferences saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err: any) {
      setSaveStatus(err.message || 'Error updating settings.');
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const [apts, jnl, tks, sums] = await Promise.all([
        api.getAppointments(),
        api.getJournalEntries(),
        api.getDailyTasks(),
        api.getVisitSummaries(),
      ]);

      const bundle = {
        exportDate: new Date().toISOString(),
        user: { name: user?.name, email: user?.email, role: user?.role },
        appointments: apts,
        symptomJournal: jnl,
        dailyTasks: tks,
        visitSummaries: sums,
      };

      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `carebridge_health_records_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export records:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'WARNING: This will permanently delete your account, appointments, symptom logs, and visit summaries from our database. Are you absolutely certain?'
      )
    ) {
      try {
        await api.deleteAccount();
        await logout();
        onNavigate('home');
      } catch (err) {
        console.error('Failed to delete account:', err);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-600" />
          <span>Profile, Privacy & Settings</span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your account preferences, accessibility settings, and personal data.
        </p>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <UserIcon className="w-4 h-4 text-indigo-600" />
            <span>Profile & Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Treatment Plan Config (for Patients) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Treatment Plan Details</span>
            </div>
            <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
              Cycle {currentCycle} of {totalCycles}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chemotherapy Regimen</label>
              <input
                type="text"
                value={regimen}
                onChange={(e) => setRegimen(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Oncologist</label>
              <input
                type="text"
                value={oncologist}
                onChange={(e) => setOncologist(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Active Cycle</label>
              <input
                type="number"
                min="1"
                max={totalCycles}
                value={currentCycle}
                onChange={(e) => setCurrentCycle(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Total Planned Cycles</label>
              <input
                type="number"
                min="1"
                max="24"
                value={totalCycles}
                onChange={(e) => setTotalCycles(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Language & Accessibility */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Languages className="w-4 h-4 text-indigo-600" />
            <span>Language & Accessibility</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-2">Display Language</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                    language === 'en'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ur')}
                  className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                    language === 'ur'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  اردو (Urdu)
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-slate-700">High Contrast Mode</span>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-slate-700">Reduced Motion</span>
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600"
                />
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-2xl shadow-md shadow-indigo-200 transition-all text-sm"
        >
          Save All Preferences
        </button>
      </form>

      {/* Privacy & Data Ownership Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Data Ownership & Privacy Controls</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-600" />
              Export My Health Records
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Download a complete JSON export of all your appointments, symptom logs, and doctor visit agendas.
            </p>
            <button
              onClick={handleExportData}
              disabled={exporting}
              className="mt-2 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition-colors"
            >
              {exporting ? 'Preparing Bundle...' : 'Download My Data (.JSON)'}
            </button>
          </div>

          <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-2">
            <h4 className="text-xs font-bold text-rose-900 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              Delete Account & Records
            </h4>
            <p className="text-[11px] text-rose-700/80 leading-relaxed">
              Permanently purge all personal health data and delete your account from our database.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="mt-2 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors"
            >
              Permanently Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
