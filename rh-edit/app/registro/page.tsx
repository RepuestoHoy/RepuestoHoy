'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Car, UserPlus, Eye, EyeOff, AlertCircle, Check } from 'lucide-react'
// Phone validation removed - handled inline
import { Suspense } from 'react'

function RegistroForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [countryCode, setCountryCode] = useState('+58')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push(redirect)
    })
  }, [redirect, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir números
    let rawValue = e.target.value.replace(/\D/g, '')
    // Si empieza con 0, lo quitamos (el +58 ya está en el dropdown)
    if (rawValue.startsWith('0')) {
      rawValue = rawValue.slice(1)
    }
    // Limitar a 10 dígitos
    const limitedValue = rawValue.slice(0, 10)
    setFormData(prev => ({ ...prev, phone: limitedValue }))
    setError('')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (!formData.phone || formData.phone.length < 10) {
      setError('El teléfono es obligatorio. Debe tener 10 dígitos (ej: 4121234567)')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
          phone: `${countryCode}${formData.phone}`,
        },
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        setError('Este email ya está registrado. ¿Quieres iniciar sesión?')
      } else {
        setError(error.message)
      }
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#111111] mb-3">¡Cuenta creada!</h1>
          <p className="text-gray-600 mb-2">
            Revisa tu email <strong>{formData.email}</strong> para confirmar tu cuenta.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Puedes seguir comprando mientras tanto — la confirmación es solo para futuras visitas.
          </p>
          <Link href={redirect} className="btn-primary inline-block px-8">
            Continuar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <span
              style={{
                background: '#E8181A',
                color: '#FFFFFF',
                fontFamily: "'Futura', 'Trebuchet MS', 'Arial Black', Arial, sans-serif",
                fontWeight: 900,
                fontStyle: 'italic',
                fontSize: '26px',
                letterSpacing: '-0.5px',
                padding: '8px 22px 10px',
                borderRadius: '3px',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                display: 'inline-block',
              }}
            >repuestohoy</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-[#111111]">Crear cuenta</h1>
          <p className="mt-2 text-gray-600">¿Ya tienes cuenta?{' '}
            <Link href={`/login?redirect=${redirect}`} className="text-[#E10600] font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">Nombre completo *</label>
              <input name="name" type="text" value={formData.name} onChange={handleChange} required className="input" placeholder="Juan Pérez" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">Email *</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required className="input" placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">Teléfono *</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="input w-28 flex-shrink-0"
                >
                  <option value="+58">🇻🇪 +58</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+57">🇨🇴 +57</option>
                  <option value="+51">🇵🇪 +51</option>
                  <option value="+54">🇦🇷 +54</option>
                  <option value="+56">🇨🇱 +56</option>
                  <option value="+52">🇲🇽 +52</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+34">🇪🇸 +34</option>
                </select>
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required
                  className="input flex-1"
                  placeholder="4121234567"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">Escribe: 4121234567 (10 dígitos sin el 0 inicial)</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">Contraseña *</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="input pr-12"
                  placeholder="Mínimo 6 caracteres"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-2">Confirmar contraseña *</label>
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="input" placeholder="Repite tu contraseña" />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <UserPlus className="w-5 h-5" />}
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Puedes{' '}
            <Link href="/checkout" className="text-[#111111] font-semibold hover:underline">
              comprar sin cuenta
            </Link>
            {' '}— no es obligatorio.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistroForm />
    </Suspense>
  )
}
