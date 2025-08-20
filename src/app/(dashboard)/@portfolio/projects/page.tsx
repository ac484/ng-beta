import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar, Users } from 'lucide-react'

const mockProjects = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete overhaul of company website',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-02-15',
    team: ['Alice', 'Bob', 'Charlie'],
    progress: 65,
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Native iOS and Android application',
    status: 'Planning',
    priority: 'Medium',
    dueDate: '2024-03-30',
    team: ['David', 'Eve'],
    progress: 20,
  },
]

export default function ProjectsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {mockProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <Badge variant={project.priority === 'High' ? 'destructive' : 'secondary'}>
                  {project.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  Due: {project.dueDate}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  Team: {project.team.join(', ')}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}