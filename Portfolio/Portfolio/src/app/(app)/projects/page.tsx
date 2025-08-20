'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { useProjects } from '@/context/ProjectContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CreateProjectDialog } from '@/components/app/create-project-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Task } from '@/lib/types';

function calculateProgress(tasks: Task[]): { completedValue: number } {
  let completedValue = 0;

  function recurse(taskArray: Task[]) {
    taskArray.forEach(task => {
      // Only count leaf nodes for progress
      if (task.subTasks && task.subTasks.length > 0) {
        recurse(task.subTasks);
      } else {
        if (task.status === 'Completed') {
          completedValue += task.value;
        }
      }
    });
  }

  recurse(tasks);
  return { completedValue };
}


export default function ProjectsPage() {
  const { projects, loading } = useProjects();

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage all your construction projects from one place.
          </p>
        </div>
        <CreateProjectDialog />
      </header>
      
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full mt-2" />
                        <Skeleton className="h-4 w-1/2 mt-1" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-8 w-full" />
                         <div className="space-y-2">
                             <Skeleton className="h-4 w-1/4" />
                             <Skeleton className="h-4 w-1/2" />
                         </div>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No Projects Yet</h2>
            <p className="text-muted-foreground mt-2">Click "New Project" to get started.</p>
        </div>
      ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const { completedValue } = calculateProgress(project.tasks);
          const progressPercentage = project.value > 0 ? (completedValue / project.value) * 100 : 0;
          
          return (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                         <span className="text-sm font-medium text-muted-foreground">Progress</span>
                         <span className="text-sm font-semibold">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">${completedValue.toLocaleString()} of ${project.value.toLocaleString()} value complete</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">Start:</span> {project.startDate ? format(project.startDate, 'MMM dd, yyyy') : 'N/A'}</p>
                  <p><span className="font-medium text-foreground">End:</span> {project.endDate ? format(project.endDate, 'MMM dd, yyyy') : 'N/A'}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href={`/projects/${project.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      )}
    </div>
  );
}
