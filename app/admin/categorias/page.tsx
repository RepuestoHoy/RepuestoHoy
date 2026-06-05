'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Upload, Check, ImageIcon, Loader2 } from 'lucide-react'
import { validateImage, compressImage, MAX_FILE_MB } from '@/lib/image-upload'

interface Categoria {
  id: string
  slug: string
  name: string
  emoji: string | null
  description: string | null
  image_url: string | null
  sort_order: number
}

export default function AdminCategoriasPage() {
  const router = useRouter()
  const supabase = createClient()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/admin'); return }
      loadCategorias()
    })
  }, [router])

  const loadCategorias = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories').select('*').order('sort_order', { ascending: true })
    if (!error && data) setCategorias(data)
    setLoading(false)
  }

  // Extrae el nombre del archivo desde una URL pública de Supabase Storage.
  const fileNameFromUrl = (url: string | null): string | null => {
    if (!url) return null
    const parts = url.split('/categorias/')
    return parts[1] ? decodeURIComponent(parts[1].split('?')[0]) : null
  }

  const processFile = async (categoria: Categoria, file: File) => {
    setError('')

    // 1. Validar tipo y tamaño (en el navegador; las políticas de Supabase validan en el servidor)
    const check = validateImage(file)
    if (!check.ok) { setError(check.error!); return }

    setBusyId(categoria.id)
    setSavedId(null)
    try {
      // 2. Comprimir y convertir a WebP (carga más rápida para los clientes)
      const blob = await compressImage(file)

      // 3. Subir con nombre único
      const fileName = `${categoria.slug}-${Date.now()}.webp`
      const { error: upErr } = await supabase.storage
        .from('categorias')
        .upload(fileName, blob, { cacheControl: '3600', upsert: false, contentType: 'image/webp' })
      if (upErr) { setError(`Error subiendo: ${upErr.message}`); setBusyId(null); return }

      const { data: urlData } = supabase.storage.from('categorias').getPublicUrl(fileName)

      // 4. Guardar URL en la categoría
      const { error: updErr } = await supabase
        .from('categories').update({ image_url: urlData.publicUrl }).eq('id', categoria.id)
      if (updErr) { setError(`Error guardando: ${updErr.message}`); setBusyId(null); return }

      // 5. Borrar la imagen anterior (evita acumular basura en el storage)
      const oldFile = fileNameFromUrl(categoria.image_url)
      if (oldFile && oldFile !== fileName) {
        await supabase.storage.from('categorias').remove([oldFile])
      }

      setCategorias(prev =>
        prev.map(c => (c.id === categoria.id ? { ...c, image_url: urlData.publicUrl } : c))
      )
      setSavedId(categoria.id)
      setTimeout(() => setSavedId(null), 2000)
    } catch (e: any) {
      setError(e.message || 'Error inesperado al procesar la imagen')
    }
    setBusyId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#111111] text-white py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
          <Link href="/admin/dashboard" className="text-gray-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold">Imágenes de Categorías</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600 mb-2">
          Arrastra una imagen sobre cada categoría, o haz clic para elegirla.
        </p>
        <p className="text-gray-400 text-sm mb-6">
          JPG, PNG o WebP · hasta {MAX_FILE_MB} MB · se optimiza automáticamente para carga rápida.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Cargando categorías…</div>
        ) : categorias.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No hay categorías. Ejecuta primero el SQL de configuración en Supabase.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categorias.map((cat) => {
              const isBusy = busyId === cat.id
              const isDrag = dragId === cat.id
              return (
                <div key={cat.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragId(cat.id) }}
                    onDragLeave={() => setDragId(null)}
                    onDrop={(e) => {
                      e.preventDefault(); setDragId(null)
                      const file = e.dataTransfer.files?.[0]
                      if (file) processFile(cat, file)
                    }}
                    onClick={() => !isBusy && fileInputs.current[cat.id]?.click()}
                    className={`aspect-square flex items-center justify-center relative cursor-pointer transition-colors ${
                      isDrag ? 'bg-red-50 ring-2 ring-[#FF6A00] ring-inset' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-400 px-2">
                        <ImageIcon className="w-10 h-10 mx-auto mb-1" />
                        <span className="text-xs">Arrastra o haz clic</span>
                      </div>
                    )}
                    {isBusy && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                    {savedId === cat.id && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span>{cat.emoji}</span>
                      <span className="font-semibold text-sm text-gray-900">{cat.name}</span>
                    </div>
                    <input
                      ref={(el) => { fileInputs.current[cat.id] = el }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) processFile(cat, file)
                        e.target.value = ''
                      }}
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); fileInputs.current[cat.id]?.click() }}
                      disabled={isBusy}
                      className="w-full bg-[#FF6A00] hover:bg-[#E55A00] text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-60"
                    >
                      {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {cat.image_url ? 'Cambiar' : 'Subir'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
