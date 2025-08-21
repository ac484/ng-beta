'use client';

import { useState } from 'react';
import type { Task, TaskStatus } from '@/lib/types';
import { useProjects } from '@/context/ProjectContext';
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '../ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { AISubtaskSuggestions } from './ai-subtask-suggestions';
import { Badge } from '../ui/badge';

interface TaskItemProps {
  task: Task;
  projectId: string;
}

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  Pending: <Circle className="h-4 w-4 text-muted-foreground" />,
  'In Progress': <Clock className="h-4 w-4 text-yellow-500" />,
  Completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
};

const statusColors: Record<TaskStatus, string> = {
    Pending: 'border-muted-foreground/30',
    'In Progress': 'border-yellow-500/30',
    Completed: 'border-green-500/30',
};

function calculateRemainingValue(totalValue: number, tasks: Task[]): number {
    const usedValue = tasks.reduce((acc, task) => acc + (task.value || 0), 0);
    return totalValue - usedValue;
}

export function TaskItem({ task, projectId }: TaskItemProps) {
  const { updateTaskStatus, addTask, findProject } = useProjects();
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtaskQuantity, setSubtaskQuantity] = useState(1);
  const [subtaskUnitPrice, setSubtaskUnitPrice] = useState(0);

  const [isOpen, setIsOpen] = useState(true);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const project = findProject(projectId);
  const remainingValue = calculateRemainingValue(task.value, task.subTasks);
  const subtaskValue = subtaskQuantity * subtaskUnitPrice;

  const handleStatusChange = (status: TaskStatus) => {
    updateTaskStatus(projectId, task.id, status);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (subtaskTitle.trim() && subtaskValue > 0) {
        if (subtaskValue > remainingValue) {
            alert(`Sub-task value (${subtaskValue}) cannot exceed remaining task value of ${remainingValue}`);
            return;
        }
      addTask(projectId, task.id, subtaskTitle.trim(), subtaskQuantity, subtaskUnitPrice);
      setSubtaskTitle('');
      setSubtaskQuantity(1);
      setSubtaskUnitPrice(0);
      setIsAddingSubtask(false);
      setIsOpen(true);
    }
  };

  const handleAddSuggestedSubtask = (title: string) => {
    const suggestedUnitPrice = Math.min(10, remainingValue); // Suggest a unit price of 10 or remaining
    if (suggestedUnitPrice > 0) {
        addTask(projectId, task.id, title, 1, suggestedUnitPrice);
    } else {
        alert("No remaining value to assign to new sub-tasks.");
    }
  }

  const taskQuantity = task.quantity || 0;
  const taskUnitPrice = task.unitPrice || 0;
  const taskValue = task.value || 0;

  return (
    <TooltipProvider delayDuration={200}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <div
          className={cn(
            'flex items-center gap-2 rounded-lg border p-2 pl-3 bg-card',
            statusColors[task.status]
          )}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-6 w-6',
                task.subTasks.length === 0 && 'invisible'
              )}
            >
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen && 'rotate-90'
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <span className="flex-grow font-medium">{task.title}</span>
          <Badge variant="secondary">${taskValue.toLocaleString()} ({taskQuantity} x ${taskUnitPrice.toLocaleString()})</Badge>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-xs text-muted-foreground mr-2">
                {formatDistanceToNow(new Date(task.lastUpdated), { addSuffix: true })}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Last updated: {new Date(task.lastUpdated).toLocaleString()}</p>
            </TooltipContent>
          </Tooltip>
          <Select value={task.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px] h-8">
              <SelectValue placeholder="Set status" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(statusIcons).map((status) => (
                <SelectItem key={status} value={status}>
                  <div className="flex items-center gap-2">
                    {statusIcons[status as TaskStatus]}
                    <span>{status}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowAISuggestions(true)}
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get AI Sub-task Suggestions</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsAddingSubtask(true)}
                disabled={remainingValue === 0}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {remainingValue > 0 ? <p>Add Sub-task (Rem: ${remainingValue.toLocaleString()})</p> : <p>No remaining value to assign</p>}
            </TooltipContent>
          </Tooltip>
        </div>

        {showAISuggestions && project && (
            <AISubtaskSuggestions
                projectTitle={project.title}
                taskTitle={task.title}
                onAddSubtask={handleAddSuggestedSubtask}
                onClose={() => setShowAISuggestions(false)}
            />
        )}

        <CollapsibleContent className="pl-6 space-y-2">
          {task.subTasks.map((subTask) => (
            <TaskItem key={subTask.id} task={subTask} projectId={projectId} />
          ))}

          {isAddingSubtask && (
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pl-8 pr-2 py-2 rounded-lg border bg-secondary">
              <Input
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                placeholder="New sub-task title"
                className="h-8 flex-grow"
                autoFocus
              />
               <Input
                    type="number"
                    placeholder="Qty"
                    value={subtaskQuantity || ''}
                    onChange={(e) => setSubtaskQuantity(parseInt(e.target.value, 10) || 1)}
                    className="h-8 w-20"
                />
                <Input
                    type="number"
                    placeholder="Unit Price"
                    value={subtaskUnitPrice || ''}
                    onChange={(e) => setSubtaskUnitPrice(parseInt(e.target.value, 10) || 0)}
                    className="h-8 w-24"
                />
                <Badge variant="outline" className="h-8 w-28 justify-center bg-background">
                    Value: ${subtaskValue.toLocaleString()}
                </Badge>
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 h-8">Add</Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingSubtask(false)}
                className="h-8"
              >
                Cancel
              </Button>
            </form>
          )}
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
}
