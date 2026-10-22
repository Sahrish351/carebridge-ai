import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: 'CareBridge AI',
    tagline: 'Your Cancer Journey, Made Easier',
    subTagline: 'An AI-powered companion for cancer patients, caregivers and healthcare support — because you’re not alone.',
    getStarted: 'Get Started',
    watchDemo: 'Watch Demo',
    exploreFeatures: 'Explore Features',
    dashboard: 'Dashboard',
    carePlanner: 'Care Planner',
    aiAssistant: 'AI Health Assistant',
    symptomJournal: 'Symptom Journal',
    doctorVisitPrep: 'Doctor Visit Prep',
    appointments: 'Appointments',
    resources: 'Trusted Resources',
    caregivers: 'Caregiver Access',
    settings: 'Settings',
    logout: 'Log Out',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    welcomeBack: 'Welcome Back',
    goodMorning: 'Good Morning',
    treatmentProgress: 'Treatment Progress',
    nextAppointment: 'Next Appointment',
    dailyTasks: 'Daily Tasks',
    notAloneTitle: "You're not alone",
    notAloneText: "We're here for you, always. Ask questions, log observations, or plan your next step.",
    strongerTogether: 'Stronger Together ♡',
    togetherDifference: 'Together We Can Make a Difference ♡',
  },
  ur: {
    appName: 'کیئر برج اے آئی',
    tagline: 'کینسر کے سفر میں آپ کا ہمدرد ساتھی',
    subTagline: 'کینسر کے مریضوں، تیمارداروں اور نگہداشت کے لیے جدید و محفوظ ساتھی — کیونکہ آپ اکیلے نہیں ہیں۔',
    getStarted: 'شروع کریں',
    watchDemo: 'ڈیمو دیکھیں',
    exploreFeatures: 'خصوصیات دیکھیں',
    dashboard: 'ڈیش بورڈ',
    carePlanner: 'علاج و نگہداشت کا منصوبہ',
    aiAssistant: 'اے آئی ہیلتھ اسسٹنٹ',
    symptomJournal: 'علامات کا روزنامچہ',
    doctorVisitPrep: 'ڈاکٹر ملاقات کی تیاری',
    appointments: 'ملاقاتیں (اپائنٹمنٹس)',
    resources: 'معتبر طبی ذرائع',
    caregivers: 'تیمارداروں کی رسائی',
    settings: 'ترتیبات',
    logout: 'لاگ آؤٹ',
    signIn: 'لاگ ان کریں',
    signUp: 'نیا اکاؤنٹ بنائیں',
    welcomeBack: 'خوش آمدید',
    goodMorning: 'صبح بخیر',
    treatmentProgress: 'علاج کی پیش رفت',
    nextAppointment: 'اگلی ملاقات',
    dailyTasks: 'روزمرہ کے کام',
    notAloneTitle: 'آپ اکیلے نہیں ہیں',
    notAloneText: 'ہم ہر قدم پر آپ کے ساتھ ہیں۔ سوال پوچھیں، علامات درج کریں یا اگلی ملاقات تیار کریں۔',
    strongerTogether: 'ایک ساتھ ہم زیادہ مضبوط ہیں ♡',
    togetherDifference: 'ہم مل کر فرق پیدا کر سکتے ہیں ♡',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('cb_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cb_lang', lang);
    if (lang === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  useEffect(() => {
    if (language === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
