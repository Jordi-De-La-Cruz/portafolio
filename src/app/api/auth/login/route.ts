import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida')
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validar datos de entrada
        const validationResult = loginSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Datos de entrada inválidos' },
                { status: 400 }
            )
        }

        const { email, password } = validationResult.data

        // Buscar usuario por email
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            )
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            )
        }

        // Generar token JWT con jose (ahora es async)
        const token = await generateToken({
            userId: user.id,
            email: user.email
        })

        return NextResponse.json({
            message: 'Login exitoso',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                },
                token
            }
        })

    } catch (error) {
        console.error('Error during login:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
