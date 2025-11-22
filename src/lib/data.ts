import type { DailyTimeline, WeeklyStamina, Breaker, Trigger, AiInsight, Task, ForestTree, AnalysisModel } from './types';

export const DAILY_TIMELINE_DATA: DailyTimeline[] = [
  { time: '09:00', state: 'NEUTRAL', duration: 15 },
  { time: '09:15', state: 'FLOW', duration: 45 },
  { time: '10:00', state: 'DISTRACTED', duration: 10 },
  { time: '10:10', state: 'BREAK', duration: 5 },
  { time: '10:15', state: 'FLOW', duration: 55 },
  { time: '11:10', state: 'BREAK', duration: 15 },
  { time: '11:25', state: 'FLOW', duration: 40 },
  { time: '12:05', state: 'NEUTRAL', duration: 30 },
  { time: '13:00', state: 'FLOW', duration: 60 },
  { time: '14:00', state: 'DISTRACTED', duration: 20 },
];

export const WEEKLY_STAMINA_DATA: WeeklyStamina[] = [
  { day: 'Mon', score: 42, sessions: 3, avgLength: 25 },
  { day: 'Tue', score: 48, sessions: 4, avgLength: 30 },
  { day: 'Wed', score: 45, sessions: 3, avgLength: 28 },
  { day: 'Thu', score: 55, sessions: 5, avgLength: 35 },
  { day: 'Fri', score: 67, sessions: 5, avgLength: 42 },
  { day: 'Sat', score: 60, sessions: 4, avgLength: 38 },
  { day: 'Sun', score: 72, sessions: 6, avgLength: 45 },
];

export const BREAKERS_DATA: Breaker[] = [
  { name: 'WhatsApp', count: 8, color: '#EF4444' },
  { name: 'Alt+Tab', count: 6, color: '#F59E0B' },
  { name: 'Idle Time', count: 2, color: '#6B7280' },
  { name: 'Email', count: 4, color: '#F59E0B' },
];

export const TRIGGERS_DATA: Trigger[] = [
  { name: 'VS Code Active', impact: '+35%', type: 'app' },
  { name: 'LoFi Playlist', impact: '+20%', type: 'music' },
  { name: 'Morning (9-11am)', impact: '+15%', type: 'time' },
  { name: 'DND Enabled', impact: '+40%', type: 'setting' },
];

// Note: Storing icon names as strings to be used in a map later.
export const AI_INSIGHTS_DATA: AiInsight[] = [
  { 
    id: 1, 
    type: 'Time-Based', 
    text: 'You focused best between 9am–11am today. Schedule your deepest work here tomorrow.', 
    icon: 'Clock' 
  },
  { 
    id: 2, 
    type: 'Breaker-Based', 
    text: 'WhatsApp broke your flow 3 times in the last hour. We recommend enabling Auto-Block for Social Apps.', 
    icon: 'Smartphone' 
  },
  { 
    id: 3, 
    type: 'Trigger-Based', 
    text: 'LoFi music increased your average flow duration by 15%. Consider auto-starting this playlist on flow detect.', 
    icon: 'Music' 
  }
];

export const TASKS_DATA: Task[] = [
  { id: 1, title: 'Complete React Component', duration: '45m', xp: 50, completed: true },
  { id: 2, title: 'Debug API Integration', duration: '30m', xp: 35, completed: false },
  { id: 3, title: 'Write Documentation', duration: '20m', xp: 20, completed: false },
  { id: 4, title: 'Code Review', duration: '15m', xp: 15, completed: false },
];

export const FOREST_DATA: ForestTree[] = [
  { id: 1, type: 'pine', stage: 3 },
  { id: 2, type: 'oak', stage: 3 },
  { id: 3, type: 'pine', stage: 2 },
  { id: 4, type: 'pine', stage: 3 },
  { id: 5, type: 'oak', stage: 3 },
  { id: 6, type: 'sapling', stage: 1 },
];

export const ANALYSIS_MODELS: AnalysisModel[] = [
  { id: 'rf', name: 'Global Model (Random Forest)', desc: 'Trained on general population data. Good baseline.' },
  { id: 'xgb', name: 'Personalized (XGBoost)', desc: 'Adapted to your specific typing/mouse patterns. High accuracy.' },
  { id: 'rule', name: 'Rule-Based Fallback', desc: 'Heuristic rules (high typing speed + low switching). Robust.' },
];
