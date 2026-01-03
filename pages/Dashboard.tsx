import React, { useMemo } from 'react';
import { 
  Users, 
  Smile, 
  Frown, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  // Fix: Added missing icon imports
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from 'recharts';
import { FeedbackEntry, DashboardStats } from '../types';
import { Link } from 'react-router-dom';

interface DashboardProps {
  history: FeedbackEntry[];
}

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
        {trend && (
          <div className={`flex items-center mt-2 text-xs font-semibold ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend > 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            {Math.abs(trend)}% vs last month
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  const stats = useMemo(() => {
    if (history.length === 0) return { totalFeedback: 0, avgSentiment: 0, positiveRatio: 0, topIssue: 'N/A' };
    
    const results = history.filter(h => h.result).map(h => h.result!);
    const avgScore = results.reduce((acc, curr) => acc + curr.sentimentScore, 0) / results.length;
    const posCount = results.filter(r => r.sentimentLabel === 'Positive').length;
    
    // Simple frequency count for issues
    const issueMap: Record<string, number> = {};
    results.forEach(r => r.keyIssues.forEach(issue => {
      issueMap[issue] = (issueMap[issue] || 0) + 1;
    }));
    const topIssue = Object.entries(issueMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None detected';

    return {
      totalFeedback: history.length,
      avgSentiment: Math.round(avgScore),
      positiveRatio: Math.round((posCount / results.length) * 100),
      topIssue
    };
  }, [history]);

  const sentimentData = useMemo(() => {
    const counts = { Positive: 0, Neutral: 0, Negative: 0 };
    history.forEach(h => {
      if (h.result) counts[h.result.sentimentLabel]++;
    });
    return [
      { name: 'Positive', value: counts.Positive, color: '#10b981' },
      { name: 'Neutral', value: counts.Neutral, color: '#f59e0b' },
      { name: 'Negative', value: counts.Negative, color: '#f43f5e' },
    ].filter(d => d.value > 0);
  }, [history]);

  const trendData = useMemo(() => {
    // Group by date - very simple for demo
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayFeedback = history.filter(h => h.date.startsWith(date) && h.result);
      const score = dayFeedback.length > 0 
        ? dayFeedback.reduce((acc, curr) => acc + curr.result!.sentimentScore, 0) / dayFeedback.length 
        : 0;
      return { date: date.slice(5), score: Math.round(score) };
    });
  }, [history]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Feedback" value={stats.totalFeedback} icon={Users} trend={12} color="bg-indigo-600" />
        <StatCard title="Avg Sentiment" value={`${stats.avgSentiment}%`} icon={Smile} trend={5} color="bg-emerald-600" />
        <StatCard title="Positivity Ratio" value={`${stats.positiveRatio}%`} icon={TrendingUp} trend={-2} color="bg-sky-600" />
        <StatCard title="Top Pain Point" value={stats.topIssue.length > 15 ? stats.topIssue.slice(0, 15) + '...' : stats.topIssue} icon={AlertCircle} color="bg-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sentiment Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Sentiment Mix</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-around">
            {sentimentData.map((d) => (
              <div key={d.name} className="text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{d.name}</p>
                <p className="text-lg font-bold text-slate-800">{d.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Sentiment Trend (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#6366f1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Suggestions Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Top Priority Suggestions</h3>
            <Link to="/suggestions" className="text-indigo-600 text-sm font-semibold flex items-center hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {history.slice(0, 3).flatMap(h => h.result?.suggestions || []).filter(s => s.priority === 'High').slice(0, 3).map((s, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 rounded-xl border border-slate-50 bg-slate-50/50">
                <div className={`p-2 rounded-lg bg-indigo-100 text-indigo-600`}>
                  <Lightbulb size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{s.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{s.description}</p>
                </div>
              </div>
            ))}
            {history.length === 0 && <p className="text-slate-400 text-center py-8">No analysis data yet.</p>}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Feedbacks</h3>
          <div className="space-y-4">
            {history.slice(0, 4).map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-100 transition-colors">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className={`w-2 h-2 rounded-full ${h.result?.sentimentLabel === 'Positive' ? 'bg-emerald-500' : h.result?.sentimentLabel === 'Negative' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                  <p className="text-sm text-slate-600 truncate max-w-[200px]">{h.content}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">{new Date(h.date).toLocaleDateString()}</span>
              </div>
            ))}
            {history.length === 0 && <p className="text-slate-400 text-center py-8">Start by analyzing some feedback.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;