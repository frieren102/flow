import { getPersonalizedFocusInsights } from '@/ai/flows/personalized-focus-insights';
import { DAILY_TIMELINE_DATA, WEEKLY_STAMINA_DATA, BREAKERS_DATA, TRIGGERS_DATA, TASKS_DATA } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Clock, Smartphone, Music } from '@/components/icons';
import type { LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  Clock,
  Smartphone,
  Music,
  Brain, // Fallback
};

export default async function AiInsights() {
  let insights = [];
  try {
    insights = await getPersonalizedFocusInsights({
      dailyTimelineData: DAILY_TIMELINE_DATA,
      weeklyStaminaData: WEEKLY_STAMINA_DATA,
      breakersData: BREAKERS_DATA,
      triggersData: TRIGGERS_DATA,
      userLevel: 5,
      userXP: 650,
      userHP: 85,
      tasks: TASKS_DATA
    });
  } catch (error) {
    console.error("Failed to fetch AI insights:", error);
    // You can return a fallback UI here
    return (
        <Card className="bg-gradient-to-r from-blue-50 to-background border-blue-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                <Brain size={18} className="text-blue-600" /> AI Actionable Insights
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Could not load AI insights at the moment. Please try again later.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 via-white to-background border-blue-200/80 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain size={18} className="text-blue-600" /> AI Actionable Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight) => {
            const Icon = iconMap[insight.icon] || Brain;
            return (
              <div key={insight.id} className="bg-card/50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2 text-blue-700">
                  <Icon size={14} />
                  <span className="text-xs font-bold uppercase">{insight.type}</span>
                </div>
                <p className="text-sm text-foreground/80">{insight.text}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
