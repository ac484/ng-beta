'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface PortfolioErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PortfolioError({ error, reset }: PortfolioErrorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-destructive flex items-center gap-2'>
          <AlertCircle className='h-4 w-4' />
          Projects Error
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <p className='text-muted-foreground text-sm'>Failed to load projects</p>
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
