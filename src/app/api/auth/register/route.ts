import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(100),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validar datos de entrada
        const validationResult = registerSchema.safeParse(body)

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))

            return NextResponse.json(
                {
                    error: 'Datos de entrada inválidos',
                    details: errorMessages
                },
                { status: 400 }
            )
        }

        const { name, email, password } = validationResult.data

        // Verificar que el email no esté en uso
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Este email ya está registrado' },
                { status: 409 }
            )
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 12)

        // Crear usuario
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        // Generar token JWT con jose (ahora es async)
        const token = await generateToken({
            userId: user.id,
            email: user.email
        })

        return NextResponse.json(
            {
                message: 'Usuario registrado exitosamente',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    },
                    token
                }
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error during registration:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
