import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog de Mantenimiento | Tips y Guías para tu Vehículo | Repuesto Hoy',
  description: 'Descubre tips de mantenimiento, guías prácticas y consejos para cuidar tu vehículo. Artículos sobre frenos, aceite, batería y más.',
  keywords: 'blog automotriz, mantenimiento carro, tips vehículo, repuestos Caracas',
  openGraph: {
    title: 'Blog de Mantenimiento | Repuesto Hoy',
    description: 'Tips y guías para el cuidado de tu vehículo',
    type: 'website',
    locale: 'es_VE',
    url: 'https://repuestohoy.com/blog',
  },
  alternates: {
    canonical: 'https://repuestohoy.com/blog',
  },
}

// Schema.org structured data
const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Blog de Repuesto Hoy',
  description: 'Tips y guías de mantenimiento automotriz',
  url: 'https://repuestohoy.com/blog',
  publisher: {
    '@type': 'Organization',
    name: 'Repuesto Hoy',
    logo: {
      '@type': 'ImageObject',
      url: 'https://repuestohoy.com/logo.png'
    }
  }
}

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-red-600">Inicio</Link></li>
              <li>/</li>
              <li className="text-gray-900 font-medium">Blog</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Blog de Mantenimiento
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tips, guías y consejos para mantener tu vehículo en perfectas condiciones.
              Aprende de los expertos en repuestos de Caracas.
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="aspect-video bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                    <span className="text-6xl">🚗</span>
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {post.readingTime} min de lectura
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-red-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString('es-VE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-red-600 font-medium hover:text-red-700 transition-colors"
                    >
                      Leer más →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              ¿Necesitas repuestos para tu vehículo?
            </h2>
            <p className="mb-6 max-w-xl mx-auto">
              Tenemos todo lo que necesitas para el mantenimiento de tu carro. 
              Entrega el mismo día en Caracas.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Ver catálogo de productos
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}