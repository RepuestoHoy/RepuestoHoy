'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react'

interface Product {
  id: string
  sku: string
  name: string
  brand: string
  type: string
  sale_price: number
  stock: number
  is_available: boolean
  category: { name: string } | null
}

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, sku, name, brand, type, sale_price, stock, is_available,
        category:category_id (name)
      `)
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setProducts(data)
    }
    setLoading(false)
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  const getTypeBadge = (type: string) => {
    const styles = {
      economico: 'bg-green-100 text-green-700',
      standard: 'bg-yellow-100 text-yellow-700',
      premium: 'bg-red-100 text-red-700'
    }
    return styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#111111] text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
              Volver a la tienda
            </Link>
          </div>
          <h1 className="font-bold">Panel de Administración</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#111111]">Productos</h2>
            <p className="text-gray-500">{products.length} productos en total</p>
          </div>
          <Link
            href="/admin/productos/nuevo"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Agregar Producto
          </Link>
        </div>

        {/* Search */}
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
            <div className="w-10 h-10 border-4 border-[#E10600] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500">Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-500">No se encontraron productos</p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-[#E10600] hover:underline mt-2"
              >
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
                    <th className="text-right py-4 px-6 font-bold text-sm text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-[#111111]">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 font-mono">{product.sku}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getTypeBadge(product.type)}`}>
                          {product.type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#E10600]">${product.sale_price.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${product.stock < 5 ? 'text-orange-600' : 'text-green-600'}`}>
                          {product.stock}
                        </span>
                        {product.stock < 5 && (
                          <span className="text-xs text-orange-600 ml-1">(Bajo)</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
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

        {/* Links útiles */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <a
            href="https://supabase.com/dashboard/project/knxhboghyxwfsqptghxq"
            target="_blank"
            rel="noopener noreferrer"
            className="card p-4 hover:border-[#E10600] transition-colors"
          >
            <p className="font-semibold text-[#111111]">Abrir Supabase Dashboard</p>
            <p className="text-sm text-gray-500">Para edición avanzada de productos</p>
          </a>
          <Link
            href="/GUIA-PRODUCTOS.md"
            className="card p-4 hover:border-[#E10600] transition-colors"
          >
            <p className="font-semibold text-[#111111]">Ver Guía Completa</p>
            <p className="text-sm text-gray-500">Documentación de cómo agregar productos</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
