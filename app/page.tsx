'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CARS, CATEGORIES } from '@/lib/data'
import { Search, HelpCircle, Car } from 'lucide-react'

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
      {/* Header - NEGRO */}
      <header className="bg-[#111111] text-white">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#E10600] rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">REPUESTO HOY</h1>
              <p className="text-sm text-gray-400">Caracas • Entrega same-day</p>
            </div>
          </div>
        </div>
      </header>

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

      {/* Footer - NEGRO */}
      <footer className="bg-[#111111] text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-11 h-11 bg-[#E10600] rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg">REPUESTO HOY</h4>
                <p className="text-sm text-gray-500">Caracas, Venezuela</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-sm">Contacto</p>
              <p className="font-semibold">hola@repuestohoy.com</p>
              <p className="text-sm text-gray-500">+58 412-2223775</p>
            </div>
          </div>
          <div className="border-t border-[#2A2A2A] pt-8 text-center text-sm text-gray-600">
            © 2026 Repuesto Hoy. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/584122223775?text=Hola!%20Vengo%20de%20repuestohoy.com%20y%20quiero%20consultar%20sobre%20un%20repuesto"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center gap-2"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="font-semibold text-sm hidden md:inline">WhatsApp</span>
      </a>
    </div>
  )
}