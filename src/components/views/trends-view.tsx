'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { WEEKLY_STAMINA_DATA } from '@/lib/data';
import { CheckCircle2 } from '@/components/icons';

export default function TrendsView() {
  return (
    <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-end">
            <div>
              <CardTitle className="text-xl mb-2">Weekly Stamina Trend</CardTitle>
              <p className="text-muted-foreground">Tracking your ability to sustain Deep Work over time.</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">56.2</div>
              <div className="text-sm text-primary">Avg Weekly Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_STAMINA_DATA}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}/>
                <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
           <CardHeader>
             <CardTitle>Stamina Formula</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="bg-secondary p-4 rounded-lg font-mono text-xs text-muted-foreground border">
               S = (Avg_Session_Len × Num_Sessions) - (Distractions × Penalty)
             </div>
             <p className="text-sm text-muted-foreground mt-4">
               Your score is improving primarily due to increased average session length (<span className="text-emerald-600 font-medium">+7m this week</span>).
             </p>
           </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next Level Targets</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-foreground">
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground flex items-center justify-center"></div>
                Reach 70 Stamina Score (Curr: 67)
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <CheckCircle2 size={16} className="text-primary"/>
                Reduce daily distractions under 10
              </li>
              <li className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground flex items-center justify-center"></div>
                Maintain 4h Flow Time for 3 days
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
