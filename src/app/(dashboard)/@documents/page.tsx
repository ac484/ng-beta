import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

export default function DocumentsSlot() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Documents</CardTitle>
        <Button size="sm" variant="outline">
          <Upload className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">24</div>
        <p className="text-xs text-muted-foreground">
          Processed documents
        </p>
      </CardContent>
    </Card>
  )
}