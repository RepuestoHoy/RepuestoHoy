import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/components/CartContext'
import ToastContainer from '@/components/ToastContainer'
import { BUSINESS_CONFIG } from '@/lib/config'
import Script from 'next/script'

export const metadata: Metadata = {
  metadataBase: new URL('https://repuestohoy.com'),
  title: {
    default: 'Repuesto Hoy | Repuestos para Carros en Caracas - Entrega el Mismo Día',
    template: '%s | Repuesto Hoy'
  },
  description: 'Encuentra repuestos para tu carro al mejor precio en Caracas. Frenos, filtros, bujías, aceites y más. Entrega el mismo día. Toyota, Chevrolet, Ford, Jeep, Chery, Hyundai y todas las marcas.',
  keywords: [
    'repuestos Caracas',
    'repuestos Toyota',
    'repuestos Chevrolet',
    'autopartes Venezuela',
    'frenos carro',
    'filtros aceite',
    'bujías',
    'baterías carro',
    'aceite motor',
    'repuestos same day',
    'repuestos entrega inmediata',
    'tienda repuestos Caracas',
    'repuestos Ford',
    'repuestos Jeep',
    'repuestos Chery',
    'repuestos Hyundai'
  ],
  authors: [{ name: 'Repuesto Hoy' }],
  creator: 'Repuesto Hoy',
  publisher: 'Repuesto Hoy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Repuesto Hoy - Repuestos para Carros en Caracas',
    description: 'Repuestos para tu carro con entrega el mismo día en Caracas. Toyota, Chevrolet, Ford, Jeep, Chery y más. Frenos, filtros, bujías, aceites y baterías.',
    type: 'website',
    locale: 'es_VE',
    url: 'https://repuestohoy.com',
    siteName: 'Repuesto Hoy',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Repuesto Hoy - Repuestos para carros en Caracas'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Repuesto Hoy - Repuestos para Carros en Caracas',
    description: 'Repuestos para tu carro con entrega el mismo día. Toyota, Chevrolet, Ford y más marcas.',
    images: ['/og-image.jpg'],
    creator: '@repuestohoy',
    site: '@repuestohoy'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://repuestohoy.com',
    languages: {
      'es-VE': 'https://repuestohoy.com',
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  },
  category: 'automotive',
}

// Schema.org - Organization (LocalBusiness)
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness', 'AutoPartsStore'],
  name: 'Repuesto Hoy',
  url: 'https://repuestohoy.com',
  logo: 'https://repuestohoy.com/logo.png',
  description: 'Tienda de repuestos para carros en Caracas. Frenos, filtros, bujías, aceites y baterías con entrega el mismo día.',
  image: 'https://repuestohoy.com/og-image.jpg',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Caracas',
    addressRegion: 'Distrito Capital',
    addressCountry: 'VE',
    streetAddress: 'Caracas, Venezuela'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 10.4806,
    longitude: -66.9036
  },
  telephone: '+58-412-2223775',
  whatsapp: '+58-412-2223775',
  email: 'ventas@repuestohoy.com',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+58-412-2223775',
    contactType: 'customer service',
    availableLanguage: ['Spanish'],
    areaServed: 'Caracas, Venezuela',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:00'
    }
  },
  sameAs: [
    'https://instagram.com/repuestohoy',
    'https://facebook.com/repuestohoy'
  ],
  openingHours: ['Mo-Sa 08:00-18:00'],
  priceRange: '$$',
  paymentAccepted: 'Efectivo, Pago Móvil, Zelle',
  currenciesAccepted: 'USD, VES',
  areaServed: {
    '@type': 'City',
    name: 'Caracas',
    containedInPlace: {
      '@type': 'Country',
      name: 'Venezuela'
    }
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Repuestos Automotrices',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Frenos',
          description: 'Pastillas y discos de freno'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Filtros',
          description: 'Filtros de aceite, aire y gasolina'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Bujías',
          description: 'Bujías para todo tipo de vehículos'
        }
      }
    ]
  }
}

// Schema.org - WebSite
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Repuesto Hoy',
  url: 'https://repuestohoy.com',
  description: 'Tienda online de repuestos para carros en Caracas. Entrega el mismo día.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://repuestohoy.com/buscar?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  },
  inLanguage: 'es-VE'
}

// Schema.org - BreadcrumbList (Home)
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: 'https://repuestohoy.com'
    }
  ]
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
        
        {/* Schema.org - Organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        
        {/* Schema.org - WebSite */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        
        {/* Schema.org - BreadcrumbList */}
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
