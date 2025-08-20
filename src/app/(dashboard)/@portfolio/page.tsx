'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjects } from '@/lib/queries/projects-queries';
import { AlertCircle, Plus } from 'lucide-react';

export default function PortfolioSlot() {
  const { data: projects, isLoading, error } = useProjects();

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-sm font-medium'>
            <AlertCircle className='text-destructive h-4 w-4' />
            Projects Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-xs'>
            Failed to load projects
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Projects</CardTitle>
        <Button size='sm' variant='outline'>
          <Plus className='h-4 w-4' />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-2'>
            <Skeleton className='h-8 w-16' />
            <Skeleton className='h-4 w-24' />
          </div>
        ) : (
          <>
            <div className='text-2xl font-bold'>{projects?.length || 0}</div>
            <p className='text-muted-foreground text-xs'>
              {projects?.length === 1 ? 'Active project' : 'Active projects'}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
