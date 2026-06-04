// lib/image-upload.ts
// Utilidades para subida de imágenes: validación + compresión en el navegador.
// No requiere librerías externas (usa canvas nativo).

export const MAX_FILE_MB = 8
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export interface ValidationResult {
  ok: boolean
  error?: string
}

// Valida tipo y tamaño antes de procesar.
export function validateImage(file: File): ValidationResult {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: 'Formato no válido. Usa JPG, PNG o WebP.' }
  }
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    return { ok: false, error: `La imagen supera ${MAX_FILE_MB} MB. Usa una más liviana.` }
  }
  return { ok: true }
}

// Comprime y redimensiona la imagen a un máximo de lado, devolviendo un Blob WebP.
// Reduce mucho el peso sin pérdida visible — la página carga más rápido.
export async function compressImage(
  file: File,
  maxSide = 1000,
  quality = 0.82
): Promise<Blob> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'))
    reader.readAsDataURL(file)
  })

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('No se pudo procesar la imagen'))
    image.src = dataUrl
  })

  let { width, height } = img
  if (width > height && width > maxSide) {
    height = Math.round((height * maxSide) / width)
    width = maxSide
  } else if (height > maxSide) {
    width = Math.round((width * maxSide) / height)
    height = maxSide
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo preparar la imagen')
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', quality)
  )
  if (!blob) throw new Error('No se pudo comprimir la imagen')
  return blob
}
