
import React, { useState } from 'react';
import { 
  Upload, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Trash2,
  Mic,
  Info
} from 'lucide-react';
import { analyzeFeedback } from '../geminiService';
import { FeedbackEntry, AnalysisResult } from '../types';

interface AnalyzeProps {
  onComplete: (entry: FeedbackEntry) => void;
}

const Analyze: React.FC<AnalyzeProps> = ({ onComplete }) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setLastResult(null);

    try {
      const result = await analyzeFeedback(text);
      const entry: FeedbackEntry = {
        id: Math.random().toString(36).substr(2, 9),
        content: text,
        source: 'Manual Input',
        date: new Date().toISOString(),
        result
      };
      setLastResult(result);
      onComplete(entry);
    } catch (err: any) {
      setError('Analysis failed. Please check your API configuration or try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-indigo-50/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">New Feedback Analysis</h3>
            <p className="text-slate-500 mt-1">Paste your user feedback or upload a file for batch processing.</p>
          </div>
          <div className="flex space-x-2">
             <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Mic size={20} />
            </button>
            <button 
              onClick={() => setText('')}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="E.g. 'I love the new UI, but the dashboard loads slowly on my phone. Also, the subscription pricing is a bit confusing for new teams...'"
            className="w-full h-48 p-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition-all resize-none text-slate-700 leading-relaxed"
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-400 bg-white/80 backdrop-blur px-2 py-1 rounded">
            {text.length} characters
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full md:w-auto">
             <label className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 cursor-pointer text-slate-500 hover:text-indigo-600 transition-all bg-slate-50 hover:bg-indigo-50/30">
              <Upload size={20} />
              <span className="font-semibold text-sm">Upload CSV or TXT</span>
              <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileChange} />
            </label>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || isAnalyzing}
            className="w-full md:w-auto flex items-center justify-center space-x-2 px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:bg-slate-300 disabled:shadow-none transition-all"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Analyze Feedback</span>
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mt-6 flex items-center space-x-3 p-4 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>

      {lastResult && (
        <div className="space-y-6 animate-in zoom-in-95 fade-in duration-500">
          <div className="flex items-center space-x-2 text-emerald-600">
            <CheckCircle2 size={20} />
            <span className="font-bold">Analysis Complete</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sentiment Summary */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Sentiment</h4>
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                  lastResult.sentimentLabel === 'Positive' ? 'bg-emerald-100 text-emerald-600' :
                  lastResult.sentimentLabel === 'Negative' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {lastResult.sentimentScore}%
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg leading-none">{lastResult.sentimentLabel}</p>
                  <div className="flex mt-2 gap-1">
                    {lastResult.emotions.map((emo, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                        {emo}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-2">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Detected Topics</h4>
              <div className="flex flex-wrap gap-2">
                {lastResult.keywords.map((word, i) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <Info className="text-indigo-600" size={24} />
              <h3 className="text-xl font-bold text-slate-800">Executive Summary</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">
              {lastResult.summary}
            </p>
            
            <div className="mt-8 pt-8 border-t border-slate-100">
              <h4 className="font-bold text-slate-800 mb-4">Identified Pain Points</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lastResult.keyIssues.map((issue, i) => (
                  <div key={i} className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="mt-1 w-2 h-2 bg-rose-500 rounded-full" />
                    <p className="text-sm font-medium text-slate-700">{issue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyze;
