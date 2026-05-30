import type { Metadata } from 'next'
import BuscarClient from './BuscarClient'

export const metadata: Metadata = {
  title: 'Buscar repuestos | Repuesto Hoy',
  description: 'Busca repuestos para tu carro por marca, modelo, año y categoría. Entrega same-day en Caracas.',
  keywords: 'buscar repuestos, autopartes Caracas, repuestos Toyota, repuestos Chevrolet',
  openGraph: {
    title: 'Buscar repuestos | Repuesto Hoy',
    description: 'Busca repuestos para tu carro por marca, modelo, año y categoría.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://repuestohoy.com/buscar',
  },
}

// Sistema: Original / Genérico
export default function BuscarPage() {
  return <BuscarClient />
}
