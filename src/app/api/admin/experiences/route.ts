import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { experienceSchema, handleValidationError } from '@/lib/validations'
import { Prisma } from '@prisma/client'

// Controlador de experiencias
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const current = searchParams.get('current')
        const search = searchParams.get('search')

        const offset = (page - 1) * limit

        const where: Prisma.ExperienceWhereInput = {}

        if (current !== null) {
            where.current = current === 'true'
        }

        if (search) {
            where.OR = [
                { company: { contains: search, mode: 'insensitive' } },
                { position: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }

        const [experiences, totalCount] = await Promise.all([
            prisma.experience.findMany({
                where,
                orderBy: [
                    { current: 'desc' },
                    { startDate: 'desc' }
                ],
                skip: offset,
                take: limit
            }),
            prisma.experience.count({ where })
        ])

        const totalPages = Math.ceil(totalCount / limit)

        return NextResponse.json({
            data: experiences,
            meta: {
                page,
                limit,
                totalCount,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        })

    } catch (error) {
        console.error('Error fetching experiences:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validationResult = experienceSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                handleValidationError(validationResult.error),
                { status: 400 }
            )
        }

        const { company, position, description, startDate, endDate, current } = validationResult.data

        if (current) {
            // Solo puede haber una experiencia actual
            await prisma.experience.updateMany({
                where: { current: true },
                data: { current: false }
            })
        }

        const experience = await prisma.experience.create({
            data: {
                company,
                position,
                description,
                startDate: new Date(startDate),
                endDate: current ? null : (endDate ? new Date(endDate) : null),
                current: current || false
            }
        })

        return NextResponse.json(
            {
                message: 'Experiencia creada exitosamente',
                data: experience
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error creating experience:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
