import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function PartnersSlot() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Partners</CardTitle>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">8</div>
        <p className="text-xs text-muted-foreground">
          Active partnerships
        </p>
      </CardContent>
    </Card>
  )
}