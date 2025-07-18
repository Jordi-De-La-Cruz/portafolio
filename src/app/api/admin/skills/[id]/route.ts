import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const { name, category, level, featured } = body

        const skill = await prisma.skill.update({
            where: { id: params.id },
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
    { params }: { params: { id: string } }
) {
    try {
        await prisma.skill.delete({
            where: { id: params.id }
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
