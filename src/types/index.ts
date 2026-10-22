export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'caregiver' | 'doctor';
  language: 'en' | 'ur';
  accessibility: {
    highContrast: boolean;
    fontSize: 'normal' | 'large';
    reducedMotion: boolean;
  };
  treatmentPlan?: {
    regimen: string;
    currentCycle: number;
    totalCycles: number;
    startDate: string;
    nextDoseDate: string;
    oncologist: string;
    clinic: string;
    status: 'in_progress' | 'completed' | 'paused';
  };
  createdAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  title: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  type: 'oncology' | 'blood_test' | 'infusion' | 'consultation' | 'imaging';
  notes: string;
  reminder: boolean;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  symptoms: string[];
  severity: number;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'very_bad';
  notes: string;
  createdAt: string;
}

export interface DailyTask {
  id: string;
  userId: string;
  date: string;
  title: string;
  category: 'medication' | 'hydration' | 'exercise' | 'rest' | 'nutrition';
  completed: boolean;
}

export interface CaregiverPermission {
  id: string;
  patientUserId: string;
  caregiverEmail: string;
  caregiverName: string;
  status: 'active' | 'pending' | 'revoked';
  permissions: {
    canViewAppointments: boolean;
    canEditAppointments: boolean;
    canViewJournal: boolean;
    canViewTasks: boolean;
  };
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    url: string;
    organization: string;
  }>;
  disclaimer?: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface VisitSummary {
  id: string;
  userId: string;
  appointmentId: string;
  appointmentTitle: string;
  doctorName: string;
  appointmentDate: string;
  chiefConcerns: string;
  symptomsSummary: string;
  currentMedications: string[];
  questionsForDoctor: string[];
  patientNotes: string;
  createdAt: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  organization: string;
  category: 'chemo' | 'nutrition' | 'emotional' | 'caregiver' | 'clinical';
  description: string;
  url: string;
  verifiedDate: string;
}
