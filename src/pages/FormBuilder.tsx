import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, Eye, Settings, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Checkbox } from '../components/ui/checkbox'
import { DatabaseStatusBanner } from '../components/DatabaseStatusBanner'
import { blink } from '../blink/client'

export interface FormField {
  id: string
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'email' | 'phone' | 'number'
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

export interface FormData {
  id?: string
  title: string
  description: string
  fields: FormField[]
  status: 'draft' | 'published'
  createdAt?: string
  updatedAt?: string
}

const fieldTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'number', label: 'Number' }
]

export function FormBuilder() {
  const { formId } = useParams()
  const navigate = useNavigate()
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: 'New Patient Intake Form',
    description: 'Please fill out this form before your appointment',
    fields: [],
    status: 'draft'
  })

  useEffect(() => {
    if (formId) {
      loadForm(formId)
    }
  }, [formId])

  const loadForm = async (id: string) => {
    try {
      try {
        const form = await blink.db.forms.list({
          where: { id },
          limit: 1
        })
        if (form && form.length > 0) {
          setFormData(form[0])
        }
      } catch (dbError) {
        console.warn('Database unavailable, checking local storage:', dbError)
        // Fallback to localStorage
        const localForms = localStorage.getItem('medical-forms')
        if (localForms) {
          try {
            const forms = JSON.parse(localForms)
            const form = forms.find((f: any) => f.id === id)
            if (form) {
              setFormData({
                ...form,
                fields: typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields || []
              })
            }
          } catch (parseError) {
            console.error('Error parsing local forms data:', parseError)
          }
        }
      }
    } catch (error) {
      console.error('Error loading form:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const user = await blink.auth.me()
      const now = new Date().toISOString()
      
      const formToSave = {
        ...formData,
        userId: user.id,
        updatedAt: now,
        createdAt: formData.createdAt || now,
        responses: formData.responses || 0,
        fields: JSON.stringify(formData.fields) // Ensure fields are stored as JSON string
      }

      try {
        if (formId) {
          await blink.db.forms.update(formId, formToSave)
        } else {
          const newForm = await blink.db.forms.create(formToSave)
          navigate(`/builder/${newForm.id}`, { replace: true })
        }
      } catch (dbError) {
        console.warn('Database unavailable, saving to local storage:', dbError)
        // Fallback to localStorage
        try {
          const localForms = localStorage.getItem('medical-forms')
          const forms = localForms ? JSON.parse(localForms) : []
          
          if (formId) {
            // Update existing form
            const formIndex = forms.findIndex((f: any) => f.id === formId)
            if (formIndex >= 0) {
              forms[formIndex] = formToSave
            }
          } else {
            // Create new form
            const newFormId = `form_${Date.now()}`
            const newForm = { ...formToSave, id: newFormId }
            forms.push(newForm)
            navigate(`/builder/${newFormId}`, { replace: true })
          }
          
          localStorage.setItem('medical-forms', JSON.stringify(forms))
        } catch (storageError) {
          console.error('Error saving to localStorage:', storageError)
          throw new Error('Failed to save form locally')
        }
      }
    } catch (error) {
      console.error('Error saving form:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    const updatedForm = { ...formData, status: 'published' as const }
    setFormData(updatedForm)
    await handleSave()
  }

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: getDefaultLabel(type),
      required: false,
      placeholder: getDefaultPlaceholder(type)
    }

    if (type === 'select' || type === 'radio' || type === 'checkbox') {
      newField.options = ['Option 1', 'Option 2', 'Option 3']
    }

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
  }

  const getDefaultLabel = (type: FormField['type']): string => {
    const labels = {
      text: 'Text Input',
      textarea: 'Text Area',
      select: 'Dropdown',
      radio: 'Radio Buttons',
      checkbox: 'Checkboxes',
      date: 'Date',
      email: 'Email',
      phone: 'Phone Number',
      number: 'Number'
    }
    return labels[type] || 'Field'
  }

  const getDefaultPlaceholder = (type: FormField['type']): string => {
    const placeholders = {
      text: 'Enter text...',
      textarea: 'Enter your message...',
      email: 'Enter email address...',
      phone: 'Enter phone number...',
      number: 'Enter number...',
      date: 'Select date...'
    }
    return placeholders[type] || ''
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }))
  }

  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }))
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Form Preview</h1>
            <Button onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{formData.title}</CardTitle>
              <p className="text-muted-foreground">{formData.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'textarea' && (
                    <Textarea placeholder={field.placeholder} />
                  )}
                  
                  {['text', 'email', 'phone', 'number', 'date'].includes(field.type) && (
                    <Input 
                      type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                      placeholder={field.placeholder} 
                    />
                  )}
                  
                  {field.type === 'select' && (
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option, index) => (
                          <SelectItem key={index} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {field.type === 'radio' && (
                    <div className="space-y-2">
                      {field.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input type="radio" name={field.id} id={`${field.id}-${index}`} />
                          <label htmlFor={`${field.id}-${index}`}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {field.type === 'checkbox' && (
                    <div className="space-y-2">
                      {field.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox id={`${field.id}-${index}`} />
                          <label htmlFor={`${field.id}-${index}`}>{option}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {formData.fields.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No fields added yet. Go back to add some fields to your form.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DatabaseStatusBanner />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Form Builder</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={formData.status === 'published' ? 'default' : 'secondary'}>
                {formData.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formId ? 'Editing form' : 'Creating new form'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={handlePublish} disabled={saving}>
            Publish
          </Button>
        </div>
      </div>

      {/* Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Form Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Form Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter form title..."
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter form description..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field Library */}
        <Card>
          <CardHeader>
            <CardTitle>Field Library</CardTitle>
            <p className="text-sm text-muted-foreground">Click to add fields to your form</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {fieldTypes.map((fieldType) => (
                <Button
                  key={fieldType.value}
                  variant="outline"
                  size="sm"
                  onClick={() => addField(fieldType.value as FormField['type'])}
                  className="justify-start"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {fieldType.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
              <p className="text-sm text-muted-foreground">Configure your form fields</p>
            </CardHeader>
            <CardContent>
              {formData.fields.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No fields added yet.</p>
                  <p className="text-sm">Click on field types from the library to add them.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Field Label</label>
                            <Input
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              placeholder="Enter field label..."
                            />
                          </div>
                          
                          {['text', 'textarea', 'email', 'phone', 'number'].includes(field.type) && (
                            <div>
                              <label className="text-sm font-medium mb-1 block">Placeholder</label>
                              <Input
                                value={field.placeholder || ''}
                                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                placeholder="Enter placeholder text..."
                              />
                            </div>
                          )}
                          
                          {['select', 'radio', 'checkbox'].includes(field.type) && (
                            <div>
                              <label className="text-sm font-medium mb-1 block">Options (one per line)</label>
                              <Textarea
                                value={field.options?.join('\n') || ''}
                                onChange={(e) => updateField(field.id, { 
                                  options: e.target.value.split('\n').filter(opt => opt.trim()) 
                                })}
                                placeholder="Option 1&#10;Option 2&#10;Option 3"
                                rows={3}
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`required-${field.id}`}
                              checked={field.required}
                              onCheckedChange={(checked) => updateField(field.id, { required: checked as boolean })}
                            />
                            <label htmlFor={`required-${field.id}`} className="text-sm">
                              Required field
                            </label>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(field.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                        Field Type: {getDefaultLabel(field.type)}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}