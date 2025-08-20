import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalyticsSlot() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Project completion</p>
          </div>
          <div>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Partner satisfaction</p>
          </div>
          <div>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Documents processed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}