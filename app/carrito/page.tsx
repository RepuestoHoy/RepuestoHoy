import type { Metadata } from 'next'
import CarritoClient from './CarritoClient'

export const metadata: Metadata = {
  title: 'Carrito | Repuesto Hoy',
  description: 'Revisa los productos en tu carrito y procede al checkout.',
  keywords: 'carrito de compras, repuestos Caracas',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://repuestohoy.com/carrito',
  },
}

export default function CarritoPage() {
  return <CarritoClient />
}
