'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting work items, quantities, prices, and unit prices from documents.
 *
 * - extractWorkItems - A function that triggers the data extraction process.
 * - ExtractWorkItemsInput - The input type for the extractWorkItems function.
 * - ExtractWorkItemsOutput - The return type for the extractWorkItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractWorkItemsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document (contract, quote, or estimate) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractWorkItemsInput = z.infer<typeof ExtractWorkItemsInputSchema>;

const ExtractWorkItemsOutputSchema = z.object({
  workItems: z.array(
    z.object({
      item: z.string().describe('The description of the work item.'),
      quantity: z.number().describe('The quantity of the work item.'),
      price: z.number().describe('The total price for the work item.'),
      unitPrice: z.number().describe('The unit price of the work item.'),
    })
  ).
  describe('A list of extracted work items with their quantities, prices, and unit prices.'),
  totalTokens: z.number().describe('The total number of tokens used for the operation.'),
});
export type ExtractWorkItemsOutput = z.infer<typeof ExtractWorkItemsOutputSchema>;

export async function extractWorkItems(input: ExtractWorkItemsInput): Promise<ExtractWorkItemsOutput> {
  return extractWorkItemsFlow(input);
}

const extractWorkItemsPrompt = ai.definePrompt({
  name: 'extractWorkItemsPrompt',
  input: {schema: ExtractWorkItemsInputSchema},
  output: {schema: ExtractWorkItemsOutputSchema},
  prompt: `You are an expert AI assistant specialized in parsing documents like contracts, quotes, and estimates to extract work items, quantities, prices, and unit prices.

  Analyze the provided document and extract every single work item you can find. For each item, extract its description, quantity, total price, and calculate the unit price. Use the following document data.

  Document: {{media url=documentDataUri}}
  
  Ensure that the extracted data is accurate and well-formatted.
  If quantity is not explicitly provided in document, default to 1.
  If unit price is not explicitly provided in document, calculate the unit price by dividing the price by the quantity.
  `,
});

const extractWorkItemsFlow = ai.defineFlow(
  {
    name: 'extractWorkItemsFlow',
    inputSchema: ExtractWorkItemsInputSchema,
    outputSchema: ExtractWorkItemsOutputSchema,
  },
  async input => {
    const result = await extractWorkItemsPrompt(input);
    const output = result.output;
    if (!output) {
      throw new Error('No output from AI');
    }
    return {
        workItems: output.workItems,
        totalTokens: result.usage?.totalTokens || 0,
    };
  }
);
