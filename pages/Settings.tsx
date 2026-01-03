
import React from 'react';
import { User, Bell, Shield, Cloud, CreditCard, ChevronRight } from 'lucide-react';

const SettingsItem = ({ icon: Icon, title, desc }: any) => (
  <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 group-hover:text-indigo-600 transition-colors">
        <Icon size={20} />
      </div>
      <div className="text-left">
        <p className="font-bold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-400" />
  </button>
);

const Settings: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        <div className="inline-block relative">
           <div className="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center text-3xl font-bold text-indigo-600 border-4 border-white shadow-xl">
             AC
           </div>
           <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg border border-slate-100 text-slate-500 hover:text-indigo-600">
             <User size={16} />
           </button>
        </div>
        <h3 className="mt-6 text-2xl font-bold text-slate-800">Alex Chen</h3>
        <p className="text-slate-500">alex.chen@example.com • Administrator</p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Account Settings</h4>
          <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm">
            <SettingsItem icon={User} title="Personal Information" desc="Manage your personal details and bio" />
            <SettingsItem icon={Bell} title="Notifications" desc="Set your email and browser alert preferences" />
            <SettingsItem icon={Shield} title="Privacy & Security" desc="Two-factor authentication and passwords" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Workspace</h4>
          <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm">
            <SettingsItem icon={Cloud} title="API Integrations" desc="Connect Gemini API, Slack, and Zendesk" />
            <SettingsItem icon={CreditCard} title="Billing & Plans" desc="Manage your subscription and invoices" />
          </div>
        </div>
      </div>

      <div className="pt-10 flex items-center justify-between border-t border-slate-200">
        <button className="px-6 py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-xl transition-colors">
          Sign Out
        </button>
        <p className="text-xs text-slate-400 italic">v1.2.4 (Stable Build)</p>
      </div>
    </div>
  );
};

export default Settings;
