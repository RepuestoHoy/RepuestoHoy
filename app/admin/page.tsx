'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, LogIn } from 'lucide-react'
import Link from 'next/link'
import { Car } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('rh-admin-auth')
    if (isAdmin === 'true') {
      router.push('/admin/dashboard')
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Check against env or fallback
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'repuestohoy2024'

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('rh-admin-auth', 'true')
        router.push('/admin/dashboard')
      } else {
        setError('Contraseña incorrecta')
        setLoading(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col justify-center py-12 px-4">
      <div className="max-w-sm w-full mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <svg viewBox="0 0 420 100" height="36" xmlns="http://www.w3.org/2000/svg" aria-label="repuestohoy">
              <rect x="0" y="0" width="420" height="100" rx="3" fill="#E8181A"/>
              <text x="210" y="76" textAnchor="middle" fontFamily="'Futura', 'Trebuchet MS', Arial, sans-serif" fontWeight="bold" fontStyle="italic" fontSize="74" letterSpacing="-1" fill="#FFFFFF">repuestohoy</text>
            </svg>
          </Link>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
          <p className="text-gray-400 mt-2">Ingresa la contraseña para continuar</p>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#E10600] transition-colors"
                placeholder="Contraseña del panel"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#E10600] hover:bg-[#B00500] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              Entrar
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Volver a la tienda
          </Link>
        </p>
      </div>
    </div>
  )
}
