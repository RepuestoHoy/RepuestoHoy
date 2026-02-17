import { BUSINESS_CONFIG } from '@/lib/config'
import { Car, MapPin, Phone, Mail, Clock, Shield, Truck, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer-dark">
      {/* Features Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#E10600]" />
              </div>
              <div>
                <p className="font-semibold text-sm">Envío Rápido</p>
                <p className="text-xs text-gray-500">Mismo día en Caracas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#E10600]" />
              </div>
              <div>
                <p className="font-semibold text-sm">Piezas verificadas</p>
                <p className="text-xs text-gray-500">Marcas confiables seleccionadas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-[#E10600]" />
              </div>
              <div>
                <p className="font-semibold text-sm">Asesoria tecnica</p>
                <p className="text-xs text-gray-500">Confirmamos compatibilidad antes de enviar</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#E10600]" />
              </div>
              <div>
                <p className="font-semibold text-sm">Atención Personal</p>
                <p className="text-xs text-gray-500">WhatsApp directo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-[#E10600] to-[#B00500] rounded-xl flex items-center justify-center shadow-lg">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg">{BUSINESS_CONFIG.name}</h4>
                <p className="text-xs text-gray-500">{BUSINESS_CONFIG.tagline}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Repuestos de calidad para tu carro con entrega el mismo día en Caracas. 
              Precios justos, calidad real.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-sm uppercase tracking-wider mb-4">Enlaces</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/buscar" className="text-gray-400 hover:text-white transition-colors">
                  Buscar Repuestos
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="text-gray-400 hover:text-white transition-colors">
                  Mi Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-bold text-sm uppercase tracking-wider mb-4">Categorías</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/buscar?category=filtros" className="text-gray-400 hover:text-white transition-colors">
                  🔧 Filtros
                </Link>
              </li>
              <li>
                <Link href="/buscar?category=frenos" className="text-gray-400 hover:text-white transition-colors">
                  🛑 Frenos
                </Link>
              </li>
              <li>
                <Link href="/buscar?category=motor" className="text-gray-400 hover:text-white transition-colors">
                  ⚡ Motor
                </Link>
              </li>
              <li>
                <Link href="/buscar?category=suspension" className="text-gray-400 hover:text-white transition-colors">
                  ⬆️ Suspensión
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-bold text-sm uppercase tracking-wider mb-4">Contacto</h5>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#E10600] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">{BUSINESS_CONFIG.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#E10600] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">{BUSINESS_CONFIG.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E10600] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">Caracas, Venezuela</span>
              </li>
            </ul>
            
            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '584122223775'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {BUSINESS_CONFIG.year} {BUSINESS_CONFIG.name}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">
              Términos
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
