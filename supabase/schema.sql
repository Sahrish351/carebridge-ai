
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'caregiver', 'doctor')),
  language TEXT NOT NULL DEFAULT 'en',
  accessibility JSONB NOT NULL DEFAULT '{"highContrast": false, "fontSize": "normal", "reducedMotion": false}'::jsonb,
  treatment_plan JSONB NOT NULL DEFAULT '{"regimen": "", "currentCycle": 0, "totalCycles": 0, "startDate": "", "nextDoseDate": "", "oncologist": "", "clinic": "", "status": "completed"}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  doctor TEXT NOT NULL,
  specialty TEXT DEFAULT 'Cancer Care',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'oncology',
  notes TEXT DEFAULT '',
  reminder BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.journal_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  symptoms JSONB NOT NULL DEFAULT '[]'::jsonb,
  severity INT NOT NULL DEFAULT 3,
  mood TEXT NOT NULL DEFAULT 'okay',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'rest',
  completed BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.caregiver_permissions (
  id TEXT PRIMARY KEY,
  patient_user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  caregiver_email TEXT NOT NULL,
  caregiver_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'revoked')),
  permissions JSONB NOT NULL DEFAULT '{"canViewAppointments": true, "canEditAppointments": false, "canViewJournal": true, "canViewTasks": true}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.visit_summaries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  appointment_id TEXT DEFAULT '',
  appointment_title TEXT DEFAULT 'Doctor Visit Summary',
  doctor_name TEXT DEFAULT 'Oncologist',
  appointment_date TEXT NOT NULL,
  chief_concerns TEXT DEFAULT '',
  symptoms_summary TEXT DEFAULT '',
  current_medications JSONB NOT NULL DEFAULT '[]'::jsonb,
  questions_for_doctor JSONB NOT NULL DEFAULT '[]'::jsonb,
  patient_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expires_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON public.sessions(token);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_user_id ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON public.daily_tasks(user_id, date);
CREATE INDEX IF NOT EXISTS idx_caregiver_patient ON public.caregiver_permissions(patient_user_id);
CREATE INDEX IF NOT EXISTS idx_caregiver_email ON public.caregiver_permissions(caregiver_email);
CREATE INDEX IF NOT EXISTS idx_chat_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_summaries_user_id ON public.visit_summaries(user_id);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on users') THEN
    CREATE POLICY "Service role full access on users" ON public.users FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on sessions') THEN
    CREATE POLICY "Service role full access on sessions" ON public.sessions FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on appointments') THEN
    CREATE POLICY "Service role full access on appointments" ON public.appointments FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on journal_entries') THEN
    CREATE POLICY "Service role full access on journal_entries" ON public.journal_entries FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on daily_tasks') THEN
    CREATE POLICY "Service role full access on daily_tasks" ON public.daily_tasks FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on caregiver_permissions') THEN
    CREATE POLICY "Service role full access on caregiver_permissions" ON public.caregiver_permissions FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on chat_sessions') THEN
    CREATE POLICY "Service role full access on chat_sessions" ON public.chat_sessions FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on visit_summaries') THEN
    CREATE POLICY "Service role full access on visit_summaries" ON public.visit_summaries FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on password_reset_tokens') THEN
    CREATE POLICY "Service role full access on password_reset_tokens" ON public.password_reset_tokens FOR ALL USING (true);
  END IF;
END $$;

INSERT INTO public.users (id, email, password_hash, name, role, language, accessibility, treatment_plan, created_at)
VALUES
(
  'user_areeba_khan',
  'areeba@example.com',
  '9d284db63a937f9568c31c302b211cea11c7e06d06c6b888afb5a08bdec6d3579230dc5f0a2c4e1515b7d46ac886d3364986efc784c17d3ad8b42b771830d789',
  'Areeba Khan',
  'patient',
  'en',
  '{"highContrast": false, "fontSize": "normal", "reducedMotion": false}'::jsonb,
  '{"regimen": "Paclitaxel & Carboplatin", "currentCycle": 2, "totalCycles": 6, "startDate": "2026-09-14", "nextDoseDate": "2026-10-28", "oncologist": "Dr. Saman Ali", "clinic": "Lahore Comprehensive Cancer Care Center", "status": "in_progress"}'::jsonb,
  '2026-09-01T08:00:00.000Z'
),
(
  'user_tariq_khan',
  'tariq@example.com',
  '9d284db63a937f9568c31c302b211cea11c7e06d06c6b888afb5a08bdec6d3579230dc5f0a2c4e1515b7d46ac886d3364986efc784c17d3ad8b42b771830d789',
  'Tariq Khan',
  'caregiver',
  'en',
  '{"highContrast": false, "fontSize": "normal", "reducedMotion": false}'::jsonb,
  '{"regimen": "", "currentCycle": 0, "totalCycles": 0, "startDate": "", "nextDoseDate": "", "oncologist": "", "clinic": "", "status": "completed"}'::jsonb,
  '2026-09-02T10:00:00.000Z'
),
(
  'user_dr_saman',
  'saman@example.com',
  '9d284db63a937f9568c31c302b211cea11c7e06d06c6b888afb5a08bdec6d3579230dc5f0a2c4e1515b7d46ac886d3364986efc784c17d3ad8b42b771830d789',
  'Dr. Saman Ali',
  'doctor',
  'en',
  '{"highContrast": false, "fontSize": "normal", "reducedMotion": false}'::jsonb,
  '{"regimen": "", "currentCycle": 0, "totalCycles": 0, "startDate": "", "nextDoseDate": "", "oncologist": "", "clinic": "Oncology Associates", "status": "completed"}'::jsonb,
  '2026-08-15T09:00:00.000Z'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

INSERT INTO public.appointments (id, user_id, title, doctor, specialty, date, time, location, type, notes, reminder, created_at)
VALUES
(
  'apt_1',
  'user_areeba_khan',
  'Cycle 2 Follow-up & Review',
  'Dr. Saman Ali',
  'Oncologist',
  '2026-10-28',
  '10:00 AM',
  'Outpatient Oncology Clinic, Suite 402',
  'oncology',
  'Review complete blood count, discuss mild nausea from current cycle, evaluate antiemetic response.',
  true,
  '2026-10-15T10:00:00.000Z'
),
(
  'apt_2',
  'user_areeba_khan',
  'Routine Blood Test (CBC & CMP)',
  'Lab Services',
  'Pathology & Lab',
  '2026-11-04',
  '02:00 PM',
  'Central Diagnostic Laboratory, 1st Floor',
  'blood_test',
  'Pre-chemotherapy round 3 lab work. Fasting not required for this panel.',
  true,
  '2026-10-18T11:00:00.000Z'
),
(
  'apt_3',
  'user_areeba_khan',
  'Follow-up Consultation',
  'Dr. Saman Ali',
  'Oncologist',
  '2026-11-11',
  '11:00 AM',
  'Outpatient Oncology Clinic, Suite 402',
  'consultation',
  'Review lab results before scheduling Cycle 3 infusion.',
  true,
  '2026-10-18T11:30:00.000Z'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.journal_entries (id, user_id, date, symptoms, severity, mood, notes, created_at)
VALUES
(
  'jnl_1',
  'user_areeba_khan',
  '2026-10-27',
  '["Mild nausea", "Low energy"]'::jsonb,
  3,
  'okay',
  'Slight wave of nausea around noon after light breakfast. Took prescribed antiemetic and rested for an hour. Feeling steady this evening.',
  '2026-10-27T17:30:00.000Z'
),
(
  'jnl_2',
  'user_areeba_khan',
  '2026-10-25',
  '["Slight headache"]'::jsonb,
  2,
  'good',
  'Woke up with faint tension headache, drank warm herbal tea and hydrated well. Cleared up by lunchtime.',
  '2026-10-25T14:15:00.000Z'
),
(
  'jnl_3',
  'user_areeba_khan',
  '2026-10-23',
  '["Fatigue"]'::jsonb,
  2,
  'good',
  'Better today, noticeably less fatigue. Managed a gentle 15-minute garden walk with Tariq.',
  '2026-10-23T16:00:00.000Z'
),
(
  'jnl_4',
  'user_areeba_khan',
  '2026-10-20',
  '["Mild tingling in fingers"]'::jsonb,
  2,
  'okay',
  'Noticed slight peripheral tingling when holding cold drinks. Will mention this to Dr. Saman at next visit.',
  '2026-10-20T19:00:00.000Z'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.daily_tasks (id, user_id, date, title, category, completed)
VALUES
(
  'tsk_1',
  'user_areeba_khan',
  '2026-10-28',
  'Take prescribed medication (Morning dose)',
  'medication',
  true
),
(
  'tsk_2',
  'user_areeba_khan',
  '2026-10-28',
  'Drink water (Hydration goal: 2 liters)',
  'hydration',
  true
),
(
  'tsk_3',
  'user_areeba_khan',
  '2026-10-28',
  'Light exercise (10 min gentle breathing / walk)',
  'exercise',
  false
),
(
  'tsk_4',
  'user_areeba_khan',
  '2026-10-28',
  'Rest & relax (Afternoon 30-min recharge)',
  'rest',
  false
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.caregiver_permissions (id, patient_user_id, caregiver_email, caregiver_name, status, permissions, created_at)
VALUES
(
  'perm_1',
  'user_areeba_khan',
  'tariq@example.com',
  'Tariq Khan',
  'active',
  '{"canViewAppointments": true, "canEditAppointments": true, "canViewJournal": true, "canViewTasks": true}'::jsonb,
  '2026-09-10T12:00:00.000Z'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.visit_summaries (id, user_id, appointment_id, appointment_title, doctor_name, appointment_date, chief_concerns, symptoms_summary, current_medications, questions_for_doctor, patient_notes, created_at)
VALUES
(
  'sum_1',
  'user_areeba_khan',
  'apt_1',
  'Cycle 2 Follow-up & Review',
  'Dr. Saman Ali (Oncologist)',
  '2026-10-28',
  'Checking blood counts following Cycle 2 and reviewing mild intermittent nausea.',
  'Mild nausea recorded on Oct 27 (severity 3/10) managed with antiemetic; slight headache on Oct 25; mild tingling in fingers noted on Oct 20 when touching cold objects.',
  '["Paclitaxel (IV scheduled)", "Ondansetron 8mg PRN", "Dexamethasone pre-medication", "Multivitamin"]'::jsonb,
  '["What are the next steps in my treatment plan?", "Are there any dietary changes or supplements I should consider for fatigue?", "What side effects should I specifically monitor after Cycle 2?", "When should I contact the on-call oncology team immediately versus waiting?", "Are my blood counts recovering adequately on this regimen?"]'::jsonb,
  'Feeling emotionally supported by Tariq. Walking daily has helped with mood.',
  '2026-10-27T20:00:00.000Z'
)
ON CONFLICT (id) DO NOTHING;

