'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Zap,
  Headphones,
  Lightbulb,
  MessageSquare,
  Mic,
  Eye,
  Flame,
  Music,
  Sun,
  CheckCircle2,
} from '@/components/icons';
import type { AmpState } from '@/lib/types';
import { cn } from '@/lib/utils';

// Reusable Amplification Card
const AmplificationCard = ({
  icon: Icon,
  title,
  status,
  children,
  active,
  toggle,
}: {
  icon: React.ElementType;
  title: string;
  status: string;
  children: React.ReactNode;
  active: boolean;
  toggle: () => void;
}) => (
  <Card
    className={cn(
      'transition-all',
      active
        ? 'bg-card border-primary/50 shadow-lg shadow-primary/10'
        : 'bg-secondary/50 hover:border-muted-foreground/30'
    )}
  >
    <CardHeader>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'p-2.5 rounded-lg',
              active ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'
            )}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
          </div>
          <div>
            <h3 className={cn('font-semibold', active ? 'text-foreground' : 'text-muted-foreground')}>
              {title}
            </h3>
            <p className="text-xs text-muted-foreground">{status}</p>
          </div>
        </div>
        <Switch checked={active} onCheckedChange={toggle} aria-label={`Toggle ${title}`} />
      </div>
    </CardHeader>
    <CardContent className={cn('transition-opacity duration-300', active ? 'opacity-100' : 'opacity-40 grayscale')}>
      {children}
    </CardContent>
  </Card>
);

interface AmplificationViewProps {
  ampState: AmpState;
  setAmpState: { [K in keyof AmpState as `set${Capitalize<string & K>}`]: React.Dispatch<React.SetStateAction<boolean>> };
  activeTab: string;
}

export default function AmplificationView({ ampState, setAmpState, activeTab }: AmplificationViewProps) {
  const { ampMusic, ampLight, ampNLP, ampBreath, ampPosture, ampStreak } = ampState;
  const { setAmpMusic, setAmpLight, setAmpNLP, setAmpBreath, setAmpPosture, setAmpStreak } = setAmpState;

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-500">
      <Card className="bg-gradient-to-r from-amber-50 to-background border-amber-200/80">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <CardTitle className="flex items-center gap-2 text-xl text-amber-800">
                    <Zap /> Amplification Control Center
                </CardTitle>
                <p className="text-muted-foreground mt-1">Manage active environmental and physiological boosters.</p>
            </div>
             <div className="text-right mt-2 sm:mt-0">
                <div className="text-sm font-bold text-amber-700">AUTO-PILOT ACTIVE</div>
                <p className="text-xs text-muted-foreground">System automatically engages tools on flow detect</p>
              </div>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AmplificationCard title="Neural Audio" status="Brain.fm Integration" icon={Headphones} active={ampMusic} toggle={() => setAmpMusic(!ampMusic)}>
          <div className="mt-4 p-3 bg-secondary rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-foreground">DEEP FOCUS</span>
              <span className="text-xs text-primary animate-pulse">● LIVE</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background rounded flex items-center justify-center text-muted-foreground">
                <Music size={16} />
              </div>
              <div className="flex-1">
                <div className="h-1 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                  </div>
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                  <span>Low-Fi 100Hz</span>
                  <span>High Intensity</span>
                </div>
              </div>
            </div>
          </div>
        </AmplificationCard>
        
        <AmplificationCard title="Dynamic Lighting" status="Philips Hue Bridge" icon={Lightbulb} active={ampLight} toggle={() => setAmpLight(!ampLight)}>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Temperature</span>
                <span className="font-bold text-foreground">4500K (Focus)</span>
              </div>
              <input type="range" className="w-full h-1 bg-gradient-to-r from-orange-300 via-white to-blue-300 rounded-lg appearance-none cursor-pointer accent-primary" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sun size={12} /> Auto-adjusts based on circadian rhythm
              </div>
            </div>
        </AmplificationCard>

        <AmplificationCard title="Context Shield" status="NLP Task Monitor" icon={MessageSquare} active={ampNLP} toggle={() => setAmpNLP(!ampNLP)}>
            <div className="mt-4 p-3 bg-secondary rounded border text-xs font-mono">
                <p className="text-muted-foreground mb-1">{'>'} DETECTED CONTEXT:</p>
                <p className="text-emerald-600 font-bold">CODING (REACT/JS)</p>
                <p className="text-muted-foreground mt-2 mb-1">{'>'} ACTIVE BLOCKS:</p>
                <div className="flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded border border-rose-200">YouTube</span>
                    <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded border border-rose-200">Reddit</span>
                </div>
            </div>
        </AmplificationCard>
        
        <AmplificationCard title="Respiration Monitor" status="Microphone Input" icon={Mic} active={ampBreath} toggle={() => setAmpBreath(!ampBreath)}>
            <div className="mt-4 flex items-end gap-1 h-12 justify-center">
                {[40, 60, 30, 80, 50, 70, 40, 60, 30, 50].map((h, i) => (
                    <div key={i} className="w-2 bg-emerald-500/50 rounded-t-sm transition-all duration-300" style={{ height: `${activeTab==='amplification' && ampBreath ? h + Math.random()*20 : 10}%` }}></div>
                ))}
            </div>
            <p className="mt-2 text-center text-xs text-emerald-600 font-bold">Status: Calm (14 breaths/min)</p>
        </AmplificationCard>
        
        <AmplificationCard title="Ergonomics AI" status="Camera Vision" icon={Eye} active={ampPosture} toggle={() => setAmpPosture(!ampPosture)}>
            <div className="mt-4 flex items-center justify-between bg-secondary p-3 rounded-lg">
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Posture</span>
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12}/> Optimal</span>
                </div>
                <div className="w-[1px] h-8 bg-border"></div>
                <div className="flex flex-col gap-1 text-right">
                    <span className="text-xs text-muted-foreground">Eye Fatigue</span>
                    <span className="text-sm font-bold text-foreground">Low</span>
                </div>
            </div>
        </AmplificationCard>
        
        <AmplificationCard title="Flow Streaks" status="Habit Engine" icon={Flame} active={ampStreak} toggle={() => setAmpStreak(!ampStreak)}>
            <div className="mt-4 text-center">
                <div className="inline-block p-3 rounded-full bg-orange-500/10 mb-2 ring-4 ring-orange-500/5">
                    <Flame size={24} className="text-orange-500 fill-orange-500 animate-pulse" />
                </div>
                <div className="text-2xl font-bold text-foreground">12 Days</div>
                <div className="text-xs text-muted-foreground">Current Deep Work Streak</div>
                <Progress value={75} className="mt-3 h-1.5 [&>div]:bg-orange-500" />
                <p className="text-[10px] text-muted-foreground mt-1 text-right">Next Level: 14 Days</p>
            </div>
        </AmplificationCard>
      </div>
    </div>
  );
}
