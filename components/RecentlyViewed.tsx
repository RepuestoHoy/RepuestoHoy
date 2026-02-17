'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from './CartContext'
import { X } from 'lucide-react'

export default function RecentlyViewed() {
  const { recentlyViewed } = useCart()

  if (recentlyViewed.length === 0) return null

  return (
    <div className="mt-12 pt-12 border-t border-[#E0E0E0]">
      <h2 className="text-xl font-bold text-[#111111] mb-6 uppercase tracking-tight">
        Visto recientemente
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentlyViewed.slice(0, 4).map(product => (
          <Link
            key={product.id}
            href={`/producto/${product.id}`}
            className="card overflow-hidden hover:shadow-lg transition-all group"
          >
            <div className="aspect-[4/3] bg-[#F5F5F5] flex items-center justify-center relative">
              {product.images[0] ? (
                <Image 
                  src={product.images[0]} 
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="text-4xl">🔧</span>
              )}
            </div>
            <div className="p-4">
              <div className="text-xs font-bold text-[#2A2A2A] uppercase">{product.brand}</div>
              <h3 className="font-bold text-[#111111] text-sm mt-1 line-clamp-2">{product.name}</h3>
              <div className="text-lg font-extrabold text-[#E10600] mt-2">
                ${product.price.toFixed(2)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
