'use client'

import { useEffect, useState, useCallback } from 'react'
import { apiClient, type DashboardStatsResponse, type DashboardStats } from '@/lib/api-client'
import { BarChart3, TrendingUp, Users, Briefcase, Star, Activity } from 'lucide-react'
import type { Project } from '@prisma/client'

interface DashboardStatsProps {
    className?: string
}

export default function DashboardStats({ className = '' }: DashboardStatsProps) {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasToken, setHasToken] = useState<boolean>(false)

    // Verificar si hay token disponible
    useEffect(() => {
        const checkToken = () => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('auth_token')
                setHasToken(!!token)
                console.log('🔍 Token check:', token ? 'Existe' : 'No existe')
            }
        }

        checkToken()

        // Escuchar cambios en localStorage (por ejemplo, cuando se hace login/logout)
        const handleStorageChange = () => {
            checkToken()
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    const fetchStats = useCallback(async () => {
        // No intentar cargar stats si no hay token
        if (!hasToken) {
            console.log('❌ No hay token, no se pueden cargar estadísticas')
            setError('No hay sesión activa')
            setIsLoading(false)
            return
        }

        try {
            setIsLoading(true)
            setError(null)
            console.log('📊 Cargando estadísticas del dashboard...')

            const response: DashboardStatsResponse = await apiClient.getDashboardStats()
            setStats(response.data)
            console.log('✅ Estadísticas cargadas exitosamente')

        } catch (error: unknown) {
            console.error('❌ Error fetching stats:', error)
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar estadísticas'
            setError(errorMessage)

            // Si es error de autenticación, marcar que no hay token
            if (errorMessage.includes('Token inválido') || errorMessage.includes('401')) {
                setHasToken(false)
            }
        } finally {
            setIsLoading(false)
        }
    }, [hasToken])

    // Cargar datos cuando hay token disponible
    useEffect(() => {
        if (hasToken) {
            fetchStats()
        } else {
            setIsLoading(false)
            setStats(null)
            setError('No hay sesión activa')
        }
    }, [hasToken, fetchStats])

    // Mostrar estado de carga
    if (isLoading) {
        return (
            <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Mostrar error de autenticación
    if (!hasToken) {
        return (
            <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                        <Users className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-gray-600 mb-4">Necesitas iniciar sesión para ver las estadísticas</p>
                    <button
                        onClick={() => window.location.href = '/admin/login'}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Ir a Login
                    </button>
                </div>
            </div>
        )
    }

    // Mostrar error general
    if (error && hasToken) {
        return (
            <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
                <div className="text-center py-8">
                    <div className="text-red-400 mb-4">
                        <Activity className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchStats}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    // Mostrar mensaje si no hay datos
    if (!stats) {
        return (
            <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
                <p className="text-gray-500">No se pudieron cargar las estadísticas</p>
            </div>
        )
    }

    const { overview, currentJob, recentActivity, skillsDistribution } = stats

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Estadísticas generales */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    Resumen General
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{overview.totalProjects}</div>
                        <div className="text-sm text-gray-600">Proyectos</div>
                        <div className="text-xs text-green-600 mt-1">
                            {overview.featuredProjects} destacados
                        </div>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{overview.totalSkills}</div>
                        <div className="text-sm text-gray-600">Habilidades</div>
                        <div className="text-xs text-green-600 mt-1">
                            {overview.featuredSkills} destacadas
                        </div>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{overview.totalExperiences}</div>
                        <div className="text-sm text-gray-600">Experiencias</div>
                        <div className="text-xs text-purple-600 mt-1">
                            {currentJob ? 'Activo' : 'Inactivo'}
                        </div>
                    </div>

                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{overview.projectsCompletionRate}%</div>
                        <div className="text-sm text-gray-600">Destacados</div>
                        <div className="text-xs text-orange-600 mt-1">
                            Tasa de proyectos
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Trabajo actual */}
                {currentJob && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                            Trabajo Actual
                        </h3>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Empresa:</span>
                                <span className="font-medium">{currentJob.company}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Puesto:</span>
                                <span className="font-medium">{currentJob.position}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Duración:</span>
                                <span className="font-medium">{currentJob.durationMonths} meses</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Inicio:</span>
                                <span className="font-medium">
                                    {new Date(currentJob.startDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actividad reciente */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-blue-600" />
                        Proyectos Recientes
                    </h3>

                    <div className="space-y-3">
                        {recentActivity.recentProjects.length > 0 ? (
                            recentActivity.recentProjects.map((project: Project) => (
                                <div key={project.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div>
                                        <div className="font-medium text-sm">{project.title}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(project.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {project.featured && (
                                        <Star className="w-4 h-4 text-yellow-500" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No hay proyectos recientes</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Distribución de habilidades */}
            {skillsDistribution.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                        Distribución de Habilidades
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {skillsDistribution.map((item, index: number) => (
                            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                                <div className="text-lg font-bold text-gray-900">{item.count}</div>
                                <div className="text-xs text-gray-600 capitalize">{item.category}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
