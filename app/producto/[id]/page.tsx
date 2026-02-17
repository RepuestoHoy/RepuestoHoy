import { Metadata } from 'next'
import { SAMPLE_PRODUCTS, CATEGORIES } from '@/lib/data'
import ProductoClient from './ProductoClient'

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
  return <ProductoClient productId={id} />
}
