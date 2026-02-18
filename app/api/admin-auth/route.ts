import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    
    // Leer variable en tiempo de ejecución (no en carga del módulo)
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Dette2026!'
    
    console.log('DEBUG: Checking password, env var exists:', !!process.env.ADMIN_PASSWORD)
    
    if (!password) {
      return NextResponse.json(
        { error: 'Contraseña requerida' }, 
        { status: 400 }
      )
    }
    
    if (password === ADMIN_PASSWORD) {
      // Generar token simple (en producción usar JWT)
      const token = Buffer.from(`${Date.now()}:${ADMIN_PASSWORD}`).toString('base64')
      
      return NextResponse.json({ 
        success: true, 
        token,
        message: 'Autenticación exitosa'
      })
    } else {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' }, 
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { error: 'Error interno' }, 
      { status: 500 }
    )
  }
}
