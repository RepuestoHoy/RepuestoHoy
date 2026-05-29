import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CARS } from '@/lib/data'
import { getToyotaModelDetail, getGenerationForYear } from '@/lib/toyota-generations'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

interface PageProps {
  params: Promise<{
    brand: string
    model: string
    year: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand, model, year } = await params
  const brandDecoded = decodeURIComponent(brand).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const modelDecoded = decodeURIComponent(model).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const yearDecoded = decodeURIComponent(year)
  
  const title = `Repuestos para ${brandDecoded} ${modelDecoded} ${yearDecoded} | Repuesto Hoy`
  const description = `Encuentra repuestos compatibles con ${brandDecoded} ${modelDecoded} ${yearDecoded} en Caracas. Frenos, filtros, bujías, aceites y más con entrega el mismo día.`
  
  return {
    title,
    description,
    keywords: `${brandDecoded} ${modelDecoded} ${yearDecoded}, repuestos ${brandDecoded}, autopartes ${modelDecoded}, repuestos Caracas`,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'es_VE',
      url: `https://repuestohoy.com/marca/${brand}/${model}/${year}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://repuestohoy.com/marca/${brand}/${model}/${year}`,
    },
  }
}

// Generate static params for all car combinations
export async function generateStaticParams() {
  const params: { brand: string; model: string; year: string }[] = []
  
  for (const car of CARS) {
    const brandSlug = car.brand.toLowerCase().replace(/\s+/g, '-')
    
    for (const model of car.models) {
      const modelSlug = model.toLowerCase().replace(/\s+/g, '-')
      
      for (const year of car.years) {
        params.push({
          brand: brandSlug,
          model: modelSlug,
          year: year.toString(),
        })
      }
    }
  }
  
  return params
}

// Schema.org structured data
function generateSchema(brand: string, model: string, year: string, productCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Repuestos para ${brand} ${model} ${year}`,
    description: `Catálogo de repuestos compatibles con ${brand} ${model} ${year}`,
    url: `https://repuestohoy.com/marca/${brand.toLowerCase().replace(/\s+/g, '-')}/${model.toLowerCase().replace(/\s+/g, '-')}/${year}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: {
        '@type': 'ListItem',
        position: 1,
        name: `${brand} ${model} ${year}`,
        description: `Vehículo con ${productCount} repuestos disponibles`,
      }
    },
    about: {
      '@type': 'Vehicle',
      name: `${brand} ${model}`,
      vehicleModelDate: year,
      manufacturer: {
        '@type': 'Organization',
        name: brand,
      }
    }
  }
}

export default async function CarYearPage({ params }: PageProps) {
  const { brand, model, year } = await params
  
  // Decode and format params
  const brandDecoded = decodeURIComponent(brand).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const modelSlug = decodeURIComponent(model)
  const yearNum = parseInt(year)
  
  // Validate car exists in our data
  const carData = CARS.find(c => c.brand === brandDecoded)
  // Buscar el modelo real comparando slugs (robusto para "4Runner", "RAV4", "FJ Cruiser", etc.)
  const realModel = carData?.models.find(
    m => m.toLowerCase().replace(/\s+/g, '-') === modelSlug
  )
  if (!carData || !realModel || !carData.years.includes(yearNum)) {
    notFound()
  }
  const modelDecoded = realModel
  
  // Fetch products compatible with this car
  let products: any[] = []
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .contains('compatible_cars', [{ brand: brandDecoded, model: modelDecoded }])
      .order('sale_price', { ascending: true })
    
    if (data) {
      products = data
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  }
  
  // If no specific products, get all available products
  if (products.length === 0) {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .limit(12)
        .order('sale_price', { ascending: true })
      
      if (data) {
        products = data
      }
    } catch (error) {
      console.error('Error fetching fallback products:', error)
    }
  }

  const schemaData = generateSchema(brandDecoded, modelDecoded, year, products.length)

  // Generación y motores específicos para este año (solo Toyota enriquecido)
  const detail = brandDecoded === 'Toyota' ? getToyotaModelDetail(modelSlug) : null
  const generation = detail ? getGenerationForYear(detail, yearNum) : null

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
              <li><Link href={`/marca/${brand}/${model}`} className="hover:text-rh-red">{modelDecoded}</Link></li>
              <li>/</li>
              <li className="text-gray-900 font-medium">{year}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Repuestos para {brandDecoded} {modelDecoded} {year}
            </h1>
            {generation && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-rh-red/10 text-rh-red text-sm font-medium">
                  {generation.name}
                </span>
                {generation.engines.map((eng) => (
                  <span
                    key={eng}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
                  >
                    {eng}
                  </span>
                ))}
              </div>
            )}
            <p className="text-gray-600">
              Encontrá {products.length} repuestos compatibles con tu vehículo. 
              Entrega el mismo día en Caracas.
            </p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/producto/${product.id}?brand=${brand}&model=${model}&year=${year}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-4xl">📦</span>
                      </div>
                    )}
                    {product.type === 'original' && (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Original
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mb-3">
                      {product.brand}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-rh-red">
                        ${product.sale_price?.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.stock > 0 ? 'En stock' : 'Agotado'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <span className="text-6xl mb-4 block">🔍</span>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No encontramos productos para este vehículo
              </h2>
              <p className="text-gray-600 mb-6">
                Estamos trabajando para ampliar nuestro catálogo. 
                Contáctanos por WhatsApp y te ayudamos a encontrar lo que necesitas.
              </p>
              <a
                href={`https://wa.me/584122223775?text=Hola, busco repuestos para ${brandDecoded} ${modelDecoded} ${year}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <span>💬</span>
                Consultar por WhatsApp
              </a>
            </div>
          )}

          {/* Related Years */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Otros años para {brandDecoded} {modelDecoded}
            </h2>
            <div className="flex flex-wrap gap-2">
              {carData.years
                .filter(y => y !== yearNum)
                .slice(0, 10)
                .map(y => (
                  <Link
                    key={y}
                    href={`/marca/${brand}/${model}/${y}`}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-rh-red hover:text-rh-red transition-colors"
                  >
                    {y}
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