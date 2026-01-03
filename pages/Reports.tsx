
import React, { useMemo } from 'react';
import { 
  Download, 
  Calendar, 
  Filter, 
  Share2,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TrendingUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { FeedbackEntry } from '../types';

interface ReportsProps {
  history: FeedbackEntry[];
}

const Reports: React.FC<ReportsProps> = ({ history }) => {
  const emotionDistribution = useMemo(() => {
    const emotionCounts: Record<string, number> = {};
    history.forEach(h => {
      h.result?.emotions.forEach(emo => {
        emotionCounts[emo] = (emotionCounts[emo] || 0) + 1;
      });
    });
    return Object.entries(emotionCounts).map(([name, value]) => ({ name, value }));
  }, [history]);

  const categoryMix = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    history.forEach(h => {
      h.result?.suggestions.forEach(s => {
        categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
      });
    });
    return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  }, [history]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Advanced Analytics</h3>
          <p className="text-slate-500">In-depth breakdown of feedback emotions, categories, and trends.</p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            <Calendar size={18} />
            <span>Last 30 Days</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
            <Download size={18} />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Emotion Breakdown */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-bold text-slate-800">Emotion Intensity</h4>
            <PieChartIcon className="text-indigo-500" size={20} />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={emotionDistribution}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={100}
                  tick={{ fontSize: 13, fontWeight: 600, fill: '#475569' }} 
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                  {emotionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-bold text-slate-800">Issue Categories</h4>
            <BarChartIcon className="text-emerald-500" size={20} />
          </div>
          <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categoryMix.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs font-semibold text-slate-500">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
               <TrendingUp size={24} />
             </div>
             <div>
               <h4 className="text-xl font-bold text-slate-800">Keyword Popularity</h4>
               <p className="text-sm text-slate-500">Most frequent topics detected across all feedback channels.</p>
             </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg">
            <Share2 size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
           {useMemo(() => {
             const keywords: Record<string, number> = {};
             history.forEach(h => h.result?.keywords.forEach(kw => keywords[kw] = (keywords[kw] || 0) + 1));
             return Object.entries(keywords).sort((a,b) => b[1] - a[1]).slice(0, 12);
           }, [history]).map(([word, count], i) => (
             <div key={i} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/30 text-center hover:bg-white hover:shadow-md transition-all cursor-default">
                <p className="text-sm font-bold text-slate-800">{word}</p>
                <p className="text-xs text-slate-400 mt-1 uppercase font-bold">{count} mentions</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
