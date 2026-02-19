'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { DELIVERY_ZONES } from '@/lib/data'
import { BUSINESS_CONFIG, validatePhone, validateEmail, trackEvent } from '@/lib/config'
import { useCart } from '@/components/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Check, AlertCircle, User, LogIn, Upload, FileText, X, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const PAYMENT_METHODS = [
  { id: 'pago_movil', name: 'Pago Móvil', description: 'Transferencia a Mercantil', icon: '📱', primary: true },
  { id: 'zelle', name: 'Zelle', description: 'Pago desde USA', icon: '🇺🇸' },
]

// Tipos de archivo permitidos
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]

const MAX_FILE_SIZE_MB = 5

export default function CheckoutClient() {
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCart()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  })
  const [countryCode, setCountryCode] = useState('+58')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedZone, setSelectedZone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [user, setUser] = useState<any>(null)

  // Estados para el comprobante
  const [comprobante, setComprobante] = useState<{
    file: File | null
    preview: string | null
    url: string | null
    isUploading: boolean
    uploadProgress: number
  }>({
    file: null,
    preview: null,
    url: null,
    isUploading: false,
    uploadProgress: 0,
  })

  const deliveryZone = DELIVERY_ZONES.find(z => z.id === selectedZone)
  const deliveryCost = deliveryZone?.cost || 0
  const subtotal = getSubtotal()
  const total = subtotal + deliveryCost

  // Pago Móvil: se contacta por WhatsApp, sin comprobante
  // Zelle: comprobante opcional
  const requiresComprobante = false
  const showComprobanteUpload = paymentMethod === 'zelle'

  // Check if user is logged in and prefill form
  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (items.length === 0) {
      router.push('/buscar')
    }
  }, [items, router])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        const savedPhone = user.user_metadata?.phone || ''
        // Extraer código de país si existe
        if (savedPhone.startsWith('+58')) {
          setCountryCode('+58')
          setFormData(prev => ({
            ...prev,
            email: user.email || '',
            name: user.user_metadata?.full_name || '',
            phone: savedPhone.replace('+58', ''),
          }))
        } else {
          setFormData(prev => ({
            ...prev,
            email: user.email || '',
            name: user.user_metadata?.full_name || '',
            phone: savedPhone,
          }))
        }
      }
    })
    trackEvent('page_view', { page_title: 'Finalizar compra' })
  }, [])

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'phone':
        return value && value.length < 10 ? 'Debe tener 10 dígitos (ej: 4121234567)' : ''
      case 'email':
        return value && !validateEmail(value) ? 'Email inválido' : ''
      default:
        return ''
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir números
    let rawValue = e.target.value.replace(/\D/g, '')
    // Si empieza con 0, lo quitamos (el código de país ya está en el dropdown)
    if (rawValue.startsWith('0')) {
      rawValue = rawValue.slice(1)
    }
    // Limitar a 10 dígitos
    const limitedValue = rawValue.slice(0, 10)
    setFormData(prev => ({ ...prev, phone: limitedValue }))
    const error = validateField('phone', limitedValue)
    setErrors(prev => ({ ...prev, phone: error }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'phone') {
      // Phone is handled separately
      return
    }
    setFormData(prev => ({ ...prev, [name]: value }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  // ─── Manejo de comprobante ────────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrors(prev => ({ 
        ...prev, 
        comprobante: 'Solo se permiten imágenes (JPG, PNG, GIF, WebP) o PDF' 
      }))
      return
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrors(prev => ({ 
        ...prev, 
        comprobante: `El archivo es demasiado grande. Máximo ${MAX_FILE_SIZE_MB}MB` 
      }))
      return
    }

    // Crear preview
    let preview: string | null = null
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file)
    }

    setComprobante({
      file,
      preview,
      url: null,
      isUploading: true,
      uploadProgress: 0,
    })
    setErrors(prev => ({ ...prev, comprobante: '' }))

    // Subir archivo inmediatamente
    await uploadComprobante(file)
  }

  const uploadComprobante = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload-comprobante', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error subiendo el archivo')
      }

      setComprobante(prev => ({
        ...prev,
        url: data.url,
        isUploading: false,
        uploadProgress: 100,
      }))
    } catch (err: any) {
      setErrors(prev => ({ ...prev, comprobante: err.message }))
      setComprobante(prev => ({
        ...prev,
        isUploading: false,
      }))
    }
  }

  const removeComprobante = async () => {
    if (comprobante.url) {
      // Intentar eliminar del servidor
      try {
        const path = comprobante.url.split('/comprobantes/').pop()
        if (path) {
          await fetch(`/api/upload-comprobante?path=${encodeURIComponent(path)}`, {
            method: 'DELETE',
          })
        }
      } catch (err) {
        console.error('Error removing file:', err)
      }
    }

    // Limpiar preview URL
    if (comprobante.preview) {
      URL.revokeObjectURL(comprobante.preview)
    }

    setComprobante({
      file: null,
      preview: null,
      url: null,
      isUploading: false,
      uploadProgress: 0,
    })

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isFormValid = useMemo(() => {
    return !!(
      formData.name.trim() &&
      formData.phone.trim() &&
      formData.phone.length >= 10 &&
      validateEmail(formData.email) &&
      formData.address.trim() &&
      selectedZone &&
      paymentMethod &&
      !Object.values(errors).some(e => e)
    )
  }, [formData, selectedZone, paymentMethod, errors])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const fullPhone = `${countryCode}${formData.phone}`
      const res = await fetch('/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: fullPhone,
          customerEmail: formData.email || undefined,
          items,
          subtotal,
          deliveryCost,
          total,
          deliveryZone: deliveryZone?.name || selectedZone,
          address: formData.address,
          paymentMethod,
          notes: formData.notes || undefined,
          comprobanteUrl: comprobante.url || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar tu pedido')
      }

      // Save to localStorage for the thank-you page
      try {
        localStorage.setItem('repuestohoy-last-order', JSON.stringify({
          ...data.order,
          id: data.order.order_number,
          customerName: formData.name,
          customerPhone: fullPhone,
          customerEmail: formData.email,
          items,
          subtotal,
          deliveryCost,
          total,
          deliveryZone: deliveryZone?.name || selectedZone,
          address: formData.address,
          paymentMethod,
          notes: formData.notes,
          comprobanteUrl: comprobante.url,
          createdAt: new Date().toISOString(),
        }))
      } catch (storageError) {
        console.error('localStorage error:', storageError)
      }

      trackEvent('purchase', {
        transaction_id: data.order.order_number,
        value: total,
        currency: 'USD',
        shipping: deliveryCost,
      })

      clearCart()
      router.push('/gracias')
    } catch (err: any) {
      setSubmitError(err.message || 'Hubo un error. Por favor intenta de nuevo.')
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header showBackLink />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-[#111111] mb-4">Tu carrito está vacío</h1>
          <p className="text-[#2A2A2A] mb-6">Agrega algunos productos para continuar.</p>
          <Link href="/buscar" className="btn-primary inline-block px-8">Ver productos</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header showBackLink />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-[#111111] mb-8 uppercase tracking-tight">
          Finalizar compra
        </h1>

        {/* Auth prompt - optional account */}
        {!user && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-900 text-sm">¿Tienes cuenta? Inicia sesión para agilizar tu compra</p>
                <p className="text-xs text-blue-700">Tus datos se llenarán automáticamente. <strong>No es obligatorio.</strong></p>
              </div>
            </div>
            <Link
              href={`/login?redirect=/checkout`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <LogIn className="w-4 h-4" />
              Iniciar sesión
            </Link>
          </div>
        )}

        {user && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">
              Comprando como <strong>{user.email}</strong>.{' '}
              <button onClick={() => supabase.auth.signOut().then(() => setUser(null))} className="underline hover:no-underline">
                Cerrar sesión
              </button>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Info */}
            <section className="card p-6">
              <h2 className="text-lg font-bold text-[#111111] mb-6 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-8 bg-[#111111] text-white rounded-full flex items-center justify-center text-sm">1</span>
                Tus datos
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-bold text-[#111111] mb-2 uppercase">
                    Nombre completo *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-[#111111] mb-2 uppercase">
                    Teléfono *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className={`input w-28 flex-shrink-0 ${errors.phone ? 'border-red-500' : ''}`}
                    >
                      <option value="+58">🇻🇪 +58</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+57">🇨🇴 +57</option>
                      <option value="+51">🇵🇪 +51</option>
                      <option value="+54">🇦🇷 +54</option>
                      <option value="+56">🇨🇱 +56</option>
                      <option value="+52">🇲🇽 +52</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+34">🇪🇸 +34</option>
                    </select>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      inputMode="numeric"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      required
                      className={`input flex-1 ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="4121234567"
                    />
                  </div>
                  {errors.phone ? (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">10 dígitos sin el 0 inicial</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-[#111111] mb-2 uppercase">
                    Email <span className="text-gray-400 font-normal normal-case">(para recibir confirmación)</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Ej: juan@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section className="card p-6">
              <h2 className="text-lg font-bold text-[#111111] mb-6 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-8 bg-[#111111] text-white rounded-full flex items-center justify-center text-sm">2</span>
                Entrega
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-bold text-[#111111] mb-2 uppercase">
                    Dirección de entrega *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="input resize-none"
                    placeholder="Ej: Av. Principal de Las Mercedes, Edificio X, Piso 3, Apto 301"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-3 uppercase">
                    Zona de entrega *
                  </label>
                  <div className="space-y-2">
                    {DELIVERY_ZONES.map(zone => (
                      <label
                        key={zone.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedZone === zone.id
                            ? 'border-[#111111] bg-[#F5F5F5]'
                            : 'border-[#E0E0E0] hover:border-[#2A2A2A]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="zone"
                          value={zone.id}
                          checked={selectedZone === zone.id}
                          onChange={(e) => setSelectedZone(e.target.value)}
                          className="hidden"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-[#111111]">{zone.name}</div>
                          <div className="text-sm text-[#2A2A2A]">⏱️ {zone.time}</div>
                        </div>
                        <div className="font-bold text-[#E10600]">
                          {zone.cost === 0 ? 'GRATIS' : `$${zone.cost.toFixed(2)}`}
                        </div>
                        {selectedZone === zone.id && <Check className="w-5 h-5 text-[#111111]" />}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="card p-6">
              <h2 className="text-lg font-bold text-[#111111] mb-6 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-8 bg-[#111111] text-white rounded-full flex items-center justify-center text-sm">3</span>
                Método de pago *
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {PAYMENT_METHODS.map(method => (
                  <label
                    key={method.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                      paymentMethod === method.id
                        ? 'border-[#111111] bg-[#F5F5F5]'
                        : 'border-[#E0E0E0] hover:border-[#2A2A2A]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden"
                    />
                    <div className="text-3xl mb-2">{method.icon}</div>
                    <div className="font-bold text-[#111111] text-sm">{method.name}</div>
                    <div className="text-xs text-[#2A2A2A]">{method.description}</div>
                  </label>
                ))}
              </div>

              {paymentMethod === 'pago_movil' && (
                <div className="mt-4 p-4 bg-[#F5F5F5] rounded-lg">
                  {!BUSINESS_CONFIG.payment.pagoMovil.id ? (
                    <p className="text-sm text-red-600 font-semibold">
                      ⚠️ Datos de Pago Móvil no configurados. Contacta al administrador.
                    </p>
                  ) : (
                    <div className="text-sm text-[#2A2A2A] space-y-1">
                      <p><strong>Datos para Pago Móvil:</strong></p>
                      <p>Banco: {BUSINESS_CONFIG.payment.pagoMovil.bank}</p>
                      <p>Teléfono: {BUSINESS_CONFIG.payment.pagoMovil.phone}</p>
                      <p>CI: {BUSINESS_CONFIG.payment.pagoMovil.id}</p>
                      <p className="mt-2 text-green-700 font-medium">
                        📲 Una vez confirmes el pedido, te contactaremos por WhatsApp para coordinar el pago.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'zelle' && (
                <div className="mt-4 p-4 bg-[#F5F5F5] rounded-lg">
                  <p className="text-sm text-[#2A2A2A]">
                    <strong>Datos para Zelle:</strong><br />
                    Email: {BUSINESS_CONFIG.payment.zelle.email}<br />
                    Nombre: {BUSINESS_CONFIG.payment.zelle.name}
                  </p>
                </div>
              )}

              {/* Campo de comprobante — opcional para Zelle */}
              {showComprobanteUpload && (
                <div className="mt-6">
                  <label className="block text-sm font-bold text-[#111111] mb-3 uppercase">
                    Comprobante de pago <span className="text-gray-400 font-normal normal-case">(opcional)</span>
                  </label>
                  
                  {!comprobante.url && !comprobante.isUploading && (
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="comprobante-upload"
                      />
                      <label
                        htmlFor="comprobante-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E0E0E0] rounded-lg cursor-pointer hover:border-[#E10600] hover:bg-red-50 transition-all"
                      >
                        <Upload className="w-8 h-8 text-[#E10600] mb-2" />
                        <p className="text-sm text-[#2A2A2A] font-medium">Haz clic para subir comprobante</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WebP o PDF (máx. 5MB)</p>
                      </label>
                    </div>
                  )}

                  {comprobante.isUploading && (
                    <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#E0E0E0] rounded-lg bg-gray-50">
                      <div className="animate-spin w-8 h-8 border-4 border-[#E10600] border-t-transparent rounded-full mb-2"></div>
                      <p className="text-sm text-[#2A2A2A]">Subiendo comprobante...</p>
                    </div>
                  )}

                  {comprobante.url && !comprobante.isUploading && (
                    <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {comprobante.preview ? (
                          <img 
                            src={comprobante.preview} 
                            alt="Comprobante" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="w-8 h-8 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-green-800 truncate">
                          {comprobante.file?.name || 'Comprobante subido'}
                        </p>
                        <p className="text-xs text-green-600">✅ Listo para enviar</p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={comprobante.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                          title="Ver comprobante"
                        >
                          <Eye className="w-4 h-4 text-green-700" />
                        </a>
                        <button
                          type="button"
                          onClick={removeComprobante}
                          className="p-2 bg-white rounded-lg border border-green-200 hover:bg-red-50 hover:border-red-200 transition-colors"
                          title="Eliminar comprobante"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  )}

                  {errors.comprobante && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.comprobante}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-4">
                <label htmlFor="notes" className="block text-sm font-bold text-[#111111] mb-2 uppercase">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="input resize-none"
                  placeholder="Instrucciones especiales, referencias, etc."
                />
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              <h2 className="text-lg font-bold text-[#111111] mb-6 uppercase tracking-wider">
                Resumen del pedido
              </h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 pb-4 border-b border-[#E0E0E0] last:border-0">
                    <div className="w-16 h-16 bg-[#F5F5F5] rounded-lg flex items-center justify-center flex-shrink-0 relative">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.png' }}
                        />
                      ) : (
                        <span className="text-xl">🔧</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#111111] text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-[#2A2A2A]">Cantidad: {item.quantity}</p>
                      <p className="text-[#E10600] font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pb-6 border-b border-[#E0E0E0]">
                <div className="flex justify-between text-[#2A2A2A]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#2A2A2A]">
                  <span>Envío</span>
                  <span className={deliveryCost === 0 ? 'text-green-600 font-bold' : ''}>
                    {deliveryCost === 0 ? (selectedZone ? 'GRATIS' : '—') : `$${deliveryCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-extrabold text-[#111111] pt-3 border-t border-[#E0E0E0]">
                  <span>TOTAL</span>
                  <span className="text-[#E10600]">${total.toFixed(2)}</span>
                </div>
              </div>

              {showComprobanteUpload && !comprobante.url && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    Puedes adjuntar el comprobante de Zelle para agilizar la confirmación (opcional).
                  </p>
                </div>
              )}

              {submitError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Confirmar pedido
                  </>
                )}
              </button>

              {!isFormValid && (
                <p className="text-xs text-[#2A2A2A] mt-3 text-center">
                  Completa todos los campos requeridos para continuar
                </p>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#2A2A2A]">
                <AlertCircle className="w-4 h-4" />
                <span>Pago seguro garantizado</span>
              </div>
            </div>
          </div>
        </form>
      </main>

      <div className="mt-12">
        <Footer />
      </div>
      <WhatsAppButton />
    </div>
  )
}
