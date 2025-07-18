import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { experienceSchema, handleValidationError } from '@/lib/validations'

// GET - Obtener experiencia por ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        
        const experience = await prisma.experience.findUnique({
            where: { id }
        })

        if (!experience) {
            return NextResponse.json(
                { error: 'Experiencia no encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json({ data: experience })

    } catch (error) {
        console.error('Error fetching experience:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

// PUT - Actualizar experiencia
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        
        // Verificar que la experiencia existe
        const existingExperience = await prisma.experience.findUnique({
            where: { id }
        })

        if (!existingExperience) {
            return NextResponse.json(
                { error: 'Experiencia no encontrada' },
                { status: 404 }
            )
        }

        const body = await request.json()

        // Validar datos de entrada
        const validationResult = experienceSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                handleValidationError(validationResult.error),
                { status: 400 }
            )
        }

        const {
            company,
            position,
            description,
            startDate,
            endDate,
            current,
            featured
        } = validationResult.data

        // Si se marca como actual, desmarcar otras experiencias como actuales
        if (current) {
            await prisma.experience.updateMany({
                where: { 
                    current: true,
                    id: { not: id }
                },
                data: { current: false }
            })
        }

        // Actualizar la experiencia
        const updatedExperience = await prisma.experience.update({
            where: { id },
            data: {
                company,
                position,
                description,
                startDate: new Date(startDate),
                endDate: current ? null : (endDate && endDate !== '' ? new Date(endDate) : null),
                current: current || false,
                featured: featured || false
            }
        })

        return NextResponse.json({
            message: 'Experiencia actualizada exitosamente',
            data: updatedExperience
        })

    } catch (error) {
        console.error('Error updating experience:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar experiencia
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        
        // Verificar que la experiencia existe
        const existingExperience = await prisma.experience.findUnique({
            where: { id }
        })

        if (!existingExperience) {
            return NextResponse.json(
                { error: 'Experiencia no encontrada' },
                { status: 404 }
            )
        }

        // Eliminar la experiencia
        await prisma.experience.delete({
            where: { id }
        })

        return NextResponse.json({
            message: 'Experiencia eliminada exitosamente'
        })

    } catch (error) {
        console.error('Error deleting experience:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
