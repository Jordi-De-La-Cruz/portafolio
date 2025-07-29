import { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this'

export interface AuthPayload {
    userId: string
    email: string
    iat?: number
    exp?: number
}

// Convertir secret a Uint8Array para jose
function getJwtSecret(): Uint8Array {
    return new TextEncoder().encode(JWT_SECRET)
}

// Función para generar JWT token con jose
export async function generateToken(payload: Omit<AuthPayload, 'iat' | 'exp'>): Promise<string> {
    console.log('🔑 Generando token para:', payload.email)

    try {
        const secret = getJwtSecret()

        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d') // Token válido por 7 días
            .sign(secret)

        console.log('✅ Token generado:', token.substring(0, 20) + '...')
        return token
    } catch (error) {
        console.error('❌ Error generando token:', error)
        throw new Error('Error al generar token de autenticación')
    }
}

// Función para verificar JWT token con jose
export async function verifyToken(token: string): Promise<AuthPayload | null> {
    try {
        console.log('🔍 auth.verifyToken: Verificando token...')
        console.log('🎫 Token recibido:', token.substring(0, 20) + '...')
        console.log('🔑 JWT_SECRET configurado:', JWT_SECRET ? 'Sí' : 'No')
        console.log('🔑 JWT_SECRET valor:', JWT_SECRET.substring(0, 10) + '...')

        const secret = getJwtSecret()
        const { payload } = await jwtVerify(token, secret) as { payload: AuthPayload }

        console.log('✅ Token válido, payload:', payload)
        return payload
    } catch (error) {
        console.error('❌ Error verificando token:', error)
        return null
    }
}

// Middleware para verificar autenticación en rutas API
export async function verifyAuth(request: NextRequest): Promise<AuthPayload | null> {
    try {
        console.log('🛡️ verifyAuth: Verificando autenticación...')
        const authHeader = request.headers.get('Authorization')
        console.log('🔑 Authorization header:', authHeader ? 'Presente' : 'Ausente')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ Header de autorización inválido')
            return null
        }

        const token = authHeader.substring(7) // Remover "Bearer "
        console.log('🎫 Token extraído:', token.substring(0, 20) + '...')

        const result = await verifyToken(token)
        console.log('🔍 Resultado de verificación:', result ? 'Válido' : 'Inválido')

        return result
    } catch (error) {
        console.error('❌ Error verifying auth:', error)
        return null
    }
}

// Define el tipo para el contexto
interface AuthContext {
    params: { [key: string]: string | string[] };
    user?: AuthPayload;
}

// HOC para proteger rutas API
export function withAuth(handler: (request: NextRequest, context: AuthContext) => Promise<Response>) {
    return async (request: NextRequest, context: AuthContext) => {
        console.log('🔒 withAuth: Protegiendo ruta...')
        const authPayload = await verifyAuth(request)

        if (!authPayload) {
            console.log('❌ withAuth: Usuario no autorizado')
            return new Response(
                JSON.stringify({ error: 'No autorizado' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
        }

        console.log('✅ withAuth: Usuario autorizado:', authPayload.email)
        // Añadir información del usuario al contexto
        context.user = authPayload

        return handler(request, context)
    }
}
