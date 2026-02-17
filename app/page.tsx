'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CARS, CATEGORIES } from '@/lib/data'
import { Search, HelpCircle, Car, Shield, Clock, Award, ChevronRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function HomePage() {
  const router = useRouter()
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  const selectedCar = CARS.find(c => c.brand === brand)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (brand && model && year) {
      setIsAnimating(true)
      setTimeout(() => {
        router.push(`/shop?brand=${brand}&model=${model}&year=${year}`)
      }, 300)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section Mejorado */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
        {/* Patrón de fondo decorativo */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-900/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full text-[#E10600] text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Más de 10,000 repuestos disponibles</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-extrabold text-[#111111] mb-4 tracking-tight">
            ¿Cuál es tu <span className="text-[#E10600]">carro</span>?
          </h2>
          <p className="text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto">
            Seleccioná tu marca, modelo y año. Te mostramos exactamente qué repuestos necesita tu carro en minutos.
          </p>

          {/* Search Box Mejorado */}
          <div className={`search-box max-w-2xl mx-auto transition-all duration-300 ${isAnimating ? 'scale-95 opacity-70' : ''}`}>
            <form onSubmit={handleSearch}>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {/* Brand */}
                <div className="relative">
                  <label className="block text-xs font-bold text-[#6B7280] mb-2 uppercase tracking-wider">
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
                    <option value="">Seleccioná</option>
                    {CARS.map(car => (
                      <option key={car.brand} value={car.brand}>{car.brand}</option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div className="relative">
                  <label className="block text-xs font-bold text-[#6B7280] mb-2 uppercase tracking-wider">
                    Modelo
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    disabled={!brand}
                    className="select disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Seleccioná</option>
                    {selectedCar?.models.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div className="relative">
                  <label className="block text-xs font-bold text-[#6B7280] mb-2 uppercase tracking-wider">
                    Año
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    disabled={!model}
                    className="select disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Seleccioná</option>
                    {selectedCar?.years.slice().reverse().map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={!brand || !model || !year}
                  className="btn-primary text-lg py-4 flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Ver qué necesito
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/buscar')}
                  className="btn-secondary flex items-center justify-center gap-2 sm:w-auto"
                >
                  <HelpCircle className="w-5 h-5" />
                  No estoy seguro
                </button>
              </div>
            </form>
          </div>

          {/* Stats rápidas */}
          <div className="flex flex-wrap justify-center gap-8 mt-10 text-sm text-[#6B7280]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#E10600]" />
              <span>Calidad asegurada</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#E10600]" />
              <span>Entrega el mismo día</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-[#E10600]" />
              <span>Compatibilidad garantizada</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-pattern py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#111111] mb-4">
              Cómo funciona
            </h3>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              En 3 simples pasos consigues el repuesto que necesitas, asegurado de que le va a quedar perfecto a tu vehículo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card">
              <div className="w-14 h-14 bg-gradient-to-br from-[#111111] to-[#2A2A2A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div className="step-number">1</div>
              <h3 className="text-xl font-bold text-[#111111] mb-3">Tu Carro</h3>
              <p className="text-[#6B7280]">
                Selecciona tu marca, modelo y año. Guardamos tu vehiculo para que no tengas que repetirlo.
              </p>
            </div>

            <div className="feature-card">
              <div className="w-14 h-14 bg-gradient-to-br from-[#111111] to-[#2A2A2A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="step-number">2</div>
              <h3 className="text-xl font-bold text-[#111111] mb-3">Compara Precios</h3>
              <p className="text-[#6B7280]">
                Elige entre Original o Generico. Siempre el mejor precio garantizado.
              </p>
            </div>

            <div className="feature-card">
              <div className="w-14 h-14 bg-gradient-to-br from-[#111111] to-[#2A2A2A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="step-number">3</div>
              <h3 className="text-xl font-bold text-[#111111] mb-3">Entrega Rapida</h3>
              <p className="text-[#6B7280]">
                Pagas y recibes el mismo dia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#111111] mb-4">
              ¿Por qué elegirnos?
            </h3>
            <p className="text-[#6B7280]">
              Somos el repuesto que tu carro necesita, cuando lo necesita.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 text-center group hover:border-[#E10600] transition-colors">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 transition-colors">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-bold text-[#111111] mb-2">Entrega Hoy</h4>
              <p className="text-sm text-[#6B7280]">En Chacao, Baruta y alrededores</p>
            </div>

            <div className="card p-6 text-center group hover:border-[#E10600] transition-colors">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-bold text-[#111111] mb-2">Precio justo</h4>
              <p className="text-sm text-[#6B7280]">Transparente y competitivo</p>
            </div>

            <div className="card p-6 text-center group hover:border-[#E10600] transition-colors">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                <span className="text-2xl">✓</span>
              </div>
              <h4 className="font-bold text-[#111111] mb-2">Verificación experta</h4>
              <p className="text-sm text-[#6B7280]">Confirmamos la pieza exacta antes de enviar</p>
            </div>

            <div className="card p-6 text-center group hover:border-[#E10600] transition-colors">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-100 transition-colors">
                <span className="text-2xl">💬</span>
              </div>
              <h4 className="font-bold text-[#111111] mb-2">WhatsApp con expertos</h4>
              <p className="text-sm text-[#6B7280]">Asesoría rápida para comprar la pieza correcta</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#111111] mb-4">
              Buscar por categoría
            </h3>
            <p className="text-[#6B7280]">
              Todo lo que tu carro necesita, organizado por sistema.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <a
                key={cat.id}
                href={`/buscar?category=${cat.id}`}
                className="card p-5 text-center hover:border-[#E10600] hover:shadow-xl transition-all group"
              >
                <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <h4 className="font-bold text-[#111111] text-sm uppercase mb-1">{cat.name}</h4>
                <p className="text-xs text-[#6B7280]">{cat.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#111111] to-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            ¿No sabes qué repuesto necesitas?
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Escríbenos por WhatsApp qué le pasa a tu vehículo. Nuestros expertos te van a ayudar a encontrar exactamente lo que necesitas.
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '584122223775'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-all hover:shadow-xl hover:shadow-green-600/30"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Escribir por WhatsApp
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
