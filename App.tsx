import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Lightbulb, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Bell,
  User,
  LogOut,
  ChevronRight
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import Suggestions from './pages/Suggestions';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';
import { FeedbackEntry } from './types';

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

// Fix: Explicitly type AppLayout as React.FC to resolve children prop missing error
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">FeedAI</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-indigo-600 rounded-lg mx-auto flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
          <SidebarItem to="/analyze" icon={Search} label="Analyze" active={location.pathname === '/analyze'} />
          <SidebarItem to="/suggestions" icon={Lightbulb} label="Suggestions" active={location.pathname === '/suggestions'} />
          <SidebarItem to="/reports" icon={BarChart3} label="Reports" active={location.pathname === '/reports'} />
          <SidebarItem to="/settings" icon={Settings} label="Settings" active={location.pathname === '/settings'} />
        </nav>

        <div className="p-4 border-t border-slate-100">
           <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 text-slate-400"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800">
            {location.pathname === '/' ? 'Dashboard Overview' : 
             location.pathname === '/analyze' ? 'Analyze Feedback' :
             location.pathname === '/suggestions' ? 'AI Recommendations' :
             location.pathname === '/reports' ? 'Detailed Analytics' : 'Settings'}
          </h2>
          
          <div className="flex items-center space-x-6">
            <button className="text-slate-400 hover:text-indigo-600 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 border-l pl-6 border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">Alex Chen</p>
                <p className="text-xs text-slate-400 font-medium">Product Manager</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm">
                AC
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const App = () => {
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackEntry[]>([]);

  // Load sample data if empty
  useEffect(() => {
    const stored = localStorage.getItem('feedback_history');
    if (stored) {
      setFeedbackHistory(JSON.parse(stored));
    }
  }, []);

  const addFeedback = (entry: FeedbackEntry) => {
    const updated = [entry, ...feedbackHistory];
    setFeedbackHistory(updated);
    localStorage.setItem('feedback_history', JSON.stringify(updated));
  };

  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard history={feedbackHistory} />} />
          <Route path="/analyze" element={<Analyze onComplete={addFeedback} />} />
          <Route path="/suggestions" element={<Suggestions history={feedbackHistory} />} />
          <Route path="/reports" element={<Reports history={feedbackHistory} />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  );
};

export default App;