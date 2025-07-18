import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Obtener estadísticas del dashboard
export async function GET(request: NextRequest) {
    console.log('📊 API /admin/stats llamada')

    try {
        // Verificar que el middleware haya añadido la información del usuario
        const userEmail = request.headers.get('x-user-email')
        const userId = request.headers.get('x-user-id')

        console.log('👤 Usuario de headers:', { userId, userEmail })

        if (!userEmail || !userId) {
            console.log('❌ No hay información de usuario en headers')
            return NextResponse.json(
                { error: 'No autorizado - falta información de usuario' },
                { status: 401 }
            )
        }

        console.log('🔍 Ejecutando consultas a la base de datos...')

        // Ejecutar todas las consultas en paralelo para mejor rendimiento
        const [
            totalProjects,
            featuredProjects,
            totalSkills,
            featuredSkills,
            totalExperiences,
            currentExperience,
            recentProjects,
            skillsByCategory
        ] = await Promise.all([
            // Contar proyectos totales
            prisma.project.count(),

            // Contar proyectos destacados
            prisma.project.count({
                where: { featured: true }
            }),

            // Contar habilidades totales
            prisma.skill.count(),

            // Contar habilidades destacadas
            prisma.skill.count({
                where: { featured: true }
            }),

            // Contar experiencias totales
            prisma.experience.count(),

            // Obtener experiencia actual
            prisma.experience.findFirst({
                where: { current: true },
                select: {
                    id: true,
                    company: true,
                    position: true,
                    startDate: true
                }
            }),

            // Proyectos más recientes
            prisma.project.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    featured: true,
                    createdAt: true
                }
            }),

            // Habilidades agrupadas por categoría
            prisma.skill.groupBy({
                by: ['category'],
                _count: {
                    category: true
                },
                orderBy: {
                    _count: {
                        category: 'desc'
                    }
                }
            })
        ])

        console.log('✅ Consultas ejecutadas exitosamente')

        // Calcular algunos datos adicionales
        const projectsCompletionRate = totalProjects > 0
            ? Math.round((featuredProjects / totalProjects) * 100)
            : 0

        const skillsDistribution = skillsByCategory.map(item => ({
            category: item.category,
            count: item._count.category
        }))

        // Calcular tiempo en el trabajo actual
        let currentJobDuration = null
        if (currentExperience) {
            const startDate = new Date(currentExperience.startDate)
            const now = new Date()
            const diffTime = Math.abs(now.getTime() - startDate.getTime())
            const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
            currentJobDuration = diffMonths
        }

        const stats = {
            overview: {
                totalProjects,
                featuredProjects,
                totalSkills,
                featuredSkills,
                totalExperiences,
                projectsCompletionRate
            },
            currentJob: currentExperience ? {
                ...currentExperience,
                durationMonths: currentJobDuration
            } : null,
            recentActivity: {
                recentProjects
            },
            skillsDistribution,
            summary: {
                lastUpdated: new Date().toISOString(),
                hasPersonalInfo: await prisma.personalInfo.count() > 0
            }
        }

        console.log('📈 Estadísticas preparadas:', {
            totalProjects,
            totalSkills,
            totalExperiences,
            hasCurrentJob: !!currentExperience
        })

        return NextResponse.json({
            data: stats,
            message: 'Estadísticas obtenidas exitosamente'
        })

    } catch (error) {
        console.error('❌ Error fetching dashboard stats:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
