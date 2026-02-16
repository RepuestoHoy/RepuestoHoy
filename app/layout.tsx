import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Repuesto Hoy | Repuestos para tu carro en Caracas',
  description: 'Encuentra repuestos para tu carro al mejor precio. Entrega same-day en Caracas. Toyota, Chevrolet, Ford, Jeep, Chery y más.',
  keywords: 'repuestos, Caracas, Toyota, Corolla, Chevrolet, Aveo, autopartes',
  openGraph: {
    title: 'Repuesto Hoy',
    description: 'Repuestos para tu carro con entrega el mismo día en Caracas',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}