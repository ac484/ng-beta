import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, Download, Eye } from 'lucide-react'

const mockDocuments = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    status: 'Processed',
    tags: ['proposal', 'client'],
    summary: 'Comprehensive project proposal for website redesign including timeline and budget.',
  },
  {
    id: '2',
    name: 'Contract Agreement.docx',
    type: 'Word',
    size: '1.8 MB',
    uploadDate: '2024-01-12',
    status: 'Processing',
    tags: ['contract', 'legal'],
    summary: 'Service agreement with terms and conditions for partnership.',
  },
  {
    id: '3',
    name: 'Technical Specifications.xlsx',
    type: 'Excel',
    size: '3.2 MB',
    uploadDate: '2024-01-10',
    status: 'Processed',
    tags: ['technical', 'specs'],
    summary: 'Detailed technical requirements and system specifications.',
  },
]

export default function DocumentsLibraryPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Document Library</h2>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
      
      <div className="space-y-4">
        {mockDocuments.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{doc.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {doc.type} • {doc.size} • Uploaded {doc.uploadDate}
                    </p>
                  </div>
                </div>
                <Badge variant={doc.status === 'Processed' ? 'default' : 'secondary'}>
                  {doc.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">{doc.summary}</p>
                <div className="flex gap-2">
                  {doc.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}