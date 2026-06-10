import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Repuesto Hoy',
  description: 'Términos y condiciones de uso de repuestohoy.com',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-[#111111] mb-6">Términos y Condiciones</h1>
        <div className="prose prose-gray max-w-none text-[#374151] space-y-4 text-[15px] leading-relaxed">
          <p><strong>Última actualización:</strong> {new Date().getFullYear()}</p>

          <h2 className="text-xl font-bold text-[#111111] mt-8">1. Sobre nosotros</h2>
          <p>Repuesto Hoy (repuestohoy.com) es una tienda en línea de repuestos automotrices que opera en Caracas, Venezuela. Al usar este sitio aceptas estos términos.</p>

          <h2 className="text-xl font-bold text-[#111111] mt-8">2. Pedidos y disponibilidad</h2>
          <p>Los pedidos realizados a través del sitio están sujetos a confirmación de disponibilidad. Te contactaremos por WhatsApp o teléfono para confirmar tu pedido, el precio final y el tiempo de entrega. Los precios pueden estar sujetos a cambios hasta la confirmación del pedido.</p>

          <h2 className="text-xl font-bold text-[#111111] mt-8">3. Pagos</h2>
          <p>Aceptamos Pago Móvil y Zelle. El pedido se procesa una vez verificado el pago. Los comprobantes de pago enviados son verificados por nuestro equipo.</p>

          <h2 className="text-xl font-bold text-[#111111] mt-8">4. Entregas</h2>
          <p>Realizamos entregas en Caracas y zonas indicadas al momento de la compra. Los tiempos de entrega son estimados y pueden variar según disponibilidad y zona.</p>

          <h2 className="text-xl font-bold text-[#111111] mt-8">5. Compatibilidad de repuestos</h2>
          <p>Hacemos nuestro mejor esfuerzo por verificar la compatibilidad de cada repuesto con tu vehículo. Es responsabilidad del cliente confirmar los datos de su vehículo (marca, modelo, año y motor) al realizar el pedido.</p>

          <h2 className="text-xl font-bold text-[#111111] mt-8">6. Devoluciones</h2>
          <p>Si el repuesto recibido no corresponde a lo solicitado o presenta defectos de fábrica, contáctanos dentro de las 48 horas siguientes a la entrega para gestionar el cambio o la devolución.</p>

          <h2 className="text-xl font-bold text-[#111111] mt-8">7. Contacto</h2>
          <p>Para cualquier consulta sobre estos términos, escríbenos por WhatsApp o a través de los canales de contacto del sitio.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
