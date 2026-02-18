import { NextRequest, NextResponse } from 'next/server'

// Forzar la contraseña correcta - la variable de entorno no está funcionando
const ADMIN_PASSWORD = 'Dette2026!'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    
    console.log('DEBUG: Attempting login')
    
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
