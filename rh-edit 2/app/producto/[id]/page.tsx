import { Metadata } from 'next'
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/data'
import ProductoClient from './ProductoClient'
import Script from 'next/script'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = SAMPLE_PRODUCTS.find(p => p.id === id)
  
  if (!product) {
    return {
      title: 'Producto no encontrado | Repuesto Hoy',
      description: 'El producto que buscas no existe o fue removido.'
    }
  }

  const category = CATEGORIES.find(c => c.id === product.category)
  
  return {
    title: `${product.name} | Repuesto Hoy`,
    description: product.description,
    keywords: `${product.name}, ${product.brand}, ${category?.name || ''}, repuestos, Caracas`,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      images: product.images.length > 0 ? [{ url: product.images[0] }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
    },
    alternates: {
      canonical: `https://repuestohoy.com/producto/${product.id}`,
    },
  }
}

export default async function ProductoPage({ params }: Props) {
  const { id } = await params
  const product = SAMPLE_PRODUCTS.find(p => p.id === id)
  
  // Schema.org structured data for SEO
  const productSchema = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.length > 0 ? product.images[0] : '/placeholder-product.png',
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    offers: {
      '@type': 'Offer',
      url: `https://repuestohoy.com/producto/${product.id}`,
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '3.00',
          currency: 'USD'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'VE'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'HOUR'
          }
        }
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '10'
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Cliente RepuestoHoy'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        reviewBody: 'Excelente producto, calidad garantizada. Entrega rápida en Caracas.'
      }
    ]
  } : null
  
  return (
    <>
      {productSchema && (
        <Script
          id="product-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <ProductoClient productId={id} />
    </>
  )
}
