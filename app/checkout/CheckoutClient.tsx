'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { DELIVERY_ZONES } from '@/lib/data'
import { BUSINESS_CONFIG, validatePhone, validateEmail, trackEvent } from '@/lib/config'
import { useCart } from '@/components/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Check, AlertCircle } from 'lucide-react'

const PAYMENT_METHODS = [
  { id: 'pago_movil', name: 'Pago Móvil', description: 'Transferencia inmediata', icon: '📱' },
  { id: 'zelle', name: 'Zelle', description: 'Pago desde USA', icon: '🇺🇸' },
  { id: 'efectivo', name: 'Efectivo', description: 'Al recibir el pedido', icon: '💵' },
]

export default function CheckoutClient() {
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCart()
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedZone, setSelectedZone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const deliveryZone = DELIVERY_ZONES.find(z => z.id === selectedZone)
  const deliveryCost = deliveryZone?.cost || 0
  const subtotal = getSubtotal()
  const total = subtotal + deliveryCost

  // Track page view
  useEffect(() => {
    trackEvent('page_view', { 
      page_title: 'Checkout',
      page_location: '/checkout'
    })
  }, [])

  // Validación en tiempo real
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'phone':
        return validatePhone(value) ? '' : 'Formato: 0412-1234567'
      case 'email':
        return validateEmail(value) ? '' : 'Email inválido'
      default:
        return ''
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Validar en tiempo real
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() &&
      formData.phone.trim() &&
      validatePhone(formData.phone) &&
      validateEmail(formData.email) &&
      formData.address.trim() &&
      selectedZone &&
      paymentMethod
    )
  }, [formData, selectedZone, paymentMethod])

  const generateOrderNumber = () => {
    // Usar timestamp + random para evitar duplicados
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `RH-${timestamp}-${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid) {
      return
    }

    setIsSubmitting(true)
    
    const orderNum = generateOrderNumber()
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const order = {
      id: orderNum,
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email || undefined,
      items: items,
      subtotal: subtotal,
      deliveryCost: deliveryCost,
      total: total,
      deliveryZone: deliveryZone?.name || '',
      address: formData.address,
      paymentMethod: paymentMethod,
      notes: formData.notes,
      createdAt: new Date().toISOString()
    }
    
    // Guardar en localStorage con try/catch
    try {
      localStorage.setItem('repuestohoy-last-order', JSON.stringify(order))
    } catch (error) {
      console.error('Error saving order:', error)
      alert('Error al guardar el pedido. Intenta de nuevo.')
      setIsSubmitting(false)
      return
    }
    
    // Track purchase
    trackEvent('purchase', {
      transaction_id: orderNum,
      value: total,
      currency: 'USD',
      shipping: deliveryCost,
      items: items.map(item => ({
        item_id: item.product.id,
        item_name: item.product.name,
        item_brand: item.product.brand,
        price: item.product.price,
        quantity: item.quantity
      }))
    })
    
    clearCart()
    router.push('/gracias')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header showBackLink />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-[#111111] mb-4">Tu carrito está vacío</h1>
          <p className="text-[#2A2A2A] mb-6">Agrega algunos productos para continuar con tu compra.</p>
          <Link href="/buscar" className="btn-primary inline-block px-8">
            Ver productos
          </Link>
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

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Info */}
            <section className="card p-6">
              <h2 className="text-lg font-bold text-[#111111] mb-6 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-8 bg-[#111111] text-white rounded-full flex items-center justify-center text-sm">1</span>
                Tus datos
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#111111] mb-2 uppercase">
                    Nombre completo *
                  </label>
                  <input
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
                  <label className="block text-sm font-bold text-[#111111] mb-2 uppercase">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    pattern="0(412|414|416|424|426)-\d{7}"
                    className={`input ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="Ej: 0412-1234567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111111] mb-2 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Ej: juan@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
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
                  <label className="block text-sm font-bold text-[#111111] mb-2 uppercase">
                    Dirección de entrega *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="input resize-none"
                    placeholder="Ej: Av. Principal de Las Mercedes, Edificio X, Piso 3, Apartamento 301"
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
                        <div className="text-right">
                          <div className="font-bold text-[#E10600]">
                            {zone.cost === 0 ? 'GRATIS' : `$${zone.cost.toFixed(2)}`}
                          </div>
                        </div>
                        {selectedZone === zone.id && (
                          <Check className="w-5 h-5 text-[#111111]" />
                        )}
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
                  <p className="text-sm text-[#2A2A2A]">
                    <strong>Datos para Pago Móvil:</strong><br />
                    Banco: {BUSINESS_CONFIG.payment.pagoMovil.bank}<br />
                    Teléfono: {BUSINESS_CONFIG.payment.pagoMovil.phone}<br />
                    CI: {BUSINESS_CONFIG.payment.pagoMovil.id}
                  </p>
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

              <div className="mt-4">
                <label className="block text-sm font-bold text-[#111111] mb-2 uppercase">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="input resize-none"
                  placeholder="Instrucciones especiales de entrega, referencias, etc."
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

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 pb-4 border-b border-[#E0E0E0] last:border-0">
                    <div className="w-16 h-16 bg-[#F5F5F5] rounded-lg flex items-center justify-center flex-shrink-0 relative">
                      {item.product.images[0] ? (
                        <Image 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
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

              {/* Totals */}
              <div className="space-y-3 pb-6 border-b border-[#E0E0E0]">
                <div className="flex justify-between text-[#2A2A2A]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#2A2A2A]">
                  <span>Envío</span>
                  <span className={deliveryCost === 0 ? 'text-green-600 font-bold' : ''}>
                    {deliveryCost === 0 ? 'GRATIS' : `$${deliveryCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-extrabold text-[#111111] pt-3 border-t border-[#E0E0E0]">
                  <span>TOTAL</span>
                  <span className="text-[#E10600]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
