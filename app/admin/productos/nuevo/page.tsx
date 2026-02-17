'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/data'
import { categoryIcons } from '@/components/CategoryIcons'
import { Upload, Plus, Check, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NuevoProductoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    category_id: '',
    brand: '',
    type: 'generico',
    cost_price: '',
    sale_price: '',
    stock: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const { error } = await supabase.from('products').insert([{
        sku: formData.sku,
        name: formData.name,
        description: formData.description,
        category_id: formData.category_id || null,
        brand: formData.brand,
        type: formData.type,
        cost_price: parseFloat(formData.cost_price),
        sale_price: parseFloat(formData.sale_price),
        stock: parseInt(formData.stock),
        is_available: true,
        images: [],
        features: {}
      }])
      
      if (error) throw error
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/productos')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Error al guardar el producto')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#111111] text-white py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
              Volver a la tienda
            </Link>
          </div>
          <h1 className="font-bold">Panel de Administración</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#E10600] rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#111111]">Agregar Nuevo Producto</h2>
              <p className="text-gray-500">Completa los datos del repuesto</p>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
              <Check className="w-5 h-5" />
              <div>
                <p className="font-semibold">¡Producto guardado!</p>
                <p className="text-sm">Redirigiendo...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SKU y Nombre */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#111111] mb-2">
                  SKU (Código único) *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  placeholder="Ej: FIL-TOY-001"
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ejemplo: FIL-Toyota-Corolla-001
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111111] mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Filtro de Aceite Toyota Corolla"
                  className="input"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe el producto: qué incluye, duración, compatibilidad..."
                className="input"
              />
            </div>

            {/* Categoría y Marca */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#111111] mb-2">
                  Categoría *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="select"
                >
                  <option value="">Selecciona categoría</option>
                  {CATEGORIES.map(cat => {
                    const IconComponent = categoryIcons[cat.icon]
                    return (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111111] mb-2">
                  Marca del Producto *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  placeholder="Ej: FRAM, Toyota, Genérico"
                  className="input"
                />
              </div>
            </div>

            {/* Tipo de marca */}
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-3">
                Marca del Producto *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'original', label: '⭐ Original', desc: 'Marca oficial del vehículo' },
                  { id: 'generico', label: '🔧 Genérico', desc: 'Marca alternativa' }
                ].map(tipo => (
                  <label
                    key={tipo.id}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center ${
                      formData.type === tipo.id
                        ? 'border-[#E10600] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={tipo.id}
                      checked={formData.type === tipo.id}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="font-bold text-[#111111]">{tipo.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{tipo.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Precios y Stock */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#111111] mb-2">
                  Precio Costo (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="cost_price"
                    value={formData.cost_price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="12.50"
                    className="input pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Lo que pagas tú</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111111] mb-2">
                  Precio Venta (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="sale_price"
                    value={formData.sale_price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="18.50"
                    className="input pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Lo que cobras</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111111] mb-2">
                  Stock (Unidades) *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="15"
                  className="input"
                />
              </div>
            </div>

            {/* Margen calculado */}
            {formData.cost_price && formData.sale_price && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Margen de ganancia:</span>
                  <span className="text-lg font-bold text-green-700">
                    ${(parseFloat(formData.sale_price) - parseFloat(formData.cost_price)).toFixed(2)} 
                    ({((parseFloat(formData.sale_price) - parseFloat(formData.cost_price)) / parseFloat(formData.cost_price) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            )}

            {/* Fotos (placeholder) */}
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">
                Fotos del Producto
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#E10600] transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Click para subir fotos</p>
                <p className="text-xs text-gray-500 mt-1">JPG o PNG, máximo 2MB por foto</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Por ahora sube fotos directamente en Supabase Storage. 
                <a href="https://supabase.com/dashboard/project/knxhboghyxwfsqptghxq/storage" target="_blank" className="text-[#E10600] underline">Abrir Storage</a>
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Guardar Producto
                  </>
                )}
              </button>
              
              <Link
                href="/admin/productos"
                className="btn-secondary flex items-center justify-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">💡 Tips para agregar productos</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• El SKU debe ser único (no repetirse con otros productos)</li>
            <li>• En la descripción incluye: duración y compatibilidad exacta</li>
            <li>• Precio venta siempre mayor que precio costo</li>
            <li>• Actualiza el stock cuando vendas para no vender productos agotados</li>
            <li>• Las fotos aumentan las ventas significativamente</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
