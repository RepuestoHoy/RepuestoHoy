import { BUSINESS_CONFIG } from '@/lib/config'
import { Car } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-11 h-11 bg-[#E10600] rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">{BUSINESS_CONFIG.name}</h4>
              <p className="text-sm text-gray-500">{BUSINESS_CONFIG.tagline}</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-500 text-sm">Contacto</p>
            <p className="font-semibold">{BUSINESS_CONFIG.email}</p>
            <p className="text-sm text-gray-500">{BUSINESS_CONFIG.phone}</p>
          </div>
        </div>
        <div className="border-t border-[#2A2A2A] pt-8 text-center text-sm text-gray-600">
          © {BUSINESS_CONFIG.year} {BUSINESS_CONFIG.name}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
