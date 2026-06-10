'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Upload, Check, ImageIcon, Loader2, Trash2, Pencil, Plus, X, AlertTriangle } from 'lucide-react'
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

// Genera un slug limpio desde el nombre: "Aire Acondicionado" -> "aire-acondicionado"
function slugify(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
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

  // Edición / creación / borrado
  const [editing, setEditing] = useState<Categoria | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', emoji: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState<Categoria | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [productCount, setProductCount] = useState<number | null>(null)

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

  const fileNameFromUrl = (url: string | null): string | null => {
    if (!url) return null
    const parts = url.split('/categorias/')
    return parts[1] ? decodeURIComponent(parts[1].split('?')[0]) : null
  }

  // ─── Imágenes (subir / cambiar / quitar) ───
  const processFile = async (categoria: Categoria, file: File) => {
    setError('')
    const check = validateImage(file)
    if (!check.ok) { setError(check.error!); return }

    setBusyId(categoria.id)
    setSavedId(null)
    try {
      const blob = await compressImage(file)
      const fileName = `${categoria.slug}-${Date.now()}.webp`
      const { error: upErr } = await supabase.storage
        .from('categorias')
        .upload(fileName, blob, { cacheControl: '3600', upsert: false, contentType: 'image/webp' })
      if (upErr) { setError(`Error subiendo: ${upErr.message}`); setBusyId(null); return }

      const { data: urlData } = supabase.storage.from('categorias').getPublicUrl(fileName)
      const { error: updErr } = await supabase
        .from('categories').update({ image_url: urlData.publicUrl }).eq('id', categoria.id)
      if (updErr) { setError(`Error guardando: ${updErr.message}`); setBusyId(null); return }

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

  const handleRemoveImage = async (categoria: Categoria) => {
    if (!categoria.image_url) return
    setError('')
    setBusyId(categoria.id)
    const oldFile = fileNameFromUrl(categoria.image_url)
    if (oldFile) await supabase.storage.from('categorias').remove([oldFile])
    const { error: updErr } = await supabase
      .from('categories').update({ image_url: null }).eq('id', categoria.id)
    if (updErr) {
      setError(`No se pudo quitar: ${updErr.message}`)
      setBusyId(null)
      return
    }
    setCategorias(prev =>
      prev.map(c => (c.id === categoria.id ? { ...c, image_url: null } : c))
    )
    setBusyId(null)
  }

  // ─── Editar nombre / emoji / descripción ───
  const openEdit = (cat: Categoria) => {
    setForm({ name: cat.name, emoji: cat.emoji || '', description: cat.description || '' })
    setEditing(cat)
    setCreating(false)
  }

  const openCreate = () => {
    setForm({ name: '', emoji: '🔧', description: '' })
    setCreating(true)
    setEditing(null)
  }

  const handleSaveForm = async () => {
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return }
    setSaving(true)
    setError('')

    if (editing) {
      // Actualizar existente (el slug NO cambia para no romper enlaces/productos)
      const { error: updErr } = await supabase
        .from('categories')
        .update({ name: form.name.trim(), emoji: form.emoji.trim() || null, description: form.description.trim() || null })
        .eq('id', editing.id)
      if (updErr) { setError(`No se pudo guardar: ${updErr.message}`); setSaving(false); return }
      setCategorias(prev => prev.map(c =>
        c.id === editing.id
          ? { ...c, name: form.name.trim(), emoji: form.emoji.trim() || null, description: form.description.trim() || null }
          : c
      ))
      setEditing(null)
    } else if (creating) {
      // Crear nueva
      const slug = slugify(form.name)
      if (!slug) { setError('El nombre genera un código vacío, usa letras'); setSaving(false); return }
      if (categorias.some(c => c.slug === slug)) {
        setError(`Ya existe una categoría con el código "${slug}"`)
        setSaving(false)
        return
      }
      const maxOrder = categorias.reduce((m, c) => Math.max(m, c.sort_order || 0), 0)
      const { data: inserted, error: insErr } = await supabase
        .from('categories')
        .insert([{ slug, name: form.name.trim(), emoji: form.emoji.trim() || null, description: form.description.trim() || null, sort_order: maxOrder + 1 }])
        .select()
        .single()
      if (insErr) { setError(`No se pudo crear: ${insErr.message}`); setSaving(false); return }
      if (inserted) setCategorias(prev => [...prev, inserted])
      setCreating(false)
    }
    setSaving(false)
  }

  // ─── Borrar categoría ───
  const openDelete = async (cat: Categoria) => {
    setToDelete(cat)
    setProductCount(null)
    // Contar productos vinculados para informar
    const { count } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', cat.id)
    setProductCount(count ?? 0)
  }

  const handleDeleteCategoria = async () => {
    if (!toDelete) return
    setDeleting(true)
    setError('')

    // 1. Desvincular productos (quedan sin categoría, NO se borran)
    await supabase.from('products').update({ category_id: null }).eq('category_id', toDelete.id)
    // 2. Borrar la imagen del storage si tiene
    const oldFile = fileNameFromUrl(toDelete.image_url)
    if (oldFile) await supabase.storage.from('categorias').remove([oldFile])
    // 3. Borrar la categoría
    const { error: delErr } = await supabase.from('categories').delete().eq('id', toDelete.id)
    if (delErr) {
      setError(`No se pudo eliminar: ${delErr.message}`)
      setDeleting(false)
      return
    }
    setCategorias(prev => prev.filter(c => c.id !== toDelete.id))
    setDeleting(false)
    setToDelete(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#111111] text-white py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold">Categorías</h1>
          </div>
          <button
            onClick={openCreate}
            className="bg-[#FF6A00] hover:bg-[#E55A00] text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Nueva categoría
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600 mb-2">
          Arrastra una imagen sobre cada categoría o haz clic en la foto. Usa ✏️ para cambiar nombre/emoji y 🗑️ para eliminarla.
        </p>
        <p className="text-gray-400 text-sm mb-6">
          JPG, PNG o WebP · hasta {MAX_FILE_MB} MB · se optimiza automáticamente.
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
            No hay categorías. Ejecuta primero el SQL de configuración en Supabase, o crea una con "Nueva categoría".
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
                      isDrag ? 'bg-orange-50 ring-2 ring-[#FF6A00] ring-inset' : 'bg-gray-100 hover:bg-gray-200'
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
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span>{cat.emoji}</span>
                        <span className="font-semibold text-sm text-gray-900 truncate">{cat.name}</span>
                      </div>
                      <div className="flex items-center flex-shrink-0">
                        <button
                          onClick={() => openEdit(cat)}
                          title="Editar nombre/emoji"
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDelete(cat)}
                          title="Eliminar categoría"
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); fileInputs.current[cat.id]?.click() }}
                        disabled={isBusy}
                        className="flex-1 bg-[#FF6A00] hover:bg-[#E55A00] text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-60"
                      >
                        {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {cat.image_url ? 'Cambiar' : 'Subir'}
                      </button>
                      {cat.image_url && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveImage(cat) }}
                          disabled={isBusy}
                          title="Quitar imagen"
                          className="px-2.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg disabled:opacity-60 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal editar / crear */}
      {(editing || creating) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editing ? 'Editar categoría' : 'Nueva categoría'}
              </h3>
              <button onClick={() => { setEditing(null); setCreating(false) }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ej: Aire Acondicionado"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                  autoFocus
                />
                {creating && form.name && (
                  <p className="text-xs text-gray-500 mt-1">Código: {slugify(form.name)}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Emoji</label>
                <input
                  type="text"
                  value={form.emoji}
                  onChange={(e) => setForm(f => ({ ...f, emoji: e.target.value }))}
                  placeholder="Ej: ❄️"
                  maxLength={4}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                />
                <p className="text-xs text-gray-500 mt-1">Se muestra junto al nombre. Pega cualquier emoji.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Descripción</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Ej: Compresores, filtros de cabina"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setEditing(null); setCreating(false) }}
                disabled={saving}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveForm}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-[#FF6A00] hover:bg-[#E55A00] text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar borrado */}
      {toDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Eliminar categoría</h3>
                <p className="text-gray-600 text-sm mt-1">
                  ¿Seguro que quieres eliminar <strong>{toDelete.name}</strong>?
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  {productCount === null
                    ? 'Verificando productos vinculados…'
                    : productCount > 0
                      ? `⚠️ Tiene ${productCount} producto(s). NO se borrarán, pero quedarán sin categoría.`
                      : 'No tiene productos vinculados.'}
                </p>
              </div>
              <button onClick={() => setToDelete(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setToDelete(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteCategoria}
                disabled={deleting || productCount === null}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
