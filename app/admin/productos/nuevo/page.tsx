'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/data'
import { categoryIcons } from '@/components/CategoryIcons'
import { Upload, Plus, Check, AlertCircle, ArrowLeft, X, ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function NuevoProductoPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setUploadingImage(true)
    setError('')

    for (const file of Array.from(files)) {
      if (file.size > 3 * 1024 * 1024) {
        setError(`${file.name} es muy grande. Máximo 3MB.`)
        continue
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError(`${file.name}: Solo se permiten JPG, PNG o WebP.`)
        continue
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`

      const { data, error: uploadError } = await supabase.storage
        .from('productos')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) {
        setError(`Error subiendo ${file.name}: ${uploadError.message}`)
      } else {
        const { data: urlData } = supabase.storage.from('productos').getPublicUrl(fileName)
        setUploadedImages(prev => [...prev, urlData.publicUrl])
      }
    }
    setUploadingImage(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

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
        images: uploadedImages,
        features: {}
      }])

      if (error) throw error

      setSuccess(true)
      setTimeout(() => router.push('/admin/dashboard'), 2000)
    } catch (err: any) {
      setError(err.message || 'Error al guardar el producto')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const margin = formData.cost_price && formData.sale_price
    ? parseFloat(formData.sale_price) - parseFloat(formData.cost_price)
    : null
  const marginPct = margin && parseFloat(formData.cost_price) > 0
    ? (margin / parseFloat(formData.cost_price) * 100).toFixed(0)
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#111111] text-white py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Volver al dashboard
          </Link>
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
              <div><p className="font-semibold">¡Producto guardado!</p><p className="text-sm">Redirigiendo...</p></div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div><p className="font-semibold">Error</p><p className="text-sm">{error}</p></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SKU y Nombre */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#111111] mb-2">SKU (Código único) *</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} required placeholder="Ej: FIL-TOY-COR-001" className="input" />
                <p className="text-xs text-gray-500 mt-1">Debe ser único para cada producto</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111111] mb-2">Nombre del Producto *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Filtro de Aceite Toyota Corolla" className="input" />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">Descripción *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} placeholder="Compatibilidad, duración, qué incluye..." className="input" />
            </div>

            {/* Categoría y Marca */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#111111] mb-2">Categoría *</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange} required className="select">
                  <option value="">Selecciona categoría</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111111] mb-2">Marca del Repuesto *</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} required placeholder="Ej: FRAM, Toyota, Genérico" className="input" />
              </div>
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-3">Tipo de repuesto *</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'original', label: '⭐ Original', desc: 'Marca oficial del vehículo' },
                  { id: 'generico', label: '🔧 Genérico', desc: 'Marca alternativa' }
                ].map(tipo => (
                  <label key={tipo.id} className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center ${formData.type === tipo.id ? 'border-[#E10600] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="type" value={tipo.id} checked={formData.type === tipo.id} onChange={handleChange} className="hidden" />
                    <div className="font-bold text-[#111111]">{tipo.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{tipo.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Precios y Stock */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#111111] mb-2">Precio Costo (USD) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input type="number" name="cost_price" value={formData.cost_price} onChange={handleChange} required min="0" step="0.01" placeholder="12.50" className="input pl-8" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Lo que pagas tú</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111111] mb-2">Precio Venta (USD) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input type="number" name="sale_price" value={formData.sale_price} onChange={handleChange} required min="0" step="0.01" placeholder="18.50" className="input pl-8" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Lo que cobras</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111111] mb-2">Stock (Unidades) *</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" placeholder="15" className="input" />
              </div>
            </div>

            {/* Margen */}
            {margin !== null && (
              <div className={`p-4 rounded-xl border ${margin >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Margen de ganancia:</span>
                  <span className={`text-lg font-bold ${margin >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    ${margin.toFixed(2)} ({marginPct}%)
                  </span>
                </div>
                {margin < 0 && <p className="text-xs text-red-600 mt-1">⚠️ El precio de venta es menor al costo</p>}
              </div>
            )}

            {/* Upload de Fotos */}
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">
                Fotos del Producto
                <span className="text-gray-400 font-normal ml-1">({uploadedImages.length}/5)</span>
              </label>

              {/* Preview de imágenes */}
              {uploadedImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {uploadedImages.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 group">
                      <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {i === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-0.5">
                          Principal
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              {uploadedImages.length < 5 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#E10600] transition-colors cursor-pointer"
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-[#E10600] border-t-transparent rounded-full animate-spin" />
                      <p className="text-gray-600">Subiendo...</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Click para subir fotos</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG o WebP • Máximo 3MB por foto</p>
                    </>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />

              {uploadedImages.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  💡 Para que el upload funcione necesitas crear el bucket "productos" en Supabase Storage con acceso público.
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button type="submit" disabled={loading || success} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Guardando...</>
                ) : (
                  <><Check className="w-5 h-5" />Guardar Producto</>
                )}
              </button>
              <Link href="/admin/dashboard" className="btn-secondary flex items-center justify-center">
                Cancelar
              </Link>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-bold text-blue-900 mb-2">💡 Tips</h3>
          <ul className="space-y-1.5 text-sm text-blue-800">
            <li>• El SKU debe ser único — usa un sistema como: CAT-MARCA-MODELO-001</li>
            <li>• Pon la foto más atractiva primero — esa será la imagen principal</li>
            <li>• Incluye años de compatibilidad en la descripción para que el cliente confíe</li>
            <li>• Actualiza el stock cuando vendas para evitar sobrevender</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
