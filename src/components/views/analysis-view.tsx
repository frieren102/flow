'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Activity,
  Download,
  Keyboard,
  AlertCircle,
  MousePointer,
  Monitor,
} from '@/components/icons';
import { ANALYSIS_MODELS } from '@/lib/data';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, Line, BarChart, Bar } from 'recharts';
import { WEEKLY_STAMINA_DATA } from '@/lib/data';

const FeatureCard = ({ icon: Icon, label, value, unit, status }: {
  icon: React.ElementType,
  label: string,
  value: string,
  unit: string,
  status?: 'good' | 'bad' | 'neutral'
}) => (
  <div className="bg-secondary/50 border p-3 rounded-lg flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-background rounded text-muted-foreground">
        <Icon size={14} />
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </div>
    <div className="text-right">
      <div className={`font-mono font-bold ${status === 'good' ? 'text-emerald-600' : status === 'bad' ? 'text-rose-600' : 'text-foreground'}`}>
        {value} <span className="text-[10px] text-muted-foreground font-normal">{unit}</span>
      </div>
    </div>
  </div>
);

interface AnalysisViewProps {
  selectedModel: string;
  setSelectedModel: (modelId: 'rf' | 'xgb' | 'rule') => void;
  historyView: string;
  setHistoryView: (view: 'day' | 'week' | 'month') => void;
}

export default function AnalysisView({ selectedModel, setSelectedModel, historyView, setHistoryView }: AnalysisViewProps) {
  const [liveData, setLiveData] = useState<any>(null);

  // Fetch live JSON data every 5 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/latest_state'); // your proxy API
        const data = await res.json();
        setLiveData(data);
      } catch (err) {
        console.error('Failed to fetch live data', err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!liveData) return <div>Loading Analysis...</div>;

  // Calculations
  const sessionMinutes = Math.max((liveData.mean_iki_ms * liveData.total_keys) / 1000 / 60, 1);
  const features = {
    wpm: (liveData.total_keys / 5) / sessionMinutes,
    errorRate: liveData.backspace_rate * 100,
    clickRate: liveData.mouse_clicks / sessionMinutes,
    appContext: 'VS Code',
    hrv: liveData.burstiness / 1000,
  };

  const probData = [{ time: new Date(liveData.timestamp).toLocaleTimeString(), prob: 1 - liveData.backspace_rate }];
  const isSimulationRunning = true;

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-500">
      {/* Header */}
      <Card>
        <CardHeader className="flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Activity className="text-primary" /> Flow State Analysis Engine
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time inference, feature monitoring, and model configuration.
            </p>
          </div>
          <ToggleGroup type="single" value={selectedModel} onValueChange={(value) => value && setSelectedModel(value as any)} className="bg-secondary border rounded-lg">
            {ANALYSIS_MODELS.map(model => (
              <ToggleGroupItem key={model.id} value={model.id} className="text-xs rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                {model.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardHeader>
      </Card>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider flex justify-between items-center text-muted-foreground">
              <span>Live Sensor Feed</span>
              <span className={`w-2 h-2 rounded-full ${isSimulationRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground mb-1">Keyboard & Mouse Dynamics</p>
            <FeatureCard icon={Keyboard} label="Typing Speed" value={features.wpm.toFixed(0)} unit="wpm" status={features.wpm > 40 ? 'good' : 'neutral'} />
            <FeatureCard icon={AlertCircle} label="Error Rate" value={features.errorRate.toFixed(1)} unit="%" status={features.errorRate < 3 ? 'good' : 'bad'} />
            <FeatureCard icon={MousePointer} label="Mouse Activity" value={features.clickRate.toFixed(0)} unit="actions/min" status="neutral" />
            <p className="text-xs text-muted-foreground mb-1 pt-4">System Context</p>
            <FeatureCard icon={Monitor} label="Active App" value={features.appContext} unit="" status={features.appContext === 'VS Code' ? 'good' : 'bad'} />
            <FeatureCard icon={Activity} label="Heart Rate Var." value={features.hrv.toFixed(0)} unit="ms" status="neutral" />
          </CardContent>
        </Card>

        {/* Flow Probability Chart */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Flow Probability Inference</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] w-full bg-secondary/50 rounded-lg border p-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={probData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis domain={[0, 1]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} labelStyle={{ color: 'hsl(var(--foreground))' }} itemStyle={{ color: 'hsl(var(--primary))' }} />
                <ReferenceLine y={0.7} stroke="hsl(var(--chart-2))" strokeDasharray="3 3" />
                <ReferenceLine y={0.4} stroke="hsl(var(--chart-5))" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="prob" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Historical Trends */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Historical Flow Trends</h3>
              <p className="text-sm text-muted-foreground">Frequency and duration analysis over time.</p>
            </div>
            <div className="flex bg-secondary rounded-lg p-1 border">
              {['day', 'week', 'month'].map(view => (
                <Button key={view} onClick={() => setHistoryView(view as any)} variant={historyView === view ? "outline" : "ghost"} size="sm" className={`capitalize ${historyView === view ? 'bg-background shadow' : ''}`}>
                  {view}
                </Button>
              ))}
              <Button variant="ghost" size="sm" className="ml-2 border-l rounded-l-none">
                <Download size={14} className="mr-2" /> Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_STAMINA_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="avgLength" name="Avg Session (min)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sessions" name="Session Count" fill="hsl(var(--accent-foreground))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
