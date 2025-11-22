'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { Task } from '@/lib/types';
import { FOREST_DATA } from '@/lib/data';
import {
  Star,
  Heart,
  Swords,
  Clock,
  CheckSquare,
  Trees,
  Sprout,
  Plus,
  RefreshCw,
  Coffee,
  Lightbulb,
} from '@/components/icons';
import { cn } from '@/lib/utils';

interface StaminaViewProps {
  userLevel: number;
  userXP: number;
  userHP: number;
  tasks: Task[];
  handleTaskComplete: (id: number, xp: number) => void;
}

export default function StaminaView({ userLevel, userXP, userHP, tasks, handleTaskComplete }: StaminaViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-500">
      <Card className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-2xl relative">
            {userLevel}
            <div className="absolute -bottom-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
              Level
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Focus Warrior</h2>
            <p className="text-xs text-muted-foreground">Keep focusing to level up!</p>
          </div>
        </div>

        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-yellow-500 flex items-center gap-1">
                <Star size={12} className="fill-yellow-400" /> XP
              </span>
              <span className="text-muted-foreground">{userXP} / 1000</span>
            </div>
            <Progress value={(userXP / 1000) * 100} className="h-3 [&>div]:bg-yellow-400" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-rose-500 flex items-center gap-1">
                <Heart size={12} className="fill-rose-400" /> Health
              </span>
              <span className="text-muted-foreground">{userHP} / 100</span>
            </div>
            <Progress value={userHP} className="h-3 [&>div]:bg-rose-500" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col h-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-lg text-purple-700">
                <Swords size={18} /> Daily Quests
              </CardTitle>
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">+XP Active</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 space-y-3">
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => handleTaskComplete(task.id, task.xp)}
                  className={cn(
                    'p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 group',
                    task.completed
                      ? 'bg-secondary border-border opacity-60'
                      : 'bg-card hover:border-purple-300'
                  )}
                >
                  <Checkbox checked={task.completed} id={`task-${task.id}`} className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"/>
                  <div className="flex-1">
                    <label htmlFor={`task-${task.id}`} className={cn('font-medium', task.completed ? 'text-muted-foreground line-through' : 'text-foreground')}>
                      {task.title}
                    </label>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Clock size={12}/> {task.duration}</span>
                      <span className="flex items-center gap-1 text-yellow-500/80"><Star size={12}/> +{task.xp} XP</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed hover:bg-secondary">
                <Plus size={14} className="mr-2"/> Add New Quest
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
             <CardTitle className="flex items-center gap-2 text-lg text-emerald-700">
               <Trees size={18}/> Digital Forest
             </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex-1 bg-secondary rounded-xl border p-4 grid grid-cols-3 gap-4 relative overflow-hidden">
                {FOREST_DATA.map(tree => (
                   <div key={tree.id} className="aspect-square flex items-center justify-center flex-col gap-1 rounded-lg bg-background/30 border-border/30 hover:bg-background transition-colors relative p-1">
                      {tree.stage === 3 ? (
                         <Trees size={32} className="text-emerald-500 fill-emerald-500/20" />
                      ) : tree.stage === 2 ? (
                         <Trees size={28} className="text-yellow-600 opacity-80" /> 
                      ) : (
                         <Sprout size={24} className="text-emerald-400 animate-pulse" />
                      )}
                      {tree.stage === 1 && (
                         <div className="absolute bottom-1 left-0 w-full px-2">
                           <Progress value={60} className="h-1 [&>div]:bg-emerald-500"/>
                         </div>
                      )}
                   </div>
                ))}
             </div>
             <p className="mt-4 text-center text-xs text-muted-foreground">
                Plant a tree for every 25m of Deep Work. Leaving early kills the tree!
             </p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <RefreshCw size={18}/> Adaptive Routine
                </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative">
                <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-border"></div>
                <div className="relative pl-8">
                  <div className="absolute left-[7px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-card"></div>
                  <p className="text-xs text-muted-foreground mb-1">09:00 - 11:00 (Completed)</p>
                  <p className="text-sm font-medium text-foreground">Deep Work Block</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">Performance: High (92% Flow)</p>
                </div>
                <div className="relative pl-8 opacity-50">
                  <div className="absolute left-[7px] top-1.5 w-3 h-3 rounded-full bg-slate-400 ring-4 ring-card"></div>
                  <p className="text-xs text-muted-foreground mb-1">11:00 - 11:15 (Skipped)</p>
                  <p className="text-sm font-medium text-muted-foreground line-through">Short Break</p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute left-[7px] top-1.5 w-3 h-3 rounded-full bg-primary animate-pulse ring-4 ring-card"></div>
                  <p className="text-xs text-primary mb-1 font-bold">CURRENT (Adapted)</p>
                  <p className="text-sm font-medium text-foreground">Recovery Break</p>
                  <p className="text-[10px] text-primary/80 mt-0.5">Increased due to skipped break</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-background border-emerald-200/80 flex-1 flex flex-col justify-center items-center text-center p-6">
            <Coffee size={32} className="text-emerald-500 mb-3" />
            <h4 className="font-bold mb-1">Smart Break Recommender</h4>
            <div className="text-3xl font-bold text-emerald-600 my-2">12 min</div>
            <p className="text-xs text-emerald-700/70 mb-4">Based on 52m Work Ratio</p>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold">
               Start Break Timer
            </Button>
          </Card>
        </div>
      </div>
      <Card className="bg-gradient-to-r from-indigo-50 to-background border-indigo-200/80 p-6 flex items-start gap-4">
        <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 hidden sm:block">
          <Lightbulb size={24} />
        </div>
        <div>
          <h3 className="text-foreground font-bold text-lg mb-1">End of Day Insight</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Great job today! You maintained focus for <span className="text-foreground font-bold">2h 15m</span>. 
            Your stamina score increased by <span className="text-emerald-600 font-bold">+12%</span> thanks to the 
            morning deep work block. Tomorrow, try starting with the "API Debugging" task to build momentum early.
          </p>
        </div>
      </Card>
    </div>
  );
}
