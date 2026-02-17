import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/components/CartContext'
import ToastContainer from '@/components/ToastContainer'
import { BUSINESS_CONFIG } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Repuesto Hoy | Repuestos para tu carro en Caracas',
  description: 'Encuentra repuestos para tu carro al mejor precio. Entrega el mismo día en Caracas. Toyota, Chevrolet, Ford, Jeep, Chery y más.',
  keywords: 'repuestos, Caracas, Toyota, Corolla, Chevrolet, Aveo, autopartes, repuestos carros Venezuela',
  openGraph: {
    title: 'Repuesto Hoy',
    description: 'Repuestos para tu carro con entrega el mismo día en Caracas',
    type: 'website',
    locale: 'es_VE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Repuesto Hoy',
    description: 'Repuestos para tu carro con entrega el mismo día en Caracas',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://repuestohoy.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${BUSINESS_CONFIG.analytics?.gaId || 'G-XXXXXXXXXX'}`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${BUSINESS_CONFIG.analytics?.gaId || 'G-XXXXXXXXXX'}');
            `
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        <CartProvider>
          {children}
          <ToastContainer />
        </CartProvider>
      </body>
    </html>
  )
}
