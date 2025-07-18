import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Definir el tipo para el payload del JWT
interface AuthPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log('🔍 Middleware ejecutándose para:', pathname)

  // Rutas API que requieren autenticación
  const protectedApiRoutes = [
    '/api/admin/projects',
    '/api/admin/skills', 
    '/api/admin/experiences',
    '/api/admin/personal',
    '/api/admin/stats',
    '/api/upload'
  ]

  // Verificar si es una ruta API protegida
  const isProtectedApiRoute = protectedApiRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (isProtectedApiRoute) {
    console.log('🛡️ Ruta protegida detectada:', pathname)
    
    const authHeader = request.headers.get('Authorization')
    console.log('🎫 Header Authorization:', authHeader ? 'Presente' : 'Ausente')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Token de autorización faltante o malformado')
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    console.log('🔑 Token extraído:', token.substring(0, 20) + '...')

    try {
      // Obtener el secret desde las variables de entorno
      const secret = process.env.JWT_SECRET
      if (!secret) {
        console.error('❌ JWT_SECRET no está configurado')
        return NextResponse.json(
          { error: 'Error de configuración del servidor' },
          { status: 500 }
        )
      }

      console.log('🔐 Verificando token con jose...')
      
      // Usar jose para verificar el JWT (compatible con Edge Runtime)
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret)
      ) as { payload: AuthPayload }

      console.log('✅ Token válido, usuario:', payload.email)

      // Añadir información del usuario a los headers para las rutas API
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.userId)
      requestHeaders.set('x-user-email', payload.email)

      console.log('🔄 Headers añadidos:', {
        'x-user-id': payload.userId,
        'x-user-email': payload.email
      })

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })

    } catch (error) {
      console.error('❌ Error verificando token:', error)
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      )
    }
  }

  console.log('➡️ Ruta no protegida, continuando...')
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/api/upload'
  ]
}
