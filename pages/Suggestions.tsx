import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  Zap, 
  Layers, 
  Filter,
  CheckCircle,
  Clock
} from 'lucide-react';
import { FeedbackEntry, Suggestion, Priority, Category } from '../types';

interface SuggestionsProps {
  history: FeedbackEntry[];
}

// Fix: Typed SuggestionCard as React.FC to resolve error when passing 'key' prop in .map()
const SuggestionCard: React.FC<{ suggestion: Suggestion }> = ({ suggestion }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityStyles = {
    High: 'bg-rose-100 text-rose-700 border-rose-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  };

  const categoryIcons = {
    'UI/UX': <Layers size={16} />,
    'Performance': <Zap size={16} />,
    'Content': <FileText size={16} />,
    'Support': <Tag size={16} />,
    'Pricing': <Tag size={16} />,
    'Other': <Tag size={16} />
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${priorityStyles[suggestion.priority]}`}>
                {suggestion.priority} Priority
              </span>
              <span className="flex items-center space-x-1 px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                {suggestion.category}
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-800">{suggestion.title}</h4>
            <p className="text-slate-500 text-sm mt-1 line-clamp-2">{suggestion.description}</p>
          </div>
          <button className="p-2 text-slate-400">
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-50 bg-slate-50/50">
          <h5 className="text-sm font-bold text-slate-700 mb-4">Recommended Actions</h5>
          <div className="space-y-3">
            {suggestion.actionItems.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-100">
                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-slate-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FileText = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

const Suggestions: React.FC<SuggestionsProps> = ({ history }) => {
  const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');

  const allSuggestions = useMemo(() => {
    const list: Suggestion[] = [];
    history.forEach(h => {
      if (h.result?.suggestions) {
        h.result.suggestions.forEach(s => {
          // Deduplicate roughly by title
          if (!list.find(item => item.title === s.title)) {
            list.push(s);
          }
        });
      }
    });
    
    return list.filter(s => {
      const pMatch = filterPriority === 'All' || s.priority === filterPriority;
      const cMatch = filterCategory === 'All' || s.category === filterCategory;
      return pMatch && cMatch;
    }).sort((a, b) => {
      const weight = { High: 3, Medium: 2, Low: 1 };
      return weight[b.priority] - weight[a.priority];
    });
  }, [history, filterPriority, filterCategory]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Actionable Suggestions</h3>
          <p className="text-slate-500">AI-generated improvements based on your recent feedback trends.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
             <select 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <div className="relative">
             <select 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
            >
              <option value="All">All Categories</option>
              <option value="UI/UX">UI/UX</option>
              <option value="Performance">Performance</option>
              <option value="Support">Support</option>
              <option value="Pricing">Pricing</option>
            </select>
            <Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allSuggestions.map((s, i) => (
          <SuggestionCard key={i} suggestion={s} />
        ))}
        {allSuggestions.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Lightbulb className="mx-auto text-slate-300 mb-4" size={48} />
            <h4 className="text-lg font-bold text-slate-400">No suggestions yet</h4>
            <p className="text-slate-400 mt-2">Run an analysis to generate improvement ideas.</p>
          </div>
        )}
      </div>

      {allSuggestions.length > 0 && (
        <div className="bg-indigo-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h4 className="text-2xl font-bold mb-4">Export Analysis Report</h4>
              <p className="text-indigo-100 opacity-90 leading-relaxed max-w-xl">
                Need to share these insights with your team? Download a comprehensive PDF or Excel report containing all sentiment analysis and action items.
              </p>
            </div>
            <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-colors whitespace-nowrap">
              Download Report
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      )}
    </div>
  );
};

export default Suggestions;