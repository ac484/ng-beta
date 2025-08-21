'use client';

import { useState, type ChangeEvent, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2, FileUp, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { summarizeContract, type SummarizeContractInput } from '@/ai/flows/summarize-contract';
import { Skeleton } from '../ui/skeleton';

export function AiSummarizerDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSummary('');
      setError('');
    }
  };

  const handleSummarize = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const dataUri = reader.result as string;
        const input: SummarizeContractInput = { contractDataUri: dataUri };
        const result = await summarizeContract(input);
        setSummary(result.summary);
        toast({
          title: "Summary Complete",
          description: "The contract has been successfully summarized.",
          action: <CheckCircle2 className="text-green-500" />,
        });
      };
      reader.onerror = () => {
        throw new Error('Failed to read file.');
      };
    } catch (e: any) {
      const errorMessage = e.message || 'An unknown error occurred.';
      setError(errorMessage);
       toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: errorMessage,
        action: <XCircle className="text-white" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setSummary('');
    setError('');
    setIsLoading(false);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if(!open) {
        resetState();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Wand2 className="mr-2 h-4 w-4" />
        AI Summary
      </Button>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI-Powered Contract Summary</DialogTitle>
          <DialogDescription>
            Upload a contract document to get a concise summary of its key terms, obligations, and deadlines.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="contract-file">Contract Document</Label>
            <div className="flex items-center gap-2">
                <Input id="contract-file" type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                {file && <span className="text-sm text-muted-foreground truncate">{file.name}</span>}
            </div>
          </div>
          {isLoading && (
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {summary && (
            <div>
              <Label htmlFor="summary">Generated Summary</Label>
              <Textarea id="summary" value={summary} readOnly rows={10} className="mt-1 bg-secondary" />
            </div>
          )}
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={handleSummarize} disabled={!file || isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Summarizing...' : 'Summarize'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
