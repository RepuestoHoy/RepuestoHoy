import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Repuesto Hoy',
  description: 'Política de privacidad de repuestohoy.com',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-[#111111] mb-6">Política de Privacidad</h1>
        <div className="prose prose-gray max-w-none text-[#374151] space-y-4 text-[15px] leading-relaxed">
          <p><strong>Última actualización:</strong> {new Date().getFullYear()}</p>

          <h2 className="text-xl font-bold text-[#111111] mt-8">1. Datos que recopilamos</h2>
          <p>Al hacer un pedido recopilamos: tu nombre, teléfono, correo electrónico (opcional), dirección de entrega y los datos de tu vehículo. Estos datos son necesarios para procesar y entregar tu pedido.</p>

          <h2 className="text-xl font-bold text-[#111111] mt-8">2. Cómo usamos tus datos</h2>
          <p>Usamos tu información únicamente para: procesar tus pedidos, contactarte sobre el estado de tu compra, coordinar la entrega y brindarte soporte. No vendemos ni compartimos tus datos con terceros con fines publicitarios.</p>

          <h2 className="text-xl font-bold text-[#111111] mt-8">3. Protección de tus datos</h2>
          <p>Tus datos se almacenan de forma segura y el acceso está restringido únicamente al equipo de Repuesto Hoy. Aplicamos medidas técnicas para proteger tu información contra accesos no autorizados.</p>

          <h2 className="text-xl font-bold text-[#111111] mt-8">4. Pagos</h2>
          <p>No almacenamos datos de tarjetas. Los pagos se realizan por Pago Móvil o Zelle directamente; solo guardamos el comprobante que nos envíes para verificar tu pago.</p>

          <h2 className="text-xl font-bold text-[#111111] mt-8">5. Tus derechos</h2>
          <p>Puedes solicitar la corrección o eliminación de tus datos personales en cualquier momento contactándonos por WhatsApp o por los canales del sitio.</p>

          <h2 className="text-xl font-bold text-[#111111] mt-8">6. Contacto</h2>
          <p>Si tienes preguntas sobre esta política, escríbenos por los canales de contacto disponibles en el sitio.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
