import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CARS } from '@/lib/data'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    brand: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand } = await params
  const brandDecoded = decodeURIComponent(brand).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  const title = `Repuestos ${brandDecoded} | Todos los modelos | Repuesto Hoy`
  const description = `Encuentra repuestos para todos los modelos de ${brandDecoded}. Frenos, filtros, bujías, aceites y más con entrega el mismo día en Caracas.`
  
  return {
    title,
    description,
    keywords: `${brandDecoded}, repuestos ${brandDecoded}, autopartes ${brandDecoded}, repuestos Caracas, ${brandDecoded} Venezuela`,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'es_VE',
      url: `https://repuestohoy.com/marca/${brand}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://repuestohoy.com/marca/${brand}`,
    },
  }
}

// Generate static params
export async function generateStaticParams() {
  return CARS.map((car) => ({
    brand: car.brand.toLowerCase().replace(/\s+/g, '-'),
  }))
}

// Schema.org structured data
function generateSchema(brand: string, models: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Repuestos para ${brand}`,
    description: `Catálogo de repuestos para todos los modelos de ${brand}`,
    url: `https://repuestohoy.com/marca/${brand.toLowerCase().replace(/\s+/g, '-')}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: models.map((model, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${brand} ${model}`,
        url: `https://repuestohoy.com/marca/${brand.toLowerCase().replace(/\s+/g, '-')}/${model.toLowerCase().replace(/\s+/g, '-')}`,
      }))
    }
  }
}

export default async function CarBrandPage({ params }: PageProps) {
  const { brand } = await params
  
  // Decode and format brand
  const brandDecoded = decodeURIComponent(brand).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  // Validate brand exists
  const carData = CARS.find(c => c.brand === brandDecoded)
  if (!carData) {
    notFound()
  }

  const schemaData = generateSchema(brandDecoded, carData.models)

  // Get brand logo/emoji based on brand
  const getBrandEmoji = (brand: string) => {
    const emojis: Record<string, string> = {
      'Toyota': '🚙',
      'Chevrolet': '🚘',
      'Ford': '🛻',
      'Jeep': '🚙',
      'Chery': '🚗',
      'Hyundai': '🚙',
    }
    return emojis[brand] || '🚗'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-red-600">Inicio</Link></li>
              <li>/</li>
              <li className="text-gray-900 font-medium">{brandDecoded}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{getBrandEmoji(brandDecoded)}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Repuestos {brandDecoded}
                </h1>
                <p className="text-gray-600 mt-1">
                  {carData.models.length} modelos disponibles • Años {Math.min(...carData.years)}-{Math.max(...carData.years)}
                </p>
              </div>
            </div>
            <p className="text-gray-600">
              Selecciona tu modelo de {brandDecoded} para ver los repuestos compatibles. 
              Todos los productos con entrega el mismo día en Caracas.
            </p>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {carData.models.map((model) => (
              <Link
                key={model}
                href={`/marca/${brand}/${model.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-red-600 transition-colors">
                      {model}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {carData.years.length} años disponibles
                    </p>
                  </div>
                  <span className="text-2xl text-gray-300 group-hover:text-red-500 transition-colors">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* SEO Content */}
          <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Repuestos para {brandDecoded} en Caracas
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600">
              <p className="mb-4">
                En Repuesto Hoy tenemos el inventario más completo de repuestos para {brandDecoded} en Caracas. 
                Trabajamos con todas las líneas de {brandDecoded} desde {Math.min(...carData.years)} hasta {Math.max(...carData.years)}.
              </p>
              <p className="mb-4">
                Nuestro catálogo incluye: frenos, filtros de aceite y aire, bujías, baterías, 
                aceites, amortiguadores, y mucho más. Todos los productos son compatibles garantizados 
                y cuentan con garantía de calidad.
              </p>
              <p>
                Realizamos entregas el mismo día en toda el área metropolitana de Caracas. 
                También puedes retirar en nuestro punto de atención sin costo adicional.
              </p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}