import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus, Mail, Phone, MapPin } from 'lucide-react'

const mockPartners = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    type: 'Technology Partner',
    status: 'Active',
    contact: {
      email: 'contact@techcorp.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
    },
    avatar: null,
    relationship: 'Strategic',
    projects: 3,
  },
  {
    id: '2',
    name: 'Design Studio Pro',
    type: 'Creative Partner',
    status: 'Active',
    contact: {
      email: 'hello@designstudio.com',
      phone: '+1 (555) 987-6543',
      location: 'New York, NY',
    },
    avatar: null,
    relationship: 'Preferred',
    projects: 2,
  },
]

export default function PartnersDirectoryPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Partner Directory</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {mockPartners.map((partner) => (
          <Card key={partner.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={partner.avatar || undefined} />
                  <AvatarFallback>
                    {partner.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{partner.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{partner.type}</p>
                </div>
                <Badge variant={partner.status === 'Active' ? 'default' : 'secondary'}>
                  {partner.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  {partner.contact.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  {partner.contact.phone}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  {partner.contact.location}
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-medium">
                    {partner.projects} active projects
                  </span>
                  <Badge variant="outline">
                    {partner.relationship}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}