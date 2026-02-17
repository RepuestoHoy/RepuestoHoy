'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CARS, CATEGORIES } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { Wrench, Sparkles, ArrowRight, MessageCircle, AlertCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

// Categorías por prioridad
const ESSENTIAL_CATEGORIES = ['frenos', 'filtros', 'bateria', 'aceites', 'bujias', 'neumaticos', 'parabrisas']
const REPAIR_CATEGORIES = ['suspension', 'enfriamiento', 'motor', 'sensores', 'escape', 'direccion', 'transmision']
const UPGRADE_CATEGORIES = ['audio', 'iluminacion', 'interior', 'exterior', 'herramientas', 'seguridad']

export default function ShopPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  
  const brand = searchParams.get('brand') || ''
  const model = searchParams.get('model') || ''
  const year = searchParams.get('year') || ''
  
  const vehicleName = brand && model ? `${brand} ${model} ${year}` : 'Tu carro'
  
  useEffect(() => {
    // Si no hay vehículo seleccionado, redirigir al home
    if (!brand || !model || !year) {
      router.push('/')
      return
    }
    
    // Contar productos por categoría para este vehículo
    const fetchCounts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category_id, count')
        .eq('is_available', true)
        .gt('stock', 0)
      
      if (!error && data) {
        const counts: Record<string, number> = {}
        data.forEach((p: any) => {
          counts[p.category_id] = (counts[p.category_id] || 0) + 1
        })
        setCategoryCounts(counts)
      }
      setLoading(false)
    }
    
    fetchCounts()
  }, [brand, model, year, router])
  
  // Filtrar categorías que tienen productos
  const getCategoriesWithProducts = (categoryIds: string[]) => {
    return CATEGORIES.filter(cat => 
      categoryIds.includes(cat.id) && 
      (categoryCounts[cat.id] > 0 || loading)
    )
  }
  
  const essentials = getCategoriesWithProducts(ESSENTIAL_CATEGORIES)
  const repairs = getCategoriesWithProducts(REPAIR_CATEGORIES)
  const upgrades = getCategoriesWithProducts(UPGRADE_CATEGORIES)
  
  const handleCategoryClick = (categoryId: string) => {
    router.push(`/buscar?brand=${brand}&model=${model}&year=${year}&category=${categoryId}`)
  }
  
  const handleFixItNow = () => {
    // Ir a buscar con filtro de categorías esenciales (mostrar todas)
    router.push(`/buscar?brand=${brand}&model=${model}&year=${year}`)
  }
  
  const handleUpgrades = () => {
    // Ir a buscar mostrando categorías de upgrade
    const firstUpgrade = upgrades[0]
    if (firstUpgrade) {
      router.push(`/buscar?brand=${brand}&model=${model}&year=${year}&category=${firstUpgrade.id}`)
    } else {
      router.push(`/buscar?brand=${brand}&model=${model}&year=${year}`)
    }
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Barra sticky con vehículo */}
      <div className="sticky top-0 z-40 bg-[#111111] text-white py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🚗</span>
            <span className="font-bold">{vehicleName}</span>
          </div>
          <Link 
            href="/" 
            className="text-sm text-gray-400 hover:text-white underline"
          >
            Cambiar
          </Link>
        </div>
      </div>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero con CTAs principales */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#111111] mb-3">
            ¿Qué necesitás para tu {vehicleName}?
          </h1>
          <p className="text-gray-600 mb-8">
            Tenemos {loading ? '...' : 'repuestos'} con entrega el mismo día en Caracas
          </p>
          
          {/* Dos CTAs grandes */}
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* Arreglalo ya - Rojo */}
            <button
              onClick={handleFixItNow}
              className="bg-gradient-to-br from-[#E10600] to-[#B00500] text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">🔧 Arreglalo ya</h2>
                  <p className="text-white/90 text-sm">
                    Frenos, batería, filtros<br/>
                    Seguridad primero
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-sm font-semibold">
                    Ver repuestos <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </button>
            
            {/* Mejoras - Negro */}
            <button
              onClick={handleUpgrades}
              className="bg-gradient-to-br from-[#111111] to-[#2A2A2A] text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">✨ Mejoras</h2>
                  <p className="text-white/90 text-sm">
                    Audio, luces, accesorios<br/>
                    Dale tu estilo
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-sm font-semibold">
                    Ver mejoras <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        {/* Buscador por problema */}
        <div className="bg-[#F5F5F5] rounded-2xl p-6 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-[#E10600]" />
            <h3 className="font-bold text-[#111111]">¿Tenés un problema?</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Describí qué le pasa a tu carro y te ayudamos a encontrar el repuesto
          </p>
          <a
            href={`https://wa.me/584122223775?text=Hola! Tengo un ${vehicleName} y tengo este problema: `}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Consultar por WhatsApp
          </a>
        </div>
        
        {/* Essentials - Lo más importante */}
        {essentials.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#111111]">Lo más importante</h2>
              <span className="text-sm text-gray-500">Seguridad y mantenimiento</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {essentials.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="bg-white border-2 border-gray-100 hover:border-[#E10600] rounded-xl p-4 text-center transition-all active:scale-95"
                >
                  <span className="text-3xl mb-2 block">{cat.emoji}</span>
                  <span className="font-semibold text-sm text-[#111111]">{cat.name}</span>
                  {!loading && categoryCounts[cat.id] > 0 && (
                    <span className="text-xs text-gray-500 block mt-1">
                      {categoryCounts[cat.id]} productos
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}
        
        {/* Reparación */}
        {repairs.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#111111]">Reparación</h2>
              <span className="text-sm text-gray-500">Sistemas mecánicos</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {repairs.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="bg-white border-2 border-gray-100 hover:border-[#111111] rounded-xl p-4 text-center transition-all active:scale-95"
                >
                  <span className="text-3xl mb-2 block">{cat.emoji}</span>
                  <span className="font-semibold text-sm text-[#111111]">{cat.name}</span>
                  {!loading && categoryCounts[cat.id] > 0 && (
                    <span className="text-xs text-gray-500 block mt-1">
                      {categoryCounts[cat.id]} productos
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}
        
        {/* Mejoras y accesorios */}
        {upgrades.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#111111]">Mejoras y accesorios</h2>
              <span className="text-sm text-gray-500">Personalización</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {upgrades.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="bg-white border-2 border-gray-100 hover:border-[#111111] rounded-xl p-4 text-center transition-all active:scale-95"
                >
                  <span className="text-3xl mb-2 block">{cat.emoji}</span>
                  <span className="font-semibold text-sm text-[#111111]">{cat.name}</span>
                  {!loading && categoryCounts[cat.id] > 0 && (
                    <span className="text-xs text-gray-500 block mt-1">
                      {categoryCounts[cat.id]} productos
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}
        
        {/* Ver todo */}
        <div className="text-center">
          <button
            onClick={handleFixItNow}
            className="inline-flex items-center gap-2 bg-[#111111] text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-colors"
          >
            Ver todos los repuestos
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
