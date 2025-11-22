'use server';
/**
 * @fileOverview Real-time focus state inference using sensor data.
 *
 * - inferFocusState - A function that infers the user's current focus state.
 * - InferFocusStateInput - The input type for the inferFocusState function.
 * - InferFocusStateOutput - The return type for the inferFocusState function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InferFocusStateInputSchema = z.object({
  wpm: z.number().describe('Typing speed in words per minute.'),
  errorRate: z.number().describe('Typing error rate as a percentage.'),
  clickRate: z.number().describe('Mouse click rate in clicks per minute.'),
  appContext: z.string().describe('The currently active application.'),
  hrv: z.number().describe('Heart rate variability in milliseconds.'),
});
export type InferFocusStateInput = z.infer<typeof InferFocusStateInputSchema>;

const InferFocusStateOutputSchema = z.object({
  focusState: z
    .enum(['FLOW', 'NEUTRAL', 'DISTRACTED'])
    .describe('The inferred focus state of the user.'),
  probability: z.number().describe('The probability of being in the inferred focus state.'),
  reason: z.string().describe('Explanation of why the model chose that particular state.')
});
export type InferFocusStateOutput = z.infer<typeof InferFocusStateOutputSchema>;

export async function inferFocusState(input: InferFocusStateInput): Promise<InferFocusStateOutput> {
  return inferFocusStateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'inferFocusStatePrompt',
  input: {schema: InferFocusStateInputSchema},
  output: {schema: InferFocusStateOutputSchema},
  prompt: `Based on the following sensor data, infer the user's current focus state (FLOW, NEUTRAL, or DISTRACTED) and the probability (between 0 and 1) of that state being correct. Explain the reasoning behind your determination.\n\nTyping Speed: {{wpm}} words per minute\nError Rate: {{errorRate}}%\nMouse Activity: {{clickRate}} clicks per minute\nActive Application: {{appContext}}\nHeart Rate Variability: {{hrv}} ms\n\nConsider these factors:\n- High typing speed, low error rate, and consistent mouse activity in a relevant application (e.g., VS Code for coding) indicate a state of FLOW.\n- Moderate values and/or context switching indicate a NEUTRAL state.\n- Low typing speed, high error rate, erratic mouse activity, or activity in distracting applications (e.g., social media) indicate a DISTRACTED state.\n- Higher heart rate variability generally indicates a more relaxed state, while lower HRV can be associated with stress or high focus.
\nReturn the focusState, probability, and your reasoning. Make sure the probability is in the 0 to 1 range.
`,
});

const inferFocusStateFlow = ai.defineFlow(
  {
    name: 'inferFocusStateFlow',
    inputSchema: InferFocusStateInputSchema,
    outputSchema: InferFocusStateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
