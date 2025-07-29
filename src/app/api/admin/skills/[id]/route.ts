import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json()
        const { name, category, level, featured } = body
        
        // Await params para obtener el id
        const { id } = await params

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

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await params para obtener el id
        const { id } = await params
        
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
