import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        console.log('🔍 Verificando token de usuario...')
        
        // Verificar autenticación usando el helper
        const authPayload = await verifyAuth(request)
        
        if (!authPayload) {
            console.log('❌ Token inválido o no proporcionado')
            return NextResponse.json(
                { error: 'Token inválido o no proporcionado' },
                { status: 401 }
            )
        }

        // Buscar información completa del usuario
        const user = await prisma.user.findUnique({
            where: { id: authPayload.userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        })

        if (!user) {
            console.log('❌ Usuario no encontrado en la base de datos')
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        console.log('✅ Token verificado exitosamente para:', user.email)

        return NextResponse.json({
            message: 'Token válido',
            data: {
                user
            }
        })

    } catch (error) {
        console.error('❌ Error verificando token:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
