import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Appointment, VisitSummary } from '../types';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Sparkles,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Clock,
} from 'lucide-react';

interface DoctorVisitPrepPageProps {
  onNavigate: (page: string) => void;
}

export const DoctorVisitPrepPage: React.FC<DoctorVisitPrepPageProps> = ({ onNavigate }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [summaries, setSummaries] = useState<VisitSummary[]>([]);
  const [selectedAptId, setSelectedAptId] = useState<string>('');

  // Options
  const [includeSymptoms, setIncludeSymptoms] = useState(true);
  const [includeMedications, setIncludeMedications] = useState(true);
  const [includeQuestions, setIncludeQuestions] = useState(true);
  const [customNotes, setCustomNotes] = useState('');

  // Generated Summary state
  const [currentSummary, setCurrentSummary] = useState<VisitSummary | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New question draft
  const [newQuestion, setNewQuestion] = useState('');

  const sampleQuestions = [
    'What are the next steps in my treatment plan?',
    'Are there any dietary changes I should make for energy?',
    'What side effects should I specifically monitor after this cycle?',
    'When should I contact your triage team immediately versus waiting?',
    'Are there any new supportive options or physical therapy exercises available?',
    'How are my white blood cell and platelet counts trending?',
  ];

  const loadInitialData = async () => {
    try {
      const [apts, sums] = await Promise.all([
        api.getAppointments(),
        api.getVisitSummaries(),
      ]);
      setAppointments(apts);
      setSummaries(sums);
      if (apts.length > 0) {
        setSelectedAptId(apts[0].id);
      }
      if (sums.length > 0) {
        setCurrentSummary(sums[0]);
      }
    } catch (err) {
      console.error('Failed to load visit prep data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setSavedSuccess(false);

    try {
      const summary = await api.generateVisitSummary({
        appointmentId: selectedAptId,
        includeSymptoms,
        includeMedications,
        includeQuestions,
        customNotes,
      });

      setCurrentSummary(summary);

      // Auto save
      const saved = await api.saveVisitSummary({
        appointmentId: summary.appointmentId,
        appointmentTitle: summary.appointmentTitle,
        doctorName: summary.doctorName,
        appointmentDate: summary.appointmentDate,
        chiefConcerns: summary.chiefConcerns,
        symptomsSummary: summary.symptomsSummary,
        currentMedications: summary.currentMedications,
        questionsForDoctor: summary.questionsForDoctor,
        patientNotes: summary.patientNotes,
      });

      const updatedSummaries = await api.getVisitSummaries();
      setSummaries(updatedSummaries);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate summary:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (!currentSummary) return;
    const text = `PATIENT-PREPARED DOCTOR VISIT SUMMARY
Appointment: ${currentSummary.appointmentTitle} with ${currentSummary.doctorName}
Date: ${currentSummary.appointmentDate}

CHIEF CONCERNS:
${currentSummary.chiefConcerns}

RECENT SYMPTOMS & OBSERVATIONS:
${currentSummary.symptomsSummary}

CURRENT MEDICATIONS:
${currentSummary.currentMedications.join(', ')}

QUESTIONS FOR MY DOCTOR:
${currentSummary.questionsForDoctor.map((q, i) => `${i + 1}. ${q}`).join('\n')}

PATIENT NOTES:
${currentSummary.patientNotes}

*Prepared with CareBridge AI. Not a clinical assessment.*`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddQuestion = (q: string) => {
    if (!q.trim() || !currentSummary) return;
    setCurrentSummary({
      ...currentSummary,
      questionsForDoctor: [...currentSummary.questionsForDoctor, q.trim()],
    });
    setNewQuestion('');
  };

  const handleRemoveQuestion = (idx: number) => {
    if (!currentSummary) return;
    setCurrentSummary({
      ...currentSummary,
      questionsForDoctor: currentSummary.questionsForDoctor.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Doctor Visit Preparation
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Get personalized questions and an organized summary for your next appointment.
          </p>
        </div>

        {currentSummary && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Controls on Left (5 cols), Summary View on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generate Controls & Sample Questions (5 cols) */}
        <div className="lg:col-span-5 space-y-6 no-print">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-slate-900">Generate Visit Summary</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Upcoming Appointment
                </label>
                {appointments.length > 0 ? (
                  <select
                    value={selectedAptId}
                    onChange={(e) => setSelectedAptId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none font-medium"
                  >
                    {appointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.date} — {a.doctor} ({a.title})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-slate-400 italic">No appointments booked. Please add one first.</p>
                )}
              </div>

              {/* Checkboxes matching visual reference */}
              <div className="space-y-2 pt-1">
                <span className="font-bold text-slate-700 block mb-1">Include in Summary</span>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeSymptoms}
                    onChange={(e) => setIncludeSymptoms(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>✓ Recent symptom & discomfort logs</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeMedications}
                    onChange={(e) => setIncludeMedications(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>✓ Current medications & supportive therapies</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeQuestions}
                    onChange={(e) => setIncludeQuestions(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>✓ Recommended questions for your oncologist</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Personal Priorities or Questions to Add
                </label>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Ask about tingling in fingers when holding cold drinks..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating || appointments.length === 0}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generating ? 'Synthesizing Summary...' : 'Generate Summary'}</span>
              </button>

              {savedSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Summary saved to your permanent records!</span>
                </div>
              )}
            </div>
          </div>

          {/* Sample Questions Bank matching visual reference */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Sample High-Value Questions</h3>
            <p className="text-xs text-slate-500">
              Click any question to append it directly to your consultation agenda:
            </p>
            <div className="space-y-2">
              {sampleQuestions.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddQuestion(sq)}
                  className="w-full p-2.5 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-200 rounded-xl text-left text-xs text-slate-700 hover:text-indigo-900 transition-colors flex items-start gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{sq}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Printable Summary Document (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentSummary ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100 shadow-lg space-y-6 print-shadow-none">
              {/* Document Header */}
              <div className="border-b border-slate-200 pb-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    Patient-Prepared Consultation Summary
                  </span>
                  <span className="text-xs text-slate-400">
                    Prepared: {currentSummary.appointmentDate}
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-slate-900">
                  {currentSummary.appointmentTitle}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Physician: {currentSummary.doctorName}
                </p>

                <p className="text-[11px] text-slate-400 italic pt-1">
                  *Notice: Patient-prepared summary to guide discussion. Not a clinical assessment or diagnosis.*
                </p>
              </div>

              {/* Chief Concerns */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-slate-500">
                  1. Chief Discussion Priorities
                </h3>
                <textarea
                  value={currentSummary.chiefConcerns}
                  onChange={(e) =>
                    setCurrentSummary({ ...currentSummary, chiefConcerns: e.target.value })
                  }
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              {/* Recent Symptoms & Tolerance */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-slate-500">
                  2. Reported Symptoms & Tolerance Summary
                </h3>
                <textarea
                  value={currentSummary.symptomsSummary}
                  onChange={(e) =>
                    setCurrentSummary({ ...currentSummary, symptomsSummary: e.target.value })
                  }
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              {/* Current Medications */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-slate-500">
                  3. Current Regimen & Medications
                </h3>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
                  {currentSummary.currentMedications.join(' · ')}
                </div>
              </div>

              {/* Questions for Doctor */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold uppercase tracking-wider text-slate-500">
                    4. Questions for My Oncologist
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {currentSummary.questionsForDoctor.length} questions
                  </span>
                </div>

                <div className="space-y-2">
                  {currentSummary.questionsForDoctor.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start justify-between gap-3 text-slate-800"
                    >
                      <span className="font-bold text-indigo-600 shrink-0">{idx + 1}.</span>
                      <span className="flex-1 font-medium">{q}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-slate-400 hover:text-rose-600 no-print"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add question inline */}
                <div className="flex items-center gap-2 pt-1 no-print">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Add another question for the doctor..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddQuestion(newQuestion)}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Patient Notes */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-slate-500">
                  5. Caregiver & Lifestyle Notes
                </h3>
                <textarea
                  value={currentSummary.patientNotes}
                  onChange={(e) =>
                    setCurrentSummary({ ...currentSummary, patientNotes: e.target.value })
                  }
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              {/* Signature / Date line for clinic */}
              <div className="pt-6 border-t border-slate-200 flex justify-between text-[11px] text-slate-400">
                <span>CareBridge AI · CodeTheCure 2026</span>
                <span>Reviewed by Patient / Caregiver: ___________________</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Visit Summary Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select your upcoming appointment on the left and click "Generate Summary" to produce your preparation agenda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
