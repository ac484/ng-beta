// WorkflowOptimization.ts
'use server';

/**
 * @fileOverview An AI-powered tool to auto-suggest workflow optimizations based on historical transaction data.
 *
 * - suggestWorkflowOptimizations - A function that handles the workflow optimization process.
 * - SuggestWorkflowOptimizationsInput - The input type for the suggestWorkflowOptimizations function.
 * - SuggestWorkflowOptimizationsOutput - The return type for the suggestWorkflowOptimizations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestWorkflowOptimizationsInputSchema = z.object({
  historicalTransactionData: z
    .string()
    .describe(
      'Historical transaction data, including transaction times, partner performance metrics, and any other relevant data points.'
    ),
  currentWorkflowDefinition: z
    .string()
    .describe('A description of the current workflow definition.'),
});
export type SuggestWorkflowOptimizationsInput = z.infer<
  typeof SuggestWorkflowOptimizationsInputSchema
>;

const SuggestWorkflowOptimizationsOutputSchema = z.object({
  suggestedOptimizations: z
    .string()
    .describe(
      'A list of suggested optimizations for the workflow, based on the historical transaction data.'
    ),
  predictedEfficiencyIncrease: z
    .string()
    .describe(
      'The predicted efficiency increase as a percentage, if the suggested optimizations are implemented.'
    ),
  rationale: z
    .string()
    .describe(
      'A detailed rationale for each suggested optimization, explaining why it is expected to improve efficiency.'
    ),
});
export type SuggestWorkflowOptimizationsOutput = z.infer<
  typeof SuggestWorkflowOptimizationsOutputSchema
>;

export async function suggestWorkflowOptimizations(
  input: SuggestWorkflowOptimizationsInput
): Promise<SuggestWorkflowOptimizationsOutput> {
  return suggestWorkflowOptimizationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWorkflowOptimizationsPrompt',
  input: {schema: SuggestWorkflowOptimizationsInputSchema},
  output: {schema: SuggestWorkflowOptimizationsOutputSchema},
  prompt: `You are an AI-powered tool that analyzes historical transaction data and suggests workflow optimizations.

Analyze the historical transaction data and the current workflow definition to identify areas for improvement.

Based on your analysis, provide a list of suggested optimizations, a predicted efficiency increase as a percentage, and a detailed rationale for each suggested optimization.

Historical Transaction Data: {{{historicalTransactionData}}}
Current Workflow Definition: {{{currentWorkflowDefinition}}}`,
});

const suggestWorkflowOptimizationsFlow = ai.defineFlow(
  {
    name: 'suggestWorkflowOptimizationsFlow',
    inputSchema: SuggestWorkflowOptimizationsInputSchema,
    outputSchema: SuggestWorkflowOptimizationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
