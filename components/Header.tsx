'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Menu, X, ArrowLeft, Phone, User, LogOut } from 'lucide-react'
import Image from 'next/image'
import { useCart } from './CartContext'
import { supabase } from '@/lib/supabase'

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
  const [user, setUser] = useState<any>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
      if (window.scrollY > 100) setShowBanner(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const cartCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  const handleBack = () => {
    if (backLinkHref) router.push(backLinkHref)
    else router.back()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    setUser(null)
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Mi cuenta'

  return (
    <>
      {/* Banner promocional */}
      {showBanner && (
        <div className="bg-[#E10600] text-white text-center py-2 px-4 text-sm font-medium relative">
          <span className="hidden sm:inline">Entrega el mismo día en Caracas • </span>
          <span>WhatsApp: +58 412-2223775</span>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70"
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
              <Link href="/" className="flex items-center group">
                <svg
                  viewBox="0 0 420 100"
                  height="40"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="repuestohoy"
                  style={{ display: 'block' }}
                  className="transition-transform group-hover:-translate-y-0.5"
                >
                  <rect x="0" y="0" width="420" height="100" rx="3" fill="#E8181A"/>
                  <text
                    x="210"
                    y="76"
                    textAnchor="middle"
                    fontFamily="'Futura', 'Trebuchet MS', Arial, sans-serif"
                    fontWeight="bold"
                    fontStyle="italic"
                    fontSize="74"
                    letterSpacing="-1"
                    fill="#FFFFFF"
                  >repuestohoy</text>
                </svg>
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
            <div className="flex items-center gap-3">
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

              {/* User menu */}
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <div className="w-7 h-7 bg-[#E10600] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {displayName[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300 max-w-24 truncate hidden lg:block">{displayName}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Conectado como</p>
                        <p className="text-sm font-semibold text-[#111111] truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  Entrar
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                type="button"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-white/20">
              <div className="flex flex-col gap-1">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-3 px-2 text-gray-300 hover:text-white transition-colors font-medium rounded-lg hover:bg-white/5">
                  Inicio
                </Link>
                <Link href="/buscar" onClick={() => setMobileMenuOpen(false)} className="py-3 px-2 text-gray-300 hover:text-white transition-colors font-medium rounded-lg hover:bg-white/5">
                  Buscar repuestos
                </Link>
                <Link href="/carrito" onClick={() => setMobileMenuOpen(false)} className="py-3 px-2 text-gray-300 hover:text-white transition-colors font-medium rounded-lg hover:bg-white/5">
                  Carrito ({cartCount})
                </Link>
                {user ? (
                  <button onClick={() => { handleSignOut(); setMobileMenuOpen(false) }} className="py-3 px-2 text-red-400 hover:text-red-300 transition-colors font-medium text-left rounded-lg hover:bg-white/5 flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-3 px-2 text-gray-300 hover:text-white transition-colors font-medium rounded-lg hover:bg-white/5 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Iniciar sesión
                  </Link>
                )}
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '584122223775'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-2 text-green-400 hover:text-green-300 transition-colors font-medium flex items-center gap-2 rounded-lg hover:bg-white/5"
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
