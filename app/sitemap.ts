import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { CARS } from '@/lib/data'
import { BUSINESS_CONFIG } from '@/lib/config'

// Blog posts estáticos para el sitemap
const BLOG_POSTS = [
  { slug: 'como-saber-si-necesitas-frenos-nuevos', updatedAt: '2025-02-18' },
  { slug: 'cuando-cambiar-aceite-motor', updatedAt: '2025-02-18' },
  { slug: 'signos-bateria-fallando', updatedAt: '2025-02-18' },
  { slug: 'por-que-vibra-carro-al-frenar', updatedAt: '2025-02-18' },
  { slug: 'mantenimiento-preventivo-carro', updatedAt: '2025-02-18' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://repuestohoy.com'
  
  // URLs estáticas principales
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/buscar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/carrito`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Obtener productos dinámicamente
  let productUrls: MetadataRoute.Sitemap = []
  try {
    const { data: products } = await supabase
      .from('products')
      .select('id, updated_at')
      .eq('is_available', true)
    
    if (products) {
      productUrls = products.map((product) => ({
        url: `${baseUrl}/producto/${product.id}`,
        lastModified: new Date(product.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
  }

  // Generar URLs de marca/modelo/año
  const carFitmentUrls: MetadataRoute.Sitemap = []
  
  for (const car of CARS) {
    const brandSlug = car.brand.toLowerCase().replace(/\s+/g, '-')
    
    // URL de marca
    carFitmentUrls.push({
      url: `${baseUrl}/marca/${brandSlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
    
    // URLs de marca/modelo
    for (const model of car.models) {
      const modelSlug = model.toLowerCase().replace(/\s+/g, '-')
      
      carFitmentUrls.push({
        url: `${baseUrl}/marca/${brandSlug}/${modelSlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
      
      // URLs de marca/modelo/año
      for (const year of car.years) {
        carFitmentUrls.push({
          url: `${baseUrl}/marca/${brandSlug}/${modelSlug}/${year}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  }

  // URLs del blog
  const blogUrls: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticUrls, ...productUrls, ...carFitmentUrls, ...blogUrls]
}