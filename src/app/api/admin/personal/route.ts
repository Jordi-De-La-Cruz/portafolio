import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { name, title, description, email, phone, github, linkedIn } = body

        // Buscar si ya existe información personal
        const existingInfo = await prisma.personalInfo.findFirst()

        let result
        if (existingInfo) {
            // Actualizar información existente
            result = await prisma.personalInfo.update({
                where: { id: existingInfo.id },
                data: {
                    name,
                    title,
                    description,
                    email,
                    phone,
                    github,
                    linkedIn
                }
            })
        } else {
            // Crear nueva información personal
            result = await prisma.personalInfo.create({
                data: {
                    name,
                    title,
                    description,
                    email,
                    phone,
                    github,
                    linkedIn
                }
            })
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error updating personal info:', error)
        return NextResponse.json(
            { error: 'Error updating personal info' },
            { status: 500 }
        )
    }
}
