import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ContactFAQPage } from './pages/ContactFAQPage';

// Workspace / Protected Pages
import { DashboardPage } from './pages/DashboardPage';
import { CarePlannerPage } from './pages/CarePlannerPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { SymptomJournalPage } from './pages/SymptomJournalPage';
import { DoctorVisitPrepPage } from './pages/DoctorVisitPrepPage';
import { CaregiverAccessPage } from './pages/CaregiverAccessPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { Shield, Sparkles, RefreshCw, X, Heart } from 'lucide-react';

function MainRouter() {
  const { user, isLoading, demoLogin } = useAuth();
  const { language } = useLanguage();

  // Initialize page from window hash or default to 'home'
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || 'home';
  };

  const [currentPage, setCurrentPage] = useState<string>(getInitialPage);

  // Sync hash with browser URL
  useEffect(() => {
    const handleHashChange = () => {
      const page = getInitialPage();
      setCurrentPage(page);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string) => {
    window.location.hash = `#/${page}`;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Protected workspace routes list
  const protectedPages = [
    'dashboard',
    'care-planner',
    'ai-assistant',
    'symptom-journal',
    'doctor-visit-prep',
    'appointments',
    'caregiver-access',
    'settings',
  ];

  // Route protection: if not logged in and accessing protected page, redirect to login
  useEffect(() => {
    if (!isLoading && !user && protectedPages.includes(currentPage)) {
      navigateTo('login');
    }
  }, [user, isLoading, currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white animate-pulse">
          <Heart className="w-6 h-6 fill-white" />
        </div>
        <p className="text-xs font-semibold text-slate-500">Loading CareBridge AI...</p>
      </div>
    );
  }

  // Determine page category
  const isWorkspacePage = user && protectedPages.includes(currentPage);
  const isAuthPage = ['login', 'signup', 'forgot-password', 'reset-password'].includes(currentPage);

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'about':
        return <AboutPage onNavigate={navigateTo} />;
      case 'how-it-works':
        return <HowItWorksPage onNavigate={navigateTo} />;
      case 'features':
        return <FeaturesPage onNavigate={navigateTo} />;
      case 'resources':
        return <ResourcesPage onNavigate={navigateTo} />;
      case 'contact':
        return <ContactFAQPage initialTab="contact" onNavigate={navigateTo} />;
      case 'faq':
        return <ContactFAQPage initialTab="faq" onNavigate={navigateTo} />;
      case 'privacy':
      case 'privacy-policy':
        return <ContactFAQPage initialTab="privacy" onNavigate={navigateTo} />;
      case 'terms':
      case 'terms-of-service':
        return <ContactFAQPage initialTab="terms" onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'signup':
        return <SignUpPage onNavigate={navigateTo} />;
      case 'forgot-password':
      case 'reset-password':
        return <ForgotPasswordPage onNavigate={navigateTo} />;

      // Workspace pages
      case 'dashboard':
        return <DashboardPage onNavigate={navigateTo} />;
      case 'care-planner':
      case 'appointments':
        return <CarePlannerPage onNavigate={navigateTo} />;
      case 'ai-assistant':
        return <AIAssistantPage onNavigate={navigateTo} />;
      case 'symptom-journal':
        return <SymptomJournalPage onNavigate={navigateTo} />;
      case 'doctor-visit-prep':
        return <DoctorVisitPrepPage onNavigate={navigateTo} />;
      case 'caregiver-access':
        return <CaregiverAccessPage onNavigate={navigateTo} />;
      case 'settings':
        return <SettingsPage onNavigate={navigateTo} />;
      default:
        return <NotFoundPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${language === 'ur' ? 'font-sans' : ''}`}>
      {isWorkspacePage ? (
        <AppLayout currentPage={currentPage} onNavigate={navigateTo}>
          {renderContent()}
        </AppLayout>
      ) : isAuthPage ? (
        <main className="min-h-screen flex flex-col justify-between">{renderContent()}</main>
      ) : (
        <>
          <Navbar currentPage={currentPage} onNavigate={navigateTo} />
          <main className="flex-1">{renderContent()}</main>
          <Footer onNavigate={navigateTo} />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </LanguageProvider>
  );
}
