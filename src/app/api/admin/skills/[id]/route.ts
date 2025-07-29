import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Actualizar una skill por ID
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Obtener datos del body
        const body = await request.json()
        const { name, category, level, featured } = body

        // Obtener ID desde los params
        const { id } = await params

        // Actualizar en la BD
        const skill = await prisma.skill.update({
            where: { id },
            data: {
                name,
                category,
                level,
                featured: featured || false
            }
        })

        return NextResponse.json(skill)
    } catch (error) {
        console.error('Error updating skill:', error)
        return NextResponse.json(
            { error: 'Error updating skill' },
            { status: 500 }
        )
    }
}

// Eliminar una skill por ID
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Obtener ID desde los params
        const { id } = await params

        // Eliminar en la BD
        await prisma.skill.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Skill deleted successfully' })
    } catch (error) {
        console.error('Error deleting skill:', error)
        return NextResponse.json(
            { error: 'Error deleting skill' },
            { status: 500 }
        )
    }
}
