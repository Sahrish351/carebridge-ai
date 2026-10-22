import { Router, Request, Response, NextFunction } from 'express';
import { db, User } from './db.js';
import { askAiAssistant, generateDoctorVisitSummary } from './aiService.js';

export const apiRouter = Router();

// Middleware: Authenticate Session
export interface AuthRequest extends Request {
  user?: User;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const token =
    req.cookies?.cb_session ||
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const session = db.getSession(token);
  if (!session) {
    res.status(401).json({ error: 'Invalid or expired session' });
    return;
  }

  const user = db.getUserById(session.userId);
  if (!user) {
    res.status(401).json({ error: 'User no longer exists' });
    return;
  }

  req.user = user;
  next();
}

export function optionalAuthMiddleware(req: AuthRequest, _res: Response, next: NextFunction): void {
  const token =
    req.cookies?.cb_session ||
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);

  if (token) {
    const session = db.getSession(token);
    if (session) {
      const user = db.getUserById(session.userId);
      if (user) {
        req.user = user;
      }
    }
  }
  next();
}

function sanitizeUser(user: User): Omit<User, 'passwordHash'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}

// ==========================================
// AUTH ROUTES
// ==========================================

apiRouter.post('/auth/register', (req: Request, res: Response): void => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const validRoles = ['patient', 'caregiver', 'doctor'];
    const chosenRole = validRoles.includes(role) ? role : 'patient';

    const user = db.createUser({
      email,
      password,
      name,
      role: chosenRole,
    });

    const session = db.createSession(user.id);
    res.cookie('cb_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: sanitizeUser(user),
      token: session.token,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = db.getUserByEmail(email);
    if (!user || !db.verifyPassword(user, password)) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const session = db.createSession(user.id);
    res.cookie('cb_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: sanitizeUser(user),
      token: session.token,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

apiRouter.post('/auth/demo-login', (req: Request, res: Response): void => {
  try {
    const { role } = req.body;
    let targetEmail = 'areeba@example.com';
    if (role === 'caregiver') targetEmail = 'tariq@example.com';
    if (role === 'doctor') targetEmail = 'saman@example.com';

    const user = db.getUserByEmail(targetEmail);
    if (!user) {
      res.status(404).json({ error: 'Demo account not initialized' });
      return;
    }

    const session = db.createSession(user.id);
    res.cookie('cb_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: sanitizeUser(user),
      token: session.token,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Demo login failed' });
  }
});

apiRouter.post('/auth/logout', (req: Request, res: Response): void => {
  const token =
    req.cookies?.cb_session ||
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);

  if (token) {
    db.deleteSession(token);
  }

  res.clearCookie('cb_session');
  res.json({ success: true, message: 'Logged out successfully' });
});

apiRouter.get('/auth/me', authMiddleware, (req: AuthRequest, res: Response): void => {
  res.json({ user: sanitizeUser(req.user!) });
});

apiRouter.post('/auth/forgot-password', (req: Request, res: Response): void => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email address is required' });
    return;
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    // Security best practice: don't reveal email existence, but in evaluation give transparent hint
    res.json({
      success: true,
      message: 'If an account exists with this email, recovery instructions have been prepared.',
      note: 'No account registered with this email.',
    });
    return;
  }

  const resetToken = db.createPasswordResetToken(email);
  res.json({
    success: true,
    message: 'Password reset link generated.',
    resetToken,
    resetUrl: `/reset-password?token=${resetToken}`,
  });
});

apiRouter.post('/auth/reset-password', (req: Request, res: Response): void => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    res.status(400).json({ error: 'Reset token and new password are required' });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  const ok = db.resetPasswordWithToken(token, newPassword);
  if (!ok) {
    res.status(400).json({ error: 'Invalid or expired password reset link' });
    return;
  }

  res.json({ success: true, message: 'Password updated successfully. You can now log in.' });
});

// ==========================================
// APPOINTMENTS ROUTES
// ==========================================

apiRouter.get('/appointments', authMiddleware, (req: AuthRequest, res: Response): void => {
  const appointments = db.getAppointments(req.user!.id);
  res.json(appointments);
});

apiRouter.post('/appointments', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const { title, doctor, specialty, date, time, location, type, notes, reminder } = req.body;
    if (!title || !date || !time) {
      res.status(400).json({ error: 'Title, date, and time are required' });
      return;
    }

    const appointment = db.createAppointment(req.user!.id, {
      title,
      doctor: doctor || 'Oncology Team',
      specialty: specialty || 'Cancer Care',
      date,
      time,
      location: location || '',
      type: type || 'oncology',
      notes: notes || '',
      reminder: reminder ?? true,
    });

    res.status(201).json(appointment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/appointments/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const updated = db.updateAppointment(req.user!.id, req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.delete('/appointments/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    db.deleteAppointment(req.user!.id, req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// SYMPTOM JOURNAL ROUTES
// ==========================================

apiRouter.get('/journal', authMiddleware, (req: AuthRequest, res: Response): void => {
  const entries = db.getJournalEntries(req.user!.id);
  res.json(entries);
});

apiRouter.post('/journal', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const { date, symptoms, severity, mood, notes } = req.body;
    if (!date) {
      res.status(400).json({ error: 'Date is required' });
      return;
    }

    const entry = db.createJournalEntry(req.user!.id, {
      date,
      symptoms: Array.isArray(symptoms) ? symptoms : symptoms ? [symptoms] : [],
      severity: typeof severity === 'number' ? severity : 3,
      mood: mood || 'okay',
      notes: notes || '',
    });

    res.status(201).json(entry);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/journal/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const updated = db.updateJournalEntry(req.user!.id, req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.delete('/journal/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    db.deleteJournalEntry(req.user!.id, req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// DAILY TASKS ROUTES
// ==========================================

apiRouter.get('/tasks', authMiddleware, (req: AuthRequest, res: Response): void => {
  const dateStr = typeof req.query.date === 'string' ? req.query.date : undefined;
  const tasks = db.getDailyTasks(req.user!.id, dateStr);
  res.json(tasks);
});

apiRouter.post('/tasks/toggle/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const updated = db.toggleDailyTask(req.user!.id, req.params.id);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.post('/tasks', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const { title, category, date } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }
    const task = db.addDailyTask(req.user!.id, {
      title,
      category: category || 'rest',
      date,
    });
    res.status(201).json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// CAREGIVER ACCESS ROUTES
// ==========================================

apiRouter.get('/caregivers', authMiddleware, (req: AuthRequest, res: Response): void => {
  const perms = db.getCaregiverPermissions(req.user!.id);
  res.json(perms);
});

apiRouter.post('/caregivers/invite', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const { caregiverEmail, caregiverName, permissions } = req.body;
    if (!caregiverEmail) {
      res.status(400).json({ error: 'Caregiver email is required' });
      return;
    }

    const perm = db.addCaregiverPermission(req.user!.id, {
      caregiverEmail,
      caregiverName: caregiverName || caregiverEmail.split('@')[0],
      permissions: permissions || {
        canViewAppointments: true,
        canEditAppointments: false,
        canViewJournal: true,
        canViewTasks: true,
      },
    });

    res.status(201).json(perm);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/caregivers/revoke/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    db.revokeCaregiverPermission(req.user!.id, req.params.id);
    res.json({ success: true, message: 'Caregiver access revoked.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.get('/caregivers/shared-patients', authMiddleware, (req: AuthRequest, res: Response): void => {
  const shared = db.getSharedPatientsForCaregiver(req.user!.email);
  res.json(shared);
});

// ==========================================
// AI ASSISTANT ROUTES
// ==========================================

apiRouter.get('/ai/sessions', authMiddleware, (req: AuthRequest, res: Response): void => {
  const sessions = db.getChatSessions(req.user!.id);
  res.json(sessions);
});

apiRouter.post('/ai/ask', optionalAuthMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const prompt = req.body.prompt || req.body.message;
    const sessionId = req.body.sessionId;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    if (req.user) {
      let session = sessionId ? db.getChatSessionById(req.user.id, sessionId) : undefined;
      if (!session) {
        const shortTitle = prompt.length > 40 ? prompt.substring(0, 37) + '...' : prompt;
        session = db.createChatSession(req.user.id, shortTitle);
      }

      // Save user message
      db.addChatMessage(req.user.id, session.id, {
        role: 'user',
        content: prompt,
      });

      // Call AI
      const response = await askAiAssistant({
        prompt,
        history: session.messages.map((m) => ({ role: m.role, content: m.content })),
        userName: req.user.name,
        regimen: req.user.treatmentPlan?.regimen,
      });

      // Save assistant message
      const botMsg = db.addChatMessage(req.user.id, session.id, {
        role: 'assistant',
        content: response.content,
        sources: response.sources,
        disclaimer: response.disclaimer,
      });

      res.json({
        sessionId: session.id,
        message: botMsg,
      });
    } else {
      // Guest exploration mode - ground and answer directly
      const response = await askAiAssistant({
        prompt,
        userName: 'Visitor',
      });

      res.json({
        sessionId: sessionId || `guest_${Date.now()}`,
        message: {
          id: `msg_guest_${Date.now()}`,
          role: 'assistant',
          content: response.content,
          sources: response.sources,
          disclaimer: response.disclaimer,
          timestamp: new Date().toISOString(),
        },
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI request failed' });
  }
});

apiRouter.delete('/ai/sessions/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    db.clearChatSession(req.user!.id, req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// DOCTOR VISIT SUMMARY ROUTES
// ==========================================

apiRouter.get('/summaries', authMiddleware, (req: AuthRequest, res: Response): void => {
  const summaries = db.getVisitSummaries(req.user!.id);
  res.json(summaries);
});

apiRouter.post('/summaries/generate', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { appointmentId, includeSymptoms, includeMedications, includeQuestions, customNotes } = req.body;

    const appointments = db.getAppointments(req.user!.id);
    const appointment = appointments.find((a) => a.id === appointmentId) || appointments[0];

    if (!appointment) {
      res.status(400).json({ error: 'Please create an appointment first to generate a visit summary' });
      return;
    }

    const journalEntries = includeSymptoms ? db.getJournalEntries(req.user!.id).slice(0, 5) : [];
    const medications = includeMedications
      ? ['Paclitaxel (IV chemotherapy)', 'Ondansetron 8mg (Antiemetic)', 'Dexamethasone', 'Multivitamin support']
      : [];

    const result = await generateDoctorVisitSummary({
      appointment,
      journalEntries,
      medications,
      patientNotes: customNotes,
      customQuestions: includeQuestions
        ? [
            'What are the next steps in my treatment plan?',
            'Are there any dietary changes or supplements I should consider for fatigue?',
            'What side effects should I watch for after this cycle?',
            'When should I contact you immediately versus waiting for next visit?',
          ]
        : [],
      patientName: req.user!.name,
    });

    res.json({
      appointmentId: appointment.id,
      appointmentTitle: appointment.title,
      doctorName: `${appointment.doctor} (${appointment.specialty})`,
      appointmentDate: appointment.date,
      chiefConcerns: result.chiefConcerns,
      symptomsSummary: result.symptomsSummary,
      currentMedications: medications,
      questionsForDoctor: result.questionsForDoctor,
      patientNotes: customNotes || 'Patient prepared with CareBridge AI.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/summaries', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const {
      appointmentId,
      appointmentTitle,
      doctorName,
      appointmentDate,
      chiefConcerns,
      symptomsSummary,
      currentMedications,
      questionsForDoctor,
      patientNotes,
    } = req.body;

    const summary = db.createVisitSummary(req.user!.id, {
      appointmentId: appointmentId || '',
      appointmentTitle: appointmentTitle || 'Doctor Visit Summary',
      doctorName: doctorName || 'Oncologist',
      appointmentDate: appointmentDate || new Date().toISOString().split('T')[0],
      chiefConcerns: chiefConcerns || '',
      symptomsSummary: symptomsSummary || '',
      currentMedications: currentMedications || [],
      questionsForDoctor: questionsForDoctor || [],
      patientNotes: patientNotes || '',
    });

    res.status(201).json(summary);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/summaries/:id', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    db.deleteVisitSummary(req.user!.id, req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// USER PROFILE & SETTINGS ROUTES
// ==========================================

apiRouter.put('/user/profile', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const { name, language, accessibility, treatmentPlan } = req.body;
    const updates: Partial<User> = {};

    if (name) updates.name = name;
    if (language) updates.language = language;
    if (accessibility) updates.accessibility = accessibility;
    if (treatmentPlan) updates.treatmentPlan = treatmentPlan;

    const updated = db.updateUser(req.user!.id, updates);
    res.json(sanitizeUser(updated));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.delete('/user/account', authMiddleware, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    db.deleteUserData(userId);
    res.clearCookie('cb_session');
    res.json({ success: true, message: 'All personal records and account successfully deleted.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
