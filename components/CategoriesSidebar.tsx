'use client'

import { useEffect } from 'react'
import { X, MessageCircle } from 'lucide-react'
import { BUSINESS_CONFIG } from '@/lib/config'

// Slugs REALES de las categorías del sitio (coinciden con Supabase y /buscar)
const MAS_BUSCADOS = [
  { label: 'Filtros de aceite', slug: 'filtros' },
  { label: 'Pastillas de freno', slug: 'frenos' },
  { label: 'Baterías', slug: 'bateria' },
  { label: 'Bujías', slug: 'bujias' },
  { label: 'Aceite de motor', slug: 'aceites' },
]

const CATEGORIAS = [
  { label: 'Frenos y Suspensión', slug: 'frenos' },
  { label: 'Motor y Transmisión', slug: 'motor' },
  { label: 'Sistema Eléctrico', slug: 'sensores' },
  { label: 'Enfriamiento', slug: 'enfriamiento' },
  { label: 'Dirección', slug: 'direccion' },
  { label: 'Neumáticos', slug: 'neumaticos' },
  { label: 'Carrocería y Exterior', slug: 'exterior' },
  { label: 'Interior y Accesorios', slug: 'interior' },
  { label: 'Herramientas', slug: 'herramientas' },
]

const POR_NECESIDAD = [
  { label: 'Mantenimiento preventivo', slug: 'filtros' },
  { label: 'Falla / Check Engine', slug: 'sensores' },
  { label: 'Preparación para viaje largo', slug: 'neumaticos' },
  { label: 'Mejora de rendimiento', slug: 'motor' },
]

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function CategoriesSidebar({ isOpen, onClose }: Props) {
  // Cerrar con tecla Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const SOPORTE = [
    { label: 'Hablar por WhatsApp', href: `https://wa.me/${BUSINESS_CONFIG.whatsapp}` },
    { label: 'Preguntas frecuentes', href: '/faq' },
  ]

  return (
    <>
      {/* Fondo oscurecido */}
      <div
        className="fixed inset-0 bg-black/60 z-[60]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel lateral */}
      <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#111111] z-[70] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-[#111111]">
          <span className="font-bold text-white">Repuestos</span>
          <button onClick={onClose} aria-label="Cerrar menú" className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Más buscados */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Más buscados</p>
            <ul className="space-y-1">
              {MAS_BUSCADOS.map((item) => (
                <li key={item.label}>
                  <a
                    href={`/buscar?category=${item.slug}`}
                    onClick={onClose}
                    className="block text-sm text-gray-200 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-gray-800" />

          {/* Categorías principales */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categorías principales</p>
            <ul className="space-y-1">
              {CATEGORIAS.map((cat) => (
                <li key={cat.label}>
                  <a
                    href={`/buscar?category=${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between text-sm text-gray-200 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition"
                  >
                    {cat.label}
                    <span className="text-gray-500">›</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-gray-800" />

          {/* Por necesidad */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Por necesidad</p>
            <ul className="space-y-1">
              {POR_NECESIDAD.map((item) => (
                <li key={item.label}>
                  <a
                    href={`/buscar?category=${item.slug}`}
                    onClick={onClose}
                    className="block text-sm text-gray-200 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-gray-800" />

          {/* Ayuda y soporte */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Ayuda y soporte</p>
            <ul className="space-y-1">
              {SOPORTE.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onClick={onClose}
                    className="flex items-center gap-2 text-sm text-gray-200 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition"
                  >
                    {item.href.startsWith('http') && <MessageCircle className="w-4 h-4 text-green-500" />}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
