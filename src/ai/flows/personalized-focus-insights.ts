'use server';

/**
 * @fileOverview Provides AI-driven personalized insights and recommendations to optimize focus and productivity.
 *
 * - getPersonalizedFocusInsights - A function that retrieves personalized focus insights.
 * - PersonalizedFocusInsightsInput - The input type for the getPersonalizedFocusInsights function.
 * - PersonalizedFocusInsightsOutput - The return type for the getPersonalizedFocusInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFocusInsightsInputSchema = z.object({
  dailyTimelineData: z.array(
    z.object({
      time: z.string(),
      state: z.enum(['FLOW', 'NEUTRAL', 'DISTRACTED', 'BREAK']),
      duration: z.number(),
    })
  ).describe('An array of objects representing the user’s daily timeline data, including time, state, and duration.'),
  weeklyStaminaData: z.array(
    z.object({
      day: z.string(),
      score: z.number(),
      sessions: z.number(),
      avgLength: z.number(),
    })
  ).describe('An array of objects representing the user’s weekly stamina data, including day, score, sessions, and average length.'),
  breakersData: z.array(
    z.object({
      name: z.string(),
      count: z.number(),
      color: z.string(),
    })
  ).describe('An array of objects representing the user’s breakers data, including name, count, and color.'),
  triggersData: z.array(
    z.object({
      name: z.string(),
      impact: z.string(),
      type: z.string(),
    })
  ).describe('An array of objects representing the user’s triggers data, including name, impact, and type.'),
  userLevel: z.number().describe('The current level of the user.'),
  userXP: z.number().describe('The current XP of the user.'),
  userHP: z.number().describe('The current HP of the user.'),
  tasks: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      duration: z.string(),
      xp: z.number(),
      completed: z.boolean(),
    })
  ).describe('An array of objects representing the user’s tasks, including id, title, duration, xp, and completed status.'),
});
export type PersonalizedFocusInsightsInput = z.infer<typeof PersonalizedFocusInsightsInputSchema>;

const PersonalizedFocusInsightsOutputSchema = z.array(
  z.object({
    id: z.number().describe('A unique identifier for the insight.'),
    type: z.string().describe('The category of the insight (e.g., Time-Based, Breaker-Based, Trigger-Based).'),
    text: z.string().describe('The insight text providing a recommendation or observation.'),
    icon: z.string().describe('The Lucide React icon component name associated with the insight.'),
  })
).describe('An array of personalized insights and recommendations to optimize focus and productivity.');
export type PersonalizedFocusInsightsOutput = z.infer<typeof PersonalizedFocusInsightsOutputSchema>;

export async function getPersonalizedFocusInsights(input: PersonalizedFocusInsightsInput): Promise<PersonalizedFocusInsightsOutput> {
  return personalizedFocusInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFocusInsightsPrompt',
  input: {schema: PersonalizedFocusInsightsInputSchema},
  output: {schema: PersonalizedFocusInsightsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized insights and recommendations to optimize focus and productivity.
  Analyze the provided data, and provide insights to help the user improve their work habits.

  Data:
  Daily Timeline Data: {{{JSON.stringify(dailyTimelineData)}}
  Weekly Stamina Data: {{{JSON.stringify(weeklyStaminaData)}}}
  Breakers Data: {{{JSON.stringify(breakersData)}}}
  Triggers Data: {{{JSON.stringify(triggersData)}}}
  User Level: {{{userLevel}}}
  User XP: {{{userXP}}}
  User HP: {{{userHP}}}
  Tasks: {{{JSON.stringify(tasks)}}}

  Based on the data, provide a list of insights with the following fields:
  - id: A unique identifier for the insight.
  - type: The category of the insight (e.g., Time-Based, Breaker-Based, Trigger-Based).
  - text: The insight text providing a recommendation or observation.
  - icon: The Lucide React icon component name associated with the insight.

  Example:
  [
    {
      "id": 1,
      "type": "Time-Based",
      "text": "You focused best between 9am–11am today. Schedule your deepest work here tomorrow.",
      "icon": "Clock"
    },
    {
      "id": 2,
      "type": "Breaker-Based",
      "text": "WhatsApp broke your flow 3 times in the last hour. We recommend enabling Auto-Block for Social Apps.",
      "icon": "Smartphone"
    },
    {
      "id": 3,
      "type": "Trigger-Based",
      "text": "LoFi music increased your average flow duration by 15%. Consider auto-starting this playlist on flow detect.",
      "icon": "Music"
    }
  ]
  `,
});

const personalizedFocusInsightsFlow = ai.defineFlow(
  {
    name: 'personalizedFocusInsightsFlow',
    inputSchema: PersonalizedFocusInsightsInputSchema,
    outputSchema: PersonalizedFocusInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
