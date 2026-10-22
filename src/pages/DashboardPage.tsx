import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Appointment, DailyTask, JournalEntry } from '../types';
import {
  Calendar,
  Sparkles,
  Activity,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Heart,
  ChevronRight,
  Sun,
  Shield,
  Smile,
  AlertCircle,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [recentJournal, setRecentJournal] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [apts, tks, jnl] = await Promise.all([
          api.getAppointments(),
          api.getDailyTasks(),
          api.getJournalEntries(),
        ]);
        setAppointments(apts);
        setTasks(tks);
        setRecentJournal(jnl.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );
      await api.toggleTask(taskId);
    } catch (err) {
      console.error('Failed to toggle task:', err);
      // Revert if error
      const tks = await api.getDailyTasks();
      setTasks(tks);
    }
  };

  const nextAppointment = appointments[0];
  const treatmentPlan = user?.treatmentPlan || {
    regimen: 'Paclitaxel & Carboplatin',
    currentCycle: 2,
    totalCycles: 6,
    startDate: '2026-09-14',
    nextDoseDate: '2026-10-28',
    oncologist: 'Dr. Saman Ali',
  };

  const cyclePercent = Math.round(
    ((treatmentPlan.currentCycle || 1) / (treatmentPlan.totalCycles || 6)) * 100
  );

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcoming Header Banner matching visual reference */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50/60 to-rose-50/40 rounded-3xl p-6 sm:p-8 border border-indigo-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Good Morning, {user?.name?.split(' ')[0] || 'Friend'}</span>
              <span className="text-amber-500">☀️</span>
            </h1>
          </div>
          <p className="text-sm text-slate-600 font-medium">
            {user?.role === 'doctor'
              ? 'Oncology Clinical Practice · 4 Consultations & Patient Agendas Scheduled Today'
              : user?.role === 'caregiver'
              ? 'Caregiver Companion for Areeba Khan · Supporting Cycle 2 Chemotherapy'
              : "You're doing great! Keep taking small steps."}
          </p>
        </div>

        {/* Quick supportive badge */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-white/90 rounded-full border border-slate-200/80 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>
              {user?.role === 'doctor'
                ? 'Comprehensive Cancer Center · Clinic Room 4B'
                : user?.role === 'caregiver'
                ? 'Authorized Delegate for Areeba Khan'
                : `Cycle ${treatmentPlan.currentCycle} of ${treatmentPlan.totalCycles} Chemotherapy`}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Metric & Core Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Appointment Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {user?.role === 'doctor' ? 'Next Patient Visit' : 'Next Appointment'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>

            {nextAppointment ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {user?.role === 'doctor' ? 'AK' : nextAppointment.doctor?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {user?.role === 'doctor' ? 'Areeba Khan (Patient)' : nextAppointment.doctor}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {user?.role === 'doctor' ? 'Chemotherapy Cycle 2 Review' : nextAppointment.specialty}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>{nextAppointment.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {nextAppointment.date} · {nextAppointment.time}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                No upcoming appointments booked.
              </div>
            )}
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigate('doctor-visit-prep')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              {user?.role === 'doctor' ? 'Review Patient Agenda →' : 'Prepare for Visit →'}
            </button>
            <button
              onClick={() => onNavigate('care-planner')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              View Details
            </button>
          </div>
        </div>

        {/* Treatment Progress / Active Cases Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {user?.role === 'doctor' ? 'Clinic Regimen Status' : 'Treatment Progress'}
              </span>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">
                Chemotherapy
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-lg font-bold text-slate-900">
                    {user?.role === 'doctor'
                      ? '4 Active Regimens Today'
                      : user?.role === 'caregiver'
                      ? `Areeba: Cycle ${treatmentPlan.currentCycle} of ${treatmentPlan.totalCycles}`
                      : `Cycle ${treatmentPlan.currentCycle} of ${treatmentPlan.totalCycles}`}
                  </span>
                  <span className="text-sm font-bold text-indigo-600">{cyclePercent}%</span>
                </div>
                <p className="text-xs text-slate-500">
                  {user?.role === 'doctor' ? 'Lead Regimen: Paclitaxel & Carboplatin' : treatmentPlan.regimen}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-rose-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${cyclePercent}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 block uppercase">
                    {user?.role === 'doctor' ? 'Patient Started' : 'Started'}
                  </span>
                  <span className="font-semibold text-slate-800">{treatmentPlan.startDate}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 block uppercase">Next Dose</span>
                  <span className="font-semibold text-indigo-700">{treatmentPlan.nextDoseDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigate('care-planner')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              {user?.role === 'doctor' ? 'View Patient Schedules →' : 'View Plan →'}
            </button>
            <span className="text-[11px] text-slate-400">Milestone 2</span>
          </div>
        </div>

        {/* Daily Tasks Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Daily Tasks
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {tasks.filter((t) => t.completed).length}/{tasks.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-colors ${
                    task.completed
                      ? 'bg-emerald-50/60 text-slate-500 line-through'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border transition-colors ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className="truncate flex-1">{task.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigate('care-planner')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Manage Tasks
            </button>
            <span className="text-[11px] text-slate-400">Today</span>
          </div>
        </div>
      </div>

      {/* 3. Reassurance & AI Assistant Card matching visual reference */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50/70 to-rose-50/50 rounded-3xl p-6 sm:p-8 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
            <Sparkles className="w-4 h-4" />
            <span>Supportive Companion</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            You're not alone
          </h2>
          <p className="text-slate-600 text-sm max-w-lg leading-relaxed">
            We're here for you, always. Ask our clinical guidance assistant about managing chemotherapy side effects, nutrition tips, or scan preparation.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('ai-assistant')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Chat with AI Assistant</span>
          </button>
        </div>
      </div>

      {/* 4. Recent Journal Observations & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Journal entries */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Symptom Logs</h3>
              <p className="text-xs text-slate-500">Your recent observations shared with your care team</p>
            </div>
            <button
              onClick={() => onNavigate('symptom-journal')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>+ Add Entry</span>
            </button>
          </div>

          <div className="space-y-3">
            {recentJournal.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-indigo-200 transition-all flex items-start justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-900">{entry.date}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-indigo-600 capitalize">
                      Mood: {entry.mood}
                    </span>
                    <span className="text-[11px] bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                      Severity: {entry.severity}/10
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">{entry.notes || 'No extra notes recorded.'}</p>
                  {entry.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {entry.symptoms.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Quick Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('doctor-visit-prep')}
                className="w-full p-3 rounded-xl bg-teal-50/70 hover:bg-teal-50 border border-teal-100 text-left flex items-center justify-between text-xs font-bold text-teal-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" /> Prepare Doctor Visit Summary
                </span>
                <ChevronRight className="w-4 h-4 text-teal-400" />
              </button>

              <button
                onClick={() => onNavigate('care-planner')}
                className="w-full p-3 rounded-xl bg-indigo-50/70 hover:bg-indigo-50 border border-indigo-100 text-left flex items-center justify-between text-xs font-bold text-indigo-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" /> Schedule New Appointment
                </span>
                <ChevronRight className="w-4 h-4 text-indigo-400" />
              </button>

              <button
                onClick={() => onNavigate('caregiver-access')}
                className="w-full p-3 rounded-xl bg-purple-50/70 hover:bg-purple-50 border border-purple-100 text-left flex items-center justify-between text-xs font-bold text-purple-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-purple-600" /> Manage Caregiver Access
                </span>
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </button>
            </div>
          </div>

          {/* Urgent Warning Reminder */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>When to call immediately</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              If your temperature reaches &ge; 100.4&deg;F (38.0&deg;C), or you have severe pain, call your 24/7 oncology triage line directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
