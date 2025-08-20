'use client';

import { useProjects } from '@/context/ProjectContext';
import { useParams } from 'next/navigation';
import { TaskItem } from '@/components/app/task-item';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/lib/types';

function calculateRemainingValue(totalValue: number, tasks: Task[]): number {
    const usedValue = tasks.reduce((acc, task) => acc + (task.value || 0), 0);
    return totalValue - usedValue;
}


export default function ProjectDetailPage() {
  const params = useParams();
  const { findProject, addTask } = useProjects();
  const project = findProject(params.id as string);

  const [isAddingTask, setIsAddingTask] = React.useState(false);
  const [taskTitle, setTaskTitle] = React.useState('');
  const [taskQuantity, setTaskQuantity] = React.useState(1);
  const [taskUnitPrice, setTaskUnitPrice] = React.useState(0);

  if (!project) {
    return null;
  }
  
  const remainingValue = calculateRemainingValue(project.value, project.tasks);
  const taskValue = taskQuantity * taskUnitPrice;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if(taskTitle.trim() && taskValue > 0) {
        if (taskValue > remainingValue) {
            alert(`Task value (${taskValue}) cannot exceed remaining project value of ${remainingValue}`);
            return;
        }
        addTask(project.id, null, taskTitle.trim(), taskQuantity, taskUnitPrice);
        setTaskTitle('');
        setTaskQuantity(1);
        setTaskUnitPrice(0);
        setIsAddingTask(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">{project.title}</CardTitle>
              <CardDescription className="text-base mt-1">{project.description}</CardDescription>
            </div>
            <Badge variant="outline" className="text-lg">
                Total Value: ${project.value.toLocaleString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-8 text-sm">
            <div>
              <span className="font-semibold">Start Date: </span>
              <span className="text-muted-foreground">{project.startDate ? format(project.startDate, 'MMMM dd, yyyy') : 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold">End Date: </span>
              <span className="text-muted-foreground">{project.endDate ? format(project.endDate, 'MMMM dd, yyyy') : 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tasks</CardTitle>
             <CardDescription>
              Remaining value to assign: <span className="font-bold text-foreground">${remainingValue.toLocaleString()}</span>
            </CardDescription>
          </div>
          {!isAddingTask && (
            <Button variant="outline" onClick={() => setIsAddingTask(true)} disabled={remainingValue === 0}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
            {isAddingTask && (
                <form onSubmit={handleAddTask} className="flex items-center gap-2 p-2 rounded-lg border bg-secondary">
                    <Input 
                        placeholder="Enter new task title..." 
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        className="flex-grow"
                        autoFocus
                    />
                    <Input
                        type="number"
                        placeholder="Qty"
                        value={taskQuantity || ''}
                        onChange={(e) => setTaskQuantity(parseInt(e.target.value, 10) || 1)}
                        className="w-20"
                    />
                    <Input
                        type="number"
                        placeholder="Unit Price"
                        value={taskUnitPrice || ''}
                        onChange={(e) => setTaskUnitPrice(parseInt(e.target.value, 10) || 0)}
                        className="w-24"
                    />
                     <Badge variant="secondary" className="w-24 justify-center">
                        Value: ${taskValue.toLocaleString()}
                    </Badge>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">Add Task</Button>
                    <Button type="button" variant="ghost" onClick={() => setIsAddingTask(false)}>Cancel</Button>
                </form>
            )}

            {project.tasks.length > 0 ? (
                <div className="space-y-2">
                {project.tasks.map((task) => (
                    <TaskItem key={task.id} task={task} projectId={project.id} />
                ))}
                </div>
            ) : (
                !isAddingTask && (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium">No tasks yet</h3>
                        <p className="text-sm text-muted-foreground">Click "Add Task" to start planning.</p>
                    </div>
                )
            )}
        </CardContent>
      </Card>
    </div>
  );
}
