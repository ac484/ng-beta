'use client';

import { useState, useEffect } from 'react';
import { generateSubtasks } from '@/ai/flows/generate-subtasks-flow';
import { Button } from '@/components/ui/button';
import { Loader, PlusCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '@/hooks/use-toast';

interface AISubtaskSuggestionsProps {
  projectTitle: string;
  taskTitle: string;
  onAddSubtask: (title: string) => void;
  onClose: () => void;
}

export function AISubtaskSuggestions({
  projectTitle,
  taskTitle,
  onAddSubtask,
  onClose,
}: AISubtaskSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await generateSubtasks({ projectTitle, taskTitle });
        setSuggestions(result.suggestions);
      } catch (err) {
        setError('Failed to generate AI suggestions. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [projectTitle, taskTitle]);

  const handleAddSuggestion = (suggestion: string) => {
    onAddSubtask(suggestion);
    setSuggestions(suggestions.filter((s) => s !== suggestion));
    toast({
        title: "Sub-task Added",
        description: `"${suggestion}" was added to your task list.`
    })
  };

  return (
    <div className="my-2 ml-14 mr-2">
        <Alert className="relative bg-secondary border-primary/20">
             <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}>
                <X className="h-4 w-4" />
             </Button>
            <AlertTitle className="flex items-center gap-2">
                AI Sub-task Suggestions
            </AlertTitle>
            <AlertDescription>
            {loading && (
                <div className="flex items-center gap-2 py-4">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Generating ideas...</span>
                </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {!loading && !error && (
                <ul className="space-y-2 pt-2">
                {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-center justify-between gap-2">
                    <span>{suggestion}</span>
                    <Button variant="outline" size="sm" onClick={() => handleAddSuggestion(suggestion)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add
                    </Button>
                    </li>
                ))}
                 {suggestions.length === 0 && <p className="text-sm text-muted-foreground">All suggestions have been added or none were generated.</p>}
                </ul>
            )}
            </AlertDescription>
        </Alert>
    </div>
  );
}
