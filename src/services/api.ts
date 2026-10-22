import {
  User,
  Appointment,
  JournalEntry,
  DailyTask,
  CaregiverPermission,
  ChatSession,
  ChatMessage,
  VisitSummary,
} from '../types';

class ApiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('cb_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // sends cb_session cookie
    });

    const contentType = response.headers.get('content-type');
    let data: any = null;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMsg = (typeof data === 'object' && data?.error) || response.statusText || 'Request failed';
      throw new ApiError(errorMsg, response.status);
    }

    return data as T;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    const isNetworkError = err.name === 'TypeError' || err.message?.includes('fetch');
    const msg = isNetworkError
      ? 'Unable to connect to CareBridge AI backend. Please check your connection and retry.'
      : err.message || 'An unexpected request error occurred.';
    throw new ApiError(msg, 0);
  }
}

export const api = {
  // Auth
  async register(body: { email: string; password: string; name: string; role: string }) {
    const res = await request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (res.token) localStorage.setItem('cb_token', res.token);
    return res;
  },

  async login(body: { email: string; password: string }) {
    const res = await request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (res.token) localStorage.setItem('cb_token', res.token);
    return res;
  },

  async demoLogin(role: 'patient' | 'caregiver' | 'doctor') {
    const res = await request<{ user: User; token: string }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    if (res.token) localStorage.setItem('cb_token', res.token);
    return res;
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('cb_token');
    }
  },

  async getMe() {
    return request<{ user: User }>('/auth/me');
  },

  async forgotPassword(email: string) {
    return request<{ success: boolean; message: string; resetToken?: string; resetUrl?: string }>(
      '/auth/forgot-password',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );
  },

  async resetPassword(token: string, newPassword: string) {
    return request<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },

  // Appointments
  async getAppointments() {
    return request<Appointment[]>('/appointments');
  },

  async createAppointment(data: Omit<Appointment, 'id' | 'userId' | 'createdAt'>) {
    return request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAppointment(id: string, data: Partial<Appointment>) {
    return request<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteAppointment(id: string) {
    return request<{ success: boolean }>(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },

  // Symptom Journal
  async getJournalEntries() {
    return request<JournalEntry[]>('/journal');
  },

  async createJournalEntry(data: Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>) {
    return request<JournalEntry>('/journal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateJournalEntry(id: string, data: Partial<JournalEntry>) {
    return request<JournalEntry>(`/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteJournalEntry(id: string) {
    return request<{ success: boolean }>(`/journal/${id}`, {
      method: 'DELETE',
    });
  },

  // Daily Tasks
  async getDailyTasks(date?: string) {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return request<DailyTask[]>(`/tasks${query}`);
  },

  async toggleTask(id: string) {
    return request<DailyTask>(`/tasks/toggle/${id}`, {
      method: 'POST',
    });
  },

  async addTask(data: { title: string; category: DailyTask['category']; date?: string }) {
    return request<DailyTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Caregiver Access
  async getCaregiverPermissions() {
    return request<CaregiverPermission[]>('/caregivers');
  },

  async inviteCaregiver(data: {
    caregiverEmail: string;
    caregiverName: string;
    permissions?: CaregiverPermission['permissions'];
  }) {
    return request<CaregiverPermission>('/caregivers/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async revokeCaregiver(id: string) {
    return request<{ success: boolean; message: string }>(`/caregivers/revoke/${id}`, {
      method: 'POST',
    });
  },

  async getSharedPatients() {
    return request<Array<{ patient: User; permission: CaregiverPermission }>>('/caregivers/shared-patients');
  },

  // AI Assistant
  async getAiSessions() {
    return request<ChatSession[]>('/ai/sessions');
  },

  async askAi(prompt: string, sessionId?: string) {
    return request<{ sessionId: string; message: ChatMessage }>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ prompt, sessionId }),
    });
  },

  async clearAiSession(sessionId: string) {
    return request<{ success: boolean }>(`/ai/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  // Doctor Visit Summaries
  async getVisitSummaries() {
    return request<VisitSummary[]>('/summaries');
  },

  async generateVisitSummary(params: {
    appointmentId?: string;
    includeSymptoms: boolean;
    includeMedications: boolean;
    includeQuestions: boolean;
    customNotes?: string;
  }) {
    return request<VisitSummary>('/summaries/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async saveVisitSummary(data: Omit<VisitSummary, 'id' | 'userId' | 'createdAt'>) {
    return request<VisitSummary>('/summaries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteVisitSummary(id: string) {
    return request<{ success: boolean }>(`/summaries/${id}`, {
      method: 'DELETE',
    });
  },

  // Profile & Settings
  async updateProfile(updates: Partial<User>) {
    return request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteAccount() {
    return request<{ success: boolean; message: string }>('/user/account', {
      method: 'DELETE',
    });
  },
};
