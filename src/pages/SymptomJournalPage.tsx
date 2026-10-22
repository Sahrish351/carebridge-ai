import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { JournalEntry } from '../types';
import {
  Activity,
  Plus,
  Trash2,
  Calendar,
  Smile,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  FileText,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

interface SymptomJournalPageProps {
  onNavigate: (page: string) => void;
}

export const SymptomJournalPage: React.FC<SymptomJournalPageProps> = ({ onNavigate }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [date, setDate] = useState('2026-10-28');
  const [selectedMood, setSelectedMood] = useState<JournalEntry['mood']>('okay');
  const [severity, setSeverity] = useState(3);
  const [symptomsInput, setSymptomsInput] = useState<string[]>(['Mild nausea']);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const commonSymptoms = [
    'Mild nausea',
    'Low energy / Fatigue',
    'Slight headache',
    'Tingling in fingers/toes',
    'Decreased appetite',
    'Dizziness',
    'Dry mouth',
    'Sleep disruption',
  ];

  const moods: Array<{ id: JournalEntry['mood']; label: string; emoji: string; color: string }> = [
    { id: 'great', label: 'Great', emoji: '😄', color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
    { id: 'good', label: 'Good', emoji: '🙂', color: 'border-teal-500 bg-teal-50 text-teal-700' },
    { id: 'okay', label: 'Okay', emoji: '😐', color: 'border-amber-500 bg-amber-50 text-amber-700' },
    { id: 'bad', label: 'Bad', emoji: '🙁', color: 'border-orange-500 bg-orange-50 text-orange-700' },
    { id: 'very_bad', label: 'Very Bad', emoji: '😣', color: 'border-rose-500 bg-rose-50 text-rose-700' },
  ];

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await api.getJournalEntries();
      setEntries(data);
    } catch (err) {
      console.error('Failed to load journal entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const toggleSymptom = (sym: string) => {
    if (symptomsInput.includes(sym)) {
      setSymptomsInput(symptomsInput.filter((s) => s !== sym));
    } else {
      setSymptomsInput([...symptomsInput, sym]);
    }
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setFormError('Please select a date.');
      return;
    }

    try {
      setFormError('');
      await api.createJournalEntry({
        date,
        symptoms: symptomsInput,
        severity,
        mood: selectedMood,
        notes,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Reset form fields
      setNotes('');
      setSeverity(3);
      await loadEntries();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save journal observation.');
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this symptom log?')) {
      try {
        await api.deleteJournalEntry(id);
        await loadEntries();
      } catch (err) {
        console.error('Failed to delete entry:', err);
      }
    }
  };

  // Severity label generator
  const getSeverityLabel = (val: number) => {
    if (val <= 2) return '1–2 (Very Mild)';
    if (val <= 4) return '3–4 (Mild Discomfort)';
    if (val <= 6) return '5–6 (Moderate Discomfort)';
    if (val <= 8) return '7–8 (Noticeable Impact)';
    return '9–10 (Severe - Call Care Team)';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header matching visual reference */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Symptom Journal
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track your symptoms, mood and wellbeing. Share with your doctor.
          </p>
        </div>

        <button
          onClick={() => {
            document.getElementById('entry-form')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Mood Selector Row (Great, Good, Okay, Bad, Very Bad) matching visual reference */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            How are you feeling right now?
          </span>
          <span className="text-xs text-indigo-600 font-semibold">
            October 2026 Tracker
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {moods.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMood(m.id)}
                className={`p-3 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all transform hover:scale-102 ${
                  isSelected
                    ? `${m.color} shadow-sm font-bold scale-105`
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <span className="text-2xl sm:text-3xl">{m.emoji}</span>
                <span className="text-xs">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout: History on Left (7 cols), Add New Entry on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Chronological History (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Journal History</h2>
              <span className="text-xs text-slate-400 font-medium">
                {entries.length} logged records
              </span>
            </div>

            {/* Accessible Trend Summary & SVG Chart */}
            {entries.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-rose-50/50 rounded-2xl border border-indigo-100 space-y-3 text-xs">
                <div className="flex items-center justify-between text-indigo-900">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span>
                      Discomfort Trend · Average: <strong>{(entries.reduce((acc, curr) => acc + curr.severity, 0) / entries.length).toFixed(1)}/10</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('doctor-visit-prep')}
                    className="font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Generate Visit Prep →
                  </button>
                </div>

                {/* SVG Trend Graph (rendered when at least 2 entries exist) */}
                {entries.length >= 2 && (
                  <div className="pt-2 pb-1">
                    <div className="h-24 w-full relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 80" preserveAspectRatio="none">
                        {/* Background guide lines */}
                        <line x1="0" y1="10" x2="500" y2="10" stroke="#E2E8F0" strokeDasharray="3 3" />
                        <line x1="0" y1="40" x2="500" y2="40" stroke="#E2E8F0" strokeDasharray="3 3" />
                        <line x1="0" y1="70" x2="500" y2="70" stroke="#E2E8F0" strokeDasharray="3 3" />

                        {/* Line & points */}
                        {(() => {
                          const chartEntries = [...entries].reverse().slice(-7);
                          const points = chartEntries.map((e, idx) => {
                            const x = (idx / (chartEntries.length - 1 || 1)) * 480 + 10;
                            // Severity 1 to 10 mapped to y 70 to 10
                            const y = 70 - ((e.severity - 1) / 9) * 60;
                            return { x, y, e };
                          });

                          const pathData = points
                            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                            .join(' ');

                          return (
                            <>
                              <path d={pathData} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              {points.map((p, pIdx) => (
                                <g key={pIdx}>
                                  <circle cx={p.x} cy={p.y} r="5" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2" />
                                  <text x={p.x} y={p.y - 8} fontSize="9" fontWeight="bold" textAnchor="middle" fill="#4338CA">
                                    {p.e.severity}
                                  </text>
                                </g>
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium px-2 pt-1">
                      <span>Past Observations</span>
                      <span>Latest Log</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              {entries.map((entry) => {
                const moodObj = moods.find((m) => m.id === entry.mood);
                return (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-indigo-200 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{entry.date}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <span>{moodObj?.emoji}</span>
                          <span className="capitalize">{entry.mood}</span>
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                          Severity: {entry.severity}/10
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {entry.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {entry.symptoms.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-md font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {entry.notes && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-slate-100">
                        "{entry.notes}"
                      </p>
                    )}
                  </div>
                );
              })}

              {entries.length === 0 && !loading && (
                <div className="text-center py-10 text-xs text-slate-400 space-y-2">
                  <Activity className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>No journal entries logged yet.</p>
                  <p>Use the form on the right to log your first observation.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Add New Entry Form (5 cols) matching visual reference */}
        <div id="entry-form" className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-slate-900">Add New Entry</h2>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Observation saved and added to your care history!</span>
              </div>
            )}

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Symptoms (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {commonSymptoms.map((sym) => {
                    const isSelected = symptomsInput.includes(sym);
                    return (
                      <button
                        type="button"
                        key={sym}
                        onClick={() => toggleSymptom(sym)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Discomfort Severity</label>
                  <span className="font-bold text-indigo-600">{getSeverityLabel(severity)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>1 (Mild)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Severe)</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Personal Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Additional notes (e.g. slight nausea after lunch, took ondansetron, relieved by evening walk)..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-colors"
              >
                Save Entry
              </button>
            </form>

            <div className="pt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
              <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                Entries will be compiled when you generate your Doctor Visit Prep summary.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
