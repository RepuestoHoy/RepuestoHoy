import type { Metadata } from 'next'
import CheckoutClient from './CheckoutClient'

export const metadata: Metadata = {
  title: 'Finalizar compra | Repuesto Hoy',
  description: 'Completa tu pedido. Entrega same-day en Caracas. Pago Móvil, Zelle o efectivo.',
  keywords: 'checkout, finalizar compra, pago repuestos Caracas',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://repuestohoy.com/checkout',
  },
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
