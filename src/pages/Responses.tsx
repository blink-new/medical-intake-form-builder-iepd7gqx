import { useState, useEffect } from 'react'
import { Search, Download, Eye, Filter, Calendar, MoreHorizontal, Send, FileText, Trash2, Share2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Checkbox } from '../components/ui/checkbox'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination'

interface PatientResponse {
  id: string
  patientName: string
  patientEmail: string
  patientPhone: string
  dateOfBirth: string
  treatingPhysician: string
  documentType: 'anamnesis' | 'consent'
  status: 'pending' | 'partially' | 'completed'
  dateOfCreation: string
  completionTime: string
  formTitle: string
}

// Mock data matching the medical dashboard pattern
const mockPatientResponses: PatientResponse[] = [
  {
    id: '1',
    patientName: 'Alexander Chen',
    patientEmail: 'alexander.chen@email.com',
    patientPhone: '+1 (555) 123-4567',
    dateOfBirth: 'January 5, 1990',
    treatingPhysician: 'Dr. Nathan Brown',
    documentType: 'anamnesis',
    status: 'completed',
    dateOfCreation: 'January 6, 2025 10:15',
    completionTime: '5m 23s',
    formTitle: 'General Patient Intake'
  },
  {
    id: '2',
    patientName: 'Maria Gonzalez',
    patientEmail: 'maria.gonzalez@email.com',
    patientPhone: '+1 (555) 234-5678',
    dateOfBirth: 'February 12, 1985',
    treatingPhysician: 'Sarah Johnson',
    documentType: 'consent',
    status: 'completed',
    dateOfCreation: 'January 7, 2025 09:45',
    completionTime: '7m 45s',
    formTitle: 'Dental Patient Intake'
  },
  {
    id: '3',
    patientName: 'Ravi Patel',
    patientEmail: 'ravi.patel@email.com',
    patientPhone: '+1 (555) 345-6789',
    dateOfBirth: 'March 23, 1992',
    treatingPhysician: 'Dr. Michael Smith',
    documentType: 'anamnesis',
    status: 'partially',
    dateOfCreation: 'January 8, 2025 14:30',
    completionTime: '3m 12s',
    formTitle: 'Mental Health Intake'
  },
  {
    id: '4',
    patientName: 'Sofia Kim',
    patientEmail: 'sofia.kim@email.com',
    patientPhone: '+1 (555) 456-7890',
    dateOfBirth: 'April 30, 1978',
    treatingPhysician: 'Dr. Lisa White',
    documentType: 'consent',
    status: 'pending',
    dateOfCreation: 'January 9, 2025 16:00',
    completionTime: '0m 0s',
    formTitle: 'Cardiology Intake'
  },
  {
    id: '5',
    patientName: 'Liam O\'Connor',
    patientEmail: 'liam.oconnor@email.com',
    patientPhone: '+1 (555) 567-8901',
    dateOfBirth: 'May 17, 1988',
    treatingPhysician: 'John Doe',
    documentType: 'anamnesis',
    status: 'completed',
    dateOfCreation: 'January 10, 2025 08:20',
    completionTime: '8m 15s',
    formTitle: 'Orthopedic Intake'
  },
  {
    id: '6',
    patientName: 'Fatima Al-Mansoori',
    patientEmail: 'fatima.almansoori@email.com',
    patientPhone: '+1 (555) 678-9012',
    dateOfBirth: 'June 4, 1995',
    treatingPhysician: 'Dr. Alice Green',
    documentType: 'consent',
    status: 'completed',
    dateOfCreation: 'January 11, 2025 12:50',
    completionTime: '6m 30s',
    formTitle: 'Pediatric Intake'
  },
  {
    id: '7',
    patientName: 'Jasper Wang',
    patientEmail: 'jasper.wang@email.com',
    patientPhone: '+1 (555) 789-0123',
    dateOfBirth: 'July 22, 1982',
    treatingPhysician: 'Dr. Robert King',
    documentType: 'anamnesis',
    status: 'pending',
    dateOfCreation: 'January 12, 2025 19:05',
    completionTime: '0m 0s',
    formTitle: 'Neurology Intake'
  },
  {
    id: '8',
    patientName: 'Elena Ivanov',
    patientEmail: 'elena.ivanov@email.com',
    patientPhone: '+1 (555) 890-1234',
    dateOfBirth: 'August 15, 1991',
    treatingPhysician: 'Jessica Thompson',
    documentType: 'consent',
    status: 'pending',
    dateOfCreation: 'January 13, 2025 21:10',
    completionTime: '0m 0s',
    formTitle: 'Dermatology Intake'
  }
]

export function Responses() {
  const [responses, setResponses] = useState<PatientResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all')
  const [selectedResponses, setSelectedResponses] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedResponse, setSelectedResponse] = useState<PatientResponse | null>(null)

  useEffect(() => {
    // Simulate loading responses
    setTimeout(() => {
      setResponses(mockPatientResponses)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredResponses = responses.filter(response => {
    const matchesSearch = response.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.treatingPhysician.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || response.status === statusFilter
    const matchesDocumentType = documentTypeFilter === 'all' || response.documentType === documentTypeFilter
    return matchesSearch && matchesStatus && matchesDocumentType
  })

  const totalPages = Math.ceil(filteredResponses.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedResponses = filteredResponses.slice(startIndex, startIndex + rowsPerPage)

  const getStatusBadge = (status: PatientResponse['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case 'partially':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Partially</Badge>
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedResponses(paginatedResponses.map(r => r.id))
    } else {
      setSelectedResponses([])
    }
  }

  const handleSelectResponse = (responseId: string, checked: boolean) => {
    if (checked) {
      setSelectedResponses(prev => [...prev, responseId])
    } else {
      setSelectedResponses(prev => prev.filter(id => id !== responseId))
    }
  }

  const handleSendReminder = (responseId: string) => {
    console.log('Sending reminder for response:', responseId)
    // In a real app, this would send an email reminder
    alert('Reminder sent successfully!')
  }

  const handleViewDocument = (response: PatientResponse) => {
    setSelectedResponse(response)
  }

  const handleDeleteDocument = (responseId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setResponses(prev => prev.filter(r => r.id !== responseId))
      setSelectedResponses(prev => prev.filter(id => id !== responseId))
    }
  }

  const handleShareLink = (responseId: string) => {
    console.log('Sharing link for response:', responseId)
    alert('Link copied to clipboard!')
  }

  const handleDownloadDocument = (responseId: string) => {
    console.log('Downloading document for response:', responseId)
    alert('Document download started!')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Documents</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Here's a list of your documents</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          New document
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-6">
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="partially">Partially</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center space-x-4 ml-auto">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedResponses.length === paginatedResponses.length && paginatedResponses.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Document type</TableHead>
                <TableHead>Treating physician</TableHead>
                <TableHead>Date of birth</TableHead>
                <TableHead>Date of creation</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResponses.map((response) => (
                <TableRow key={response.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedResponses.includes(response.id)}
                      onCheckedChange={(checked) => handleSelectResponse(response.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{response.patientName}</p>
                      <p className="text-sm text-muted-foreground">{response.patientEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(response.status)}
                  </TableCell>
                  <TableCell className="capitalize">{response.documentType}</TableCell>
                  <TableCell>{response.treatingPhysician}</TableCell>
                  <TableCell>{response.dateOfBirth}</TableCell>
                  <TableCell>{response.dateOfCreation}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleSendReminder(response.id)}>
                          <Send className="w-4 h-4 mr-2" />
                          Send reminder
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDocument(response)}>
                          <FileText className="w-4 h-4 mr-2" />
                          View document
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteDocument(response.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete document
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleShareLink(response.id)}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadDocument(response.id)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download document
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedResponses.length} of {filteredResponses.length} row(s) selected.
        </p>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
              <SelectTrigger className="h-8 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                ««
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                ›
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                »»
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      <Dialog open={!!selectedResponse} onOpenChange={() => setSelectedResponse(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document preview</DialogTitle>
            <p className="text-sm text-muted-foreground">Changes are not saved</p>
          </DialogHeader>
          {selectedResponse && (
            <div className="space-y-6">
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleDownloadDocument(selectedResponse.id)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download document
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Patient Information</h3>
                  <p className="text-sm text-muted-foreground">Basic patient details and contact information</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{selectedResponse.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{selectedResponse.patientEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-sm text-muted-foreground">{selectedResponse.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Treating Physician</p>
                    <p className="text-sm text-muted-foreground">{selectedResponse.treatingPhysician}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Document Type</p>
                    <p className="text-sm text-muted-foreground capitalize">{selectedResponse.documentType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedResponse.status)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}