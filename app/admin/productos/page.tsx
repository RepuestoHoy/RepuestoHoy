'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, Search, ArrowLeft, AlertTriangle, Loader2, X } from 'lucide-react'

interface Product {
  id: string
  sku: string
  name: string
  brand: string
  type: string
  sale_price: number
  stock: number
  is_available: boolean
  images?: string[] | null
  category: { name: string } | null | any
}

export default function AdminProductosPage() {
  const supabase = createClient()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toDelete, setToDelete] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/admin'); return }
      loadProducts()
    })
  }, [router])

  const loadProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, sku, name, brand, type, sale_price, stock, is_available, images,
        category:category_id (name)
      `)
      .order('created_at', { ascending: false })

    if (!error && data) setProducts(data)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    setError('')

    // Borrar también las imágenes del storage (limpieza)
    if (toDelete.images && toDelete.images.length > 0) {
      const files = toDelete.images
        .map((url) => {
          const parts = url.split('/productos/')
          return parts[1] ? decodeURIComponent(parts[1].split('?')[0]) : null
        })
        .filter((x): x is string => !!x)
      if (files.length) await supabase.storage.from('productos').remove(files)
    }

    const { data: borrados, error: delErr } = await supabase
      .from('products').delete().eq('id', toDelete.id).select('id')
    if (delErr) {
      setError(`No se pudo eliminar: ${delErr.message}`)
      setDeleting(false)
      return
    }
    if (!borrados || borrados.length === 0) {
      setError('No tienes permiso para borrar. Ejecuta "seguridad-datos-setup.sql" en Supabase → SQL Editor y vuelve a intentar.')
      setDeleting(false)
      setToDelete(null)
      return
    }
    setProducts((prev) => prev.filter((p) => p.id !== toDelete.id))
    setDeleting(false)
    setToDelete(null)
  }

  const toggleAvailability = async (product: Product) => {
    const next = !product.is_available
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, is_available: next } : p)))
    const { error } = await supabase.from('products').update({ is_available: next }).eq('id', product.id)
    if (error) {
      // revertir si falla
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, is_available: !next } : p)))
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  const getTypeBadge = (type: string) => {
    const styles = {
      original: 'bg-[#FF6A00] text-white',
      generico: 'bg-gray-200 text-gray-700'
    }
    return styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#111111] text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            Volver al panel
          </Link>
          <h1 className="font-bold">Productos</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#111111]">Productos</h2>
            <p className="text-gray-500">{products.length} productos en total</p>
          </div>
          <Link href="/admin/productos/nuevo" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Agregar Producto
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> {error}
          </div>
        )}

        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-12"
          />
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <Loader2 className="w-10 h-10 text-[#FF6A00] animate-spin mx-auto" />
            <p className="mt-4 text-gray-500">Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-500">No se encontraron productos</p>
            {search && (
              <button onClick={() => setSearch('')} className="text-[#FF6A00] hover:underline mt-2">
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-sm text-gray-700">Producto</th>
                    <th className="text-left py-4 px-4 font-bold text-sm text-gray-700">SKU</th>
                    <th className="text-left py-4 px-4 font-bold text-sm text-gray-700">Tipo</th>
                    <th className="text-left py-4 px-4 font-bold text-sm text-gray-700">Precio</th>
                    <th className="text-left py-4 px-4 font-bold text-sm text-gray-700">Stock</th>
                    <th className="text-left py-4 px-4 font-bold text-sm text-gray-700">Estado</th>
                    <th className="text-right py-4 px-6 font-bold text-sm text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <p className="font-semibold text-[#111111]">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 font-mono">{product.sku}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getTypeBadge(product.type)}`}>
                          {product.type === 'original' ? 'Original' : 'Genérico'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#FF6A00]">${Number(product.sale_price).toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${product.stock < 5 ? 'text-orange-600' : 'text-green-600'}`}>
                          {product.stock}
                        </span>
                        {product.stock < 5 && <span className="text-xs text-orange-600 ml-1">(Bajo)</span>}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => toggleAvailability(product)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                            product.is_available
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                          }`}
                          title="Clic para activar/desactivar"
                        >
                          {product.is_available ? 'Visible' : 'Oculto'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/productos/editar/${product.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setToDelete(product)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal de confirmación de borrado */}
      {toDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Eliminar producto</h3>
                <p className="text-gray-600 text-sm mt-1">
                  ¿Seguro que quieres eliminar <strong>{toDelete.name}</strong>? Esta acción no se puede deshacer.
                </p>
              </div>
              <button onClick={() => setToDelete(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setToDelete(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
