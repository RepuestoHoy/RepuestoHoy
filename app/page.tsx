'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CARS, CATEGORIES } from '@/lib/data'
import { Search, HelpCircle, Car } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function HomePage() {
  const router = useRouter()
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')

  const selectedCar = CARS.find(c => c.brand === brand)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (brand && model && year) {
      router.push(`/buscar?brand=${brand}&model=${model}&year=${year}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero - FONDO BLANCO */}
      <section className="bg-white pb-16 border-b border-[#E0E0E0]">
        <div className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4 tracking-tight">
            ¿CUÁL ES TU CARRO?
          </h2>
          <p className="text-xl text-[#2A2A2A] mb-10">
            Te mostramos exactamente qué necesita en minutos
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="bg-white rounded-xl p-6 md:p-8 border border-[#E0E0E0] shadow-xl max-w-2xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* Brand */}
              <div>
                <label className="block text-xs font-bold text-[#2A2A2A] mb-2 uppercase tracking-wider">
                  Marca
                </label>
                <select
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value)
                    setModel('')
                  }}
                  className="select"
                >
                  <option value="">Selecciona</option>
                  {CARS.map(car => (
                    <option key={car.brand} value={car.brand}>{car.brand}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-bold text-[#2A2A2A] mb-2 uppercase tracking-wider">
                  Modelo
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!brand}
                  className="select disabled:bg-[#F5F5F5] disabled:cursor-not-allowed"
                >
                  <option value="">Selecciona</option>
                  {selectedCar?.models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-xs font-bold text-[#2A2A2A] mb-2 uppercase tracking-wider">
                  Año
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  disabled={!model}
                  className="select disabled:bg-[#F5F5F5] disabled:cursor-not-allowed"
                >
                  <option value="">Selecciona</option>
                  {selectedCar?.years.slice().reverse().map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!brand || !model || !year}
              className="btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-5 h-5 inline mr-2" />
              VER QUÉ NECESITO
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E0E0E0]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-[#2A2A2A]">o</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push('/buscar')}
              className="btn-secondary"
            >
              <HelpCircle className="w-5 h-5 inline mr-2" />
              No estoy seguro - Ayúdame
            </button>
          </form>
        </div>
      </section>

      {/* Features - FONDO GRIS CLARO */}
      <section className="bg-[#F5F5F5] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#111111] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="w-8 h-8 bg-white text-[#111111] rounded-full flex items-center justify-center font-bold text-sm mx-auto -mt-10 mb-3 border-4 border-[#F5F5F5]">
                1
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-2 uppercase">Tu Carro</h3>
              <p className="text-[#2A2A2A] text-sm">
                Seleccionás tu marca, modelo y año. Guardamos para la próxima.
              </p>
            </div>

            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#111111] rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="w-8 h-8 bg-white text-[#111111] rounded-full flex items-center justify-center font-bold text-sm mx-auto -mt-10 mb-3 border-4 border-[#F5F5F5]">
                2
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-2 uppercase">Chequeo Express</h3>
              <p className="text-[#2A2A2A] text-sm">
                Te decimos exactamente qué necesita según km y último mantenimiento.
              </p>
            </div>

            <div className="card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#111111] rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="w-8 h-8 bg-white text-[#111111] rounded-full flex items-center justify-center font-bold text-sm mx-auto -mt-10 mb-3 border-4 border-[#F5F5F5]">
                3
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-2 uppercase">Compará Precios</h3>
              <p className="text-[#2A2A2A] text-sm">
                Elegí entre Económico, Estándar o Premium. Mejor precio garantizado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - FONDO BLANCO */}
      <section className="bg-white py-16 border-b border-[#E0E0E0]">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-[#111111] mb-10 uppercase tracking-tight">
            ¿Por qué elegirnos?
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 text-center hover:border-[#111111] transition-colors">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-bold text-[#111111] mb-1">Entrega Hoy</h4>
              <p className="text-sm text-[#2A2A2A]">En Chacao, Baruta y alrededores</p>
            </div>

            <div className="card p-6 text-center hover:border-[#111111] transition-colors">
              <div className="text-3xl mb-3">💰</div>
              <h4 className="font-bold text-[#111111] mb-1">Mejor Precio</h4>
              <p className="text-sm text-[#2A2A2A]">Garantizado o devolvemos la diferencia</p>
            </div>

            <div className="card p-6 text-center hover:border-[#111111] transition-colors">
              <div className="text-3xl mb-3">✓</div>
              <h4 className="font-bold text-[#111111] mb-1">Fitment Garantizado</h4>
              <p className="text-sm text-[#2A2A2A]">Si no le queda, lo cambiamos gratis</p>
            </div>

            <div className="card p-6 text-center hover:border-[#111111] transition-colors">
              <div className="text-3xl mb-3">💬</div>
              <h4 className="font-bold text-[#111111] mb-1">WhatsApp Directo</h4>
              <p className="text-sm text-[#2A2A2A]">Atención personalizada en minutos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - FONDO BLANCO */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-[#111111] mb-10 uppercase tracking-tight">
            Buscar por categoría
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <a
                key={cat.id}
                href={`/buscar?category=${cat.id}`}
                className="card p-5 text-center hover:border-[#111111] hover:shadow-lg transition-all group"
              >
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <h4 className="font-bold text-[#111111] text-sm uppercase">{cat.name}</h4>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
