import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Alert, AlertDescription } from './ui/alert'
import { Button } from './ui/button'

export function DatabaseStatusBanner() {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isDbAvailable, setIsDbAvailable] = useState(true)

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('db-banner-dismissed')
    if (dismissed) {
      setIsDismissed(true)
    }

    // Check database availability
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    try {
      // Try a simple database operation
      const { blink } = await import('../blink/client')
      await blink.db.forms.list({ limit: 1 })
      setIsDbAvailable(true)
    } catch (error) {
      // Check for specific database errors
      const errorMessage = error?.message || error?.toString() || ''
      if (errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('maximum database count')) {
        console.log('Database not available - showing fallback banner')
        setIsDbAvailable(false)
      } else {
        console.warn('Database check failed:', error)
        setIsDbAvailable(false)
      }
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('db-banner-dismissed', 'true')
  }

  if (isDismissed || isDbAvailable) {
    return null
  }

  return (
    <Alert className="mb-6 border-yellow-200 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-yellow-800">
          <strong>Local Storage Mode:</strong> Database is not available for this project. Your forms are being saved locally in your browser. Data will persist until you clear your browser storage.
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}