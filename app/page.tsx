'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CARS, CATEGORIES } from '@/lib/data'
import { Search, HelpCircle, Car, Package, Shield, Truck } from 'lucide-react'

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
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Repuesto Hoy</h1>
              <p className="text-sm text-blue-200">Caracas • Entrega same-day</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 pb-20">
        <div className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¿Cuál es tu carro?
          </h2>
          <p className="text-xl text-blue-200 mb-10">
            Te mostramos exactamente qué necesita en minutos
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <option value="">Selecciona marca</option>
                  {CARS.map(car => (
                    <option key={car.brand} value={car.brand}>{car.brand}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!brand}
                  className="select disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecciona modelo</option>
                  {selectedCar?.models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  disabled={!model}
                  className="select disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Selecciona año</option>
                  {selectedCar?.years.slice().reverse().map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!brand || !model || !year}
              className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-5 h-5 inline mr-2" />
              Ver qué necesito
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-gray-500">o</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push('/buscar')}
              className="btn-secondary w-full"
            >
              <HelpCircle className="w-5 h-5 inline mr-2" />
              No estoy seguro - Ayúdame
            </button>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 -mt-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Car className="w-7 h-7 text-white" />
            </div>
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold mx-auto -mt-11 mb-4 border-4 border-white">
              1
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Tu Carro</h3>
            <p className="text-gray-600 text-sm">
              Seleccionás tu marca, modelo y año. Guardamos para la próxima.
            </p>
          </div>

          <div className="card p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold mx-auto -mt-11 mb-4 border-4 border-white">
              2
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Chequeo Express</h3>
            <p className="text-gray-600 text-sm">
              Te decimos exactamente qué necesita según km y último mantenimiento.
            </p>
          </div>

          <div className="card p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold mx-auto -mt-11 mb-4 border-4 border-white">
              3
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Compará Precios</h3>
            <p className="text-gray-600 text-sm">
              Elegí entre Económico, Estándar o Premium. Mejor precio garantizado.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-10">
          ¿Por qué elegirnos?
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Entrega Hoy</h4>
            <p className="text-sm text-gray-600">En Chacao, Baruta y alrededores</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💰</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Mejor Precio</h4>
            <p className="text-sm text-gray-600">Garantizado o devolvemos la diferencia</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✓</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Fitment Garantizado</h4>
            <p className="text-sm text-gray-600">Si no le queda, lo cambiamos gratis</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💬</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">WhatsApp Directo</h4>
            <p className="text-sm text-gray-600">Atención personalizada en minutos</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-10">
            Buscar por categoría
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <a
                key={cat.id}
                href={`/buscar?category=${cat.id}`}
                className="card p-4 text-center hover:shadow-lg transition-all group"
              >
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <h4 className="font-semibold text-gray-900 text-sm">{cat.name}</h4>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold">Repuesto Hoy</h4>
                <p className="text-sm text-slate-400">Caracas, Venezuela</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">Contacto</p>
              <p className="font-semibold">hola@repuestohoy.com</p>
              <p className="text-sm text-slate-400">+58 412-XXX-XXXX</p>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
            © 2026 Repuesto Hoy. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* Floating Badge */}
      <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
        <span className="w-2 h-2 bg-white rounded-full"></span>
        <span className="font-medium text-sm">Delivery activo en Caracas</span>
      </div>
    </div>
  )
}