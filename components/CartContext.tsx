'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { Product } from '@/types'

interface CartItem {
  product: Product
  quantity: number
}

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getSubtotal: () => number
  getItemCount: () => number
  toasts: Toast[]
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
  recentlyViewed: Product[]
  addToRecentlyViewed: (product: Product) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'repuestohoy-cart'
const RECENTLY_VIEWED_KEY = 'repuestohoy-recently-viewed'
const MAX_ITEMS = 50
const MAX_RECENTLY_VIEWED = 8

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
      
      const savedRecent = localStorage.getItem(RECENTLY_VIEWED_KEY)
      if (savedRecent) {
        const parsed = JSON.parse(savedRecent)
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed)
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [items, isHydrated])

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed))
      } catch (error) {
        console.error('Error saving recently viewed to localStorage:', error)
      }
    }
  }, [recentlyViewed, isHydrated])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(current => [...current, { id, message, type }])
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(current => current.filter(t => t.id !== id))
  }, [])

  const addToRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed(current => {
      // Remove if already exists
      const filtered = current.filter(p => p.id !== product.id)
      // Add to beginning, limit to MAX_RECENTLY_VIEWED
      return [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED)
    })
  }, [])

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems(current => {
      if (current.length >= MAX_ITEMS && !current.find(item => item.product.id === product.id)) {
        showToast(`No puedes agregar más de ${MAX_ITEMS} productos diferentes`, 'error')
        return current
      }

      const existing = current.find(item => item.product.id === product.id)
      if (existing) {
        const newQuantity = Math.min(product.stock, existing.quantity + quantity)
        if (newQuantity === existing.quantity) {
          showToast(`No hay más stock disponible para ${product.name}`, 'error')
          return current
        }
        showToast(`${product.name} actualizado en el carrito`)
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      }
      showToast(`${product.name} agregado al carrito`)
      return [...current, { product, quantity: Math.min(product.stock, quantity) }]
    })
  }, [showToast])

  const removeFromCart = useCallback((productId: string) => {
    setItems(current => {
      const item = current.find(i => i.product.id === productId)
      if (item) {
        showToast(`${item.product.name} eliminado del carrito`, 'info')
      }
      return current.filter(item => item.product.id !== productId)
    })
  }, [showToast])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setItems(current =>
      current.map(item => {
        if (item.product.id === productId) {
          const newQuantity = Math.min(item.product.stock, quantity)
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setItems([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error)
    }
  }, [])

  const getTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }, [items])

  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }, [items])

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  // No renderizar hasta que se hidrate para evitar hydration mismatch
  if (!isHydrated) {
    return (
      <CartContext.Provider
        value={{
          items: [],
          addToCart: () => {},
          removeFromCart: () => {},
          updateQuantity: () => {},
          clearCart: () => {},
          getTotal: () => 0,
          getSubtotal: () => 0,
          getItemCount: () => 0,
          toasts: [],
          showToast: () => {},
          removeToast: () => {},
          recentlyViewed: [],
          addToRecentlyViewed: () => {}
        }}
      >
        {children}
      </CartContext.Provider>
    )
  }

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getTotal, 
        getSubtotal, 
        getItemCount,
        toasts,
        showToast,
        removeToast,
        recentlyViewed,
        addToRecentlyViewed
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
