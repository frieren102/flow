'use client';

import React, { useEffect, useState, Suspense } from 'react';
import type { MainNavItem, FocusState } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  Zap,
  Shield,
  Coffee,
  Calendar,
  ChevronRight,
  Trees,
  Music,
  Monitor,
  AlertCircle,
} from '@/components/icons';
import AiInsights from '@/components/shared/ai-insights';
import { cn } from '@/lib/utils';

// Stat Card Component
const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ElementType;
  trend?: number;
}) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex justify-between items-end">
        <p className="text-xs text-muted-foreground">{subtext}</p>
        {trend !== undefined && (
          <span
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              trend > 0
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            )}
          >
            {trend > 0 ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);

// Status Badge Component
const StatusBadge = ({ status }: { status: FocusState }) => {
  const styles: Record<FocusState, string> = {
    FLOW: 'bg-primary/10 text-primary border-primary/20',
    NEUTRAL: 'bg-slate-400/10 text-slate-600 border-slate-400/20',
    DISTRACTED: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    BREAK: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  };

  const icons: Record<FocusState, React.ElementType> = {
    FLOW: Zap,
    NEUTRAL: Monitor,
    DISTRACTED: AlertCircle,
    BREAK: Coffee,
  };

  const Icon = icons[status] || Monitor;
  const isFlow = status === 'FLOW';

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold tracking-wider transition-all',
        styles[status],
        isFlow && 'animate-pulse'
      )}
    >
      <Icon size={16} />
      <span>{status}</span>
    </div>
  );
};

// Timeline Segment Component
const TimelineSegment = ({ data }: { data: { time: string; state: FocusState; duration: number } }) => {
  const getColor = (state: FocusState) => {
    switch (state) {
      case 'FLOW': return 'bg-primary';
      case 'BREAK': return 'bg-emerald-500';
      case 'DISTRACTED': return 'bg-rose-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div
      className={cn('h-full rounded-sm relative group transition-all hover:brightness-110', getColor(data.state))}
      style={{ width: `${data.duration * 2}px`, minWidth: '4px' }}
    >
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 w-max">
        <div className="bg-card text-xs text-foreground px-2 py-1 rounded border shadow-xl">
          <span className="font-bold block">{data.time}</span>
          {data.state} ({data.duration}m)
        </div>
      </div>
    </div>
  );
};

interface LatestStateData {
  timestamp: string;
  mean_iki_ms: number;
  variance_iki: number;
  burstiness: number;
  total_keys: number;
  backspace_rate: number;
  backspaces: number;
  distance_px: number;
  click_rate_per_sec: number;
  mouse_clicks: number;
  idle_time_ms: number;
  state_prediction: string;
}

interface DashboardViewProps {
  setActiveTab: (tab: MainNavItem) => void;
}

export default function DashboardView({ setActiveTab }: DashboardViewProps) {
  const [latestState, setLatestState] = useState<LatestStateData | null>(null);
  const [timelineData, setTimelineData] = useState<{ time: string; state: FocusState; duration: number }[]>([]);

  // Fetch latest state every 5 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchLatestState = async () => {
      try {
        const res = await fetch('/api/latest_state/');
        if (!res.ok) throw new Error('Failed to fetch');
        const data: LatestStateData = await res.json();
        if (!isMounted) return;

        setLatestState(data);

        // Append to timeline (keep last 20 entries)
        const newSegment = {
          time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          state: data.state_prediction.toLowerCase() === 'flow' ? 'FLOW' :
                 data.state_prediction.toLowerCase() === 'break' ? 'BREAK' :
                 data.state_prediction.toLowerCase() === 'distracted' ? 'DISTRACTED' : 'NEUTRAL',
          duration: 30 // fixed duration for visualization
        };
        setTimelineData(prev => [...prev.slice(-19), newSegment]);
      } catch (err) {
        console.error('Error fetching latest state:', err);
      }
    };

    fetchLatestState();
    const interval = setInterval(fetchLatestState, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const liveStatus: FocusState = latestState
    ? timelineData.length ? timelineData[timelineData.length - 1].state : 'NEUTRAL'
    : 'NEUTRAL';

  const isFlow = liveStatus === 'FLOW';

  // Cards values directly from API
  const flowDuration = latestState ? Math.round((latestState.total_keys * latestState.mean_iki_ms) / 1000 / 60) : null;
  const longestSession = latestState ? Math.round(latestState.burstiness / 1000 / 60) : null;
  const distractions = latestState ? latestState.backspaces : null;
  const smartBreaks = latestState ? Math.round(latestState.idle_time_ms / 1000 / 60) : null;
  const currentProbability = latestState ? Math.min((1 - latestState.backspace_rate) * 100, 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">

      {/* Live Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg relative overflow-hidden">
          <div className={cn(
            'absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-3xl rounded-full transition-all duration-1000',
            isFlow ? 'opacity-100' : 'opacity-0'
          )}></div>
          <CardContent className="relative z-10 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Current Session State</h2>
                <p className="text-muted-foreground text-sm">Real-time classification by Sensor Agent</p>
              </div>
              <StatusBadge status={liveStatus} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Flow Probability</div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-light text-foreground">
                    {currentProbability.toFixed(0)}
                  </span>
                  <span className="text-xl text-muted-foreground mb-1">%</span>
                </div>
                <Progress value={currentProbability} className="h-2 mt-3" />
              </div>
              <div>
                <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">System Actions</div>
                <div className="flex flex-col gap-2 mt-2">
                  <div className={cn('flex items-center gap-2 text-sm', isFlow ? 'text-emerald-600' : 'text-slate-400')}>
                    <Shield size={14} /> DND Mode {isFlow ? 'Enabled' : 'Ready'}
                  </div>
                  <div className={cn('flex items-center gap-2 text-sm', isFlow ? 'text-emerald-600' : 'text-slate-400')}>
                    <Music size={14} /> Focus Music {isFlow ? 'Playing' : 'Paused'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Entry Points */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1 bg-gradient-to-br from-emerald-50 to-background border-emerald-200/80 relative overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-emerald-500/10 transition-all" onClick={() => setActiveTab('stamina')}>
            <div className="absolute right-0 top-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><Trees size={50} className="text-emerald-500"/></div>
            <CardContent className="relative z-10 p-5">
              <h3 className="font-bold text-base flex items-center gap-2 text-emerald-900">
                <Trees size={16} className="text-emerald-500"/> Habit & Forest
              </h3>
              <p className="text-xs text-emerald-800 mt-1 mb-3">Gamified Focus & Routines.</p>
              <div className="flex items-center text-xs font-semibold text-emerald-700 group-hover:text-emerald-900 transition-colors">
                Build Stamina <ChevronRight size={12} className="ml-1"/>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 bg-gradient-to-br from-amber-50 to-background border-amber-200/80 relative overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-amber-500/10 transition-all" onClick={() => setActiveTab('amplification')}>
            <div className="absolute right-0 top-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity"><Zap size={50} className="text-amber-500" /></div>
            <CardContent className="relative z-10 p-5">
              <h3 className="font-bold text-base flex items-center gap-2 text-amber-900">
                <Zap size={16} className="text-amber-500"/> Amplification Tools
              </h3>
              <p className="text-xs text-amber-800 mt-1 mb-3">Lighting, Music & Bio-feedback.</p>
              <div className="flex items-center text-xs font-semibold text-amber-700 group-hover:text-amber-900 transition-colors">
                Open Controls <ChevronRight size={12} className="ml-1"/>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Flow Duration" value={flowDuration ?? 'Loading...'} subtext="Goal: 4h" icon={Clock} trend={5} />
        <StatCard title="Longest Session" value={longestSession ?? 'Loading...'} subtext="Best: 1h 10m" icon={Zap} trend={12} />
        <StatCard title="Distractions" value={distractions ?? 'Loading...'} subtext="Blocked" icon={Shield} />
        <StatCard title="Smart Breaks" value={smartBreaks ?? 'Loading...'} subtext="Avg: 4.5/5" icon={Coffee} />
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar size={18} className="text-primary"/> Today's Flow Timeline
            </CardTitle>
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-primary rounded-sm"></div> Flow</span>
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Break</span>
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-rose-500 rounded-sm"></div> Distracted</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-secondary rounded-lg p-2">
            <div className="h-12 flex items-center overflow-x-auto overflow-y-hidden">
              {timelineData.map((segment, i) => <TimelineSegment key={i} data={segment} />)}
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground px-1 font-mono">
            <span>09:00</span><span>11:00</span><span>13:00</span><span>15:00</span><span>17:00</span>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Suspense fallback={<Card><CardContent>Loading AI Insights...</CardContent></Card>}>
        <AiInsights />
      </Suspense>

    </div>
  );
}
