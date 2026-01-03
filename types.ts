
export type Sentiment = 'Positive' | 'Neutral' | 'Negative';
export type Emotion = 'Happy' | 'Angry' | 'Frustrated' | 'Satisfied' | 'Confused';
export type Priority = 'High' | 'Medium' | 'Low';
export type Category = 'UI/UX' | 'Performance' | 'Content' | 'Support' | 'Pricing' | 'Other';

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  actionItems: string[];
}

export interface AnalysisResult {
  summary: string;
  sentimentScore: number; // 0-100
  sentimentLabel: Sentiment;
  emotions: Emotion[];
  keywords: string[];
  keyIssues: string[];
  suggestions: Suggestion[];
  timestamp: string;
}

export interface FeedbackEntry {
  id: string;
  content: string;
  source: string;
  date: string;
  result?: AnalysisResult;
}

export interface DashboardStats {
  totalFeedback: number;
  avgSentiment: number;
  positiveRatio: number;
  topIssue: string;
}
