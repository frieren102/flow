'use client';

import React, { useState, useEffect, Suspense } from 'react';
import type { MainNavItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { inferFocusState } from '@/ai/flows/real-time-focus-inference';

import Header from '@/components/layout/header';
import DashboardView from '@/components/views/dashboard-view';
import StaminaView from '@/components/views/stamina-view';
import AnalysisView from '@/components/views/analysis-view';
import AmplificationView from '@/components/views/amplification-view';
import TrendsView from '@/components/views/trends-view';
import { TASKS_DATA } from '@/lib/data';

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainNavItem>('dashboard');
  const [liveStatus, setLiveStatus] = useState('NEUTRAL');
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { toast } = useToast();

  const [selectedModel, setSelectedModel] = useState('xgb');
  const [historyView, setHistoryView] = useState('week');

  const [ampMusic, setAmpMusic] = useState(true);
  const [ampLight, setAmpLight] = useState(false);
  const [ampNLP, setAmpNLP] = useState(true);
  const [ampBreath, setAmpBreath] = useState(false);
  const [ampPosture, setAmpPosture] = useState(true);
  const [ampStreak, setAmpStreak] = useState(true);

  const [userLevel, setUserLevel] = useState(5);
  const [userXP, setUserXP] = useState(650);
  const [userHP, setUserHP] = useState(85);
  const [tasks, setTasks] = useState(TASKS_DATA);

  const [features, setFeatures] = useState({
    wpm: 65,
    errorRate: 2.1,
    clickRate: 12,
    appContext: 'VS Code',
    hrv: 45,
  });
  const [probData, setProbData] = useState<{ time: string; prob: number }[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSimulationRunning) {
      interval = setInterval(async () => {
        setElapsedTime(prev => prev + 1);

        const newFeatures = {
          wpm: Math.max(0, features.wpm + (Math.random() - 0.5) * 10),
          errorRate: Math.max(0, features.errorRate + (Math.random() - 0.5)),
          clickRate: Math.max(0, features.clickRate + (Math.random() - 0.5) * 5),
          appContext: Math.random() > 0.9 ? (Math.random() > 0.5 ? 'Chrome' : 'Slack') : 'VS Code',
          hrv: Math.max(30, Math.min(100, features.hrv + (Math.random() - 0.5) * 2)),
        };
        setFeatures(newFeatures);

        try {
          const result = await inferFocusState(newFeatures);
          setLiveStatus(result.focusState);
          setProbData(prev => {
            const newData = [
              ...prev,
              { time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), prob: result.probability },
            ];
            return newData.slice(-20);
          });
        } catch (error) {
          console.error("AI inference failed:", error);
          // Fallback logic if AI fails
          const newProb = Math.min(1, Math.max(0, 0.6 + Math.sin(elapsedTime / 10) * 0.3 + (Math.random() - 0.5) * 0.1));
          if (newProb > 0.7) setLiveStatus('FLOW');
          else if (newProb < 0.4) setLiveStatus('DISTRACTED');
          else setLiveStatus('NEUTRAL');
          
          setProbData(prev => {
            const newData = [
              ...prev,
              { time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), prob: newProb },
            ];
            return newData.slice(-20);
          });
        }
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isSimulationRunning, elapsedTime, features]);

  const toggleSimulation = () => {
    const nextState = !isSimulationRunning;
    setIsSimulationRunning(nextState);
    if (nextState) {
      setProbData([]);
      setLiveStatus('NEUTRAL');
      setElapsedTime(0);
      toast({
        title: "Live Mode Activated",
        description: "Sensor agent is now analyzing your focus.",
      });
    } else {
       toast({
        title: "Live Mode Deactivated",
        description: "Sensor agent has been stopped.",
      });
    }
  };
  
  const handleTaskComplete = (id: number, xp: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
  
    const wasCompleted = task.completed;
  
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  
    if (!wasCompleted) {
      setUserXP(prev => prev + xp);
      toast({
        title: "Quest Complete!",
        description: `You earned ${xp} XP.`,
      });
    } else {
      setUserXP(prev => Math.max(0, prev - xp));
    }
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            liveStatus={liveStatus}
            probData={probData}
            setActiveTab={setActiveTab}
          />
        );
      case 'stamina':
        return (
          <StaminaView
            userLevel={userLevel}
            userXP={userXP}
            userHP={userHP}
            tasks={tasks}
            handleTaskComplete={handleTaskComplete}
          />
        );
      case 'analysis':
        return (
          <AnalysisView
            isSimulationRunning={isSimulationRunning}
            features={features}
            probData={probData}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            historyView={historyView}
            setHistoryView={setHistoryView}
          />
        );
      case 'amplification':
        return (
          <AmplificationView
            ampState={{ ampMusic, ampLight, ampNLP, ampBreath, ampPosture, ampStreak }}
            setAmpState={{ setAmpMusic, setAmpLight, setAmpNLP, setAmpBreath, setAmpPosture, setAmpStreak }}
            activeTab={activeTab}
          />
        );
      case 'trends':
        return <TrendsView />;
      default:
        return <DashboardView liveStatus={liveStatus} probData={probData} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSimulationRunning={isSimulationRunning}
        toggleSimulation={toggleSimulation}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          {renderContent()}
        </Suspense>
      </main>
    </div>
  );
}
