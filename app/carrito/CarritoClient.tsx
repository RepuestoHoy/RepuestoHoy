'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartContext'
import { trackEvent } from '@/lib/config'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package } from 'lucide-react'

export default function CarritoClient() {
  const router = useRouter()
  const { items, updateQuantity, removeFromCart, getSubtotal } = useCart()

  const subtotal = getSubtotal()

  // Track page view
  useEffect(() => {
    trackEvent('page_view', { 
      page_title: 'Carrito',
      page_location: '/carrito'
    })
  }, [])

  const handleRemoveItem = (productId: string, productName: string) => {
    if (confirm(`¿Eliminar ${productName} del carrito?`)) {
      removeFromCart(productId)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header showBackLink />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-[#111111] mb-4">Tu carrito está vacío</h1>
          <p className="text-[#2A2A2A] mb-6">Agrega algunos productos para comenzar tu compra.</p>
          <Link href="/buscar" className="btn-primary inline-block px-8">
            Explorar productos
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
          Tu carrito
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="card p-4 flex gap-4">
                {/* Image */}
                <Link 
                  href={`/producto/${item.product.id}`}
                  className="w-24 h-24 bg-[#F5F5F5] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative"
                >
                  {item.product.images[0] ? (
                    <Image 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span className="text-3xl">🔧</span>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/producto/${item.product.id}`}>
                    <h3 className="font-bold text-[#111111] hover:text-[#E10600] transition-colors line-clamp-2">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#2A2A2A] uppercase tracking-wider mt-1">
                    {item.product.brand} • SKU: {item.product.sku}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${
                      item.product.type === 'economico' ? 'bg-green-100 text-green-700' :
                      item.product.type === 'standard' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.product.type}
                    </span>
                    {item.product.stock < 5 && (
                      <span className="text-xs text-orange-600 font-medium">
                        ¡Solo {item.product.stock} disp!
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity & Price */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                    className="text-[#2A2A2A] hover:text-[#E10600] transition-colors p-1 cursor-pointer"
                    aria-label={`Eliminar ${item.product.name}`}
                    type="button"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#E0E0E0] rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1 hover:bg-[#F5F5F5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        aria-label="Disminuir cantidad"
                        type="button"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 font-bold min-w-[2.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-3 py-1 hover:bg-[#F5F5F5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        aria-label="Aumentar cantidad"
                        type="button"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-extrabold text-[#E10600]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-xs text-[#2A2A2A]">
                      ${item.product.price.toFixed(2)} c/u
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link 
              href="/buscar" 
              className="inline-flex items-center gap-2 text-[#2A2A2A] hover:text-[#E10600] transition-colors font-medium"
            >
              <ShoppingBag className="w-5 h-5" />
              Seguir comprando
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              <h2 className="text-lg font-bold text-[#111111] mb-6 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-5 h-5" />
                Resumen
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#2A2A2A]">
                  <span>Productos ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#2A2A2A]">
                  <span>Envío</span>
                  <span className="text-sm">Se calculará en checkout</span>
                </div>
                <div className="flex justify-between text-xl font-extrabold text-[#111111] pt-3 border-t border-[#E0E0E0]">
                  <span>Subtotal</span>
                  <span className="text-[#E10600]">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  trackEvent('begin_checkout', {
                    currency: 'USD',
                    value: subtotal,
                    items: items.map(item => ({
                      item_id: item.product.id,
                      item_name: item.product.name,
                      item_brand: item.product.brand,
                      price: item.product.price,
                      quantity: item.quantity
                    }))
                  })
                  router.push('/checkout')
                }}
                className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer"
                type="button"
              >
                Proceder al pago
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-[#2A2A2A]">
                  <svg className="w-5 h-5 text-[#E10600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Pago seguro garantizado</span>
                </div>
                <div className="flex items-center gap-2 text-[#2A2A2A]">
                  <svg className="w-5 h-5 text-[#E10600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Cambios gratis si no le queda</span>
                </div>
                <div className="flex items-center gap-2 text-[#2A2A2A]">
                  <svg className="w-5 h-5 text-[#E10600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Entrega same-day en Caracas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-12">
        <Footer />
      </div>
      <WhatsAppButton />
    </div>
  )
}
