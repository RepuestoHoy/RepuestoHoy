'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, ShoppingCart, Menu, X, ArrowLeft } from 'lucide-react'
import { useCart } from './CartContext'

interface HeaderProps {
  showBackLink?: boolean
  backLinkText?: string
  backLinkHref?: string
}

export default function Header({ 
  showBackLink = false, 
  backLinkText = '← Volver',
  backLinkHref
}: HeaderProps) {
  const router = useRouter()
  const { items } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const cartCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  const handleBack = () => {
    if (backLinkHref) {
      router.push(backLinkHref)
    } else {
      router.back()
    }
  }

  return (
    <header className={`bg-[#111111] text-white sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo or Back */}
          {showBackLink ? (
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
              type="button"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">{backLinkText}</span>
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E10600] rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold tracking-tight">REPUESTO HOY</h1>
                <p className="text-xs text-gray-400">Caracas • Entrega same-day</p>
              </div>
            </Link>
          )}

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/buscar" className="text-gray-300 hover:text-white transition-colors">
              Repuestos
            </Link>
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Inicio
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link 
              href="/carrito" 
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label={`Carrito con ${cartCount} items`}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E10600] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              type="button"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-gray-300 hover:text-white transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/buscar"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-gray-300 hover:text-white transition-colors"
              >
                Buscar repuestos
              </Link>
              <Link
                href="/carrito"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-gray-300 hover:text-white transition-colors"
              >
                Carrito ({cartCount})
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
