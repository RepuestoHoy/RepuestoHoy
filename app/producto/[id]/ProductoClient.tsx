'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/data'
import { BUSINESS_CONFIG, trackEvent } from '@/lib/config'
import { useCart } from '@/components/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import RecentlyViewed from '@/components/RecentlyViewed'
import { Check, ShoppingCart, Shield, Truck, RotateCcw, AlertTriangle } from 'lucide-react'

interface ProductoClientProps {
  productId: string
}

export default function ProductoClient({ productId }: ProductoClientProps) {
  const router = useRouter()
  const { addToCart, addToRecentlyViewed } = useCart()
  
  const product = SAMPLE_PRODUCTS.find(p => p.id === productId)
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})

  // Track recently viewed
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product)
      // Track page view
      trackEvent('page_view', { 
        page_title: product.name,
        page_location: `/producto/${product.id}`
      })
    }
  }, [product, addToRecentlyViewed])

  // Find related products (same category, different id)
  const relatedProducts = SAMPLE_PRODUCTS.filter(
    p => p.category === product?.category && p.id !== productId
  ).slice(0, 3)

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header showBackLink backLinkText="← Volver" backLinkHref="/buscar" />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-[#111111] mb-4">Producto no encontrado</h1>
          <p className="text-[#2A2A2A] mb-6">El producto que buscas no existe o fue removido.</p>
          <Link href="/buscar" className="btn-primary inline-block px-8">
            Ver todos los productos
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const category = CATEGORIES.find(c => c.id === product.category)
  const images = product.images.length > 0 ? product.images : []
  const isLowStock = product.stock < 5

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAddedToCart(true)
    // Track add to cart
    trackEvent('add_to_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand,
        item_category: category?.name,
        price: product.price,
        quantity: quantity
      }]
    })
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    trackEvent('add_to_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand,
        item_category: category?.name,
        price: product.price,
        quantity: quantity
      }]
    })
    router.push('/checkout')
  }

  const handleImageError = (idx: number) => {
    setImageError(prev => ({ ...prev, [idx]: true }))
  }

  return (
    <div className="min-h-screen bg-white">
      <Header showBackLink backLinkText="← Volver" backLinkHref="/buscar" />

      {/* Breadcrumb */}
      <div className="bg-[#F5F5F5] border-b border-[#E0E0E0]">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[#2A2A2A]">
            <Link href="/" className="hover:text-[#E10600]">Inicio</Link>
            <span>/</span>
            <Link href="/buscar" className="hover:text-[#E10600]">Repuestos</Link>
            <span>/</span>
            <Link href={`/buscar?category=${product.category}`} className="hover:text-[#E10600]">
              {category?.name}
            </Link>
            <span>/</span>
            <span className="text-[#111111] font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-[#F5F5F5] rounded-lg flex items-center justify-center relative overflow-hidden">
              {images[selectedImage] && !imageError[selectedImage] ? (
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(selectedImage)}
                  priority
                />
              ) : (
                <div className="text-center">
                  <span className="text-8xl">{category?.emoji || '🔧'}</span>
                </div>
              )}
              {/* Type Badge */}
              <div className={`absolute top-4 left-4 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider ${
                product.type === 'original' ? 'bg-[#E10600] text-white' :
                'bg-gray-200 text-gray-700'
              }`}>
                {product.type === 'original' ? '⭐ Original' : '🔧 Genérico'}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer relative ${
                      selectedImage === idx ? 'border-[#111111]' : 'border-[#E0E0E0]'
                    }`}
                    type="button"
                    aria-label={`Ver imagen ${idx + 1}`}
                  >
                    {!imageError[idx] ? (
                      <Image 
                        src={img} 
                        alt={`${product.name} ${idx + 1}`} 
                        fill
                        className="object-cover"
                        onError={() => handleImageError(idx)}
                      />
                    ) : (
                      <span className="text-2xl flex items-center justify-center h-full">{category?.emoji || '🔧'}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="text-sm font-bold text-[#2A2A2A] uppercase tracking-wider mb-2">
                {product.brand} • SKU: {product.sku}
              </div>
              <h1 className="text-3xl font-extrabold text-[#111111] mb-4">
                {product.name}
              </h1>
              <p className="text-[#2A2A2A] text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="bg-[#F5F5F5] rounded-xl p-6">
              <div className="flex items-baseline gap-3 mb-2">
                {product.originalPrice && (
                  <span className="text-xl text-[#2A2A2A] line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-4xl font-extrabold text-[#E10600]">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {isLowStock ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-600 font-medium">
                      ¡Solo quedan {product.stock} unidades!
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-[#E10600] rounded-full"></span>
                    <span className="text-[#2A2A2A]">En stock ({product.stock} disponibles)</span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-bold text-[#111111] uppercase tracking-wider text-sm">Cantidad</label>
                <div className="flex items-center border-2 border-[#E0E0E0] rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-4 py-2 hover:bg-[#F5F5F5] font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    type="button"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="px-4 py-2 hover:bg-[#F5F5F5] font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-lg font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  addedToCart 
                    ? 'bg-green-600 text-white' 
                    : 'bg-[#111111] text-white hover:bg-[#2A2A2A]'
                }`}
                type="button"
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    ¡Agregado al carrito!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Agregar al carrito
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-[#E10600] text-white font-bold uppercase tracking-wide rounded-lg hover:bg-[#B00500] transition-all cursor-pointer"
                type="button"
              >
                Comprar ahora
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E0E0E0]">
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-[#E10600]" />
                <p className="text-xs font-medium text-[#2A2A2A]">Calidad asegurada</p>
              </div>
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-[#E10600]" />
                <p className="text-xs font-medium text-[#2A2A2A]">Entrega hoy</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-[#E10600]" />
                <p className="text-xs font-medium text-[#2A2A2A]">Cambio gratis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compatibility & Specs */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-[#E0E0E0]">
          {/* Compatibility */}
          <div>
            <h2 className="text-xl font-bold text-[#111111] mb-6 uppercase tracking-tight">
              Compatibilidad
            </h2>
            <div className="space-y-4">
              {product.compatible.map((compat, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#F5F5F5] p-4 rounded-lg">
                  <div className="w-10 h-10 bg-[#111111] rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">🚗</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#111111]">{compat.brand} {compat.model}</p>
                    <p className="text-sm text-[#2A2A2A]">Años: {compat.years}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-xl font-bold text-[#111111] mb-6 uppercase tracking-tight">
              Características
            </h2>
            <ul className="space-y-3">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E10600] flex-shrink-0 mt-0.5" />
                  <span className="text-[#2A2A2A]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-12 border-t border-[#E0E0E0]">
            <h2 className="text-xl font-bold text-[#111111] mb-6 uppercase tracking-tight">
              Productos relacionados
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(relatedProduct => (
                <Link
                  key={relatedProduct.id}
                  href={`/producto/${relatedProduct.id}`}
                  className="card overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="aspect-[4/3] bg-[#F5F5F5] flex items-center justify-center relative">
                    {relatedProduct.images[0] ? (
                      <Image 
                        src={relatedProduct.images[0]} 
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-4xl">{category?.emoji || '🔧'}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-xs font-bold text-[#2A2A2A] uppercase">{relatedProduct.brand}</div>
                    <h3 className="font-bold text-[#111111] text-sm mt-1 line-clamp-2">{relatedProduct.name}</h3>
                    <div className="text-lg font-extrabold text-[#E10600] mt-2">
                      ${relatedProduct.price.toFixed(2)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        <RecentlyViewed />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
