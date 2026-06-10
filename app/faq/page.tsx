import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BUSINESS_CONFIG } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | Repuesto Hoy',
  description: 'Respuestas sobre envíos, pagos, devoluciones y compatibilidad de repuestos.',
}

const FAQS = [
  {
    q: '¿En qué zonas entregan el mismo día?',
    a: 'Entregamos el mismo día en Chacao, Baruta, El Hatillo, Altamira y Las Mercedes. Si estás en otra zona de Caracas, escríbenos por WhatsApp y coordinamos la entrega.',
  },
  {
    q: '¿Cómo sé si el repuesto es compatible con mi carro?',
    a: 'Selecciona tu marca, modelo y año en el buscador y te mostramos solo los repuestos compatibles. Si tienes dudas, escríbenos por WhatsApp con los datos de tu vehículo y te confirmamos antes de comprar.',
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Aceptamos Pago Móvil y Zelle. Al finalizar tu pedido te indicamos los datos y subes el comprobante; verificamos y procesamos tu pedido de inmediato.',
  },
  {
    q: '¿Cómo rastreo mi pedido?',
    a: 'Escríbenos por WhatsApp con tu número de orden y te decimos el estado de tu entrega al momento.',
  },
  {
    q: '¿Puedo devolver un repuesto?',
    a: 'Sí. Si el repuesto no corresponde a lo solicitado o tiene defecto de fábrica, contáctanos dentro de las 48 horas siguientes a la entrega y gestionamos el cambio o la devolución.',
  },
  {
    q: '¿Venden repuestos originales o genéricos?',
    a: 'Trabajamos ambos. Cada producto indica si es Original (OEM) o Genérico, con su marca y descripción, para que elijas según tu presupuesto.',
  },
  {
    q: '¿Qué hago si no encuentro el repuesto que busco?',
    a: 'Escríbenos por WhatsApp con el nombre de la pieza y los datos de tu vehículo. Tenemos una red de proveedores y te lo conseguimos.',
  },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-[#111111] mb-2">Preguntas frecuentes</h1>
        <p className="text-gray-500 mb-8">Envíos, pagos, devoluciones y más.</p>

        <div className="space-y-4">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group border border-gray-200 rounded-xl p-4 open:shadow-sm"
            >
              <summary className="font-semibold text-[#111111] cursor-pointer list-none flex items-center justify-between">
                {item.q}
                <span className="text-[#FF6A00] text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-[#F2F2F2] p-6 text-center">
          <p className="font-semibold text-[#111111] mb-1">¿No encontraste tu respuesta?</p>
          <p className="text-sm text-gray-600 mb-4">Escríbenos y te ayudamos a conseguir la pieza correcta.</p>
          <a
            href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#FF6A00] hover:bg-[#E55A00] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            💬 Hablar por WhatsApp
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
