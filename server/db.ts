import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

export function hashPassword(password: string): string {
  const salt = 'carebridge_cure_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

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
          content: `Chemotherapy can cause side effects because it affects rapidly dividing cells, but they vary from person to person. Common ones include nausea, fatigue, and peripheral neuropathy. Always report persistent symptoms to your care team.`,
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
  private supabase: SupabaseClient | null = null;
  private isSupabaseEnabled: boolean = false;

  constructor() {
    this.data = this.loadData();
    this.initSupabase();
  }

  private initSupabase(): void {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && supabaseUrl !== 'MY_SUPABASE_URL') {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false },
        });
        this.isSupabaseEnabled = true;
        console.log('[CareBridge DB] Supabase client initialized:', supabaseUrl);
      } catch (err) {
        console.error('[CareBridge DB] Failed to initialize Supabase client:', err);
        this.supabase = null;
        this.isSupabaseEnabled = false;
      }
    } else {
      console.log('[CareBridge DB] Running with local transactional JSON storage engine.');
    }
  }

  public isUsingSupabase(): boolean {
    return this.isSupabaseEnabled && this.supabase !== null;
  }

  public async checkConnection(): Promise<{
    connected: boolean;
    storage: 'supabase' | 'local-json';
    message: string;
  }> {
    if (!this.supabase) {
      return {
        connected: true,
        storage: 'local-json',
        message: 'Operating with local JSON engine. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable cloud PostgreSQL.',
      };
    }

    try {
      const { data, error } = await this.supabase.from('users').select('id').limit(1);
      if (error) {
        return {
          connected: false,
          storage: 'supabase',
          message: `Supabase query error: ${error.message}. Please run the migration script in supabase/schema.sql.`,
        };
      }
      return {
        connected: true,
        storage: 'supabase',
        message: 'Connected to Supabase PostgreSQL successfully.',
      };
    } catch (err: any) {
      return {
        connected: false,
        storage: 'supabase',
        message: `Supabase connection error: ${err.message}`,
      };
    }
  }

  private loadData(): DatabaseSchema {
    try {
      const tmpFile = path.resolve(os.tmpdir(), 'carebridge-data', 'carebridge.json');
      if (fs.existsSync(tmpFile)) {
        const content = fs.readFileSync(tmpFile, 'utf-8');
        const parsed = JSON.parse(content);
        return this.sanitizeLoadedData(parsed);
      }

      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        return this.sanitizeLoadedData(parsed);
      }
    } catch (err) {
      console.warn('Notice: using initial seed data:', err);
    }

    const seed = getInitialSeedData();
    this.saveDataDirect(seed);
    return seed;
  }

  private sanitizeLoadedData(parsed: any): DatabaseSchema {
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

  private saveDataDirect(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      try {
        const tmpDir = path.resolve(os.tmpdir(), 'carebridge-data');
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir, { recursive: true });
        }
        fs.writeFileSync(path.join(tmpDir, 'carebridge.json'), JSON.stringify(data, null, 2), 'utf-8');
      } catch (tmpErr) {
      }
    }
  }

  public save(): void {
    this.saveDataDirect(this.data);
  }

  public async getUserByEmail(email: string): Promise<User | undefined> {
    const normalized = email.trim().toLowerCase();

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('users')
          .select('*')
          .ilike('email', normalized)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          return {
            id: data.id,
            email: data.email,
            passwordHash: data.password_hash,
            name: data.name,
            role: data.role,
            language: data.language || 'en',
            accessibility: data.accessibility || { highContrast: false, fontSize: 'normal', reducedMotion: false },
            treatmentPlan: data.treatment_plan || {
              regimen: '',
              currentCycle: 0,
              totalCycles: 0,
              startDate: '',
              nextDoseDate: '',
              oncologist: '',
              clinic: '',
              status: 'completed',
            },
            createdAt: data.created_at,
          };
        }
        return undefined;
      } catch (err) {
        console.warn('[Supabase] getUserByEmail failed, falling back to local memory:', err);
      }
    }

    return this.data.users.find((u) => u.email.toLowerCase() === normalized);
  }

  public async getUserById(id: string): Promise<User | undefined> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          return {
            id: data.id,
            email: data.email,
            passwordHash: data.password_hash,
            name: data.name,
            role: data.role,
            language: data.language || 'en',
            accessibility: data.accessibility || { highContrast: false, fontSize: 'normal', reducedMotion: false },
            treatmentPlan: data.treatment_plan || {
              regimen: '',
              currentCycle: 0,
              totalCycles: 0,
              startDate: '',
              nextDoseDate: '',
              oncologist: '',
              clinic: '',
              status: 'completed',
            },
            createdAt: data.created_at,
          };
        }
        return undefined;
      } catch (err) {
        console.warn('[Supabase] getUserById failed, falling back to local memory:', err);
      }
    }

    return this.data.users.find((u) => u.id === id);
  }

  public async createUser(userData: {
    email: string;
    password: string;
    name: string;
    role: 'patient' | 'caregiver' | 'doctor';
  }): Promise<User> {
    const existing = await this.getUserByEmail(userData.email);
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

    if (this.supabase) {
      try {
        const { error } = await this.supabase.from('users').insert({
          id: newUser.id,
          email: newUser.email,
          password_hash: newUser.passwordHash,
          name: newUser.name,
          role: newUser.role,
          language: newUser.language,
          accessibility: newUser.accessibility,
          treatment_plan: newUser.treatmentPlan,
          created_at: newUser.createdAt,
        });

        if (error) throw error;

        if (newUser.role === 'patient') {
          const today = new Date().toISOString().split('T')[0];
          await this.supabase.from('daily_tasks').insert([
            {
              id: `tsk_${Date.now()}_1`,
              user_id: newUser.id,
              date: today,
              title: 'Drink 2 liters of water & stay hydrated',
              category: 'hydration',
              completed: false,
            },
            {
              id: `tsk_${Date.now()}_2`,
              user_id: newUser.id,
              date: today,
              title: '15-minute gentle walk or resting meditation',
              category: 'exercise',
              completed: false,
            },
          ]);
        }
      } catch (err) {
        console.warn('[Supabase] createUser insert failed, writing to local storage:', err);
      }
    }

    this.data.users.push(newUser);
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

  public async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (this.supabase) {
      try {
        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.language !== undefined) dbUpdates.language = updates.language;
        if (updates.accessibility !== undefined) dbUpdates.accessibility = updates.accessibility;
        if (updates.treatmentPlan !== undefined) dbUpdates.treatment_plan = updates.treatmentPlan;
        if (updates.passwordHash !== undefined) dbUpdates.password_hash = updates.passwordHash;

        const { error } = await this.supabase.from('users').update(dbUpdates).eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('[Supabase] updateUser failed, updating locally:', err);
      }
    }

    const userIndex = this.data.users.findIndex((u) => u.id === id);
    if (userIndex !== -1) {
      this.data.users[userIndex] = {
        ...this.data.users[userIndex],
        ...updates,
      };
      this.save();
      return this.data.users[userIndex];
    }

    const user = await this.getUserById(id);
    if (!user) throw new Error('User not found');
    return { ...user, ...updates };
  }

  public async createSession(userId: string): Promise<Session> {
    const token = crypto.randomBytes(32).toString('hex');
    const session: Session = {
      token,
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };

    if (this.supabase) {
      try {
        const { error } = await this.supabase.from('sessions').insert({
          token: session.token,
          user_id: session.userId,
          created_at: session.createdAt,
          expires_at: session.expiresAt,
        });
        if (error) throw error;
      } catch (err) {
        console.warn('[Supabase] createSession failed, falling back to local memory:', err);
      }
    }

    this.data.sessions.push(session);
    this.save();
    return session;
  }

  public async getSession(token: string): Promise<Session | undefined> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('sessions')
          .select('*')
          .eq('token', token)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          if (Date.now() > Number(data.expires_at)) {
            await this.deleteSession(token);
            return undefined;
          }
          return {
            token: data.token,
            userId: data.user_id,
            createdAt: Number(data.created_at),
            expiresAt: Number(data.expires_at),
          };
        }
      } catch (err) {
        console.warn('[Supabase] getSession failed, checking local memory:', err);
      }
    }

    const session = this.data.sessions.find((s) => s.token === token);
    if (!session) return undefined;
    if (Date.now() > session.expiresAt) {
      this.deleteSession(token);
      return undefined;
    }
    return session;
  }

  public async deleteSession(token: string): Promise<void> {
    if (this.supabase) {
      try {
        await this.supabase.from('sessions').delete().eq('token', token);
      } catch (err) {
        console.warn('[Supabase] deleteSession failed:', err);
      }
    }
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }

  public async getAppointments(userId: string): Promise<Appointment[]> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('appointments')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        if (data && data.length > 0) {
          return data
            .map((a: any) => ({
              id: a.id,
              userId: a.user_id,
              title: a.title,
              doctor: a.doctor,
              specialty: a.specialty || '',
              date: a.date,
              time: a.time,
              location: a.location || '',
              type: a.type,
              notes: a.notes || '',
              reminder: a.reminder ?? true,
              createdAt: a.created_at,
            }))
            .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());
        }
      } catch (err) {
        console.warn('[Supabase] getAppointments failed, falling back to local memory:', err);
      }
    }

    return this.data.appointments
      .filter((a) => a.userId === userId)
      .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());
  }

  public async createAppointment(
    userId: string,
    data: Omit<Appointment, 'id' | 'userId' | 'createdAt'>
  ): Promise<Appointment> {
    const apt: Appointment = {
      id: `apt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      ...data,
      createdAt: new Date().toISOString(),
    };

    if (this.supabase) {
      try {
        const { error } = await this.supabase.from('appointments').insert({
          id: apt.id,
          user_id: apt.userId,
          title: apt.title,
          doctor: apt.doctor,
          specialty: apt.specialty,
          date: apt.date,
          time: apt.time,
          location: apt.location,
          type: apt.type,
          notes: apt.notes,
          reminder: apt.reminder,
          created_at: apt.createdAt,
        });
        if (error) throw error;
      } catch (err) {
        console.warn('[Supabase] createAppointment failed, storing locally:', err);
      }
    }

    this.data.appointments.push(apt);
    this.save();
    return apt;
  }

  public async updateAppointment(
    userId: string,
    aptId: string,
    data: Partial<Appointment>
  ): Promise<Appointment> {
    if (this.supabase) {
      try {
        const dbUpdates: any = {};
        if (data.title !== undefined) dbUpdates.title = data.title;
        if (data.doctor !== undefined) dbUpdates.doctor = data.doctor;
        if (data.specialty !== undefined) dbUpdates.specialty = data.specialty;
        if (data.date !== undefined) dbUpdates.date = data.date;
        if (data.time !== undefined) dbUpdates.time = data.time;
        if (data.location !== undefined) dbUpdates.location = data.location;
        if (data.type !== undefined) dbUpdates.type = data.type;
        if (data.notes !== undefined) dbUpdates.notes = data.notes;
        if (data.reminder !== undefined) dbUpdates.reminder = data.reminder;

        await this.supabase.from('appointments').update(dbUpdates).eq('id', aptId).eq('user_id', userId);
      } catch (err) {
        console.warn('[Supabase] updateAppointment failed, updating locally:', err);
      }
    }

    const index = this.data.appointments.findIndex((a) => a.id === aptId && a.userId === userId);
    if (index === -1) {
      const apts = await this.getAppointments(userId);
      const found = apts.find((a) => a.id === aptId);
      if (!found) throw new Error('Appointment not found or unauthorized');
      return { ...found, ...data };
    }

    this.data.appointments[index] = { ...this.data.appointments[index], ...data };
    this.save();
    return this.data.appointments[index];
  }

  public async deleteAppointment(userId: string, aptId: string): Promise<void> {
    if (this.supabase) {
      try {
        await this.supabase.from('appointments').delete().eq('id', aptId).eq('user_id', userId);
      } catch (err) {
        console.warn('[Supabase] deleteAppointment failed:', err);
      }
    }

    const index = this.data.appointments.findIndex((a) => a.id === aptId && a.userId === userId);
    if (index !== -1) {
      this.data.appointments.splice(index, 1);
      this.save();
    }
  }

  public async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        if (data && data.length > 0) {
          return data
            .map((j: any) => ({
              id: j.id,
              userId: j.user_id,
              date: j.date,
              symptoms: Array.isArray(j.symptoms) ? j.symptoms : [],
              severity: j.severity,
              mood: j.mood,
              notes: j.notes || '',
              createdAt: j.created_at,
            }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
      } catch (err) {
        console.warn('[Supabase] getJournalEntries failed, falling back to local memory:', err);
      }
    }

    return this.data.journalEntries
      .filter((j) => j.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async createJournalEntry(
    userId: string,
    data: Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>
  ): Promise<JournalEntry> {
    const entry: JournalEntry = {
      id: `jnl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      ...data,
      createdAt: new Date().toISOString(),
    };

    if (this.supabase) {
      try {
        const { error } = await this.supabase.from('journal_entries').insert({
          id: entry.id,
          user_id: entry.userId,
          date: entry.date,
          symptoms: entry.symptoms,
          severity: entry.severity,
          mood: entry.mood,
          notes: entry.notes,
          created_at: entry.createdAt,
        });
        if (error) throw error;
      } catch (err) {
        console.warn('[Supabase] createJournalEntry failed, storing locally:', err);
      }
    }

    this.data.journalEntries.push(entry);
    this.save();
    return entry;
  }

  public async updateJournalEntry(
    userId: string,
    entryId: string,
    data: Partial<JournalEntry>
  ): Promise<JournalEntry> {
    if (this.supabase) {
      try {
        const dbUpdates: any = {};
        if (data.date !== undefined) dbUpdates.date = data.date;
        if (data.symptoms !== undefined) dbUpdates.symptoms = data.symptoms;
        if (data.severity !== undefined) dbUpdates.severity = data.severity;
        if (data.mood !== undefined) dbUpdates.mood = data.mood;
        if (data.notes !== undefined) dbUpdates.notes = data.notes;

        await this.supabase.from('journal_entries').update(dbUpdates).eq('id', entryId).eq('user_id', userId);
      } catch (err) {
        console.warn('[Supabase] updateJournalEntry failed:', err);
      }
    }

    const index = this.data.journalEntries.findIndex((j) => j.id === entryId && j.userId === userId);
    if (index === -1) {
      const entries = await this.getJournalEntries(userId);
      const found = entries.find((j) => j.id === entryId);
      if (!found) throw new Error('Journal entry not found or unauthorized');
      return { ...found, ...data };
    }

    this.data.journalEntries[index] = { ...this.data.journalEntries[index], ...data };
    this.save();
    return this.data.journalEntries[index];
  }

  public async deleteJournalEntry(userId: string, entryId: string): Promise<void> {
    if (this.supabase) {
      try {
        await this.supabase.from('journal_entries').delete().eq('id', entryId).eq('user_id', userId);
      } catch (err) {
        console.warn('[Supabase] deleteJournalEntry failed:', err);
      }
    }

    const index = this.data.journalEntries.findIndex((j) => j.id === entryId && j.userId === userId);
    if (index !== -1) {
      this.data.journalEntries.splice(index, 1);
      this.save();
    }
  }

  public async getDailyTasks(userId: string, dateStr?: string): Promise<DailyTask[]> {
    const date = dateStr || new Date().toISOString().split('T')[0];

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('daily_tasks')
          .select('*')
          .eq('user_id', userId)
          .eq('date', date);

        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((t: any) => ({
            id: t.id,
            userId: t.user_id,
            date: t.date,
            title: t.title,
            category: t.category,
            completed: t.completed,
          }));
        } else {
          const defaults: Array<Omit<DailyTask, 'id' | 'userId' | 'date'>> = [
            { title: 'Take prescribed medication', category: 'medication', completed: false },
            { title: 'Drink water (Hydration goal: 2 liters)', category: 'hydration', completed: false },
            { title: 'Light exercise (Gentle stretching or 10-min walk)', category: 'exercise', completed: false },
            { title: 'Rest & relax (Mindful breathing or nap)', category: 'rest', completed: false },
          ];

          const newTasks = defaults.map((d, idx) => ({
            id: `tsk_${Date.now()}_${idx}`,
            user_id: userId,
            date,
            title: d.title,
            category: d.category,
            completed: d.completed,
          }));

          await this.supabase.from('daily_tasks').insert(newTasks);
          return newTasks.map((t) => ({
            id: t.id,
            userId: t.user_id,
            date: t.date,
            title: t.title,
            category: t.category as any,
            completed: t.completed,
          }));
        }
      } catch (err) {
        console.warn('[Supabase] getDailyTasks failed, falling back to local memory:', err);
      }
    }

    let tasks = this.data.dailyTasks.filter((t) => t.userId === userId && t.date === date);

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

  public async toggleDailyTask(userId: string, taskId: string): Promise<DailyTask> {
    let task = this.data.dailyTasks.find((t) => t.id === taskId && t.userId === userId);

    if (this.supabase) {
      try {
        const { data } = await this.supabase
          .from('daily_tasks')
          .select('*')
          .eq('id', taskId)
          .eq('user_id', userId)
          .maybeSingle();

        if (data) {
          const newCompleted = !data.completed;
          await this.supabase
            .from('daily_tasks')
            .update({ completed: newCompleted })
            .eq('id', taskId)
            .eq('user_id', userId);

          return {
            id: data.id,
            userId: data.user_id,
            date: data.date,
            title: data.title,
            category: data.category,
            completed: newCompleted,
          };
        }
      } catch (err) {
        console.warn('[Supabase] toggleDailyTask failed:', err);
      }
    }

    if (!task) throw new Error('Task not found');
    task.completed = !task.completed;
    this.save();
    return task;
  }

  public async addDailyTask(
    userId: string,
    data: { title: string; category: DailyTask['category']; date?: string }
  ): Promise<DailyTask> {
    const date = data.date || new Date().toISOString().split('T')[0];
    const task: DailyTask = {
      id: `tsk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      date,
      title: data.title,
      category: data.category,
      completed: false,
    };

    if (this.supabase) {
      try {
        await this.supabase.from('daily_tasks').insert({
          id: task.id,
          user_id: task.userId,
          date: task.date,
          title: task.title,
          category: task.category,
          completed: task.completed,
        });
      } catch (err) {
        console.warn('[Supabase] addDailyTask failed:', err);
      }
    }

    this.data.dailyTasks.push(task);
    this.save();
    return task;
  }

  public async getCaregiverPermissions(patientUserId: string): Promise<CaregiverPermission[]> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('caregiver_permissions')
          .select('*')
          .eq('patient_user_id', patientUserId);

        if (error) throw error;
        if (data && data.length > 0) {
          return data.map((p: any) => ({
            id: p.id,
            patientUserId: p.patient_user_id,
            caregiverEmail: p.caregiver_email,
            caregiverName: p.caregiver_name,
            status: p.status,
            permissions: p.permissions,
            createdAt: p.created_at,
          }));
        }
      } catch (err) {
        console.warn('[Supabase] getCaregiverPermissions failed:', err);
      }
    }

    return this.data.caregiverPermissions.filter((p) => p.patientUserId === patientUserId);
  }

  public async getSharedPatientsForCaregiver(
    caregiverEmail: string
  ): Promise<Array<{ patient: Omit<User, 'passwordHash'>; permission: CaregiverPermission }>> {
    const normalizedEmail = caregiverEmail.toLowerCase();
    const results: Array<{ patient: Omit<User, 'passwordHash'>; permission: CaregiverPermission }> = [];

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('caregiver_permissions')
          .select('*')
          .ilike('caregiver_email', normalizedEmail)
          .eq('status', 'active');

        if (!error && data && data.length > 0) {
          for (const p of data) {
            const patient = await this.getUserById(p.patient_user_id);
            if (patient) {
              const { passwordHash, ...safePatient } = patient;
              results.push({
                patient: safePatient,
                permission: {
                  id: p.id,
                  patientUserId: p.patient_user_id,
                  caregiverEmail: p.caregiver_email,
                  caregiverName: p.caregiver_name,
                  status: p.status,
                  permissions: p.permissions,
                  createdAt: p.created_at,
                },
              });
            }
          }
          if (results.length > 0) return results;
        }
      } catch (err) {
        console.warn('[Supabase] getSharedPatientsForCaregiver failed:', err);
      }
    }

    const perms = this.data.caregiverPermissions.filter(
      (p) => p.caregiverEmail.toLowerCase() === normalizedEmail && p.status === 'active'
    );

    for (const p of perms) {
      const patient = await this.getUserById(p.patientUserId);
      if (patient) {
        const { passwordHash, ...safePatient } = patient;
        results.push({ patient: safePatient, permission: p });
      }
    }
    return results;
  }

  public async addCaregiverPermission(
    patientUserId: string,
    data: { caregiverEmail: string; caregiverName: string; permissions: CaregiverPermission['permissions'] }
  ): Promise<CaregiverPermission> {
    const normalizedEmail = data.caregiverEmail.toLowerCase();

    if (this.supabase) {
      try {
        const existing = await this.supabase
          .from('caregiver_permissions')
          .select('*')
          .eq('patient_user_id', patientUserId)
          .ilike('caregiver_email', normalizedEmail)
          .maybeSingle();

        if (existing.data) {
          const { data: updated, error } = await this.supabase
            .from('caregiver_permissions')
            .update({ status: 'active', permissions: data.permissions })
            .eq('id', existing.data.id)
            .select()
            .single();

          if (!error && updated) {
            return {
              id: updated.id,
              patientUserId: updated.patient_user_id,
              caregiverEmail: updated.caregiver_email,
              caregiverName: updated.caregiver_name,
              status: updated.status,
              permissions: updated.permissions,
              createdAt: updated.created_at,
            };
          }
        } else {
          const newId = `perm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          const { data: inserted, error } = await this.supabase
            .from('caregiver_permissions')
            .insert({
              id: newId,
              patient_user_id: patientUserId,
              caregiver_email: normalizedEmail,
              caregiver_name: data.caregiverName,
              status: 'active',
              permissions: data.permissions,
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (!error && inserted) {
            return {
              id: inserted.id,
              patientUserId: inserted.patient_user_id,
              caregiverEmail: inserted.caregiver_email,
              caregiverName: inserted.caregiver_name,
              status: inserted.status,
              permissions: inserted.permissions,
              createdAt: inserted.created_at,
            };
          }
        }
      } catch (err) {
        console.warn('[Supabase] addCaregiverPermission failed:', err);
      }
    }

    const existing = this.data.caregiverPermissions.find(
      (p) => p.patientUserId === patientUserId && p.caregiverEmail.toLowerCase() === normalizedEmail
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
      caregiverEmail: normalizedEmail,
      caregiverName: data.caregiverName,
      status: 'active',
      permissions: data.permissions,
      createdAt: new Date().toISOString(),
    };
    this.data.caregiverPermissions.push(perm);
    this.save();
    return perm;
  }

  public async revokeCaregiverPermission(patientUserId: string, permId: string): Promise<void> {
    if (this.supabase) {
      try {
        await this.supabase
          .from('caregiver_permissions')
          .update({ status: 'revoked' })
          .eq('id', permId)
          .eq('patient_user_id', patientUserId);
      } catch (err) {
        console.warn('[Supabase] revokeCaregiverPermission failed:', err);
      }
    }

    const perm = this.data.caregiverPermissions.find((p) => p.id === permId && p.patientUserId === patientUserId);
    if (!perm) throw new Error('Permission not found');
    perm.status = 'revoked';
    this.save();
  }

  public async getChatSessions(userId: string): Promise<ChatSession[]> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', userId);

        if (!error && data && data.length > 0) {
          return data
            .map((c: any) => ({
              id: c.id,
              userId: c.user_id,
              title: c.title,
              messages: Array.isArray(c.messages) ? c.messages : [],
              createdAt: c.created_at,
              updatedAt: c.updated_at,
            }))
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        }
      } catch (err) {
        console.warn('[Supabase] getChatSessions failed:', err);
      }
    }

    return this.data.chatSessions
      .filter((c) => c.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public async getChatSessionById(userId: string, sessionId: string): Promise<ChatSession | undefined> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('chat_sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('user_id', userId)
          .maybeSingle();

        if (!error && data) {
          return {
            id: data.id,
            userId: data.user_id,
            title: data.title,
            messages: Array.isArray(data.messages) ? data.messages : [],
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.warn('[Supabase] getChatSessionById failed:', err);
      }
    }

    return this.data.chatSessions.find((c) => c.id === sessionId && c.userId === userId);
  }

  public async createChatSession(
    userId: string,
    title: string,
    initialMessage?: ChatMessage
  ): Promise<ChatSession> {
    const session: ChatSession = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title,
      messages: initialMessage ? [initialMessage] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (this.supabase) {
      try {
        await this.supabase.from('chat_sessions').insert({
          id: session.id,
          user_id: session.userId,
          title: session.title,
          messages: session.messages,
          created_at: session.createdAt,
          updated_at: session.updatedAt,
        });
      } catch (err) {
        console.warn('[Supabase] createChatSession failed:', err);
      }
    }

    this.data.chatSessions.push(session);
    this.save();
    return session;
  }

  public async addChatMessage(
    userId: string,
    sessionId: string,
    message: Omit<ChatMessage, 'id' | 'timestamp'>
  ): Promise<ChatMessage> {
    const session = await this.getChatSessionById(userId, sessionId);
    if (!session) throw new Error('Chat session not found');

    const fullMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...message,
      timestamp: new Date().toISOString(),
    };

    session.messages.push(fullMessage);
    session.updatedAt = new Date().toISOString();

    if (this.supabase) {
      try {
        await this.supabase
          .from('chat_sessions')
          .update({ messages: session.messages, updated_at: session.updatedAt })
          .eq('id', sessionId)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('[Supabase] addChatMessage update failed:', err);
      }
    }

    this.save();
    return fullMessage;
  }

  public async clearChatSession(userId: string, sessionId: string): Promise<void> {
    if (this.supabase) {
      try {
        await this.supabase
          .from('chat_sessions')
          .update({ messages: [], updated_at: new Date().toISOString() })
          .eq('id', sessionId)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('[Supabase] clearChatSession failed:', err);
      }
    }

    const session = this.data.chatSessions.find((c) => c.id === sessionId && c.userId === userId);
    if (session) {
      session.messages = [];
      session.updatedAt = new Date().toISOString();
      this.save();
    }
  }

  public async getVisitSummaries(userId: string): Promise<VisitSummary[]> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('visit_summaries')
          .select('*')
          .eq('user_id', userId);

        if (!error && data && data.length > 0) {
          return data
            .map((s: any) => ({
              id: s.id,
              userId: s.user_id,
              appointmentId: s.appointment_id || '',
              appointmentTitle: s.appointment_title || 'Doctor Visit Summary',
              doctorName: s.doctor_name || 'Oncologist',
              appointmentDate: s.appointment_date,
              chiefConcerns: s.chief_concerns || '',
              symptomsSummary: s.symptoms_summary || '',
              currentMedications: Array.isArray(s.current_medications) ? s.current_medications : [],
              questionsForDoctor: Array.isArray(s.questions_for_doctor) ? s.questions_for_doctor : [],
              patientNotes: s.patient_notes || '',
              createdAt: s.created_at,
            }))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
      } catch (err) {
        console.warn('[Supabase] getVisitSummaries failed:', err);
      }
    }

    return this.data.visitSummaries
      .filter((s) => s.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async createVisitSummary(
    userId: string,
    data: Omit<VisitSummary, 'id' | 'userId' | 'createdAt'>
  ): Promise<VisitSummary> {
    const sum: VisitSummary = {
      id: `sum_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      ...data,
      createdAt: new Date().toISOString(),
    };

    if (this.supabase) {
      try {
        await this.supabase.from('visit_summaries').insert({
          id: sum.id,
          user_id: sum.userId,
          appointment_id: sum.appointmentId,
          appointment_title: sum.appointmentTitle,
          doctor_name: sum.doctorName,
          appointment_date: sum.appointmentDate,
          chief_concerns: sum.chiefConcerns,
          symptoms_summary: sum.symptomsSummary,
          current_medications: sum.currentMedications,
          questions_for_doctor: sum.questionsForDoctor,
          patient_notes: sum.patientNotes,
          created_at: sum.createdAt,
        });
      } catch (err) {
        console.warn('[Supabase] createVisitSummary failed:', err);
      }
    }

    this.data.visitSummaries.push(sum);
    this.save();
    return sum;
  }

  public async deleteVisitSummary(userId: string, summaryId: string): Promise<void> {
    if (this.supabase) {
      try {
        await this.supabase.from('visit_summaries').delete().eq('id', summaryId).eq('user_id', userId);
      } catch (err) {
        console.warn('[Supabase] deleteVisitSummary failed:', err);
      }
    }

    const index = this.data.visitSummaries.findIndex((s) => s.id === summaryId && s.userId === userId);
    if (index !== -1) {
      this.data.visitSummaries.splice(index, 1);
      this.save();
    }
  }

  public async createPasswordResetToken(email: string): Promise<string> {
    const token = crypto.randomBytes(24).toString('hex');
    const normalizedEmail = email.toLowerCase();
    const expiresAt = Date.now() + 60 * 60 * 1000;

    if (this.supabase) {
      try {
        await this.supabase.from('password_reset_tokens').delete().ilike('email', normalizedEmail);
        await this.supabase.from('password_reset_tokens').insert({
          token,
          email: normalizedEmail,
          expires_at: expiresAt,
        });
      } catch (err) {
        console.warn('[Supabase] createPasswordResetToken failed:', err);
      }
    }

    this.data.passwordResetTokens = this.data.passwordResetTokens.filter((t) => t.email.toLowerCase() !== normalizedEmail);
    this.data.passwordResetTokens.push({
      token,
      email: normalizedEmail,
      expiresAt,
    });
    this.save();
    return token;
  }

  public async resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
    let email: string | null = null;

    if (this.supabase) {
      try {
        const { data } = await this.supabase
          .from('password_reset_tokens')
          .select('*')
          .eq('token', token)
          .maybeSingle();

        if (data && Date.now() <= Number(data.expires_at)) {
          email = data.email;
          await this.supabase.from('password_reset_tokens').delete().eq('token', token);
        }
      } catch (err) {
        console.warn('[Supabase] resetPasswordWithToken query failed:', err);
      }
    }

    if (!email) {
      const item = this.data.passwordResetTokens.find((t) => t.token === token);
      if (!item || Date.now() > item.expiresAt) {
        return false;
      }
      email = item.email;
      this.data.passwordResetTokens = this.data.passwordResetTokens.filter((t) => t.token !== token);
      this.save();
    }

    const user = await this.getUserByEmail(email);
    if (!user) return false;

    const newHash = hashPassword(newPassword);
    await this.updateUser(user.id, { passwordHash: newHash });
    return true;
  }

  public async deleteUserData(userId: string): Promise<void> {
    if (this.supabase) {
      try {
        await this.supabase.from('users').delete().eq('id', userId);
      } catch (err) {
        console.warn('[Supabase] deleteUserData failed:', err);
      }
    }

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
