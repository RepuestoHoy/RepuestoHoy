'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/data'
import { Filter, Check, AlertCircle, X } from 'lucide-react'
import Header from '@/components/Header'
import ProductSkeleton from '@/components/ProductSkeleton'

function BuscarContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState(SAMPLE_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const brand = searchParams.get('brand') || ''
  const model = searchParams.get('model') || ''
  const year = searchParams.get('year') || ''
  const urlCategory = searchParams.get('category') || ''

  // Inicializar categoría desde URL
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory)
    }
  }, [urlCategory])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      let filtered = SAMPLE_PRODUCTS
      
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category === selectedCategory)
      }
      
      if (selectedType) {
        filtered = filtered.filter(p => p.type === selectedType)
      }

      setProducts(filtered)
      setLoading(false)
    }, 300)
  }, [selectedCategory, selectedType])

  const categoryObj = CATEGORIES.find(c => c.id === selectedCategory)
  const hasActiveFilters = selectedCategory || selectedType

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setSelectedCategory(null)
    setSelectedType(null)
  }

  return (
    <>
      {/* Search Context */}
      {(brand || selectedCategory) && (
        <div className="bg-[#F5F5F5] border-b border-[#E0E0E0]">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              {brand && (
                <span className="bg-[#111111] text-white px-4 py-2 rounded-lg font-bold">
                  {brand} {model} {year}
                </span>
              )}
              {categoryObj && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="bg-white border border-[#E0E0E0] text-[#111111] px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:border-[#E10600] transition-colors"
                >
                  {categoryObj.emoji} {categoryObj.name}
                  <X className="w-3 h-3" />
                </button>
              )}
              <Link 
                href="/"
                className="text-[#E10600] hover:text-[#B00500] text-sm font-medium underline ml-auto"
              >
                Cambiar carro
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#111111] flex items-center gap-2 uppercase text-sm tracking-wider">
                  <Filter className="w-5 h-5" />
                  Filtrar por
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[#E10600] hover:underline font-medium"
                  >
                    Limpiar todo
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-[#111111] text-sm uppercase tracking-wider">Categoría</h4>
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-xs text-[#E10600] font-medium hover:underline"
                    >
                      Quitar ✕
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all text-left ${
                        selectedCategory === cat.id
                          ? 'bg-[#111111] text-white shadow-md'
                          : 'hover:bg-[#F5F5F5] text-[#2A2A2A]'
                      }`}
                    >
                      <span className="text-lg">{cat.emoji}</span>
                      <span className="font-medium flex-1">{cat.name}</span>
                      {selectedCategory === cat.id ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-[#111111] text-sm uppercase tracking-wider">Calidad</h4>
                  {selectedType && (
                    <button
                      onClick={() => setSelectedType(null)}
                      className="text-xs text-[#E10600] font-medium hover:underline"
                    >
                      Quitar ✕
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {[
                    { id: 'economico', label: '💚 Económico', desc: 'Garantía 3 meses' },
                    { id: 'standard', label: '💛 Standard', desc: 'Garantía 6 meses' },
                    { id: 'premium', label: '❤️ Premium', desc: 'Garantía 12 meses' }
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedType === type.id
                          ? 'border-[#E10600] bg-red-50 shadow-md'
                          : 'border-[#E0E0E0] hover:border-[#2A2A2A]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#111111] text-sm">{type.label}</div>
                          <div className="text-xs text-[#2A2A2A] mt-1">{type.desc}</div>
                        </div>
                        {selectedType === type.id ? (
                          <X className="w-5 h-5 text-[#E10600]" />
                        ) : (
                          <span className="w-5 h-5 rounded-full border-2 border-gray-300"></span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            {/* Barra de filtros activos - MUY VISIBLE EN MÓVIL */}
            {hasActiveFilters && (
              <div className="mb-6 p-4 bg-[#F5F5F5] rounded-xl border border-[#E0E0E0]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-[#111111]">Filtros activos:</span>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-[#E10600] font-medium hover:underline"
                  >
                    Limpiar todo ✕
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory && categoryObj && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-sm font-medium rounded-full active:scale-95 transition-transform"
                    >
                      {categoryObj.emoji} {categoryObj.name}
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {selectedType && (
                    <button
                      onClick={() => setSelectedType(null)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#E10600] text-white text-sm font-medium rounded-full active:scale-95 transition-transform"
                    >
                      {selectedType === 'economico' && '💚 Económico'}
                      {selectedType === 'standard' && '💛 Standard'}
                      {selectedType === 'premium' && '❤️ Premium'}
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#111111] tracking-tight uppercase">
                {categoryObj ? categoryObj.name : 'Todos los repuestos'}
              </h2>
              <p className="text-[#2A2A2A] mt-2">
                {products.length} productos encontrados
                {brand && ` para ${brand} ${model}`}
              </p>
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
                    <p className="text-[#2A2A2A] mb-6">
                      Probá quitando algunos filtros
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="btn-primary inline-block px-8"
                    >
                      Ver todos los productos
                    </button>
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
                      <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        product.type === 'economico' ? 'bg-green-100 text-green-700 border border-green-200' :
                        product.type === 'standard' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                        'bg-[#E10600] text-white'
                      }`}>
                        {product.type === 'economico' && 'Económico'}
                        {product.type === 'standard' && 'Standard'}
                        {product.type === 'premium' && 'Premium'}
                      </div>
                      {/* Low Stock Indicator */}
                      {product.stock < 5 && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                          ¡{product.stock} disp!
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1">
                        {product.brand} • SKU: {product.sku}
                      </div>
                      <h3 className="font-bold text-[#111111] mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Price */}
                      <div className="flex items-end justify-between pt-4 border-t border-[#E0E0E0]">
                        <div>
                          {product.originalPrice && (
                            <div className="text-sm text-[#6B7280] line-through">
                              ${product.originalPrice.toFixed(2)}
                            </div>
                          )}
                          <div className="text-2xl font-extrabold text-[#E10600]">
                            ${product.price.toFixed(2)}
                          </div>
                        </div>
                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
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
