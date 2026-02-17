'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { 
  Wrench, Sparkles, ArrowRight, MessageCircle, AlertCircle,
  Disc, Battery, Zap, Droplets, CircleDot, Wind, Thermometer,
  Settings, Radio, Lightbulb, Armchair, Home, Shield
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

// Categorías con íconos grandes estilo CARiD
const CATEGORY_GROUPS = [
  {
    title: 'Mantenimiento Esencial',
    description: 'Lo que tu carro necesita regularmente',
    items: [
      { id: 'frenos', name: 'Frenos', icon: Disc, color: 'from-red-500 to-red-600', desc: 'Pastillas, discos' },
      { id: 'filtros', name: 'Filtros', icon: Wind, color: 'from-blue-500 to-blue-600', desc: 'Aceite, aire, gasolina' },
      { id: 'bateria', name: 'Batería', icon: Battery, color: 'from-green-500 to-green-600', desc: 'Baterías y cables' },
      { id: 'aceites', name: 'Aceites', icon: Droplets, color: 'from-amber-500 to-amber-600', desc: 'Motor, caja' },
      { id: 'bujias', name: 'Bujías', icon: Zap, color: 'from-purple-500 to-purple-600', desc: 'Encendido' },
      { id: 'neumaticos', name: 'Neumáticos', icon: CircleDot, color: 'from-gray-600 to-gray-700', desc: 'Cauchos' },
    ]
  },
  {
    title: 'Reparación',
    description: 'Cuando algo necesita arreglo',
    items: [
      { id: 'suspension', name: 'Suspensión', icon: Settings, color: 'from-slate-500 to-slate-600', desc: 'Amortiguadores' },
      { id: 'enfriamiento', name: 'Enfriamiento', icon: Thermometer, color: 'from-cyan-500 to-cyan-600', desc: 'Radiador' },
      { id: 'motor', name: 'Motor', icon: Wrench, color: 'from-orange-500 to-orange-600', desc: 'Correas, juntas' },
      { id: 'sensores', name: 'Sensores', icon: Radio, color: 'from-indigo-500 to-indigo-600', desc: 'Check engine' },
    ]
  },
  {
    title: 'Mejoras & Accesorios',
    description: 'Personaliza tu carro',
    items: [
      { id: 'audio', name: 'Audio', icon: Radio, color: 'from-pink-500 to-pink-600', desc: 'Parlantes, radio' },
      { id: 'iluminacion', name: 'Iluminación', icon: Lightbulb, color: 'from-yellow-400 to-yellow-500', desc: 'LED, faros' },
      { id: 'interior', name: 'Interior', icon: Armchair, color: 'from-teal-500 to-teal-600', desc: 'Cubreasientos' },
      { id: 'exterior', name: 'Exterior', icon: Home, color: 'from-emerald-500 to-emerald-600', desc: 'Estribos, spoilers' },
      { id: 'seguridad', name: 'Seguridad', icon: Shield, color: 'from-rose-500 to-rose-600', desc: 'Cámaras, alarmas' },
      { id: 'herramientas', name: 'Herramientas', icon: Wrench, color: 'from-stone-500 to-stone-600', desc: 'Kit de emergencia' },
    ]
  }
]

function ShopContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  
  const brand = searchParams?.get('brand') || ''
  const model = searchParams?.get('model') || ''
  const year = searchParams?.get('year') || ''
  
  const vehicleName = brand && model ? `${brand} ${model} ${year}` : 'tu vehículo'
  
  useEffect(() => {
    if (!brand || !model || !year) {
      router.push('/')
      return
    }
    
    const fetchCounts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('category_id')
          .eq('is_available', true)
          .gt('stock', 0)
        
        if (!error && data) {
          const counts: Record<string, number> = {}
          data.forEach((p: any) => {
            counts[p.category_id] = (counts[p.category_id] || 0) + 1
          })
          setCategoryCounts(counts)
        }
      } catch (err) {
        console.error('Error:', err)
      }
      setLoading(false)
    }
    
    fetchCounts()
  }, [brand, model, year, router])
  
  const handleCategoryClick = (categoryId: string) => {
    router.push(`/buscar?brand=${brand}&model=${model}&year=${year}&category=${categoryId}`)
  }
  
  const handleBrowseAll = () => {
    router.push(`/buscar?brand=${brand}&model=${model}&year=${year}`)
  }
  
  if (!brand || !model || !year) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🚗</div>
          <h1 className="text-2xl font-bold text-[#111111] mb-4">Selecciona tu vehículo</h1>
          <Link href="/" className="bg-[#E10600] text-white px-8 py-4 rounded-xl font-bold inline-block">
            Ir al inicio
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <>
      {/* Header estilo CARiD con vehículo */}
      <div className="bg-[#111111] text-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Mostrando repuestos para:</p>
                <p className="font-bold text-xl">{vehicleName}</p>
              </div>
            </div>
            <Link href="/" className="text-sm text-gray-400 hover:text-white underline">
              Cambiar vehículo
            </Link>
          </div>
        </div>
      </div>
      
      {/* Barra de navegación rápida */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button 
              onClick={handleBrowseAll}
              className="bg-[#E10600] text-white px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap"
            >
              Ver Todo
            </button>
            {CATEGORY_GROUPS.map(group => (
              <a 
                key={group.title}
                href={`#${group.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-gray-100 hover:bg-gray-200 text-[#111111] px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                {group.title}
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Banner de ayuda */}
        <div className="bg-gradient-to-r from-[#E10600] to-[#B00500] rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg">¿No sabes qué necesitas?</h3>
                <p className="text-white/90">Escríbenos por WhatsApp y te ayudamos</p>
              </div>
            </div>
            <a
              href={`https://wa.me/584122223775?text=Hola! Tengo un ${vehicleName} y necesito ayuda para encontrar un repuesto.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#E10600] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Consultar ahora
            </a>
          </div>
        </div>
        
        {/* Grupos de categorías estilo CARiD */}
        {CATEGORY_GROUPS.map((group) => (
          <section 
            key={group.title}
            id={group.title.toLowerCase().replace(/\s+/g, '-')}
            className="mb-12"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#111111]">{group.title}</h2>
              <p className="text-gray-500">{group.description}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {group.items.map((item) => {
                const count = categoryCounts[item.id] || 0
                const Icon = item.icon
                const hasProducts = count > 0 || loading
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleCategoryClick(item.id)}
                    disabled={!hasProducts}
                    className={`group text-left transition-all ${!hasProducts ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                  >
                    <div className={`aspect-square rounded-2xl bg-gradient-to-br ${item.color} p-4 mb-3 flex flex-col justify-between relative overflow-hidden ${hasProducts ? 'group-hover:shadow-xl group-hover:scale-[1.02]' : ''} transition-all`}>
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white rounded-full"></div>
                      </div>
                      
                      {/* Icon */}
                      <div className="relative z-10">
                        <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                      </div>
                      
                      {/* Product count badge */}
                      {!loading && count > 0 && (
                        <div className="relative z-10">
                          <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {count} productos
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-[#111111] group-hover:text-[#E10600] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
        
        {/* CTA Final */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-[#111111] mb-3">
            ¿No encuentras lo que buscas?
          </h3>
          <p className="text-gray-600 mb-6">
            Tenemos más repuestos disponibles. Escríbenos y te conseguimos lo que necesitas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleBrowseAll}
              className="inline-flex items-center justify-center gap-2 bg-[#111111] text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors"
            >
              Ver todos los repuestos
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href={`https://wa.me/584122223775?text=Hola! Busco un repuesto para mi ${vehicleName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </main>
    </>
  )
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Suspense fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#E10600] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      }>
        <ShopContent />
      </Suspense>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
