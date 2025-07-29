import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { projectSchema, handleValidationError } from '@/lib/validations'
import { Prisma } from '@prisma/client'

// GET - Paginación y filtros básicos
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const featured = searchParams.get('featured')
        const search = searchParams.get('search')

        const offset = (page - 1) * limit

        const where: Prisma.ProjectWhereInput = {}

        // Filtros opcionales
        if (featured !== null) {
            where.featured = featured === 'true'
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Consulta paralela: proyectos + conteo total
        const [projects, totalCount] = await Promise.all([
            prisma.project.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit
            }),
            prisma.project.count({ where })
        ])

        const totalPages = Math.ceil(totalCount / limit)

        return NextResponse.json({
            data: projects,
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
        console.error('Error fetching projects:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

// POST - Validación y creación
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validación con Zod
        const validationResult = projectSchema.safeParse(body)
        if (!validationResult.success) {
            return NextResponse.json(
                handleValidationError(validationResult.error),
                { status: 400 }
            )
        }

        // Verificar título único
        const existingProject = await prisma.project.findFirst({
            where: { title: validationResult.data.title }
        })
        if (existingProject) {
            return NextResponse.json(
                { error: 'Ya existe un proyecto con este título' },
                { status: 409 }
            )
        }

        // Crear proyecto
        const project = await prisma.project.create({
            data: {
                ...validationResult.data,
                startDate: new Date(validationResult.data.startDate),
                endDate: validationResult.data.endDate ? new Date(validationResult.data.endDate) : null
            }
        })

        return NextResponse.json(
            { message: 'Proyecto creado exitosamente', data: project },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error creating project:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
