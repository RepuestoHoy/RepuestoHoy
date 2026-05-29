import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CARS } from '@/lib/data'
import { getToyotaModelDetail } from '@/lib/toyota-generations'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    brand: string
    model: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand, model } = await params
  const brandDecoded = decodeURIComponent(brand).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const modelDecoded = decodeURIComponent(model).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  const title = `Repuestos ${brandDecoded} ${modelDecoded} | Todos los años | Repuesto Hoy`
  const description = `Encuentra repuestos para ${brandDecoded} ${modelDecoded} de todos los años. Frenos, filtros, bujías y más con entrega el mismo día en Caracas.`
  
  return {
    title,
    description,
    keywords: `${brandDecoded} ${modelDecoded}, repuestos ${brandDecoded}, autopartes ${modelDecoded}, repuestos Caracas`,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'es_VE',
      url: `https://repuestohoy.com/marca/${brand}/${model}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://repuestohoy.com/marca/${brand}/${model}`,
    },
  }
}

// Generate static params
export async function generateStaticParams() {
  const params: { brand: string; model: string }[] = []
  
  for (const car of CARS) {
    const brandSlug = car.brand.toLowerCase().replace(/\s+/g, '-')
    
    for (const model of car.models) {
      const modelSlug = model.toLowerCase().replace(/\s+/g, '-')
      params.push({ brand: brandSlug, model: modelSlug })
    }
  }
  
  return params
}

// Schema.org structured data
function generateSchema(brand: string, model: string, years: number[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Repuestos para ${brand} ${model}`,
    description: `Catálogo de repuestos para ${brand} ${model} - Años disponibles: ${years.join(', ')}`,
    url: `https://repuestohoy.com/marca/${brand.toLowerCase().replace(/\s+/g, '-')}/${model.toLowerCase().replace(/\s+/g, '-')}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: years.map((year, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${brand} ${model} ${year}`,
        url: `https://repuestohoy.com/marca/${brand.toLowerCase().replace(/\s+/g, '-')}/${model.toLowerCase().replace(/\s+/g, '-')}/${year}`,
      }))
    }
  }
}

export default async function CarModelPage({ params }: PageProps) {
  const { brand, model } = await params
  
  // Decode and format params
  const brandDecoded = decodeURIComponent(brand).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  // Validate car exists
  const carData = CARS.find(c => c.brand === brandDecoded)
  // Buscar el modelo real comparando slugs (robusto para "4Runner", "RAV4", "FJ Cruiser", etc.)
  const modelSlug = decodeURIComponent(model)
  const realModel = carData?.models.find(
    m => m.toLowerCase().replace(/\s+/g, '-') === modelSlug
  )
  if (!carData || !realModel) {
    notFound()
  }
  const modelDecoded = realModel

  const schemaData = generateSchema(brandDecoded, modelDecoded, carData.years)

  // Detalle enriquecido (generaciones/motores) solo si es un modelo Toyota conocido
  const detail = brandDecoded === 'Toyota' ? getToyotaModelDetail(modelSlug) : null

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
              <li><Link href="/" className="hover:text-rh-red">Inicio</Link></li>
              <li>/</li>
              <li><Link href={`/marca/${brand}`} className="hover:text-rh-red">{brandDecoded}</Link></li>
              <li>/</li>
              <li className="text-gray-900 font-medium">{modelDecoded}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Repuestos para {brandDecoded} {modelDecoded}
            </h1>
            <p className="text-gray-600">
              Selecciona el año de tu vehículo para ver los repuestos compatibles.
            </p>
            {detail && detail.aka.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                También conocido como: {detail.aka.join(', ')}
              </p>
            )}
          </div>

          {detail ? (
            /* Vista por GENERACIONES (modelos Toyota enriquecidos) */
            <div className="space-y-8">
              {detail.generations.map((gen) => {
                const genYears = carData.years.filter(
                  (y) => y >= gen.yearStart && y <= gen.yearEnd
                )
                if (genYears.length === 0) return null
                return (
                  <div key={gen.code || gen.name} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h2 className="text-xl font-bold text-gray-900">{gen.name}</h2>
                      <span className="text-sm text-gray-500">
                        {gen.yearStart}–{gen.yearEnd === 2026 ? 'Actual' : gen.yearEnd}
                      </span>
                    </div>
                    {gen.engines.length > 0 && (
                      <p className="text-sm text-gray-600 mb-4">
                        <span className="font-medium text-gray-700">Motores:</span>{' '}
                        {gen.engines.join(' · ')}
                      </p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {genYears.map((year) => (
                        <Link
                          key={year}
                          href={`/marca/${brand}/${model}/${year}`}
                          className="bg-gray-50 rounded-lg p-3 text-center hover:bg-rh-red/10 hover:text-rh-red transition-colors group border border-transparent hover:border-rh-red/30"
                        >
                          <span className="font-semibold text-gray-900 group-hover:text-rh-red">
                            {year}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Vista clásica: grid de años plano (resto de marcas/modelos) */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {carData.years.map((year) => (
                <Link
                  key={year}
                  href={`/marca/${brand}/${model}/${year}`}
                  className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow group"
                >
                  <span className="text-4xl mb-2 block">🚗</span>
                  <h3 className="font-semibold text-gray-900 group-hover:text-rh-red transition-colors">
                    {year}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Ver repuestos
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* Popular Categories */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Categorías populares para {brandDecoded} {modelDecoded}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { name: 'Frenos', icon: '🛑', slug: 'frenos' },
                { name: 'Filtros', icon: '🔧', slug: 'filtros' },
                { name: 'Bujías', icon: '⚡', slug: 'bujias' },
                { name: 'Aceites', icon: '🛢️', slug: 'aceites' },
                { name: 'Batería', icon: '🔋', slug: 'bateria' },
                { name: 'Suspensión', icon: '🔩', slug: 'suspension' },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/buscar?category=${cat.slug}&brand=${brand}&model=${model}`}
                  className="bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition-shadow"
                >
                  <span className="text-3xl mb-2 block">{cat.icon}</span>
                  <h3 className="font-medium text-gray-900">{cat.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}