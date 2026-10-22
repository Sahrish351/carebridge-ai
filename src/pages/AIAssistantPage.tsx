import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { ChatMessage, ChatSession } from '../types';
import {
  Sparkles,
  Send,
  Trash2,
  ExternalLink,
  ShieldAlert,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Heart,
  ChevronRight,
  Info,
  RefreshCw,
  Clock,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

interface AIAssistantPageProps {
  onNavigate: (page: string) => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptCategories = [
    {
      category: 'Side Effects & Comfort',
      prompts: [
        'What are common side effects of chemotherapy and how can I manage them?',
        'How can I soothe mild peripheral neuropathy in my fingers and toes?',
        'What foods help alleviate taste alterations (metallic taste)?',
      ],
    },
    {
      category: 'Appointment Preparation',
      prompts: [
        'What critical questions should I ask my oncologist at my next visit?',
        'What should I monitor between chemotherapy infusion cycles?',
        'What lab values (like CBC counts) should I ask my doctor to explain?',
      ],
    },
    {
      category: 'Urgent Safety & Triage',
      prompts: [
        'What red-flag symptoms require contacting my oncology team immediately?',
        'What should I do if I get chills or a fever during chemotherapy?',
      ],
    },
  ];

  const loadSessions = async () => {
    try {
      const sessions = await api.getAiSessions();
      if (sessions.length > 0) {
        const first = sessions[0];
        setSessionId(first.id);
        setMessages(first.messages);
      } else {
        const welcomeMsg: ChatMessage = {
          id: 'welcome_1',
          role: 'assistant',
          content: `Hello! I am your CareBridge AI Health Assistant.

I'm here to provide plain-language, evidence-grounded answers about chemotherapy recovery, side-effect comfort, nutrition hints, and doctor-visit preparation.

*Important: I provide educational health information and cannot diagnose conditions, alter medication doses, or replace your licensed medical team.*

How can I support your care journey today?`,
          sources: [
            {
              title: 'Chemotherapy and You: Support for People With Cancer',
              url: 'https://www.cancer.gov/publications/patient-education/chemotherapy-and-you',
              organization: 'National Cancer Institute',
            },
            {
              title: 'Managing Chemotherapy Side Effects',
              url: 'https://www.cancer.org/treatment/treatments-and-side-effects/treatment-types/chemotherapy/chemotherapy-side-effects.html',
              organization: 'American Cancer Society',
            },
          ],
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMsg]);
      }
    } catch {
      // Fallback greeting if sessions can't be fetched
      const welcomeMsg: ChatMessage = {
        id: 'welcome_offline',
        role: 'assistant',
        content: `Hello! I am your CareBridge AI Health Assistant.

I am ready to help answer questions about your treatment, coping strategies, and appointment questions. All factual guidance is linked to published oncology guidelines.`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (promptToSend?: string) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || loading) return;

    setErrorMsg('');
    setLastFailedPrompt(null);
    setInputPrompt('');

    const tempUserMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await api.askAi(text, sessionId);
      if (res.sessionId) setSessionId(res.sessionId);
      setMessages((prev) => [...prev, res.message]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to retrieve answer. Please click Retry.');
      setLastFailedPrompt(text);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedPrompt) {
      handleSendMessage(lastFailedPrompt);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your current conversation?')) {
      if (sessionId) {
        try {
          await api.clearAiSession(sessionId);
        } catch {
          // ignore
        }
      }
      setMessages([
        {
          id: `fresh_${Date.now()}`,
          role: 'assistant',
          content: 'Chat cleared. What questions can I help you explore today?',
          timestamp: new Date().toISOString(),
        },
      ]);
      setErrorMsg('');
      setLastFailedPrompt(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header bar with connection status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <span>AI Health Assistant</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online & Grounded
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Grounded in clinical oncology evidence from NCI, ACS, and Mayo Clinic.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('doctor-visit-prep')}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Prepare Visit Agenda</span>
          </button>
          <button
            onClick={handleClearHistory}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-medium"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Safety & Emergency Warning */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/90 rounded-2xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-amber-950">Important Clinical Boundaries:</strong> CareBridge AI is an organization and educational support tool. It does not provide medical diagnoses, alter prescriptions, or replace your licensed care team. If you experience a fever &ge; 100.4&deg;F (38.0&deg;C), acute chest pain, or severe shortness of breath, call your oncology triage emergency number or local emergency services immediately.
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md shadow-indigo-100/30 flex flex-col justify-between overflow-hidden">
        {/* Messages Stream */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[580px] overflow-y-auto">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-rose-400 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50/90 border border-slate-200/90 text-slate-800'
                  }`}
                >
                  {/* Message body */}
                  <div className="whitespace-pre-line space-y-2">{msg.content}</div>

                  {/* Sources List */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3.5 border-t border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Verified Medical Citations:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:border-indigo-300 transition-all shadow-2xs hover:shadow-xs"
                          >
                            <span>{src.organization} — {src.title.length > 38 ? src.title.slice(0, 35) + '...' : src.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Footer with Copy Control and Disclaimer */}
                  <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="italic">
                      {isUser ? 'Sent by you' : 'Educational response · CareBridge AI'}
                    </span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-2xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 font-bold text-xs mt-1">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-900 w-fit">
              <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>Grounding clinical guidance with verified oncology sources...</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              {lastFailedPrompt && (
                <button
                  onClick={handleRetry}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Drawer */}
        <div className="px-5 sm:px-7 py-3 bg-slate-50/80 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Suggested Question Bank
            </span>
            <span className="text-[11px] text-slate-400">Tap to send</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {promptCategories.flatMap((c) => c.prompts).slice(0, 4).map((q, qIdx) => (
              <button
                key={qIdx}
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="px-3.5 py-1.5 bg-white border border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl text-slate-700 whitespace-nowrap transition-all text-xs shadow-2xs disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 sm:p-5 bg-white border-t border-slate-200"
        >
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask about symptoms, chemotherapy recovery, nutrition, or doctor questions..."
              disabled={loading}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-bold transition-all disabled:opacity-40 flex items-center justify-center shadow-md shadow-indigo-100"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Server-side verification active · No API keys exposed</span>
            <button
              type="button"
              onClick={() => onNavigate('resources')}
              className="hover:text-indigo-600 font-medium"
            >
              View Trusted Oncology Guides →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
