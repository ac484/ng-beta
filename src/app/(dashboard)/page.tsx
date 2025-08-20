import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your integrated workspace
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your projects, partners, and documents are displayed below in their respective modules.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}