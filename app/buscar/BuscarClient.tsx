'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/data'
import { AlertCircle, X } from 'lucide-react'
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

  return (
    <>
      {/* Header con filtros activos */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {brand && (
              <span className="bg-[#111111] text-white px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap flex-shrink-0">
                {brand} {model} {year}
              </span>
            )}
            
            {/* Filtros activos */}
            {hasActiveFilters ? (
              <>
                {selectedCategory && categoryObj && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="bg-[#E10600] text-white px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap flex-shrink-0 flex items-center gap-2 active:scale-95 transition-transform"
                  >
                    {categoryObj.emoji} {categoryObj.name} ✕
                  </button>
                )}
                {selectedType && (
                  <button
                    onClick={() => setSelectedType(null)}
                    className="bg-[#E10600] text-white px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap flex-shrink-0 flex items-center gap-2 active:scale-95 transition-transform"
                  >
                    {selectedType === 'original' && '⭐ Original ✕'}
                    {selectedType === 'generico' && '🔧 Genérico ✕'}
                  </button>
                )}
                <button
                  onClick={() => {setSelectedCategory(null); setSelectedType(null)}}
                  className="text-gray-500 hover:text-[#E10600] px-2 py-2 text-sm whitespace-nowrap flex-shrink-0"
                >
                  Limpiar todo
                </button>
              </>
            ) : (
              <span className="text-gray-400 text-sm">Toca un filtro para activarlo, toca otra vez para quitarlo</span>
            )}
            
            <Link 
              href="/"
              className="text-[#E10600] hover:text-[#B00500] text-sm font-medium underline ml-auto whitespace-nowrap flex-shrink-0"
            >
              Cambiar carro
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white p-4 sticky top-20">
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-bold text-[#111111] mb-3 text-sm uppercase">Categorías</h4>
                <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 flex-1 lg:w-full justify-center lg:justify-start ${
                        selectedCategory === cat.id
                          ? 'bg-[#111111] text-white shadow-lg'
                          : 'bg-gray-100 text-[#2A2A2A] hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter - Marca */}
              <div>
                <h4 className="font-bold text-[#111111] mb-3 text-sm uppercase">Marca</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'original', label: '⭐ Original', desc: 'Marca oficial del carro' },
                    { id: 'generico', label: '🔧 Genérico', desc: 'Marca alternativa calidad' }
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                      className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
                        selectedType === type.id
                          ? 'border-[#E10600] bg-red-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-[#111111] text-sm">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#111111]">
                {categoryObj ? categoryObj.name : 'Todos los repuestos'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {products.length} productos
                {brand && ` para ${brand} ${model}`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">
                  No encontramos repuestos
                </h3>
                <p className="text-gray-500 mb-4">
                  Probá quitando los filtros
                </p>
                <button
                  onClick={() => {setSelectedCategory(null); setSelectedType(null)}}
                  className="bg-[#111111] text-white px-6 py-3 rounded-xl font-medium"
                >
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                  <Link
                    key={product.id}
                    href={`/producto/${product.id}`}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden active:scale-95 transition-transform"
                  >
                    {/* Image */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                      {product.images[0] ? (
                        <Image 
                          src={product.images[0]} 
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-5xl">
                          {CATEGORIES.find(c => c.id === product.category)?.emoji || '🔧'}
                        </span>
                      )}
                      {/* Type Badge */}
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold ${
                        product.type === 'original' ? 'bg-[#E10600] text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {product.type === 'original' ? 'Original' : 'Genérico'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <div className="text-xs text-gray-500 mb-1">
                        {product.brand}
                      </div>
                      <h3 className="font-bold text-[#111111] text-sm line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      <div className="text-lg font-extrabold text-[#E10600]">
                        ${product.price.toFixed(2)}
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
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      }>
        <BuscarContent />
      </Suspense>
    </div>
  )
}
