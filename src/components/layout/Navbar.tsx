import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Menu,
  X,
  Heart,
  User as UserIcon,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Settings,
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <>
      {/* 1. Single Slim Hackathon Announcement Strip (Dismissible) */}
      {!announcementDismissed && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white text-[11px] font-medium py-1.5 px-4 flex items-center justify-between z-50">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/20 font-bold tracking-wider text-[10px] uppercase">
                CodeTheCure 2026
              </span>
              <span className="hidden sm:inline text-indigo-100">
                Patient Experience & Support · CareBridge AI Digital Companion
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Language toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold transition-colors"
                title="Switch Language"
              >
                {language === 'en' ? 'اردو' : 'English'}
              </button>

              {/* Dismiss Button */}
              <button
                onClick={() => setAnnouncementDismissed(true)}
                className="p-0.5 text-indigo-200 hover:text-white transition-colors"
                title="Dismiss announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
          {/* CareBridge AI Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-400 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
                <Heart className="w-5 h-5 fill-white/90" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                  CareBridge <span className="text-indigo-600">AI</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5">Cancer Care Companion</span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors whitespace-nowrap hover:text-indigo-600 ${
                currentPage === 'home' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('features')}
              className={`transition-colors whitespace-nowrap hover:text-indigo-600 ${
                currentPage === 'features' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`transition-colors whitespace-nowrap hover:text-indigo-600 ${
                currentPage === 'how-it-works' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`transition-colors whitespace-nowrap hover:text-indigo-600 ${
                currentPage === 'about' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('resources')}
              className={`transition-colors whitespace-nowrap hover:text-indigo-600 ${
                currentPage === 'resources' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors whitespace-nowrap hover:text-indigo-600 ${
                currentPage === 'contact' ? 'text-indigo-600 font-bold' : ''
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Actions: Sign In & Get Started OR User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 text-sm font-medium text-slate-700 bg-indigo-50/70 hover:bg-indigo-50 border border-indigo-100 rounded-full transition-colors"
                >
                  <span className="max-w-[120px] truncate font-semibold">{user.name}</span>
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[11px] text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <span className="inline-block mt-0.5 text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {user.role}
                      </span>
                    </div>
                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Patient Dashboard
                    </button>
                    <button
                      onClick={() => handleNavClick('settings')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Settings & Privacy
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={async () => {
                        await logout();
                        handleNavClick('home');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors whitespace-nowrap"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-left px-3 py-2 rounded-lg hover:bg-indigo-50 ${
                  currentPage === 'home' ? 'text-indigo-600 font-bold bg-indigo-50/60' : ''
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('features')}
                className={`text-left px-3 py-2 rounded-lg hover:bg-indigo-50 ${
                  currentPage === 'features' ? 'text-indigo-600 font-bold bg-indigo-50/60' : ''
                }`}
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick('how-it-works')}
                className={`text-left px-3 py-2 rounded-lg hover:bg-indigo-50 ${
                  currentPage === 'how-it-works' ? 'text-indigo-600 font-bold bg-indigo-50/60' : ''
                }`}
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`text-left px-3 py-2 rounded-lg hover:bg-indigo-50 ${
                  currentPage === 'about' ? 'text-indigo-600 font-bold bg-indigo-50/60' : ''
                }`}
              >
                About
              </button>
              <button
                onClick={() => handleNavClick('resources')}
                className={`text-left px-3 py-2 rounded-lg hover:bg-indigo-50 ${
                  currentPage === 'resources' ? 'text-indigo-600 font-bold bg-indigo-50/60' : ''
                }`}
              >
                Resources
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className={`text-left px-3 py-2 rounded-lg hover:bg-indigo-50 ${
                  currentPage === 'contact' ? 'text-indigo-600 font-bold bg-indigo-50/60' : ''
                }`}
              >
                Contact
              </button>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full py-2.5 px-4 text-center text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                  >
                    Open Patient Dashboard
                  </button>
                  <button
                    onClick={async () => {
                      await logout();
                      handleNavClick('home');
                    }}
                    className="w-full py-2 text-center text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavClick('login')}
                    className="py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavClick('signup')}
                    className="py-2.5 text-center text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
