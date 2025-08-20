'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface DocumentsErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DocumentsError({ error, reset }: DocumentsErrorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          Documents Error
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Failed to load documents
        </p>
        <Button size="sm" variant="outline" onClick={reset}>
          Try again
        </Button>
      </CardContent>
    </Card>
  )
}