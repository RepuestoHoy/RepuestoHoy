'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { BUSINESS_CONFIG, trackEvent } from '@/lib/config'
import { Check, Package, Truck, Clock, Phone, ShoppingBag, AlertTriangle, RefreshCw } from 'lucide-react'

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: Array<{
    product: {
      id: string
      name: string
      price: number
      images: string[]
    }
    quantity: number
  }>
  subtotal: number
  deliveryCost: number
  total: number
  deliveryZone: string
  address: string
  paymentMethod: string
  notes?: string
  createdAt: string
}

const PAYMENT_METHOD_TEXT: Record<string, string> = {
  pago_movil: 'Pago Móvil',
  zelle: 'Zelle',
  efectivo: 'Efectivo al recibir'
}

export default function GraciasClient() {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    try {
      const storedOrder = localStorage.getItem('repuestohoy-last-order')
      if (storedOrder) {
        const parsed = JSON.parse(storedOrder)
        setOrder(parsed)
        // Track purchase completion
        trackEvent('purchase_complete', {
          transaction_id: parsed.id,
          value: parsed.total,
          currency: 'USD'
        })
      } else {
        setError('No se encontró información del pedido')
      }
    } catch (err) {
      console.error('Error loading order:', err)
      setError('Error al cargar la información del pedido')
    }
  }, [])

  // Countdown for redirect
  useEffect(() => {
    if (error && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (error && countdown === 0) {
      router.push('/')
    }
  }, [error, countdown, router])

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-[#111111] mb-4">No se encontró el pedido</h1>
          <div className="flex items-center justify-center gap-2 text-orange-600 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <p>{error}</p>
          </div>
          <p className="text-[#2A2A2A] mb-6">
            Esto puede pasar si:
          </p>
          <ul className="text-left max-w-md mx-auto text-[#2A2A2A] space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-[#E10600]">•</span>
              Recargaste la página después de completar el pedido
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E10600]">•</span>
              Tu navegador borró los datos de sesión
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#E10600]">•</span>
              Accediste directamente a esta página sin hacer un pedido
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Volver a la tienda
            </Link>
            <Link href="/buscar" className="btn-secondary inline-flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Hacer nuevo pedido
            </Link>
          </div>
          <p className="text-sm text-[#2A2A2A] mt-6">
            Redirigiendo en {countdown} segundos...
          </p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[#E10600] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#2A2A2A]">Cargando información del pedido...</p>
        </div>
        <Footer />
      </div>
    )
  }

  const getPaymentMethodText = (method: string): string => {
    return PAYMENT_METHOD_TEXT[method] || 'Otro método'
  }

  const whatsappMessage = encodeURIComponent(
    `Hola! Acabo de hacer un pedido en repuestohoy.com con número ${order.id}`
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#111111] mb-3 uppercase tracking-tight">
            ¡Pedido confirmado!
          </h1>
          <p className="text-[#2A2A2A] text-lg">
            Gracias por tu compra, <strong>{order.customerName}</strong>
          </p>
        </div>

        {/* Email Warning */}
        {order.customerEmail && (
          <div className="card p-4 mb-6 bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-amber-800 mb-1">
                  📧 Revisa tu correo electrónico
                </p>
                <p className="text-sm text-amber-700">
                  Te enviamos un email de confirmación a <strong>{order.customerEmail}</strong>
                </p>
                <p className="text-sm text-amber-700 mt-2">
                  <span className="font-semibold">Importante:</span> Si no lo ves en tu bandeja de entrada, 
                  revisa la carpeta de <strong>Spam</strong> o <strong>Promociones</strong>. 
                  A veces los emails llegan allí.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Number */}
        <div className="card p-6 mb-6 bg-[#F5F5F5] border-[#111111]">
          <div className="text-center">
            <p className="text-sm text-[#2A2A2A] uppercase tracking-wider mb-1">Número de orden</p>
            <p className="text-3xl font-extrabold text-[#111111] tracking-widest">{order.id}</p>
            <p className="text-xs text-[#2A2A2A] mt-2">
              Guarda este número para cualquier consulta
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-[#111111] rounded-lg flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-bold text-[#111111] uppercase">Te contactaremos</p>
            <p className="text-xs text-[#2A2A2A]">En minutos</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-[#111111] rounded-lg flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-bold text-[#111111] uppercase">Preparamos</p>
            <p className="text-xs text-[#2A2A2A]">Tu pedido</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-[#E10600] rounded-lg flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-bold text-[#111111] uppercase">Entrega</p>
            <p className="text-xs text-[#2A2A2A]">{order.deliveryZone}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-bold text-[#111111] mb-4 uppercase tracking-wider">
            Resumen del pedido
          </h2>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item, idx) => (
              <div key={`${item.product.id}-${idx}`} className="flex gap-4">
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-lg flex items-center justify-center flex-shrink-0 relative">
                  {item.product.images[0] ? (
                    <Image 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-2xl">🔧</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#111111] text-sm">{item.product.name}</p>
                  <p className="text-xs text-[#2A2A2A]">Cantidad: {item.quantity}</p>
                  <p className="text-[#E10600] font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Info */}
          <div className="bg-[#F5F5F5] rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3 mb-3">
              <Truck className="w-5 h-5 text-[#E10600] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#111111] text-sm">Dirección de entrega</p>
                <p className="text-sm text-[#2A2A2A]">{order.address}</p>
                <p className="text-sm text-[#2A2A2A]">{order.deliveryZone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#E10600] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#111111] text-sm">Método de pago</p>
                <p className="text-sm text-[#2A2A2A]">{getPaymentMethodText(order.paymentMethod)}</p>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-4 border-t border-[#E0E0E0]">
            <div className="flex justify-between text-[#2A2A2A]">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#2A2A2A]">
              <span>Envío</span>
              <span className={order.deliveryCost === 0 ? 'text-green-600 font-bold' : ''}>
                {order.deliveryCost === 0 ? 'GRATIS' : `$${order.deliveryCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-xl font-extrabold text-[#111111] pt-2 border-t border-[#E0E0E0]">
              <span>TOTAL</span>
              <span className="text-[#E10600]">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Support */}
        <div className="card p-6 mb-6 bg-[#25D366]/10 border-[#25D366]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#111111]">¿Tienes dudas?</p>
              <p className="text-sm text-[#2A2A2A]">Escríbenos por WhatsApp con tu número de orden</p>
            </div>
            <a
              href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#25D366] text-white font-bold rounded-lg text-sm hover:bg-[#128C7E] transition-colors"
            >
              Escribir
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 btn-primary text-center flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Volver a la tienda
          </Link>
          <Link
            href="/buscar"
            className="flex-1 btn-secondary text-center"
          >
            Seguir comprando
          </Link>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
