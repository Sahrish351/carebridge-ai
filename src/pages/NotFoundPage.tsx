import React from 'react';
import { Heart, Home, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (page: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-md">
          <Heart className="w-8 h-8 fill-indigo-600" />
        </div>
        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-indigo-600 font-mono">404</span>
          <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The page you are looking for doesn’t exist or has moved. Let’s take you back to a safe place.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
