import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'patient' | 'caregiver' | 'doctor';
  language: 'en' | 'ur';
  accessibility: {
    highContrast: boolean;
    fontSize: 'normal' | 'large';
    reducedMotion: boolean;
  };
  treatmentPlan: {
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

export interface Session {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

export interface Appointment {
  id: string;
  userId: string;
  title: string;
  doctor: string;
  specialty: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  location: string;
  type: 'oncology' | 'blood_test' | 'infusion' | 'consultation' | 'imaging';
  notes: string;
  reminder: boolean;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  symptoms: string[];
  severity: number; // 1-10
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

export interface PasswordResetToken {
  token: string;
  email: string;
  expiresAt: number;
}

interface DatabaseSchema {
  users: User[];
  sessions: Session[];
  appointments: Appointment[];
  journalEntries: JournalEntry[];
  dailyTasks: DailyTask[];
  caregiverPermissions: CaregiverPermission[];
  chatSessions: ChatSession[];
  visitSummaries: VisitSummary[];
  passwordResetTokens: PasswordResetToken[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'carebridge.json');

function hashPassword(password: string): string {
  const salt = 'carebridge_cure_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Initial seed data reflecting the exact patient profile and records from the visual reference
function getInitialSeedData(): DatabaseSchema {
  const defaultPw = hashPassword('password123');

  const areeba: User = {
    id: 'user_areeba_khan',
    email: 'areeba@example.com',
    passwordHash: defaultPw,
    name: 'Areeba Khan',
    role: 'patient',
    language: 'en',
    accessibility: {
      highContrast: false,
      fontSize: 'normal',
      reducedMotion: false,
    },
    treatmentPlan: {
      regimen: 'Paclitaxel & Carboplatin',
      currentCycle: 2,
      totalCycles: 6,
      startDate: '2026-09-14',
      nextDoseDate: '2026-10-28',
      oncologist: 'Dr. Saman Ali',
      clinic: 'Lahore Comprehensive Cancer Care Center',
      status: 'in_progress',
    },
    createdAt: '2026-09-01T08:00:00.000Z',
  };

  const caregiverUser: User = {
    id: 'user_tariq_khan',
    email: 'tariq@example.com',
    passwordHash: defaultPw,
    name: 'Tariq Khan',
    role: 'caregiver',
    language: 'en',
    accessibility: {
      highContrast: false,
      fontSize: 'normal',
      reducedMotion: false,
    },
    treatmentPlan: {
      regimen: '',
      currentCycle: 0,
      totalCycles: 0,
      startDate: '',
      nextDoseDate: '',
      oncologist: '',
      clinic: '',
      status: 'completed',
    },
    createdAt: '2026-09-02T10:00:00.000Z',
  };

  const doctorUser: User = {
    id: 'user_dr_saman',
    email: 'saman@example.com',
    passwordHash: defaultPw,
    name: 'Dr. Saman Ali',
    role: 'doctor',
    language: 'en',
    accessibility: {
      highContrast: false,
      fontSize: 'normal',
      reducedMotion: false,
    },
    treatmentPlan: {
      regimen: '',
      currentCycle: 0,
      totalCycles: 0,
      startDate: '',
      nextDoseDate: '',
      oncologist: '',
      clinic: 'Oncology Associates',
      status: 'completed',
    },
    createdAt: '2026-08-15T09:00:00.000Z',
  };

  const appointments: Appointment[] = [
    {
      id: 'apt_1',
      userId: 'user_areeba_khan',
      title: 'Cycle 2 Follow-up & Review',
      doctor: 'Dr. Saman Ali',
      specialty: 'Oncologist',
      date: '2026-10-28',
      time: '10:00 AM',
      location: 'Outpatient Oncology Clinic, Suite 402',
      type: 'oncology',
      notes: 'Review complete blood count, discuss mild nausea from current cycle, evaluate antiemetic response.',
      reminder: true,
      createdAt: '2026-10-15T10:00:00.000Z',
    },
    {
      id: 'apt_2',
      userId: 'user_areeba_khan',
      title: 'Routine Blood Test (CBC & CMP)',
      doctor: 'Lab Services',
      specialty: 'Pathology & Lab',
      date: '2026-11-04',
      time: '02:00 PM',
      location: 'Central Diagnostic Laboratory, 1st Floor',
      type: 'blood_test',
      notes: 'Pre-chemotherapy round 3 lab work. Fasting not required for this panel.',
      reminder: true,
      createdAt: '2026-10-18T11:00:00.000Z',
    },
    {
      id: 'apt_3',
      userId: 'user_areeba_khan',
      title: 'Follow-up Consultation',
      doctor: 'Dr. Saman Ali',
      specialty: 'Oncologist',
      date: '2026-11-11',
      time: '11:00 AM',
      location: 'Outpatient Oncology Clinic, Suite 402',
      type: 'consultation',
      notes: 'Review lab results before scheduling Cycle 3 infusion.',
      reminder: true,
      createdAt: '2026-10-18T11:30:00.000Z',
    },
  ];

  const journalEntries: JournalEntry[] = [
    {
      id: 'jnl_1',
      userId: 'user_areeba_khan',
      date: '2026-10-27',
      symptoms: ['Mild nausea', 'Low energy'],
      severity: 3,
      mood: 'okay',
      notes: 'Slight wave of nausea around noon after light breakfast. Took prescribed antiemetic and rested for an hour. Feeling steady this evening.',
      createdAt: '2026-10-27T17:30:00.000Z',
    },
    {
      id: 'jnl_2',
      userId: 'user_areeba_khan',
      date: '2026-10-25',
      symptoms: ['Slight headache'],
      severity: 2,
      mood: 'good',
      notes: 'Woke up with faint tension headache, drank warm herbal tea and hydrated well. Cleared up by lunchtime.',
      createdAt: '2026-10-25T14:15:00.000Z',
    },
    {
      id: 'jnl_3',
      userId: 'user_areeba_khan',
      date: '2026-10-23',
      symptoms: ['Fatigue'],
      severity: 2,
      mood: 'good',
      notes: 'Better today, noticeably less fatigue. Managed a gentle 15-minute garden walk with Tariq.',
      createdAt: '2026-10-23T16:00:00.000Z',
    },
    {
      id: 'jnl_4',
      userId: 'user_areeba_khan',
      date: '2026-10-20',
      symptoms: ['Mild tingling in fingers'],
      severity: 2,
      mood: 'okay',
      notes: 'Noticed slight peripheral tingling when holding cold drinks. Will mention this to Dr. Saman at next visit.',
      createdAt: '2026-10-20T19:00:00.000Z',
    },
  ];

  const todayStr = '2026-10-28';
  const dailyTasks: DailyTask[] = [
    {
      id: 'tsk_1',
      userId: 'user_areeba_khan',
      date: todayStr,
      title: 'Take prescribed medication (Morning dose)',
      category: 'medication',
      completed: true,
    },
    {
      id: 'tsk_2',
      userId: 'user_areeba_khan',
      date: todayStr,
      title: 'Drink water (Hydration goal: 2 liters)',
      category: 'hydration',
      completed: true,
    },
    {
      id: 'tsk_3',
      userId: 'user_areeba_khan',
      date: todayStr,
      title: 'Light exercise (10 min gentle breathing / walk)',
      category: 'exercise',
      completed: false,
    },
    {
      id: 'tsk_4',
      userId: 'user_areeba_khan',
      date: todayStr,
      title: 'Rest & relax (Afternoon 30-min recharge)',
      category: 'rest',
      completed: false,
    },
  ];

  const caregiverPermissions: CaregiverPermission[] = [
    {
      id: 'perm_1',
      patientUserId: 'user_areeba_khan',
      caregiverEmail: 'tariq@example.com',
      caregiverName: 'Tariq Khan',
      status: 'active',
      permissions: {
        canViewAppointments: true,
        canEditAppointments: true,
        canViewJournal: true,
        canViewTasks: true,
      },
      createdAt: '2026-09-10T12:00:00.000Z',
    },
  ];

  const chatSessions: ChatSession[] = [
    {
      id: 'chat_sample_1',
      userId: 'user_areeba_khan',
      title: 'Chemotherapy Side Effects & Management',
      createdAt: '2026-10-22T10:00:00.000Z',
      updatedAt: '2026-10-22T10:05:00.000Z',
      messages: [
        {
          id: 'msg_1',
          role: 'user',
          content: 'What are some side effects of chemotherapy and how can I manage them?',
          timestamp: '2026-10-22T10:00:00.000Z',
        },
        {
          id: 'msg_2',
          role: 'assistant',
          content: `Chemotherapy can cause side effects because it affects rapidly dividing cells, but they vary from person to person. Here are some common ones and evidence-based ways patients manage them:

1. **Nausea & Vomiting**
   - Take prescribed anti-nausea medications *before* meals or as scheduled, not just after nausea starts.
   - Eat small, frequent meals rather than large portions.
   - Stay hydrated with ginger tea, chilled broth, or diluted electrolyte drinks.

2. **Fatigue**
   - Rest when needed, but pace yourself with light activity (gentle 10-minute walks help maintain stamina).
   - Prioritize essential tasks and accept support from loved ones.
   - Maintain a balanced, protein-rich diet to support cellular recovery.

3. **Hair Loss or Thinning**
   - Use gentle, sulfate-free hair products and soft bristle brushes.
   - Protect your scalp with soft cotton scarves, beanies, or sun hats.
   - Consider discussing cold capping with your oncology team if eligible.

4. **Peripheral Neuropathy (Tingling in fingers/toes)**
   - Protect hands and feet from extreme temperatures (wear gloves when handling frozen foods).
   - Avoid tight shoes; report any numbness or balance changes promptly.`,
          sources: [
            {
              title: 'Chemotherapy Side Effects Management',
              url: 'https://www.mayoclinic.org/tests-procedures/chemotherapy/in-depth/chemotherapy-side-effects/art-20047335',
              organization: 'Mayo Clinic',
            },
            {
              title: 'Managing Chemotherapy Side Effects',
              url: 'https://www.cancer.org/treatment/treatments-and-side-effects/treatment-types/chemotherapy/chemotherapy-side-effects.html',
              organization: 'American Cancer Society',
            },
            {
              title: 'Cancer Support & Wellbeing Resources',
              url: 'https://www.cancerresearchuk.org/about-cancer/coping/physically/chemotherapy',
              organization: 'Cancer Research UK',
            },
          ],
          disclaimer: 'This information is for educational purposes only and should not replace professional medical advice. Always consult your oncology team for personalized guidance.',
          timestamp: '2026-10-22T10:05:00.000Z',
        },
      ],
    },
  ];

  const visitSummaries: VisitSummary[] = [
    {
      id: 'sum_1',
      userId: 'user_areeba_khan',
      appointmentId: 'apt_1',
      appointmentTitle: 'Cycle 2 Follow-up & Review',
      doctorName: 'Dr. Saman Ali (Oncologist)',
      appointmentDate: '2026-10-28',
      chiefConcerns: 'Checking blood counts following Cycle 2 and reviewing mild intermittent nausea.',
      symptomsSummary: 'Mild nausea recorded on Oct 27 (severity 3/10) managed with antiemetic; slight headache on Oct 25; mild tingling in fingers noted on Oct 20 when touching cold objects.',
      currentMedications: ['Paclitaxel (IV scheduled)', 'Ondansetron 8mg PRN', 'Dexamethasone pre-medication', 'Multivitamin'],
      questionsForDoctor: [
        'What are the next steps in my treatment plan?',
        'Are there any dietary changes or supplements I should consider for fatigue?',
        'What side effects should I specifically monitor after Cycle 2?',
        'When should I contact the on-call oncology team immediately versus waiting?',
        'Are my blood counts recovering adequately on this regimen?',
      ],
      patientNotes: 'Feeling emotionally supported by Tariq. Walking daily has helped with mood.',
      createdAt: '2026-10-27T20:00:00.000Z',
    },
  ];

  return {
    users: [areeba, caregiverUser, doctorUser],
    sessions: [],
    appointments,
    journalEntries,
    dailyTasks,
    caregiverPermissions,
    chatSessions,
    visitSummaries,
    passwordResetTokens: [],
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        return {
          users: parsed.users || [],
          sessions: parsed.sessions || [],
          appointments: parsed.appointments || [],
          journalEntries: parsed.journalEntries || [],
          dailyTasks: parsed.dailyTasks || [],
          caregiverPermissions: parsed.caregiverPermissions || [],
          chatSessions: parsed.chatSessions || [],
          visitSummaries: parsed.visitSummaries || [],
          passwordResetTokens: parsed.passwordResetTokens || [],
        };
      }
    } catch (err) {
      console.error('Error reading database file, initializing seed:', err);
    }

    const seed = getInitialSeedData();
    this.saveDataDirect(seed);
    return seed;
  }

  private saveDataDirect(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public save(): void {
    this.saveDataDirect(this.data);
  }

  // --- Users & Auth ---
  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(userData: {
    email: string;
    password: string;
    name: string;
    role: 'patient' | 'caregiver' | 'doctor';
  }): User {
    const existing = this.getUserByEmail(userData.email);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: userData.email.toLowerCase(),
      passwordHash: hashPassword(userData.password),
      name: userData.name,
      role: userData.role,
      language: 'en',
      accessibility: {
        highContrast: false,
        fontSize: 'normal',
        reducedMotion: false,
      },
      treatmentPlan: {
        regimen: userData.role === 'patient' ? 'Standard Oncology Care Plan' : '',
        currentCycle: userData.role === 'patient' ? 1 : 0,
        totalCycles: userData.role === 'patient' ? 6 : 0,
        startDate: new Date().toISOString().split('T')[0],
        nextDoseDate: '',
        oncologist: 'Dr. Saman Ali',
        clinic: 'Lahore Comprehensive Cancer Care Center',
        status: 'in_progress',
      },
      createdAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);

    // If patient, seed a couple of starter tasks
    if (newUser.role === 'patient') {
      const today = new Date().toISOString().split('T')[0];
      this.data.dailyTasks.push(
        {
          id: `tsk_${Date.now()}_1`,
          userId: newUser.id,
          date: today,
          title: 'Drink 2 liters of water & stay hydrated',
          category: 'hydration',
          completed: false,
        },
        {
          id: `tsk_${Date.now()}_2`,
          userId: newUser.id,
          date: today,
          title: '15-minute gentle walk or resting meditation',
          category: 'exercise',
          completed: false,
        }
      );
    }

    this.save();
    return newUser;
  }

  public verifyPassword(user: User, passwordAttempt: string): boolean {
    const hash = hashPassword(passwordAttempt);
    return user.passwordHash === hash;
  }

  public updateUser(id: string, updates: Partial<User>): User {
    const userIndex = this.data.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    this.data.users[userIndex] = {
      ...this.data.users[userIndex],
      ...updates,
    };
    this.save();
    return this.data.users[userIndex];
  }

  // --- Sessions ---
  public createSession(userId: string): Session {
    // 30 days session
    const token = crypto.randomBytes(32).toString('hex');
    const session: Session = {
      token,
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
    this.data.sessions.push(session);
    this.save();
    return session;
  }

  public getSession(token: string): Session | undefined {
    const session = this.data.sessions.find((s) => s.token === token);
    if (!session) return undefined;
    if (Date.now() > session.expiresAt) {
      this.deleteSession(token);
      return undefined;
    }
    return session;
  }

  public deleteSession(token: string): void {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }

  // --- Appointments ---
  public getAppointments(userId: string): Appointment[] {
    return this.data.appointments
      .filter((a) => a.userId === userId)
      .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());
  }

  public createAppointment(userId: string, data: Omit<Appointment, 'id' | 'userId' | 'createdAt'>): Appointment {
    const apt: Appointment = {
      id: `apt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.data.appointments.push(apt);
    this.save();
    return apt;
  }

  public updateAppointment(userId: string, aptId: string, data: Partial<Appointment>): Appointment {
    const index = this.data.appointments.findIndex((a) => a.id === aptId && a.userId === userId);
    if (index === -1) throw new Error('Appointment not found or unauthorized');
    this.data.appointments[index] = { ...this.data.appointments[index], ...data };
    this.save();
    return this.data.appointments[index];
  }

  public deleteAppointment(userId: string, aptId: string): void {
    const index = this.data.appointments.findIndex((a) => a.id === aptId && a.userId === userId);
    if (index === -1) throw new Error('Appointment not found or unauthorized');
    this.data.appointments.splice(index, 1);
    this.save();
  }

  // --- Symptom Journal ---
  public getJournalEntries(userId: string): JournalEntry[] {
    return this.data.journalEntries
      .filter((j) => j.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public createJournalEntry(userId: string, data: Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>): JournalEntry {
    const entry: JournalEntry = {
      id: `jnl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.data.journalEntries.push(entry);
    this.save();
    return entry;
  }

  public updateJournalEntry(userId: string, entryId: string, data: Partial<JournalEntry>): JournalEntry {
    const index = this.data.journalEntries.findIndex((j) => j.id === entryId && j.userId === userId);
    if (index === -1) throw new Error('Journal entry not found or unauthorized');
    this.data.journalEntries[index] = { ...this.data.journalEntries[index], ...data };
    this.save();
    return this.data.journalEntries[index];
  }

  public deleteJournalEntry(userId: string, entryId: string): void {
    const index = this.data.journalEntries.findIndex((j) => j.id === entryId && j.userId === userId);
    if (index === -1) throw new Error('Journal entry not found or unauthorized');
    this.data.journalEntries.splice(index, 1);
    this.save();
  }

  // --- Daily Tasks ---
  public getDailyTasks(userId: string, dateStr?: string): DailyTask[] {
    const date = dateStr || new Date().toISOString().split('T')[0];
    let tasks = this.data.dailyTasks.filter((t) => t.userId === userId && t.date === date);

    // If no tasks for today yet, generate default self-care checklist
    if (tasks.length === 0) {
      const defaults: Array<Omit<DailyTask, 'id' | 'userId' | 'date'>> = [
        { title: 'Take prescribed medication', category: 'medication', completed: false },
        { title: 'Drink water (Hydration goal: 2 liters)', category: 'hydration', completed: false },
        { title: 'Light exercise (Gentle stretching or 10-min walk)', category: 'exercise', completed: false },
        { title: 'Rest & relax (Mindful breathing or nap)', category: 'rest', completed: false },
      ];

      tasks = defaults.map((d, idx) => {
        const task: DailyTask = {
          id: `tsk_${Date.now()}_${idx}`,
          userId,
          date,
          ...d,
        };
        this.data.dailyTasks.push(task);
        return task;
      });
      this.save();
    }

    return tasks;
  }

  public toggleDailyTask(userId: string, taskId: string): DailyTask {
    const task = this.data.dailyTasks.find((t) => t.id === taskId && t.userId === userId);
    if (!task) throw new Error('Task not found');
    task.completed = !task.completed;
    this.save();
    return task;
  }

  public addDailyTask(userId: string, data: { title: string; category: DailyTask['category']; date?: string }): DailyTask {
    const date = data.date || new Date().toISOString().split('T')[0];
    const task: DailyTask = {
      id: `tsk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      date,
      title: data.title,
      category: data.category,
      completed: false,
    };
    this.data.dailyTasks.push(task);
    this.save();
    return task;
  }

  // --- Caregiver Permissions ---
  public getCaregiverPermissions(patientUserId: string): CaregiverPermission[] {
    return this.data.caregiverPermissions.filter((p) => p.patientUserId === patientUserId);
  }

  public getSharedPatientsForCaregiver(caregiverEmail: string): Array<{
    patient: Omit<User, 'passwordHash'>;
    permission: CaregiverPermission;
  }> {
    const perms = this.data.caregiverPermissions.filter(
      (p) => p.caregiverEmail.toLowerCase() === caregiverEmail.toLowerCase() && p.status === 'active'
    );

    const results: Array<{ patient: Omit<User, 'passwordHash'>; permission: CaregiverPermission }> = [];
    for (const p of perms) {
      const patient = this.getUserById(p.patientUserId);
      if (patient) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...safePatient } = patient;
        results.push({ patient: safePatient, permission: p });
      }
    }
    return results;
  }

  public addCaregiverPermission(
    patientUserId: string,
    data: { caregiverEmail: string; caregiverName: string; permissions: CaregiverPermission['permissions'] }
  ): CaregiverPermission {
    const existing = this.data.caregiverPermissions.find(
      (p) => p.patientUserId === patientUserId && p.caregiverEmail.toLowerCase() === data.caregiverEmail.toLowerCase()
    );

    if (existing) {
      existing.status = 'active';
      existing.permissions = data.permissions;
      this.save();
      return existing;
    }

    const perm: CaregiverPermission = {
      id: `perm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      patientUserId,
      caregiverEmail: data.caregiverEmail.toLowerCase(),
      caregiverName: data.caregiverName,
      status: 'active',
      permissions: data.permissions,
      createdAt: new Date().toISOString(),
    };
    this.data.caregiverPermissions.push(perm);
    this.save();
    return perm;
  }

  public revokeCaregiverPermission(patientUserId: string, permId: string): void {
    const perm = this.data.caregiverPermissions.find((p) => p.id === permId && p.patientUserId === patientUserId);
    if (!perm) throw new Error('Permission not found');
    perm.status = 'revoked';
    this.save();
  }

  // --- Chat Sessions ---
  public getChatSessions(userId: string): ChatSession[] {
    return this.data.chatSessions
      .filter((c) => c.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getChatSessionById(userId: string, sessionId: string): ChatSession | undefined {
    return this.data.chatSessions.find((c) => c.id === sessionId && c.userId === userId);
  }

  public createChatSession(userId: string, title: string, initialMessage?: ChatMessage): ChatSession {
    const session: ChatSession = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title,
      messages: initialMessage ? [initialMessage] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.chatSessions.push(session);
    this.save();
    return session;
  }

  public addChatMessage(userId: string, sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    const session = this.getChatSessionById(userId, sessionId);
    if (!session) throw new Error('Chat session not found');

    const fullMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...message,
      timestamp: new Date().toISOString(),
    };

    session.messages.push(fullMessage);
    session.updatedAt = new Date().toISOString();
    this.save();
    return fullMessage;
  }

  public clearChatSession(userId: string, sessionId: string): void {
    const session = this.getChatSessionById(userId, sessionId);
    if (!session) throw new Error('Chat session not found');
    session.messages = [];
    session.updatedAt = new Date().toISOString();
    this.save();
  }

  // --- Visit Summaries ---
  public getVisitSummaries(userId: string): VisitSummary[] {
    return this.data.visitSummaries
      .filter((s) => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createVisitSummary(userId: string, data: Omit<VisitSummary, 'id' | 'userId' | 'createdAt'>): VisitSummary {
    const sum: VisitSummary = {
      id: `sum_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.data.visitSummaries.push(sum);
    this.save();
    return sum;
  }

  public deleteVisitSummary(userId: string, summaryId: string): void {
    const index = this.data.visitSummaries.findIndex((s) => s.id === summaryId && s.userId === userId);
    if (index === -1) throw new Error('Summary not found');
    this.data.visitSummaries.splice(index, 1);
    this.save();
  }

  // --- Password Reset ---
  public createPasswordResetToken(email: string): string {
    const token = crypto.randomBytes(24).toString('hex');
    this.data.passwordResetTokens = this.data.passwordResetTokens.filter((t) => t.email.toLowerCase() !== email.toLowerCase());
    this.data.passwordResetTokens.push({
      token,
      email: email.toLowerCase(),
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    });
    this.save();
    return token;
  }

  public resetPasswordWithToken(token: string, newPassword: string): boolean {
    const item = this.data.passwordResetTokens.find((t) => t.token === token);
    if (!item || Date.now() > item.expiresAt) {
      return false;
    }
    const user = this.getUserByEmail(item.email);
    if (!user) return false;

    user.passwordHash = hashPassword(newPassword);
    this.data.passwordResetTokens = this.data.passwordResetTokens.filter((t) => t.token !== token);
    this.save();
    return true;
  }

  // --- Data Purge / Delete Account ---
  public deleteUserData(userId: string): void {
    this.data.appointments = this.data.appointments.filter((a) => a.userId !== userId);
    this.data.journalEntries = this.data.journalEntries.filter((j) => j.userId !== userId);
    this.data.dailyTasks = this.data.dailyTasks.filter((t) => t.userId !== userId);
    this.data.caregiverPermissions = this.data.caregiverPermissions.filter((p) => p.patientUserId !== userId);
    this.data.chatSessions = this.data.chatSessions.filter((c) => c.userId !== userId);
    this.data.visitSummaries = this.data.visitSummaries.filter((s) => s.userId !== userId);
    this.data.sessions = this.data.sessions.filter((s) => s.userId !== userId);
    this.data.users = this.data.users.filter((u) => u.id !== userId);
    this.save();
  }
}

export const db = new Database();
