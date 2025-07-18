import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileText, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { DocumentViewer } from '../components/DocumentViewer'
import { DatabaseStatusBanner } from '../components/DatabaseStatusBanner'
import { blink } from '../blink/client'
import { getStoredForms, getStoredResponses, deleteStoredForm, initializeSampleData, isDatabaseAvailable, type FormData, type ResponseData } from '../lib/storage'

type Form = FormData

export function Dashboard() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const user = await blink.auth.me()
      let formsData: Form[] = []
      
      // Check if database is available
      const dbAvailable = await isDatabaseAvailable()
      
      if (dbAvailable) {
        try {
          formsData = await blink.db.forms.list({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' },
            limit: 10
          }) || []
        } catch (dbError) {
          console.warn('Database query failed, falling back to localStorage:', dbError)
          // Fall back to localStorage
          initializeSampleData(user.id)
          formsData = getStoredForms().filter(form => form.userId === user.id)
        }
      } else {
        // Use localStorage with sample data
        console.log('Using localStorage for form data')
        initializeSampleData(user.id)
        formsData = getStoredForms().filter(form => form.userId === user.id)
      }
      
      // Parse fields if they're stored as strings
      formsData = formsData.map(form => ({
        ...form,
        fields: typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields
      }))
      
      setForms(formsData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Fallback to empty state
      setForms([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteForm = async (formId: string) => {
    if (confirm('Are you sure you want to delete this form?')) {
      try {
        const dbAvailable = await isDatabaseAvailable()
        
        if (dbAvailable) {
          try {
            await blink.db.forms.delete(formId)
          } catch (dbError) {
            console.warn('Database delete failed, updating local storage:', dbError)
            deleteStoredForm(formId)
          }
        } else {
          deleteStoredForm(formId)
        }
        
        setForms(forms.filter(form => form.id !== formId))
      } catch (error) {
        console.error('Error deleting form:', error)
        alert('Failed to delete form. Please try again.')
      }
    }
  }

  const handleViewDocument = (patientName: string) => {
    // Mock document data based on the screenshot
    const mockDocument = {
      patientName: patientName,
      date: 'Oct 22, 2023',
      time: '9:00:00 AM',
      orderDetails: [
        { item: 'Glimmer Lamps x', price: 250.00 },
        { item: 'Aqua Filters x', price: 49.00 }
      ],
      subtotal: 299.00,
      shipping: 5.00,
      tax: 25.00,
      total: 329.00,
      shippingInfo: {
        name: 'Liam Johnson',
        address: '1234 Main St.',
        city: 'Anytown',
        zipCode: 'CA 12345'
      },
      billingInfo: {
        sameAsShipping: true
      },
      customerInfo: {
        name: 'Liam Johnson',
        email: 'liam@acme.com',
        phone: '+1 234 567 890'
      },
      notes: ''
    }
    
    setSelectedDocument(mockDocument)
    setIsDocumentViewerOpen(true)
  }

  const handleCloseDocumentViewer = () => {
    setIsDocumentViewerOpen(false)
    setSelectedDocument(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DatabaseStatusBanner />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inbox</h1>
          <p className="text-muted-foreground">Manage your patient intake forms and responses</p>
        </div>
        <Link to="/builder">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New form
          </Button>
        </Link>
      </div>



      {/* Inbox List */}
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Patient form submissions and responses</CardDescription>
        </CardHeader>
        <CardContent>
          {forms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
              <p className="text-muted-foreground mb-4">Patient form submissions will appear here</p>
              <Link to="/builder">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Form
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Mock inbox data based on the screenshot */}
              {[
                { patient: 'Alexander Chen', document: 'Bianca Martinez', status: 'Completed', type: 'Anamnesis', date: 'January 6, 2025' },
                { patient: 'Maria Gonzalez', document: 'Charles Kim', status: 'Completed', type: 'Consent', date: 'January 7, 2025' },
                { patient: 'Ravi Patel', document: 'Diana Foster', status: 'Partially', type: 'Anamnesis', date: 'January 8, 2025' },
                { patient: 'Sofia Kim', document: 'Ethan Reed', status: 'Pending', type: 'Consent', date: 'January 9, 2025' },
                { patient: 'Liam O\'Connor', document: 'Fiona Yang', status: 'Completed', type: 'Anamnesis', date: 'January 10, 2025' },
                { patient: 'Fatima Al-Mansoori', document: 'George Patel', status: 'Completed', type: 'Consent', date: 'January 11, 2025' },
                { patient: 'Jasper Wang', document: 'Hannah Li', status: 'Pending', type: 'Anamnesis', date: 'January 12, 2025' },
                { patient: 'Elena Ivanov', document: 'Isaac Nguyen', status: 'Pending', type: 'Consent', date: 'January 13, 2025' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-6">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{item.patient}</p>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-muted-foreground truncate">{item.document}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === 'Completed' ? 'bg-green-500' : 
                            item.status === 'Partially' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}></div>
                          <span className="text-sm">{item.status}</span>
                        </div>
                        <div className="text-sm text-muted-foreground min-w-0">
                          <span className="truncate">{item.type}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.date}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewDocument(item.patient)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DocumentViewer
        isOpen={isDocumentViewerOpen}
        onClose={handleCloseDocumentViewer}
        document={selectedDocument}
      />
    </div>
  )
}