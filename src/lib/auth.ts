import { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this'

// Interface for JWT payload
export interface AuthPayload {
    userId: string
    email: string
    iat?: number
    exp?: number
}

// Converts secret string to Uint8Array for jose library
function getJwtSecret(): Uint8Array {
    return new TextEncoder().encode(JWT_SECRET)
}

// Generates a JWT token with user payload
export async function generateToken(payload: Omit<AuthPayload, 'iat' | 'exp'>): Promise<string> {
    console.log('🔑 Generating token for:', payload.email)

    try {
        const secret = getJwtSecret()

        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(secret)

        console.log('✅ Token generated:', token.substring(0, 20) + '...')
        return token
    } catch (error) {
        console.error('❌ Error generating token:', error)
        throw new Error('Failed to generate authentication token')
    }
}

// Verifies a JWT token and returns its payload if valid
export async function verifyToken(token: string): Promise<AuthPayload | null> {
    try {
        console.log('🔍 Verifying token...')
        console.log('🎫 Token received:', token.substring(0, 20) + '...')

        const secret = getJwtSecret()
        const { payload } = await jwtVerify(token, secret) as { payload: AuthPayload }

        console.log('✅ Valid token, payload:', payload)
        return payload
    } catch (error) {
        console.error('❌ Error verifying token:', error)
        return null
    }
}

// Middleware to verify authentication from request headers
export async function verifyAuth(request: NextRequest): Promise<AuthPayload | null> {
    try {
        console.log('🛡️ Verifying authentication...')
        const authHeader = request.headers.get('Authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ Invalid authorization header')
            return null
        }

        const token = authHeader.substring(7)
        return await verifyToken(token)
    } catch (error) {
        console.error('❌ Error verifying auth:', error)
        return null
    }
}

// Context type for authenticated routes
interface AuthContext {
    params: { [key: string]: string | string[] }
    user?: AuthPayload
}

// Higher-order function to protect API routes with authentication
export function withAuth(handler: (request: NextRequest, context: AuthContext) => Promise<Response>) {
    return async (request: NextRequest, context: AuthContext) => {
        console.log('🔒 Protecting route with auth...')
        const authPayload = await verifyAuth(request)

        if (!authPayload) {
            console.log('❌ Unauthorized access attempt')
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            )
        }

        console.log('✅ Authorized user:', authPayload.email)
        context.user = authPayload

        return handler(request, context)
    }
}
