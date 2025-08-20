'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Application Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                A critical error occurred in the application. Please try refreshing the page.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="text-xs bg-muted p-2 rounded">
                  <summary>Error details</summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {error.message}
                    {error.stack}
                  </pre>
                </details>
              )}
              <div className="flex gap-2">
                <Button onClick={reset} size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try again
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
                  <Home className="h-4 w-4 mr-2" />
                  Go home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}