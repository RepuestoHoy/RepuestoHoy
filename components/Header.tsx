'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, ShoppingCart, Menu, X, ArrowLeft, Phone } from 'lucide-react'
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
  const [showBanner, setShowBanner] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
      if (window.scrollY > 100) setShowBanner(false)
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
    <>
      {/* Banner promocional */}
      {showBanner && (
        <div className="bg-[#E10600] text-white text-center py-2 px-4 text-sm font-medium">
          <span className="hidden sm:inline">🚗 Entrega el mismo día en Caracas • </span>
          <span>WhatsApp: +58 412-2223775</span>
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-2 hover:opacity-70"
            aria-label="Cerrar banner"
          >
            ×
          </button>
        </div>
      )}
      
      <header className={`header-dark sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-2xl' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo o Back */}
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
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 bg-gradient-to-br from-[#E10600] to-[#B00500] rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-shadow">
                  <Car className="w-6 h-6" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold tracking-tight">REPUESTO HOY</h1>
                  <p className="text-xs text-gray-400">Caracas • Entrega el mismo día</p>
                </div>
              </Link>
            )}

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/buscar" className="text-gray-300 hover:text-white transition-colors font-medium">
                Repuestos
              </Link>
              <Link href="/" className="text-gray-300 hover:text-white transition-colors font-medium">
                Inicio
              </Link>
              <a 
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '584122223775'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-medium"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline">Ayuda</span>
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link 
                href="/carrito" 
                className="relative p-2.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer group"
                aria-label={`Carrito con ${cartCount} items`}
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#E10600] to-[#B00500] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
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
                  className="py-3 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Inicio
                </Link>
                <Link
                  href="/buscar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Buscar repuestos
                </Link>
                <Link
                  href="/carrito"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Carrito ({cartCount})
                </Link>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '584122223775'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 text-green-400 hover:text-green-300 transition-colors font-medium flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp Ayuda
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  )
}
