'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Package, ShoppingBag, DollarSign, Clock, CheckCircle, Truck, XCircle,
  LogOut, Plus, Eye, BarChart2, RefreshCw, Bell, Car
} from 'lucide-react'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  total: number
  status: string
  payment_method: string
  delivery_zone: string
  created_at: string
  items: any[]
}

interface Stats {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  todayOrders: number
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmado: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  en_camino: { label: 'En camino', color: 'bg-purple-100 text-purple-800', icon: Truck },
  entregado: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle },
}

const PAYMENT_LABELS: Record<string, string> = {
  pago_movil: '📱 Pago Móvil',
  zelle: '🇺🇸 Zelle',
  efectivo: '💵 Efectivo',
}

export default function AdminDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, pendingOrders: 0, totalRevenue: 0, todayOrders: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders')

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('rh-admin-auth')
    if (isAdmin !== 'true') {
      router.push('/admin')
      return
    }
    loadOrders()
  }, [router])

  const loadOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (!error && data) {
      setOrders(data)
      const today = new Date().toDateString()
      setStats({
        totalOrders: data.length,
        pendingOrders: data.filter(o => o.status === 'pendiente').length,
        totalRevenue: data.filter(o => o.status !== 'cancelado').reduce((sum, o) => sum + Number(o.total), 0),
        todayOrders: data.filter(o => new Date(o.created_at).toDateString() === today).length,
      })
    }
    setLoading(false)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId)
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
      }
    }
    setUpdatingStatus(null)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('rh-admin-auth')
    router.push('/admin')
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-VE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#111111] text-white py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E10600] rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg">Panel Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            {stats.pendingOrders > 0 && (
              <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
                <Bell className="w-4 h-4" />
                {stats.pendingOrders} pendiente{stats.pendingOrders > 1 ? 's' : ''}
              </div>
            )}
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
              Ver tienda →
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Órdenes totales', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Pendientes', value: stats.pendingOrders, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Ingresos totales', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Órdenes hoy', value: stats.todayOrders, icon: BarChart2, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'orders' ? 'bg-[#111111] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            📦 Órdenes
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'products' ? 'bg-[#111111] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            🔧 Productos
          </button>
          <button onClick={loadOrders} className="ml-auto p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Actualizar">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="flex gap-6">
            {/* Orders List */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-10 h-10 border-4 border-[#E10600] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Cargando órdenes...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay órdenes aún</p>
                  <p className="text-gray-400 text-sm mt-2">Las nuevas órdenes aparecerán aquí</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-4 px-5 font-bold text-xs text-gray-500 uppercase tracking-wider">Orden</th>
                        <th className="text-left py-4 px-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="text-left py-4 px-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="text-left py-4 px-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="text-left py-4 px-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="py-4 px-5"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map(order => {
                        const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pendiente
                        const StatusIcon = statusCfg.icon
                        return (
                          <tr
                            key={order.id}
                            className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedOrder?.id === order.id ? 'bg-red-50' : ''}`}
                            onClick={() => setSelectedOrder(order)}
                          >
                            <td className="py-4 px-5">
                              <span className="font-mono text-xs font-bold text-[#E10600]">{order.order_number}</span>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-semibold text-[#111111] text-sm">{order.customer_name}</p>
                                <p className="text-xs text-gray-500">{order.customer_phone}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-[#E10600]">${Number(order.total).toFixed(2)}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusCfg.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusCfg.label}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-xs text-gray-500">
                              {formatDate(order.created_at)}
                            </td>
                            <td className="py-4 px-5">
                              <Eye className="w-4 h-4 text-gray-400" />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Order Detail Panel */}
            {selectedOrder && (
              <div className="w-80 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#111111]">Detalle</h3>
                    <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>

                  <div className="font-mono text-lg font-bold text-[#E10600] mb-4">{selectedOrder.order_number}</div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between"><span className="text-gray-500">Cliente</span><span className="font-semibold">{selectedOrder.customer_name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Teléfono</span>
                      <a href={`https://wa.me/58${selectedOrder.customer_phone.replace(/^0/, '').replace(/-/g, '')}`} target="_blank" className="text-green-600 font-semibold">{selectedOrder.customer_phone}</a>
                    </div>
                    {selectedOrder.customer_email && <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-xs">{selectedOrder.customer_email}</span></div>}
                    <div className="flex justify-between"><span className="text-gray-500">Pago</span><span>{PAYMENT_LABELS[selectedOrder.payment_method] || selectedOrder.payment_method}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold text-[#E10600] text-base">${Number(selectedOrder.total).toFixed(2)}</span></div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Productos ({selectedOrder.items?.length || 0})</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {selectedOrder.items?.map((item: any, i: number) => (
                        <div key={i} className="text-xs bg-gray-50 rounded px-2 py-1 flex justify-between">
                          <span className="truncate mr-2">{item.product?.name || 'Producto'}</span>
                          <span className="text-gray-500 flex-shrink-0">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Cambiar estado</p>
                    <div className="space-y-2">
                      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                        <button
                          key={key}
                          onClick={() => updateOrderStatus(selectedOrder.id, key)}
                          disabled={selectedOrder.status === key || updatingStatus === selectedOrder.id}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            selectedOrder.status === key
                              ? cfg.color + ' cursor-default'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {selectedOrder.status === key ? '✓ ' : ''}{cfg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/58${selectedOrder.customer_phone.replace(/^0/, '').replace(/-/g, '')}?text=${encodeURIComponent(`Hola ${selectedOrder.customer_name}! Te escribimos de Repuesto Hoy sobre tu orden ${selectedOrder.order_number}.`)}`}
                    target="_blank"
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl text-sm font-semibold transition-colors"
                  >
                    📲 WhatsApp al cliente
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="flex justify-end mb-4">
            <Link href="/admin/productos/nuevo" className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Agregar Producto
            </Link>
          </div>
        )}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <ProductsTab />
          </div>
        )}
      </div>
    </div>
  )
}

function ProductsTab() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('id, sku, name, brand, type, sale_price, stock, is_available')
      .order('created_at', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  const toggleAvailability = async (id: string, current: boolean) => {
    await supabase.from('products').update({ is_available: !current }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_available: !current } : p))
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="text-center py-8">
      <div className="w-8 h-8 border-4 border-[#E10600] border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input max-w-xs"
        />
        <span className="text-sm text-gray-500">{filtered.length} productos</span>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p>No hay productos aún.</p>
          <Link href="/admin/productos/nuevo" className="text-[#E10600] hover:underline text-sm mt-2 inline-block">
            Agregar el primero →
          </Link>
        </div>
      ) : (
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="text-left py-3 text-xs text-gray-500 uppercase font-bold">Producto</th>
              <th className="text-left py-3 text-xs text-gray-500 uppercase font-bold">SKU</th>
              <th className="text-left py-3 text-xs text-gray-500 uppercase font-bold">Precio</th>
              <th className="text-left py-3 text-xs text-gray-500 uppercase font-bold">Stock</th>
              <th className="text-left py-3 text-xs text-gray-500 uppercase font-bold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-3">
                  <div>
                    <p className="font-semibold text-sm text-[#111111]">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.brand}</p>
                  </div>
                </td>
                <td className="py-3 font-mono text-xs text-gray-600">{p.sku}</td>
                <td className="py-3 font-bold text-[#E10600]">${Number(p.sale_price).toFixed(2)}</td>
                <td className="py-3">
                  <span className={`font-semibold text-sm ${p.stock < 5 ? 'text-orange-600' : 'text-green-600'}`}>
                    {p.stock} {p.stock < 5 && '⚠️'}
                  </span>
                </td>
                <td className="py-3">
                  <button
                    onClick={() => toggleAvailability(p.id, p.is_available)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      p.is_available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {p.is_available ? '✓ Activo' : '✗ Inactivo'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
