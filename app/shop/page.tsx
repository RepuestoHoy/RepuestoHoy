'use client'

import { Suspense } from 'react'
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { 
  Wrench, Sparkles, ArrowRight, MessageCircle, AlertCircle
} from 'lucide-react'
import { 
  BrakeIcon, FilterIcon, BatteryIcon, OilIcon, SparkPlugIcon, TireIcon,
  SuspensionIcon, CoolingIcon, EngineIcon, SensorIcon, AudioIcon, LightIcon,
  InteriorIcon, ExteriorIcon, SecurityIcon, ToolIcon
} from '@/components/CategoryIcons'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

// Categorías con íconos SVG personalizados - Colores consistentes con la marca
const CATEGORY_GROUPS = [
  {
    title: 'Mantenimiento Esencial',
    description: 'Lo que tu carro necesita regularmente',
    items: [
      { id: 'frenos', name: 'Frenos', icon: BrakeIcon, color: 'from-[#E10600] to-[#B00500]', desc: 'Pastillas, discos' },
      { id: 'filtros', name: 'Filtros', icon: FilterIcon, color: 'from-[#E10600] to-[#B00500]', desc: 'Aceite, aire, gasolina' },
      { id: 'bateria', name: 'Batería', icon: BatteryIcon, color: 'from-[#E10600] to-[#B00500]', desc: 'Baterías y cables' },
      { id: 'aceites', name: 'Aceites', icon: OilIcon, color: 'from-[#E10600] to-[#B00500]', desc: 'Motor, caja' },
      { id: 'bujias', name: 'Bujías', icon: SparkPlugIcon, color: 'from-[#E10600] to-[#B00500]', desc: 'Encendido' },
      { id: 'neumaticos', name: 'Neumáticos', icon: TireIcon, color: 'from-[#E10600] to-[#B00500]', desc: 'Cauchos' },
    ]
  },
  {
    title: 'Reparación',
    description: 'Cuando algo necesita arreglo',
    items: [
      { id: 'suspension', name: 'Suspensión', icon: SuspensionIcon, color: 'from-[#111111] to-[#2A2A2A]', desc: 'Amortiguadores' },
      { id: 'enfriamiento', name: 'Enfriamiento', icon: CoolingIcon, color: 'from-[#111111] to-[#2A2A2A]', desc: 'Radiador' },
      { id: 'motor', name: 'Motor', icon: EngineIcon, color: 'from-[#111111] to-[#2A2A2A]', desc: 'Correas, juntas' },
      { id: 'sensores', name: 'Sensores', icon: SensorIcon, color: 'from-[#111111] to-[#2A2A2A]', desc: 'Check engine' },
    ]
  },
  {
    title: 'Mejoras & Accesorios',
    description: 'Personaliza tu carro',
    items: [
      { id: 'audio', name: 'Audio', icon: AudioIcon, color: 'from-[#E10600] to-[#B00500]', desc: 'Parlantes, radio' },
      { id: 'iluminacion', name: 'Iluminación', icon: LightIcon, color: 'from-[#E10600] to-[#B00500]', desc: 'LED, faros' },
      { id: 'interior', name: 'Interior', icon: InteriorIcon, color: 'from-[#E10600] to-[#B00500]', desc: 'Cubreasientos' },
      { id: 'exterior', name: 'Exterior', icon: ExteriorIcon, color: 'from-[#E10600] to-[#B00500]', desc: 'Estribos, spoilers' },
      { id: 'seguridad', name: 'Seguridad', icon: SecurityIcon, color: 'from-[#111111] to-[#2A2A2A]', desc: 'Cámaras, alarmas' },
      { id: 'herramientas', name: 'Herramientas', icon: ToolIcon, color: 'from-[#111111] to-[#2A2A2A]', desc: 'Kit de emergencia' },
    ]
  }
]

function ShopContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  const brand = searchParams?.get('brand') || ''
  const model = searchParams?.get('model') || ''
  const year = searchParams?.get('year') || ''
  
  const vehicleName = brand && model ? `${brand} ${model} ${year}` : 'tu vehículo'
  
  // Filtrar categorías basado en la búsqueda
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORY_GROUPS
    
    const query = searchQuery.toLowerCase()
    return CATEGORY_GROUPS.map(group => ({
      ...group,
      items: group.items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query)
      )
    })).filter(group => group.items.length > 0)
  }, [searchQuery])
  
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
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center text-[#E10600]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-[#111111] mb-4">Selecciona tu vehiculo</h1>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
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
        
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar categoría... (ej: cauchos, frenos, etc.)"
              className="w-full px-5 py-4 pl-12 bg-white border-2 border-gray-200 rounded-2xl text-[#111111] placeholder-gray-400 focus:outline-none focus:border-[#E10600] transition-colors text-lg"
            />
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-center text-sm text-gray-500 mt-2">
              {filteredGroups.reduce((acc, group) => acc + group.items.length, 0)} categorías encontradas
            </p>
          )}
        </div>

        {/* Grupos de categorías estilo CARiD */}
        {filteredGroups.map((group) => (
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
                    className={`card p-5 text-center hover:border-[#E10600] hover:shadow-xl transition-all group bg-white ${!hasProducts ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {/* Icono en rojo como el landing page */}
                    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center text-[#E10600] group-hover:scale-110 transition-transform">
                      <Icon className="w-10 h-10" />
                    </div>
                    
                    {/* Nombre de la categoría */}
                    <h3 className="font-bold text-[#111111] text-sm uppercase mb-1 group-hover:text-[#E10600] transition-colors">
                      {item.name}
                    </h3>
                    
                    {/* Descripción */}
                    <p className="text-xs text-[#6B7280]">{item.desc}</p>
                    
                    {/* Contador de productos (opcional, debajo) */}
                    {!loading && count > 0 && (
                      <span className="inline-block mt-2 text-xs text-[#E10600] font-semibold">
                        {count} productos
                      </span>
                    )}
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
