import React, { useState } from 'react';
import { ResourceItem } from '../types';
import {
  BookOpen,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Sparkles,
} from 'lucide-react';

interface ResourcesPageProps {
  onNavigate: (page: string) => void;
}

const VERIFIED_RESOURCES: ResourceItem[] = [
  {
    id: 'res_1',
    title: 'Chemotherapy and You: Support for People With Cancer',
    organization: 'National Cancer Institute (NCI)',
    category: 'chemo',
    description: 'A comprehensive, evidence-based guide for patients receiving chemotherapy, detailing side-effect relief, blood counts, and self-care.',
    url: 'https://www.cancer.gov/publications/patient-education/chemotherapy-and-you',
    verifiedDate: 'Reviewed 2026',
  },
  {
    id: 'res_2',
    title: 'Managing Chemotherapy Side Effects',
    organization: 'American Cancer Society (ACS)',
    category: 'chemo',
    description: 'Practical clinical instructions for managing nausea, fatigue, peripheral neuropathy, hair loss, and changes in taste.',
    url: 'https://www.cancer.org/treatment/treatments-and-side-effects/treatment-types/chemotherapy/chemotherapy-side-effects.html',
    verifiedDate: 'Reviewed 2026',
  },
  {
    id: 'res_3',
    title: 'Eating Hints: Before, During, and After Cancer Treatment',
    organization: 'National Cancer Institute (NCI)',
    category: 'nutrition',
    description: 'Dietary strategies to maintain caloric density, manage appetite loss, prevent dehydration, and cope with taste alterations.',
    url: 'https://www.cancer.gov/publications/patient-education/eatinghints.pdf',
    verifiedDate: 'Reviewed 2026',
  },
  {
    id: 'res_4',
    title: 'Coping with Cancer: Emotional Support & Mental Wellbeing',
    organization: 'Cancer Research UK',
    category: 'emotional',
    description: 'Techniques for managing scan anxiety, uncertainty, depression, and communication with family and healthcare professionals.',
    url: 'https://www.cancerresearchuk.org/about-cancer/coping/emotionally',
    verifiedDate: 'Reviewed 2026',
  },
  {
    id: 'res_5',
    title: 'Caregiver Support: Helping Someone with Cancer',
    organization: 'American Cancer Society (ACS)',
    category: 'caregiver',
    description: 'Practical guidance for spouses and family caregivers on avoiding burnout, managing medication schedules, and coordinating clinical transport.',
    url: 'https://www.cancer.org/treatment/caregivers.html',
    verifiedDate: 'Reviewed 2026',
  },
  {
    id: 'res_6',
    title: 'World Health Organization: Global Cancer Fact Sheets & Standards',
    organization: 'World Health Organization (WHO)',
    category: 'clinical',
    description: 'Global standards for cancer diagnosis, essential medicines list, supportive palliative care protocols, and patient safety guidelines.',
    url: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
    verifiedDate: 'Reviewed 2026',
  },
  {
    id: 'res_7',
    title: 'Questions to Ask Your Doctor About Cancer Treatment',
    organization: 'American Cancer Society (ACS)',
    category: 'clinical',
    description: 'A structured checklist of high-value questions for medical oncologists, radiation oncologists, and surgical specialists.',
    url: 'https://www.cancer.org/treatment/finding-and-paying-for-treatment/choosing-your-treatment-team/questions-to-ask-your-doctor.html',
    verifiedDate: 'Reviewed 2026',
  },
  {
    id: 'res_8',
    title: 'Radiation Therapy and You',
    organization: 'National Cancer Institute (NCI)',
    category: 'chemo',
    description: 'In-depth guide covering external beam radiation, skin protection protocols, fatigue management, and follow-up care.',
    url: 'https://www.cancer.gov/publications/patient-education/radiation-and-you',
    verifiedDate: 'Reviewed 2026',
  },
];

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'chemo', label: 'Chemo & Radiation' },
    { id: 'nutrition', label: 'Nutrition & Diet' },
    { id: 'emotional', label: 'Emotional Support' },
    { id: 'caregiver', label: 'Caregivers' },
    { id: 'clinical', label: 'Doctor Visit Prep' },
  ];

  const filteredResources = VERIFIED_RESOURCES.filter((res) => {
    const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide uppercase">
          Verified Evidence
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Trusted Medical Resources
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Curated clinical education from the world’s leading oncology institutions. Every resource is verified for accuracy, plain language, and patient safety.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, symptom, medication or institution (e.g. nausea, Mayo Clinic, nutrition)..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills/Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                  {item.organization}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {item.verifiedDate}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified External Source
              </span>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <span>Read Full Guide</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No resources found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or switch category filter to "All Resources".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Ask AI about these resources banner */}
      <div className="p-6 bg-gradient-to-r from-purple-50 via-indigo-50 to-rose-50 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5 justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Need help understanding these guidelines?
          </p>
          <p className="text-xs text-slate-600">
            Ask our AI Health Assistant to explain any term or concept in simple, everyday language.
          </p>
        </div>
        <button
          onClick={() => onNavigate('ai-assistant')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 whitespace-nowrap shadow-xs"
        >
          Ask AI Assistant
        </button>
      </div>
    </div>
  );
};
