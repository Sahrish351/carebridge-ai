import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Activity,
  FileText,
  CalendarDays,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Heart,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface AppLayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ currentPage, onNavigate, children }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const getNavItems = () => {
    switch (user?.role) {
      case 'caregiver':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'care-planner', label: 'Care Planner', icon: Calendar },
          { id: 'appointments', label: 'Appointments', icon: CalendarDays },
          { id: 'doctor-visit-prep', label: 'Doctor Visit Prep', icon: FileText },
          { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles },
          { id: 'caregiver-access', label: 'Care Recipient Access', icon: Users },
          { id: 'resources', label: 'Resources', icon: BookOpen },
        ];
      case 'doctor':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'doctor-visit-prep', label: 'Patient Summaries', icon: FileText },
          { id: 'appointments', label: 'Appointments Schedule', icon: CalendarDays },
          { id: 'ai-assistant', label: 'Evidence Assistant', icon: Sparkles },
          { id: 'resources', label: 'Oncology Guidelines', icon: BookOpen },
        ];
      case 'patient':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'care-planner', label: 'Care Planner', icon: Calendar },
          { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles },
          { id: 'symptom-journal', label: 'Symptom Journal', icon: Activity },
          { id: 'doctor-visit-prep', label: 'Doctor Visit Prep', icon: FileText },
          { id: 'appointments', label: 'Appointments', icon: CalendarDays },
          { id: 'caregiver-access', label: 'Caregivers', icon: Users },
          { id: 'resources', label: 'Resources', icon: BookOpen },
        ];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out of your session?')) {
      await logout();
      onNavigate('home');
    }
  };

  return (
    <div className="h-screen w-full bg-[#F8FAFD] flex flex-col md:flex-row overflow-hidden font-sans">
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shrink-0">
        <button
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <span className="font-bold text-slate-900 text-base">CareBridge AI</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded cursor-pointer"
          >
            {language === 'en' ? 'اردو' : 'EN'}
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col h-full transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static shrink-0 select-none ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-400 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Heart className="w-4.5 h-4.5 fill-white/90" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight block leading-none">
                CareBridge <span className="text-indigo-600">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block mt-1">
                {user?.role === 'doctor'
                  ? 'Clinician Portal'
                  : user?.role === 'caregiver'
                  ? 'Caregiver Companion'
                  : 'Patient Workspace'}
              </span>
            </div>
          </button>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {user && (
          <div className="px-3 pt-3 shrink-0">
            <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">{user.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-indigo-600 capitalize font-semibold">
                    {user.role === 'doctor' ? 'Oncologist' : user.role === 'caregiver' ? 'Caregiver' : 'Patient'}
                  </span>
                  {user.role === 'patient' && (
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-medium">
                      Cycle {user.treatmentPlan?.currentCycle || 2}/{user.treatmentPlan?.totalCycles || 6}
                    </span>
                  )}
                  {user.role === 'caregiver' && (
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded font-medium">
                      For Areeba K.
                    </span>
                  )}
                  {user.role === 'doctor' && (
                    <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.2 rounded font-medium">
                      Clinic 4B
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-200 shrink-0" />}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-3 border-t border-slate-100/90 bg-white shrink-0 space-y-1">
          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              currentPage === 'settings'
                ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Settings className={`w-4 h-4 shrink-0 ${currentPage === 'settings' ? 'text-white' : 'text-slate-400'}`} />
            <span>Settings</span>
            {currentPage === 'settings' && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-200 shrink-0" />}
          </button>
          <button
            onClick={handleLogout}
            className="w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 transition-colors cursor-pointer group"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors shrink-0" />
            <span>Log Out</span>
          </button>
          <div className="pt-2 px-1 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-slate-500">
              <Shield className="w-3 h-3 text-indigo-500 shrink-0" />
              <span className="capitalize">{user?.role || 'Patient'} Session</span>
            </span>
            <span>CodeTheCure 2026</span>
          </div>
        </div>
      </aside>
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 md:hidden"
        />
      )}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200/90 px-8 items-center justify-between sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-indigo-600 font-medium">
              {user?.role === 'patient'
                ? `Treatment Regimen: ${user.treatmentPlan?.regimen || 'Paclitaxel & Carboplatin'}`
                : user?.role === 'caregiver'
                ? 'Caregiver Companion · Patient: Areeba Khan'
                : 'Oncology Care Portal · Dr. Saman Ali'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {language === 'en' ? 'اردو میں دیکھیں' : 'Switch to English'}
            </button>
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Care Reminders
                    </span>
                    <span className="text-[11px] text-indigo-600 font-medium">2 Active</span>
                  </div>
                  <div className="py-2 space-y-2.5">
                    <div className="p-2.5 bg-indigo-50/60 rounded-lg">
                      <p className="text-xs font-semibold text-slate-900">Upcoming Visit with Dr. Saman Ali</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Cycle 2 Review on Oct 28 at 10:00 AM</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <p className="text-xs font-semibold text-slate-900">Afternoon Hydration Goal</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Remember to sip water and herbal tea</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      onNavigate('doctor-visit-prep');
                    }}
                    className="w-full mt-2 py-1.5 text-center text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Prepare for Doctor Visit →
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => onNavigate('about')}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              title="How It Works"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
