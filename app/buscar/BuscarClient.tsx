'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/data'
import { Filter, Check, AlertCircle } from 'lucide-react'
import Header from '@/components/Header'
import ProductSkeleton from '@/components/ProductSkeleton'

function BuscarContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState(SAMPLE_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const brand = searchParams.get('brand') || ''
  const model = searchParams.get('model') || ''
  const year = searchParams.get('year') || ''
  const category = searchParams.get('category') || ''

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      let filtered = SAMPLE_PRODUCTS
      
      if (category) {
        filtered = filtered.filter(p => p.category === category)
      }
      
      if (selectedType) {
        filtered = filtered.filter(p => p.type === selectedType)
      }

      setProducts(filtered)
      setLoading(false)
    }, 500)
  }, [category, selectedType])

  const selectedCategory = CATEGORIES.find(c => c.id === category)
  const hasActiveFilters = category || selectedType

  return (
    <>
      {/* Search Context */}
      {(brand || category) && (
        <div className="bg-[#F5F5F5] border-b border-[#E0E0E0]">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              {brand && (
                <span className="bg-[#111111] text-white px-4 py-2 rounded-lg font-bold">
                  {brand} {model} {year}
                </span>
              )}
              {selectedCategory && (
                <span className="bg-white border border-[#E0E0E0] text-[#111111] px-4 py-2 rounded-lg font-medium">
                  {selectedCategory.emoji} {selectedCategory.name}
                </span>
              )}
              <Link 
                href="/"
                className="text-[#E10600] hover:text-[#B00500] text-sm font-medium underline"
              >
                Cambiar
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="card p-6 sticky top-4 bg-white">
              <h3 className="font-bold text-[#111111] mb-6 flex items-center gap-2 uppercase text-sm tracking-wider">
                <Filter className="w-5 h-5" />
                Filtrar por
              </h3>

              {/* Type Filter */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-[#111111] text-sm uppercase tracking-wider">Calidad</h4>
                  {selectedType && (
                    <button
                      onClick={() => setSelectedType(null)}
                      className="text-xs text-[#E10600] hover:underline font-medium"
                    >
                      Quitar filtro ✕
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {['economico', 'standard', 'premium'].map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(selectedType === type ? null : type)}
                      className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                        selectedType === type
                          ? 'border-[#111111] bg-[#F5F5F5]'
                          : 'border-[#E0E0E0] hover:border-[#2A2A2A]'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-bold text-[#111111] text-sm uppercase">
                          {type === 'economico' && '💚 Económico'}
                          {type === 'standard' && '💛 Standard'}
                          {type === 'premium' && '❤️ Premium'}
                        </div>
                        <div className="text-xs text-[#2A2A2A] mt-1">
                          {type === 'economico' && 'Garantía 3 meses'}
                          {type === 'standard' && 'Garantía 6 meses'}
                          {type === 'premium' && 'Garantía 12 meses'}
                        </div>
                      </div>
                      {selectedType === type && (
                        <Check className="w-5 h-5 text-[#111111]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-bold text-[#111111] mb-4 text-sm uppercase tracking-wider">Categoría</h4>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/buscar?category=${cat.id}`}
                      className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-colors ${
                        category === cat.id 
                          ? 'bg-[#111111] text-white' 
                          : 'hover:bg-[#F5F5F5] text-[#2A2A2A]'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span className="font-medium">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-[#111111] tracking-tight uppercase">
                {selectedCategory ? selectedCategory.name : 'Todos los repuestos'}
              </h2>
              <p className="text-[#2A2A2A] mt-2">
                {products.length} productos encontrados
                {brand && ` para ${brand} ${model}`}
                {selectedType && ` • ${selectedType === 'economico' ? 'Económico' : selectedType === 'standard' ? 'Standard' : 'Premium'}`}
              </p>
              {/* Mobile filter indicator */}
              {selectedType && (
                <button
                  onClick={() => setSelectedType(null)}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-sm font-medium rounded-full lg:hidden"
                >
                  {selectedType === 'economico' && '💚 Económico'}
                  {selectedType === 'standard' && '💛 Standard'}
                  {selectedType === 'premium' && '❤️ Premium'}
                  <span className="text-white/70">✕</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                {hasActiveFilters ? (
                  <>
                    <h3 className="text-xl font-bold text-[#111111] mb-2">
                      No encontramos repuestos con estos filtros
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      <p className="text-[#2A2A2A]">
                        Intentá con otros filtros o categorías
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {selectedType && (
                        <button
                          onClick={() => setSelectedType(null)}
                          className="btn-secondary"
                        >
                          Quitar filtro de calidad
                        </button>
                      )}
                      <Link href="/buscar" className="btn-primary inline-block">
                        Ver todos los productos
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-[#111111] mb-2">
                      No encontramos repuestos
                    </h3>
                    <p className="text-[#2A2A2A] mb-6">
                      Intentá con otra categoría o modelo de carro
                    </p>
                    <Link href="/" className="btn-primary inline-block px-8">
                      Nueva búsqueda
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                  <Link
                    key={product.id}
                    href={`/producto/${product.id}`}
                    className="card overflow-hidden hover:shadow-xl transition-all group hover:border-[#111111]"
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] bg-[#F5F5F5] flex items-center justify-center relative">
                      {product.images[0] ? (
                        <Image 
                          src={product.images[0]} 
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="text-center">
                          <span className="text-6xl">
                            {CATEGORIES.find(c => c.id === product.category)?.emoji || '🔧'}
                          </span>
                        </div>
                      )}
                      {/* Type Badge */}
                      <div className={`absolute top-3 left-3 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider ${
                        product.type === 'economico' ? 'bg-[#F5F5F5] text-[#2A2A2A] border border-[#E0E0E0]' :
                        product.type === 'standard' ? 'bg-[#111111] text-white' :
                        'bg-[#E10600] text-white'
                      }`}>
                        {product.type === 'economico' && 'Económico'}
                        {product.type === 'standard' && 'Standard'}
                        {product.type === 'premium' && 'Premium'}
                      </div>
                      {/* Low Stock Indicator */}
                      {product.stock < 5 && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
                          ¡{product.stock} disp!
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider mb-1">
                        {product.brand} • SKU: {product.sku}
                      </div>
                      <h3 className="font-bold text-[#111111] mb-3 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[#2A2A2A] mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Price */}
                      <div className="flex items-end justify-between pt-4 border-t border-[#E0E0E0]">
                        <div>
                          {product.originalPrice && (
                            <div className="text-sm text-[#2A2A2A] line-through">
                              ${product.originalPrice.toFixed(2)}
                            </div>
                          )}
                          <div className="text-2xl font-extrabold text-[#E10600]">
                            ${product.price.toFixed(2)}
                          </div>
                        </div>
                        <span className="text-sm text-[#2A2A2A] font-medium flex items-center gap-1">
                          <span className="w-2 h-2 bg-[#E10600] rounded-full"></span>
                          En stock
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default function BuscarClient() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Suspense fallback={
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="card p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </aside>
            <main className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            </main>
          </div>
        </div>
      }>
        <BuscarContent />
      </Suspense>
    </div>
  )
}
