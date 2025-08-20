'use server';
/**
 * @fileOverview An AI agent for generating sub-tasks for a construction project task.
 *
 * - generateSubtasks - A function that generates sub-task suggestions.
 * - GenerateSubtasksInput - The input type for the generateSubtasks function.
 * - GenerateSubtasksOutput - The return type for the generateSubtasks function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateSubtasksInputSchema = z.object({
  projectTitle: z.string().describe('The title of the main project.'),
  taskTitle: z.string().describe('The title of the parent task for which to generate sub-tasks.'),
});
export type GenerateSubtasksInput = z.infer<typeof GenerateSubtasksInputSchema>;

const GenerateSubtasksOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of 3 to 5 relevant sub-task titles.'),
});
export type GenerateSubtasksOutput = z.infer<typeof GenerateSubtasksOutputSchema>;


export async function generateSubtasks(input: GenerateSubtasksInput): Promise<GenerateSubtasksOutput> {
  return generateSubtasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSubtasksPrompt',
  input: { schema: GenerateSubtasksInputSchema },
  output: { schema: GenerateSubtasksOutputSchema },
  prompt: `You are an expert construction project manager. Given a project title and a main task, generate a list of 3 to 5 realistic, actionable sub-tasks.

Project Title: {{{projectTitle}}}
Main Task: {{{taskTitle}}}

Provide only the list of sub-task titles in your response.`,
});

const generateSubtasksFlow = ai.defineFlow(
  {
    name: 'generateSubtasksFlow',
    inputSchema: GenerateSubtasksInputSchema,
    outputSchema: GenerateSubtasksOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
