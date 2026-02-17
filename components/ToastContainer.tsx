'use client'

import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useCart } from './CartContext'

export default function ToastContainer() {
  const { toasts, removeToast } = useCart()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-4 fade-in duration-200 ${
            toast.type === 'success' ? 'bg-green-600 text-white' :
            toast.type === 'error' ? 'bg-red-600 text-white' :
            'bg-[#111111] text-white'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
          {toast.type === 'info' && <Info className="w-5 h-5" />}
          <span className="font-medium text-sm">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
