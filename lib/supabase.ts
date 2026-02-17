import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for database tables
export type Category = {
  id: string
  slug: string
  name: string
  emoji: string | null
  description: string | null
  sort_order: number
}

export type DeliveryZone = {
  id: string
  name: string
  slug: string
  cost: number
  delivery_time: string | null
  is_available: boolean
}

export type Product = {
  id: string
  sku: string
  name: string
  description: string | null
  category_id: string | null
  brand: string | null
  type: 'economico' | 'standard' | 'premium'
  sale_price: number
  stock: number
  is_available: boolean
  images: string[] | null
  features: Record<string, any> | null
}

export type Order = {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_zone: string
  address: string
  items: any[]
  subtotal: number
  delivery_cost: number
  total: number
  payment_method: string
  status: 'pendiente' | 'confirmado' | 'en_camino' | 'entregado' | 'cancelado'
  notes: string | null
  created_at: string
}

// Helper functions
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
  
  if (error) throw error
  return data as Category[]
}

export async function getDeliveryZones() {
  const { data, error } = await supabase
    .from('delivery_zones')
    .select('*')
    .eq('is_available', true)
    .order('sort_order')
  
  if (error) throw error
  return data as DeliveryZone[]
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order('name')
  
  if (error) throw error
  return data as Product[]
}

export async function getProductsByCategory(categorySlug: string) {
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()
  
  if (!category) return []
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .eq('is_available', true)
  
  if (error) throw error
  return data as Product[]
}

export async function createOrder(orderData: Omit<Order, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single()
  
  if (error) throw error
  return data as Order
}
