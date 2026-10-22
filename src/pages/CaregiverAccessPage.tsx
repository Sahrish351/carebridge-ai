import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CaregiverPermission, User, Appointment, DailyTask } from '../types';
import {
  Users,
  Shield,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  Mail,
  UserCheck,
  AlertCircle,
  Eye,
  Edit2,
  Activity,
  Heart,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CaregiverAccessPageProps {
  onNavigate: (page: string) => void;
}

export const CaregiverAccessPage: React.FC<CaregiverAccessPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<CaregiverPermission[]>([]);
  const [sharedPatients, setSharedPatients] = useState<Array<{ patient: User; permission: CaregiverPermission }>>([]);
  const [sharedAppointments, setSharedAppointments] = useState<Appointment[]>([]);
  const [sharedTasks, setSharedTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [caregiverEmail, setCaregiverEmail] = useState('');
  const [caregiverName, setCaregiverName] = useState('');
  const [canViewApts, setCanViewApts] = useState(true);
  const [canEditApts, setCanEditApts] = useState(true);
  const [canViewJournal, setCanViewJournal] = useState(true);
  const [canViewTasks, setCanViewTasks] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      if (user?.role === 'caregiver') {
        const patients = await api.getSharedPatients();
        setSharedPatients(patients);
        const [apts, tks] = await Promise.all([
          api.getAppointments(),
          api.getDailyTasks(),
        ]);
        setSharedAppointments(apts);
        setSharedTasks(tks);
      } else {
        const perms = await api.getCaregiverPermissions();
        setPermissions(perms);
      }
    } catch (err) {
      console.error('Failed to load caregiver permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caregiverEmail) {
      setErrorMsg('Please enter an email address.');
      return;
    }

    try {
      setErrorMsg('');
      await api.inviteCaregiver({
        caregiverEmail,
        caregiverName: caregiverName || caregiverEmail.split('@')[0],
        permissions: {
          canViewAppointments: canViewApts,
          canEditAppointments: canEditApts,
          canViewJournal: canViewJournal,
          canViewTasks: canViewTasks,
        },
      });

      setSuccessMsg('Caregiver invitation and consent record created.');
      setInviteModalOpen(false);
      setCaregiverEmail('');
      setCaregiverName('');
      await loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to grant caregiver permission.');
    }
  };

  const handleRevoke = async (permId: string) => {
    if (window.confirm('Are you sure you want to revoke this caregiver’s access immediately?')) {
      try {
        await api.revokeCaregiver(permId);
        await loadData();
        setSuccessMsg('Access revoked successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to revoke permission.');
      }
    }
  };

  if (user?.role === 'caregiver') {
    const activePatient = sharedPatients[0]?.patient;
    const permission = sharedPatients[0]?.permission;

    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              <span>Caregiver Companion Portal</span>
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Caregiver Mode
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Viewing shared care schedules and practical support tasks for your authorized patient.
          </p>
        </div>
        {activePatient ? (
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-rose-50/50 rounded-3xl p-6 sm:p-8 border border-purple-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                {activePatient.name.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block">
                  Authorized Patient
                </span>
                <h2 className="text-xl font-bold text-slate-900">{activePatient.name}</h2>
                <p className="text-xs text-slate-500">
                  {activePatient.treatmentPlan?.regimen || 'Paclitaxel & Carboplatin'} · Cycle {activePatient.treatmentPlan?.currentCycle || 2} of {activePatient.treatmentPlan?.totalCycles || 6}
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 bg-white/90 border border-slate-200 rounded-xl text-xs text-emerald-700 font-bold flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Explicit Consent Granted</span>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Patient Has Authorized Access Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When a patient invites you with your email ({user.email}), their authorized appointments and reminders will display here.
            </p>
          </div>
        )}
        {activePatient && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Authorized Upcoming Visits</span>
                </h3>
                <span className="text-xs text-slate-400">{sharedAppointments.length} items</span>
              </div>

              <div className="space-y-3">
                {sharedAppointments.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-900">{apt.title}</p>
                    <p className="text-slate-600">{apt.doctor} · {apt.specialty}</p>
                    <div className="flex items-center gap-2 text-[11px] text-indigo-600 font-semibold pt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{apt.date} at {apt.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Caregiver Assistance Checklist</span>
                </h3>
                <span className="text-xs text-slate-400">Support Goals</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-center gap-2 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Provide transport to Outpatient Oncology (Oct 28, 10:00 AM)</span>
                </div>
                <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-2 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Ensure gentle hydration drinks are chilled in the refrigerator</span>
                </div>
                <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-center gap-2 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Help review Doctor Visit preparation agenda questions</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('doctor-visit-prep')}
                className="w-full mt-2 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs transition-colors"
              >
                View Patient’s Visit Preparation Agenda →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Caregiver Access & Permissions</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Share your care schedule and observations with loved ones, strictly on your terms.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg('');
            setInviteModalOpen(true);
          }}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Caregiver</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      <div className="p-5 bg-gradient-to-r from-purple-50 via-indigo-50 to-rose-50 rounded-3xl border border-indigo-100 space-y-2 text-xs text-slate-700">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Shield className="w-4 h-4 text-indigo-600" />
          <span>Patient-Controlled Privacy Guarantee</span>
        </div>
        <p className="leading-relaxed">
          Caregivers never automatically gain access to your medical notes or symptom observations. You choose exactly what categories they can view or edit, and you can revoke access at any second.
        </p>
      </div>
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Active Authorized Caregivers</h2>
          <span className="text-xs text-slate-400 font-medium">
            {permissions.filter((p) => p.status === 'active').length} Active
          </span>
        </div>

        <div className="space-y-4">
          {permissions.map((perm) => {
            const isActive = perm.status === 'active';
            return (
              <div
                key={perm.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-100/60 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      {perm.caregiverName?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{perm.caregiverName}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isActive ? 'Active Authorization' : 'Revoked'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{perm.caregiverEmail}</p>
                    </div>
                  </div>

                  {isActive && (
                    <button
                      onClick={() => handleRevoke(perm.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors self-start sm:self-center"
                    >
                      Revoke Access
                    </button>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <span
                    className={`flex items-center gap-1 ${
                      perm.permissions.canViewAppointments ? 'text-indigo-700 font-semibold' : 'text-slate-400 line-through'
                    }`}
                  >
                    ✓ View Appointments
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      perm.permissions.canEditAppointments ? 'text-indigo-700 font-semibold' : 'text-slate-400 line-through'
                    }`}
                  >
                    ✓ Add Appointments
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      perm.permissions.canViewJournal ? 'text-indigo-700 font-semibold' : 'text-slate-400 line-through'
                    }`}
                  >
                    ✓ View Symptom Logs
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      perm.permissions.canViewTasks ? 'text-indigo-700 font-semibold' : 'text-slate-400 line-through'
                    }`}
                  >
                    ✓ Daily Tasks
                  </span>
                </div>
              </div>
            );
          })}

          {permissions.length === 0 && !loading && (
            <div className="text-center py-8 text-xs text-slate-400">
              No caregivers authorized yet. Click "Invite Caregiver" to authorize a trusted person.
            </div>
          )}
        </div>
      </div>
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative space-y-4">
            <button
              onClick={() => setInviteModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <AlertCircle className="hidden" />
              <span className="text-xl leading-none">&times;</span>
            </button>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 pr-6">Authorize a Caregiver</h3>
            <p className="text-xs text-slate-500">
              Grant a family member or trusted advocate permission to assist in your care coordination.
            </p>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Caregiver Name</label>
                <input
                  type="text"
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  placeholder="e.g. Tariq Khan"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Caregiver Email</label>
                <input
                  type="email"
                  value={caregiverEmail}
                  onChange={(e) => setCaregiverEmail(e.target.value)}
                  placeholder="tariq@example.com"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 block">Permissions Scope</span>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={canViewApts}
                    onChange={(e) => setCanViewApts(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span>Can view upcoming appointments and treatment plan</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={canEditApts}
                    onChange={(e) => setCanEditApts(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span>Can schedule or update appointments</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={canViewJournal}
                    onChange={(e) => setCanViewJournal(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span>Can view symptom journal logs</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={canViewTasks}
                    onChange={(e) => setCanViewTasks(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span>Can manage daily hydration and medication checklist</span>
                </label>
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs text-center cursor-pointer"
                >
                  Confirm Authorization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
