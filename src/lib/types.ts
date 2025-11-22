import type { LucideIcon } from 'lucide-react';

export type MainNavItem = 'dashboard' | 'stamina' | 'analysis' | 'amplification' | 'trends';

export type FocusState = 'FLOW' | 'NEUTRAL' | 'DISTRACTED' | 'BREAK';

export interface DailyTimeline {
  time: string;
  state: FocusState;
  duration: number;
}

export interface WeeklyStamina {
  day: string;
  score: number;
  sessions: number;
  avgLength: number;
}

export interface Breaker {
  name: string;
  count: number;
  color: string;
}

export interface Trigger {
  name: string;
  impact: string;
  type: 'app' | 'music' | 'time' | 'setting';
}

export interface AiInsight {
  id: number;
  type: string;
  text: string;
  icon: string; // Lucide icon name as string
}

export interface Task {
  id: number;
  title: string;
  duration: string;
  xp: number;
  completed: boolean;
}

export interface ForestTree {
  id: number;
  type: 'pine' | 'oak' | 'sapling';
  stage: 1 | 2 | 3;
}

export interface AnalysisModel {
  id: 'rf' | 'xgb' | 'rule';
  name: string;
  desc: string;
}

export type AmpState = {
  ampMusic: boolean;
  ampLight: boolean;
  ampNLP: boolean;
  ampBreath: boolean;
  ampPosture: boolean;
  ampStreak: boolean;
};
