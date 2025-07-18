import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, category, level, featured } = body

        const skill = await prisma.skill.create({
            data: {
                name,
                category,
                level,
                featured: featured || false
            }
        })

        return NextResponse.json(skill)
    } catch (error) {
        console.error('Error creating skill:', error)
        return NextResponse.json(
            { error: 'Error creating skill' },
            { status: 500 }
        )
    }
}
