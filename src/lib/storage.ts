// Local storage utilities for form data persistence
// This serves as a fallback when database is unavailable

export interface FormData {
  id: string
  title: string
  description: string
  fields: any[] // FormField[] but stored as JSON
  status: 'draft' | 'published'
  responses: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface ResponseData {
  id: string
  formId: string
  patientName: string
  patientEmail: string
  responses: Record<string, any>
  status: 'completed' | 'partial' | 'pending'
  submittedAt: string
  userId: string
}

const FORMS_KEY = 'medical-forms'
const RESPONSES_KEY = 'medical-responses'

// Form storage functions
export const getStoredForms = (): FormData[] => {
  try {
    const stored = localStorage.getItem(FORMS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading forms from localStorage:', error)
    return []
  }
}

export const storeForm = (form: FormData): void => {
  try {
    const forms = getStoredForms()
    const existingIndex = forms.findIndex(f => f.id === form.id)
    
    if (existingIndex >= 0) {
      forms[existingIndex] = form
    } else {
      forms.push(form)
    }
    
    localStorage.setItem(FORMS_KEY, JSON.stringify(forms))
  } catch (error) {
    console.error('Error storing form to localStorage:', error)
    throw new Error('Failed to save form locally')
  }
}

export const getStoredForm = (id: string): FormData | null => {
  const forms = getStoredForms()
  return forms.find(f => f.id === id) || null
}

export const deleteStoredForm = (id: string): void => {
  try {
    const forms = getStoredForms().filter(f => f.id !== id)
    localStorage.setItem(FORMS_KEY, JSON.stringify(forms))
  } catch (error) {
    console.error('Error deleting form from localStorage:', error)
    throw new Error('Failed to delete form locally')
  }
}

// Response storage functions
export const getStoredResponses = (): ResponseData[] => {
  try {
    const stored = localStorage.getItem(RESPONSES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading responses from localStorage:', error)
    return []
  }
}

export const storeResponse = (response: ResponseData): void => {
  try {
    const responses = getStoredResponses()
    const existingIndex = responses.findIndex(r => r.id === response.id)
    
    if (existingIndex >= 0) {
      responses[existingIndex] = response
    } else {
      responses.push(response)
    }
    
    localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses))
  } catch (error) {
    console.error('Error storing response to localStorage:', error)
    throw new Error('Failed to save response locally')
  }
}

// Initialize with sample data if empty
export const initializeSampleData = (userId: string): void => {
  const existingForms = getStoredForms()
  const existingResponses = getStoredResponses()
  
  if (existingForms.length === 0) {
    const sampleForms: FormData[] = [
      {
        id: 'form_sample_1',
        title: 'General Patient Intake',
        description: 'Comprehensive intake form for new patients',
        fields: [
          {
            id: 'field_1',
            type: 'text',
            label: 'Full Name',
            required: true,
            placeholder: 'Enter your full name'
          },
          {
            id: 'field_2',
            type: 'email',
            label: 'Email Address',
            required: true,
            placeholder: 'Enter your email'
          },
          {
            id: 'field_3',
            type: 'phone',
            label: 'Phone Number',
            required: true,
            placeholder: 'Enter your phone number'
          },
          {
            id: 'field_4',
            type: 'date',
            label: 'Date of Birth',
            required: true
          },
          {
            id: 'field_5',
            type: 'textarea',
            label: 'Medical History',
            required: false,
            placeholder: 'Please describe any relevant medical history'
          }
        ],
        status: 'published',
        responses: 12,
        userId,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'form_sample_2',
        title: 'Dental Patient Intake',
        description: 'Specialized form for dental practices',
        fields: [
          {
            id: 'field_1',
            type: 'text',
            label: 'Full Name',
            required: true,
            placeholder: 'Enter your full name'
          },
          {
            id: 'field_2',
            type: 'select',
            label: 'Reason for Visit',
            required: true,
            options: ['Routine Cleaning', 'Tooth Pain', 'Check-up', 'Emergency']
          },
          {
            id: 'field_3',
            type: 'radio',
            label: 'Have you had dental work in the past year?',
            required: true,
            options: ['Yes', 'No']
          }
        ],
        status: 'published',
        responses: 8,
        userId,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'form_sample_3',
        title: 'Mental Health Intake',
        description: 'Comprehensive mental health assessment form',
        fields: [
          {
            id: 'field_1',
            type: 'text',
            label: 'Full Name',
            required: true,
            placeholder: 'Enter your full name'
          },
          {
            id: 'field_2',
            type: 'textarea',
            label: 'Current Concerns',
            required: true,
            placeholder: 'Please describe what brings you here today'
          }
        ],
        status: 'draft',
        responses: 0,
        userId,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    localStorage.setItem(FORMS_KEY, JSON.stringify(sampleForms))
  }
  
  if (existingResponses.length === 0) {
    const sampleResponses: ResponseData[] = [
      {
        id: 'response_1',
        formId: 'form_sample_1',
        patientName: 'Alexander Chen',
        patientEmail: 'alexander.chen@email.com',
        responses: {
          field_1: 'Alexander Chen',
          field_2: 'alexander.chen@email.com',
          field_3: '+1-555-0123',
          field_4: '1985-03-15',
          field_5: 'No significant medical history'
        },
        status: 'completed',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        userId
      },
      {
        id: 'response_2',
        formId: 'form_sample_2',
        patientName: 'Maria Gonzalez',
        patientEmail: 'maria.gonzalez@email.com',
        responses: {
          field_1: 'Maria Gonzalez',
          field_2: 'Routine Cleaning',
          field_3: 'Yes'
        },
        status: 'completed',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        userId
      },
      {
        id: 'response_3',
        formId: 'form_sample_1',
        patientName: 'Ravi Patel',
        patientEmail: 'ravi.patel@email.com',
        responses: {
          field_1: 'Ravi Patel',
          field_2: 'ravi.patel@email.com'
          // Incomplete - missing other fields
        },
        status: 'partial',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        userId
      }
    ]
    
    localStorage.setItem(RESPONSES_KEY, JSON.stringify(sampleResponses))
  }
}

// Database availability check
export const isDatabaseAvailable = async (): Promise<boolean> => {
  try {
    // Try a simple database operation to check availability
    const { blink } = await import('../blink/client')
    await blink.db.forms.list({ limit: 1 })
    return true
  } catch (error) {
    // Check if it's a 404 error (table doesn't exist) or other database issues
    const errorMessage = error?.message || error?.toString() || ''
    if (errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('maximum database count')) {
      console.warn('Database not available - using localStorage fallback:', errorMessage)
      return false
    }
    console.warn('Database unavailable:', error)
    return false
  }
}