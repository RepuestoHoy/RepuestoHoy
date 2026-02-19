import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getBlogPostBySlug, getAllBlogPosts, getRelatedPosts, BLOG_POSTS } from '@/lib/blog'
import BlogContent from './BlogContent'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Artículo no encontrado | Repuesto Hoy',
    }
  }
  
  return {
    title: `${post.title} | Blog Repuesto Hoy`,
    description: post.description,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      locale: 'es_VE',
      url: `https://repuestohoy.com/blog/${slug}`,
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://repuestohoy.com/blog/${slug}`,
    },
  }
}

// Generate static params
export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }))
}

// Schema.org Article structured data
function generateArticleSchema(post: any, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `https://repuestohoy.com${post.image}`,
    datePublished: post.date,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://repuestohoy.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Repuesto Hoy',
      logo: {
        '@type': 'ImageObject',
        url: 'https://repuestohoy.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://repuestohoy.com/blog/${slug}`
    },
    articleSection: post.category,
    keywords: post.tags.join(', ')
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(slug, 3)
  const articleSchema = generateArticleSchema(post, slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-red-600">Inicio</Link></li>
              <li>/</li>
              <li><Link href="/blog" className="hover:text-red-600">Blog</Link></li>
              <li>/</li>
              <li className="text-gray-900 font-medium line-clamp-1">{post.title}</li>
            </ol>
          </nav>

          {/* Article Header */}
          <article>
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                  {post.category}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(post.date).toLocaleDateString('es-VE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 text-sm">
                  {post.readingTime} min de lectura
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              <p className="text-xl text-gray-600">
                {post.description}
              </p>
              
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">
                    {post.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">Expertos en repuestos</p>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="aspect-video bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mb-8">
              <span className="text-8xl">🚗</span>
            </div>

            {/* Article Content */}
            <BlogContent content={post.content} />

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Etiquetas:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Artículos relacionados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                  >
                    <span className="text-3xl mb-2 block">🚗</span>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {related.readingTime} min de lectura
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              ¿Necesitas repuestos?
            </h2>
            <p className="mb-6">
              Encuentra todo lo que necesitas para tu vehículo con entrega el mismo día en Caracas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Ver catálogo
              </Link>
              <a
                href="https://wa.me/584122223775"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <span>💬</span>
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}