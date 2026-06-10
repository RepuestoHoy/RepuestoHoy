'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { SAMPLE_PRODUCTS, CATEGORIES, searchByProblem } from '@/lib/data'
import { categoryIcons } from '@/components/CategoryIcons'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, X, Plus, Check, Search, Lightbulb } from 'lucide-react'
import Header from '@/components/Header'
import ProductSkeleton from '@/components/ProductSkeleton'
import { useCart } from '@/components/CartContext'

function BuscarContent() {
  const searchParams = useSearchParams()
  const { addToCart, showToast } = useCart()
  const [products, setProducts] = useState(SAMPLE_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance')
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null)
  const [problemSearch, setProblemSearch] = useState('')
  const [problemSuggestion, setProblemSuggestion] = useState<ReturnType<typeof searchByProblem>>(null)
  const [dbCats, setDbCats] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('categories')
      .select('slug, name, emoji, description, image_url, sort_order')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setDbCats(data)
      })
  }, [])

  // Lista de categorías: Supabase si cargó (editable desde el panel); si no, la del código
  const categoriasLista = dbCats.length > 0
    ? dbCats.map((c: any) => ({
        id: c.slug,
        name: c.name,
        emoji: c.emoji || null,
        image: c.image_url || null,
      }))
    : CATEGORIES.map(c => ({ id: c.id, name: c.name, emoji: null, image: null }))

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

      // Sort products
      if (sortOrder === 'price-asc') {
        filtered = [...filtered].sort((a, b) => a.price - b.price)
      } else if (sortOrder === 'price-desc') {
        filtered = [...filtered].sort((a, b) => b.price - a.price)
      }

      setProducts(filtered)
      setLoading(false)
    }, 300)
  }, [selectedCategory, selectedType, sortOrder])

  const categoryObj = CATEGORIES.find(c => c.id === selectedCategory)
  const hasActiveFilters = selectedCategory || selectedType

  const handleQuickAdd = (e: React.MouseEvent, product: typeof SAMPLE_PRODUCTS[0]) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock < 1) {
      showToast('Producto agotado', 'error')
      return
    }
    addToCart(product, 1)
    setQuickAddedId(product.id)
    setTimeout(() => setQuickAddedId(null), 1500)
  }

  const handleProblemSearch = (value: string) => {
    setProblemSearch(value)
    const suggestion = searchByProblem(value)
    setProblemSuggestion(suggestion)
  }

  const applyProblemSuggestion = () => {
    if (problemSuggestion && problemSuggestion.suggestedCategories.length > 0) {
      setSelectedCategory(problemSuggestion.suggestedCategories[0])
      setProblemSearch('')
      setProblemSuggestion(null)
    }
  }

  return (
    <>
      {/* Header con filtros activos */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Búsqueda inteligente por problema */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={problemSearch}
                onChange={(e) => handleProblemSearch(e.target.value)}
                placeholder="¿Qué le pasa a tu carro? (ej: ruido al frenar, no prende...)"
                className="w-full px-4 py-3 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-[#111111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6A00] focus:border-transparent"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
            {/* Sugerencia inteligente */}
            {problemSuggestion && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800 font-medium">{problemSuggestion.suggestion}</p>
                  <button
                    onClick={applyProblemSuggestion}
                    className="mt-2 text-sm text-[#FF6A00] font-semibold hover:underline"
                  >
                    Ver repuestos recomendados →
                  </button>
                </div>
                <button
                  onClick={() => {setProblemSearch(''); setProblemSuggestion(null)}}
                  className="text-amber-400 hover:text-amber-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

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
                    className="bg-[#FF6A00] text-white px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap flex-shrink-0 flex items-center gap-2 active:scale-95 transition-transform"
                  >
                    {(() => {
              const IconComponent = categoryIcons[categoryObj?.icon || 'filtros']
              return IconComponent ? <IconComponent className="w-4 h-4" /> : null
            })()} {categoryObj.name} ✕
                  </button>
                )}
                {selectedType && (
                  <button
                    onClick={() => setSelectedType(null)}
                    className="bg-[#FF6A00] text-white px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap flex-shrink-0 flex items-center gap-2 active:scale-95 transition-transform"
                  >
                    {selectedType === 'original' && '⭐ Original ✕'}
                    {selectedType === 'generico' && '🔧 Genérico ✕'}
                  </button>
                )}
                <button
                  onClick={() => {setSelectedCategory(null); setSelectedType(null)}}
                  className="text-gray-500 hover:text-[#FF6A00] px-2 py-2 text-sm whitespace-nowrap flex-shrink-0"
                >
                  Limpiar todo
                </button>
              </>
            ) : (
              <span className="text-gray-400 text-sm">Toca un filtro para activarlo, toca otra vez para quitarlo</span>
            )}
            
            <Link 
              href="/"
              className="text-[#FF6A00] hover:text-[#E55A00] text-sm font-medium underline ml-auto whitespace-nowrap flex-shrink-0"
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
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  {categoriasLista.map(cat => {
                    const imageUrl = cat.image
                    const isActive = selectedCategory === cat.id
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                        className={`rounded-xl overflow-hidden border-2 transition-all text-left ${
                          isActive ? 'border-[#FF6A00] shadow-lg' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                          {imageUrl ? (
                            <img src={imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-4xl">{cat.emoji || '🔧'}</span>
                          )}
                        </div>
                        <div className={`px-3 py-2 ${isActive ? 'bg-[#FF6A00] text-white' : 'bg-white text-[#111111]'}`}>
                          <span className="font-semibold text-sm">{cat.name}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Type Filter - Marca */}
              <div>
                <h4 className="font-bold text-[#111111] mb-3 text-sm uppercase">Marca</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'original', label: '⭐ Original', desc: 'Marca oficial del carro' },
                    { id: 'generico', label: '🔧 Genérico', desc: 'Marca alternativa' }
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                      className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
                        selectedType === type.id
                          ? 'border-[#FF6A00] bg-orange-50 shadow-lg'
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
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#111111]">
                  {categoryObj ? categoryObj.name : 'Todos los repuestos'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {products.length} productos
                  {brand && ` para ${brand} ${model}`}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">Ordenar:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A00] focus:border-transparent cursor-pointer"
                >
                  <option value="relevance">Relevancia</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                </select>
              </div>
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
                {products.map(product => {
                  const isLowStock = product.stock < 5 && product.stock > 0
                  const isOutOfStock = product.stock === 0
                  const isQuickAdded = quickAddedId === product.id

                  return (
                    <Link
                      key={product.id}
                      href={`/producto/${product.id}`}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden active:scale-95 transition-transform group relative"
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
                            {(() => {
                              const category = CATEGORIES.find(c => c.id === product.category)
                              const IconComponent = category ? categoryIcons[category.icon] : null
                              return IconComponent ? <IconComponent className="w-12 h-12 text-gray-400" /> : '🔧'
                            })()}
                          </span>
                        )}

                        {/* Type Badge */}
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold ${
                          product.type === 'original' ? 'bg-[#FF6A00] text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {product.type === 'original' ? 'Original' : 'Genérico'}
                        </div>

                        {/* Low Stock Badge */}
                        {isLowStock && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                            Solo {product.stock}
                          </div>
                        )}

                        {/* Out of Stock Badge */}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-bold">
                              Agotado
                            </span>
                          </div>
                        )}

                        {/* Quick Add Button */}
                        {!isOutOfStock && (
                          <button
                            onClick={(e) => handleQuickAdd(e, product)}
                            className={`absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110 active:scale-95 ${
                              isQuickAdded
                                ? 'bg-green-500 text-white'
                                : 'bg-[#FF6A00] text-white hover:bg-[#E55A00]'
                            }`}
                            aria-label={isQuickAdded ? 'Agregado' : 'Agregar al carrito'}
                          >
                            {isQuickAdded ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <Plus className="w-5 h-5" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        <div className="text-xs text-gray-500 mb-1">
                          {product.brand}
                        </div>
                        <h3 className="font-bold text-[#111111] text-sm line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                        <div className="text-lg font-extrabold text-[#FF6A00]">
                          {product.price > 0 ? `$${product.price.toFixed(2)}` : 'Consultar precio'}
                        </div>
                      </div>
                    </Link>
                  )
                })}
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
