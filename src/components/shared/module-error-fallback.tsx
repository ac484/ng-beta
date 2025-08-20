import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ModuleErrorFallbackProps {
  error: Error | null
  moduleName: string
  onRetry: () => void
}

export function ModuleErrorFallback({ 
  error, 
  moduleName, 
  onRetry 
}: ModuleErrorFallbackProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          {moduleName} Error
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {error?.message || `Failed to load ${moduleName.toLowerCase()}`}
        </p>
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </CardContent>
    </Card>
  )
}