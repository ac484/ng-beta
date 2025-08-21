'use client';

import { useProjects } from '@/context/ProjectContext';
import { ProjectProgressChart } from '@/components/app/project-progress-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { differenceInDays, format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { projects, loading } = useProjects();
  
  if (loading) {
      return (
        <div className="space-y-8">
            <header>
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </header>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28 md:col-span-2" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
            </div>
        </div>
      )
  }

  const totalTasks = projects.reduce((acc, p) => acc + countAllTasks(p.tasks), 0);
  const completedTasks = projects.reduce((acc, p) => acc + countAllTasks(p.tasks, 'Completed'), 0);

  function countAllTasks(tasks: any[], status?: string): number {
    return tasks.reduce((acc, task) => {
        const statusMatch = status ? task.status === status : true;
        return acc + (statusMatch ? 1 : 0) + countAllTasks(task.subTasks, status);
    }, 0);
  }

  const upcomingDeadlines = projects.filter(p => p.endDate && differenceInDays(p.endDate, new Date()) <= 30 && differenceInDays(p.endDate, new Date()) > 0);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          A glance at your active projects' performance.
        </p>
      </header>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalTasks}</div>
                <p className="text-xs text-muted-foreground">{completedTasks} completed</p>
            </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2">
             <CardHeader>
                <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
             </CardHeader>
            <CardContent>
                {upcomingDeadlines.length > 0 ? (
                    <ul className="space-y-1">
                        {upcomingDeadlines.map(p => (
                            <li key={p.id} className="text-xs flex justify-between">
                               <span>{p.title}</span> 
                               <span className="font-medium">{p.endDate ? format(p.endDate, 'MMM dd, yyyy') : ''}</span>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-sm text-muted-foreground">No projects ending in the next 30 days.</p>}
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectProgressChart key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
