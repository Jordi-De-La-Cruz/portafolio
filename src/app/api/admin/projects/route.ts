import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { projectSchema, handleValidationError } from '@/lib/validations'
import { Prisma } from '@prisma/client'

// GET - Obtener todos los proyectos con paginación y filtros
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Parámetros de query
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const featured = searchParams.get('featured')
        const search = searchParams.get('search')

        // Calcular offset para paginación
        const offset = (page - 1) * limit

        const where: Prisma.ProjectWhereInput = {}

        if (featured !== null) {
            where.featured = featured === 'true'
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Ejecutar consultas en paralelo
        const [projects, totalCount] = await Promise.all([
            prisma.project.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit
            }),
            prisma.project.count({ where })
        ])

        // Calcular metadatos de paginación
        const totalPages = Math.ceil(totalCount / limit)
        const hasNextPage = page < totalPages
        const hasPrevPage = page > 1

        return NextResponse.json({
            data: projects,
            meta: {
                page,
                limit,
                totalCount,
                totalPages,
                hasNextPage,
                hasPrevPage
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

// POST - Crear nuevo proyecto con validación
export async function POST(request: NextRequest) {
    try {
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

        // Verificar que no exista un proyecto con el mismo título
        const existingProject = await prisma.project.findFirst({
            where: { title }
        })

        if (existingProject) {
            return NextResponse.json(
                { error: 'Ya existe un proyecto con este título' },
                { status: 409 }
            )
        }

        // Crear el proyecto
        const project = await prisma.project.create({
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

        return NextResponse.json(
            {
                message: 'Proyecto creado exitosamente',
                data: project
            },
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
