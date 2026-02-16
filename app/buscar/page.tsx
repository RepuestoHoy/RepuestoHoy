'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/data'
import { Search, Filter, Check, Car } from 'lucide-react'

export default function BuscarPage() {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header - NEGRO */}
      <header className="bg-[#111111] text-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E10600] rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">REPUESTO HOY</h1>
              </div>
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </header>

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
              <button 
                onClick={() => {}}
                className="text-[#E10600] hover:text-[#B00500] text-sm font-medium underline"
              >
                Cambiar
              </button>
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
                <h4 className="font-bold text-[#111111] mb-4 text-sm uppercase tracking-wider">Calidad</h4>
                <div className="space-y-3">
                  {['economico', 'standard', 'premium'].map(type => (
                    <label 
                      key={type}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedType === type 
                          ? 'border-[#111111] bg-[#F5F5F5]' 
                          : 'border-[#E0E0E0] hover:border-[#2A2A2A]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={selectedType === type}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="hidden"
                      />
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
                    </label>
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
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-10 h-10 border-4 border-[#E10600] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-[#2A2A2A]">Buscando repuestos...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[#111111] mb-2">
                  No encontramos repuestos
                </h3>
                <p className="text-[#2A2A2A] mb-6">
                  Intentá con otra categoría o modelo de carro
                </p>
                <Link href="/" className="btn-primary inline-block px-8">
                  Nueva búsqueda
                </Link>
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
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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
                          {/* PRECIO EN ROJO */}
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
    </div>
  )
}