import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Tipos de archivo permitidos
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// ─── POST /api/upload-comprobante ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servicio no configurado' }, { status: 503 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const orderId = formData.get('orderId') as string

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
    }

    // Validar tipo de archivo
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, GIF, WebP) o PDF.',
        allowedTypes: ALLOWED_MIME_TYPES 
      }, { status: 400 })
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'El archivo es demasiado grande. Máximo 5MB.',
        maxSize: MAX_FILE_SIZE 
      }, { status: 400 })
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 10)
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `comprobante_${timestamp}_${randomString}.${fileExtension}`
    
    // Path en el bucket: comprobantes/[orderId]/[filename]
    const filePath = orderId ? `${orderId}/${fileName}` : fileName

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Subir a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('comprobantes')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Supabase Storage error:', uploadError)
      return NextResponse.json({ 
        error: 'Error subiendo el archivo: ' + uploadError.message 
      }, { status: 500 })
    }

    // Obtener URL pública
    const { data: urlData } = supabaseAdmin
      .storage
      .from('comprobantes')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    // Si se proporcionó orderId, actualizar la orden
    if (orderId) {
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          comprobante_url: publicUrl,
          comprobante_subido_at: new Date().toISOString(),
          status: 'pending_payment',
        })
        .eq('id', orderId)

      if (updateError) {
        console.error('Error updating order:', updateError)
        // No fallamos aquí, el archivo ya se subió
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
      fileName: file.name,
      size: file.size,
      type: file.type,
    })

  } catch (err: any) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Error interno: ' + err.message }, { status: 500 })
  }
}

// ─── DELETE /api/upload-comprobante (para eliminar comprobante) ────────────
export async function DELETE(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servicio no configurado' }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const path = searchParams.get('path')
    const orderId = searchParams.get('orderId')

    if (!path) {
      return NextResponse.json({ error: 'Se requiere el path del archivo' }, { status: 400 })
    }

    // Eliminar de Storage
    const { error: deleteError } = await supabaseAdmin
      .storage
      .from('comprobantes')
      .remove([path])

    if (deleteError) {
      console.error('Error deleting file:', deleteError)
      return NextResponse.json({ error: 'Error eliminando el archivo' }, { status: 500 })
    }

    // Si hay orderId, limpiar la referencia en la orden
    if (orderId) {
      await supabaseAdmin
        .from('orders')
        .update({
          comprobante_url: null,
          comprobante_subido_at: null,
        })
        .eq('id', orderId)
    }

    return NextResponse.json({ success: true })

  } catch (err: any) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Error interno: ' + err.message }, { status: 500 })
  }
}
