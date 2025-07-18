import { useState } from 'react'
import { Search, Plus, Eye, Copy } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { DocumentViewer } from '../components/DocumentViewer'

const templates = [
  {
    id: 'general-intake',
    title: 'General Patient Intake',
    description: 'Comprehensive intake form for new patients',
    category: 'General',
    fields: 12,
    preview: 'Basic patient information, medical history, insurance details'
  },
  {
    id: 'dental-intake',
    title: 'Dental Patient Intake',
    description: 'Specialized form for dental practices',
    category: 'Dental',
    fields: 15,
    preview: 'Dental history, current concerns, insurance, emergency contact'
  },
  {
    id: 'pediatric-intake',
    title: 'Pediatric Intake Form',
    description: 'Child-focused intake form with parent/guardian information',
    category: 'Pediatric',
    fields: 18,
    preview: 'Child information, parent details, vaccination records, allergies'
  },
  {
    id: 'mental-health',
    title: 'Mental Health Intake',
    description: 'Comprehensive mental health assessment form',
    category: 'Mental Health',
    fields: 22,
    preview: 'Mental health history, current symptoms, medications, support system'
  },
  {
    id: 'orthopedic-intake',
    title: 'Orthopedic Intake',
    description: 'Specialized form for orthopedic consultations',
    category: 'Orthopedic',
    fields: 16,
    preview: 'Injury history, pain assessment, mobility, previous treatments'
  },
  {
    id: 'cardiology-intake',
    title: 'Cardiology Intake',
    description: 'Heart health focused intake form',
    category: 'Cardiology',
    fields: 20,
    preview: 'Cardiac history, symptoms, family history, lifestyle factors'
  }
]

const categories = ['All', 'General', 'Dental', 'Pediatric', 'Mental Health', 'Orthopedic', 'Cardiology']

export function Templates() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false)

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUseTemplate = (templateId: string) => {
    // In a real app, this would create a new form based on the template
    console.log('Using template:', templateId)
    alert('Template feature coming soon! This will create a new form based on the selected template.')
  }

  const handleViewDocument = (templateTitle: string) => {
    // Mock document data for template preview
    const mockDocument = {
      patientName: templateTitle,
      date: 'Oct 22, 2023',
      time: '9:00:00 AM',
      orderDetails: [
        { item: 'Medical Consultation', price: 150.00 },
        { item: 'Form Processing Fee', price: 25.00 }
      ],
      subtotal: 175.00,
      shipping: 0.00,
      tax: 15.00,
      total: 190.00,
      shippingInfo: {
        name: 'Medical Clinic',
        address: '123 Healthcare Ave.',
        city: 'Medical City',
        zipCode: 'MC 12345'
      },
      billingInfo: {
        sameAsShipping: true
      },
      customerInfo: {
        name: 'Sample Patient',
        email: 'patient@example.com',
        phone: '+1 234 567 890'
      },
      notes: 'Template preview document'
    }
    
    setSelectedDocument(mockDocument)
    setIsDocumentViewerOpen(true)
  }

  const handleCloseDocumentViewer = () => {
    setIsDocumentViewerOpen(false)
    setSelectedDocument(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Form templates and document management</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle>Document Templates</CardTitle>
          <CardDescription>Available form templates for patient intake</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-6">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{template.title}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-muted-foreground truncate">{template.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">{template.category}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground min-w-0">
                        <span className="truncate">{template.fields} fields</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Available
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUseTemplate(template.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Use
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewDocument(template.title)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <DocumentViewer
        isOpen={isDocumentViewerOpen}
        onClose={handleCloseDocumentViewer}
        document={selectedDocument}
      />
    </div>
  )
}