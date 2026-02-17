import type { Metadata } from 'next'
import GraciasClient from './GraciasClient'

export const metadata: Metadata = {
  title: 'Pedido confirmado | Repuesto Hoy',
  description: 'Gracias por tu compra. Te contactaremos pronto para coordinar la entrega.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function GraciasPage() {
  return <GraciasClient />
}
