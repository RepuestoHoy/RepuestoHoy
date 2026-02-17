export default function ProductSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200"></div>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-5 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="flex gap-2">
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-14 bg-gray-200 rounded-lg"></div>
            <div className="h-14 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
