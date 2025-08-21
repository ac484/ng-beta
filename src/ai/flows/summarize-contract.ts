'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing contract terms and obligations using AI.
 *
 * - summarizeContract - An async function that takes a contract document (as a data URI) and returns a summary of its key terms, obligations, and deadlines.
 * - SummarizeContractInput - The input type for the summarizeContract function, which includes the contract document as a data URI.
 * - SummarizeContractOutput - The output type for the summarizeContract function, which is a string containing the contract summary.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeContractInputSchema = z.object({
  contractDataUri: z
    .string()
    .describe(
      'The contract document as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Inline comment
    ),
});
export type SummarizeContractInput = z.infer<typeof SummarizeContractInputSchema>;

const SummarizeContractOutputSchema = z.object({
  summary: z.string().describe('A summary of the key contract terms, obligations, and deadlines.'),
});
export type SummarizeContractOutput = z.infer<typeof SummarizeContractOutputSchema>;

export async function summarizeContract(input: SummarizeContractInput): Promise<SummarizeContractOutput> {
  return summarizeContractFlow(input);
}

const summarizeContractPrompt = ai.definePrompt({
  name: 'summarizeContractPrompt',
  input: {schema: SummarizeContractInputSchema},
  output: {schema: SummarizeContractOutputSchema},
  prompt: `You are an AI assistant specialized in summarizing legal contracts.

  Given a contract document, provide a concise summary of the key terms, obligations, and deadlines.
  Focus on extracting critical information that a project manager would need to quickly understand the contract details.

  Contract Document: {{media url=contractDataUri}}
  Summary: `,
});

const summarizeContractFlow = ai.defineFlow(
  {
    name: 'summarizeContractFlow',
    inputSchema: SummarizeContractInputSchema,
    outputSchema: SummarizeContractOutputSchema,
  },
  async input => {
    const {output} = await summarizeContractPrompt(input);
    return output!;
  }
);
