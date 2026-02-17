export interface Car {
  brand: string
  models: string[]
  years: number[]
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  brand: string
  type: 'original' | 'generico'
  price: number
  originalPrice?: number
  stock: number
  images: string[]
  compatible: {
    brand: string
    model: string
    years: string
  }[]
  features: string[]
  sku: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id?: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: CartItem[]
  subtotal: number
  deliveryCost: number
  total: number
  deliveryZone: string
  address: string
  status: 'pendiente' | 'confirmado' | 'en_camino' | 'entregado' | 'cancelado'
  paymentMethod: 'pago_movil' | 'zelle' | 'efectivo'
  notes?: string
  createdAt?: string
}

export interface DeliveryZone {
  id: string
  name: string
  cost: number
  time: string
  available: boolean
}