import { X, Printer, Check } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

interface DocumentViewerProps {
  isOpen: boolean
  onClose: () => void
  document?: {
    patientName: string
    date: string
    time: string
    orderDetails: Array<{
      item: string
      price: number
    }>
    subtotal: number
    shipping: number
    tax: number
    total: number
    shippingInfo: {
      name: string
      address: string
      city: string
      zipCode: string
    }
    billingInfo: {
      sameAsShipping: boolean
      name?: string
      address?: string
      city?: string
      zipCode?: string
    }
    customerInfo: {
      name: string
      email: string
      phone: string
    }
    notes?: string
  }
}

export function DocumentViewer({ isOpen, onClose, document }: DocumentViewerProps) {
  if (!isOpen || !document) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {/* Status indicators */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{document.patientName}</h2>
              <p className="text-sm text-gray-500">{document.date}, {document.time}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-8">
            {/* Order Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-3">
                {document.orderDetails.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900">{item.item}</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-medium text-gray-900">{formatCurrency(item.price)}</span>
                  </div>
                ))}
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatCurrency(document.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">{formatCurrency(document.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">{formatCurrency(document.tax)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatCurrency(document.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping and Billing Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                <div className="space-y-1 text-gray-600">
                  <p className="font-medium text-gray-900">{document.shippingInfo.name}</p>
                  <p>{document.shippingInfo.address}</p>
                  <p>{document.shippingInfo.city}, {document.shippingInfo.zipCode}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
                <div className="text-gray-600">
                  {document.billingInfo.sameAsShipping ? (
                    <p>Same as shipping address</p>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{document.billingInfo.name}</p>
                      <p>{document.billingInfo.address}</p>
                      <p>{document.billingInfo.city}, {document.billingInfo.zipCode}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            {document.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <textarea
                    className="w-full bg-transparent border-none resize-none focus:outline-none text-gray-600"
                    placeholder="Placeholder"
                    defaultValue={document.notes}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Customer</p>
                  <p className="text-gray-900 font-medium">{document.customerInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900">{document.customerInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-900">{document.customerInfo.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}