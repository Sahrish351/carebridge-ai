import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Appointment } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileDown,
  Sparkles,
  X,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface CarePlannerPageProps {
  onNavigate: (page: string) => void;
}

export const CarePlannerPage: React.FC<CarePlannerPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'appointments' | 'treatment' | 'reminders'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number>(28);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);

  const [title, setTitle] = useState('');
  const [doctor, setDoctor] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [date, setDate] = useState('2026-10-28');
  const [time, setTime] = useState('10:00 AM');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<Appointment['type']>('oncology');
  const [notes, setNotes] = useState('');
  const [reminder, setReminder] = useState(true);
  const [formError, setFormError] = useState('');

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await api.getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const openAddModal = () => {
    setEditingApt(null);
    setTitle('');
    setDoctor('Dr. Saman Ali');
    setSpecialty('Oncologist');
    setDate(`2026-10-${selectedDay < 10 ? '0' + selectedDay : selectedDay}`);
    setTime('10:00 AM');
    setLocation('Outpatient Oncology Clinic, Suite 402');
    setType('oncology');
    setNotes('');
    setReminder(true);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (apt: Appointment) => {
    setEditingApt(apt);
    setTitle(apt.title);
    setDoctor(apt.doctor);
    setSpecialty(apt.specialty);
    setDate(apt.date);
    setTime(apt.time);
    setLocation(apt.location);
    setType(apt.type);
    setNotes(apt.notes);
    setReminder(apt.reminder);
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) {
      setFormError('Please enter a title, date, and time.');
      return;
    }

    try {
      if (editingApt) {
        await api.updateAppointment(editingApt.id, {
          title,
          doctor,
          specialty,
          date,
          time,
          location,
          type,
          notes,
          reminder,
        });
      } else {
        await api.createAppointment({
          title,
          doctor,
          specialty,
          date,
          time,
          location,
          type,
          notes,
          reminder,
        });
      }
      setModalOpen(false);
      await loadAppointments();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save appointment.');
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.deleteAppointment(id);
        await loadAppointments();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const treatmentPlan = user?.treatmentPlan || {
    regimen: 'Paclitaxel & Carboplatin',
    currentCycle: 2,
    totalCycles: 6,
    startDate: '2026-09-14',
    nextDoseDate: '2026-10-28',
    oncologist: 'Dr. Saman Ali',
  };

  const daysInOctober = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Care Planner
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your appointments, treatments and daily tasks.
          </p>
        </div>
        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'appointments'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('treatment')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'treatment'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Treatment Plan
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'reminders'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reminders
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-base font-bold text-slate-900">October 2026</span>
            <div className="flex items-center gap-1">
              <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            <span className="p-2 text-slate-300"></span>
            <span className="p-2 text-slate-300"></span>
            <span className="p-2 text-slate-300"></span>
            <span className="p-2 text-slate-300"></span>

            {daysInOctober.map((day) => {
              const hasApt = appointments.some(
                (a) => a.date === `2026-10-${day < 10 ? '0' + day : day}`
              );
              const isSelected = selectedDay === day;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative p-2 rounded-xl font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : hasApt
                      ? 'bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{day}</span>
                  {hasApt && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={openAddModal}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Appointment for Oct {selectedDay}</span>
            </button>
          </div>
        </div>
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Treatment Plan</h2>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Cycle {treatmentPlan.currentCycle} of {treatmentPlan.totalCycles}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-rose-400 h-2.5 rounded-full w-[33%]"></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Cycle 1</span>
                <span>Cycle 2 (Active)</span>
                <span>Cycle 6 Completion</span>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs pt-1">
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <p className="font-bold text-slate-900">Cycle 1</p>
                <p className="text-[10px] text-emerald-600 font-medium">Completed</p>
              </div>

              <div className="p-2.5 bg-indigo-50 rounded-xl border-2 border-indigo-400">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center mx-auto mb-1 font-bold">2</span>
                <p className="font-bold text-slate-900">Cycle 2</p>
                <p className="text-[10px] text-indigo-600 font-medium">In Progress</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 opacity-75">
                <span className="w-4 h-4 rounded-full bg-slate-300 text-white text-[10px] flex items-center justify-center mx-auto mb-1 font-bold">3</span>
                <p className="font-bold text-slate-700">Cycle 3</p>
                <p className="text-[10px] text-slate-400">Upcoming</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 opacity-60">
                <span className="w-4 h-4 rounded-full bg-slate-300 text-white text-[10px] flex items-center justify-center mx-auto mb-1 font-bold">4</span>
                <p className="font-bold text-slate-700">Cycle 4</p>
                <p className="text-[10px] text-slate-400">Upcoming</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 opacity-50">
                <span className="w-4 h-4 rounded-full bg-slate-300 text-white text-[10px] flex items-center justify-center mx-auto mb-1 font-bold">5</span>
                <p className="font-bold text-slate-700">Cycle 5</p>
                <p className="text-[10px] text-slate-400">Upcoming</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 opacity-50">
                <span className="w-4 h-4 rounded-full bg-slate-300 text-white text-[10px] flex items-center justify-center mx-auto mb-1 font-bold">6</span>
                <p className="font-bold text-slate-700">Cycle 6</p>
                <p className="text-[10px] text-slate-400">Upcoming</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Treatment Details
                </h4>
                <div>
                  <p className="text-sm font-bold text-slate-900">Chemotherapy</p>
                  <p className="text-xs text-slate-500">Medication: {treatmentPlan.regimen}</p>
                  <p className="text-xs text-indigo-600 font-medium mt-1">
                    Next Dose: {treatmentPlan.nextDoseDate}
                  </p>
                </div>
                <button
                  onClick={() => alert(`Regimen: ${treatmentPlan.regimen}\nOncologist: ${treatmentPlan.oncologist}\nStatus: In Progress`)}
                  className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  View Details →
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quick Actions
                </h4>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="w-full text-left py-1 text-slate-700 hover:text-indigo-600 font-semibold flex items-center justify-between"
                  >
                    <span>View Treatment Calendar</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => onNavigate('doctor-visit-prep')}
                    className="w-full text-left py-1 text-slate-700 hover:text-indigo-600 font-semibold flex items-center justify-between"
                  >
                    <span>Prepare Visit Summary</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => onNavigate('ai-assistant')}
                    className="w-full text-left py-1 text-indigo-600 hover:text-indigo-800 font-bold flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Ask AI About Treatment
                    </span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Upcoming Appointments</h3>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                <Plus className="w-4 h-4" /> Add Appointment
              </button>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                      <CalendarIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{apt.title}</h4>
                      <p className="text-xs text-slate-600">
                        {apt.doctor} · <span className="text-slate-400">{apt.specialty}</span>
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {apt.date} · {apt.time}
                        </span>
                        {apt.location && (
                          <span className="hidden sm:flex items-center gap-1 truncate max-w-xs">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {apt.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => openEditModal(apt)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(apt.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigate('doctor-visit-prep')}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      Prep Visit
                    </button>
                  </div>
                </div>
              ))}

              {appointments.length === 0 && !loading && (
                <div className="text-center py-8 text-xs text-slate-500">
                  No appointments scheduled. Click "Add Appointment" above to create one.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 pr-8">
              {editingApt ? 'Edit Appointment' : 'Schedule New Appointment'}
            </h3>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAppointment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Appointment Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cycle 2 Follow-up & Review"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doctor / Provider</label>
                  <input
                    type="text"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    placeholder="e.g. Dr. Saman Ali"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialty</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Oncologist"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="10:00 AM"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location / Clinic</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Outpatient Oncology Clinic, Suite 402"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Fasting required for CBC blood test; bring list of anti-nausea meds"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rem"
                  checked={reminder}
                  onChange={(e) => setReminder(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="rem" className="text-slate-600 font-medium">
                  Enable in-app care reminder
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
                >
                  {editingApt ? 'Update Appointment' : 'Save Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
