// middleware.ts
// Protege /admin del lado del SERVIDOR (no se puede falsificar desde el navegador).
// Si no hay sesión válida de Supabase, redirige a /login.
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // getUser() valida contra el servidor de Supabase: seguro, no falsificable.
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // /admin es la PÁGINA DE LOGIN del panel (accesible sin sesión).
  // Protegemos las subrutas: /admin/dashboard, /admin/productos, /admin/categorias, etc.
  const isProtected =
    path.startsWith('/admin/') // todo lo que cuelga de /admin/

  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Si ya está logueado y va al login del panel, lo manda al dashboard.
  if (user && path === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
