import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { projectSchema, handleValidationError } from '@/lib/validations'

// GET - Obtener proyecto por ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        
        const project = await prisma.project.findUnique({
            where: { id }
        })

        if (!project) {
            return NextResponse.json(
                { error: 'Proyecto no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json({ data: project })

    } catch (error) {
        console.error('Error fetching project:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

// PUT - Actualizar proyecto con validación
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        
        // Verificar que el proyecto existe
        const existingProject = await prisma.project.findUnique({
            where: { id }
        })

        if (!existingProject) {
            return NextResponse.json(
                { error: 'Proyecto no encontrado' },
                { status: 404 }
            )
        }

        const body = await request.json()

        // Validar datos de entrada
        const validationResult = projectSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                handleValidationError(validationResult.error),
                { status: 400 }
            )
        }

        const {
            title,
            description,
            imageUrl,
            demoUrl,
            githubUrl,
            technologies,
            featured,
            startDate,
            endDate
        } = validationResult.data

        // Verificar que no exista otro proyecto con el mismo título (excepto el actual)
        const duplicateProject = await prisma.project.findFirst({
            where: {
                title,
                id: { not: id }
            }
        })

        if (duplicateProject) {
            return NextResponse.json(
                { error: 'Ya existe otro proyecto con este título' },
                { status: 409 }
            )
        }

        // Actualizar el proyecto
        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                title,
                description,
                imageUrl: imageUrl || null,
                demoUrl: demoUrl || null,
                githubUrl: githubUrl || null,
                technologies,
                featured: featured || false,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null
            }
        })

        return NextResponse.json({
            message: 'Proyecto actualizado exitosamente',
            data: updatedProject
        })

    } catch (error) {
        console.error('Error updating project:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar proyecto con verificaciones
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        
        // Verificar que el proyecto existe
        const existingProject = await prisma.project.findUnique({
            where: { id }
        })

        if (!existingProject) {
            return NextResponse.json(
                { error: 'Proyecto no encontrado' },
                { status: 404 }
            )
        }

        // Eliminar el proyecto
        await prisma.project.delete({
            where: { id }
        })

        return NextResponse.json({
            message: 'Proyecto eliminado exitosamente'
        })

    } catch (error) {
        console.error('Error deleting project:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
