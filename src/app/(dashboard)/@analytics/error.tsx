'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface AnalyticsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AnalyticsError({ error, reset }: AnalyticsErrorProps) {
  return (
    <Card className='col-span-full'>
      <CardHeader>
        <CardTitle className='text-destructive flex items-center gap-2'>
          <AlertCircle className='h-4 w-4' />
          Analytics Error
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <p className='text-muted-foreground text-sm'>
          Failed to load analytics data
        </p>
        {error?.message && (
          <p className='text-muted-foreground text-xs break-words'>
            {error.message}
          </p>
        )}
        <Button size='sm' variant='outline' onClick={reset}>
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}
