'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, User, Code, Settings, Home, LogOut, UserCircle, BarChart3, Briefcase } from 'lucide-react'
import type { PersonalInfo, Project, Skill, Experience } from '@prisma/client'
import { useAuth } from '@/contexts/AuthContext'
import DashboardStats from './DashboardStats'
import ImageSelector from './ImageSelector'

// Define types for form data
type PersonalInfoFormData = {
    name: string
    title: string
    description: string
    email: string
    phone: string
    github: string
    linkedIn: string
}

type ProjectFormData = {
    title: string
    description: string
    technologies: string
    imageUrl: string
    demoUrl: string
    githubUrl: string
    featured: boolean
    startDate: string
    endDate: string
}

type SkillFormData = {
    name: string
    category: string
    level: string
    featured: boolean
}

type ExperienceFormData = {
    company: string
    position: string
    description: string
    startDate: string
    endDate: string
    current: boolean
    featured: boolean
}

interface AdminClientProps {
    personalInfo: PersonalInfo | null
    projects: Project[]
    skills: Skill[]
    experiences: Experience[]
}

type ActiveTab = 'dashboard' | 'personal' | 'projects' | 'skills' | 'experiences'

export default function AdminClient({ personalInfo, projects, skills, experiences }: AdminClientProps) {
    const { user, logout } = useAuth()
    const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'personal', label: 'Información Personal', icon: User },
        { id: 'projects', label: 'Proyectos', icon: Code },
        { id: 'skills', label: 'Habilidades', icon: Settings },
        { id: 'experiences', label: 'Experiencias', icon: Briefcase }
    ]

    const handleEdit = (id: string) => {
        setEditingId(id)
        setIsEditing(true)
    }

    const handleDelete = async (id: string, type: 'project' | 'skill' | 'experience') => {
        if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
            try {
                const token = localStorage.getItem('auth_token')

                if (!token) {
                    console.error('Token no encontrado')
                    return
                }

                const response = await fetch(`/api/admin/${type}s/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    window.location.reload()
                } else {
                    const errorData = await response.json()
                    console.error('Error del servidor:', errorData)
                }
            } catch (error) {
                console.error('Error al eliminar:', error)
            }
        }
    }

    const handleSave = async (
        data: PersonalInfoFormData | ProjectFormData | SkillFormData | ExperienceFormData,
        type: 'personal' | 'project' | 'skill' | 'experience'
    ) => {
        try {
            let endpoint, method, url

            if (type === 'personal') {
                endpoint = '/api/admin/personal'
                method = 'PUT'
                url = endpoint
            } else {
                endpoint = `/api/admin/${type}s`
                method = editingId ? 'PUT' : 'POST'
                url = editingId ? `${endpoint}/${editingId}` : endpoint
            }

            const token = localStorage.getItem('auth_token')

            if (!token) {
                console.error('Token no encontrado')
                return
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                setIsEditing(false)
                setEditingId(null)
                window.location.reload()
            } else {
                const errorData = await response.json()
                console.error('Error del servidor:', errorData)
            }
        } catch (error) {
            console.error('Error al guardar:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="text-2xl font-bold text-gray-900">
                            Panel de Administración
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <UserCircle className="w-4 h-4" />
                                <span>Hola, {user?.name}</span>
                            </div>
                            <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600">
                                <Home className="w-4 h-4 mr-2" />
                                Volver al sitio
                            </Link>
                            <button
                                onClick={logout}
                                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as ActiveTab)}
                                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'dashboard' && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
                                <DashboardStats />
                            </div>
                        )}

                        {activeTab === 'personal' && (
                            <PersonalInfoSection
                                personalInfo={personalInfo}
                                onSave={(data) => handleSave(data, 'personal')}
                            />
                        )}

                        {activeTab === 'projects' && (
                            <ProjectsSection
                                projects={projects}
                                onEdit={handleEdit}
                                onDelete={(id) => handleDelete(id, 'project')}
                                onSave={(data) => handleSave(data, 'project')}
                                isEditing={isEditing}
                                editingId={editingId}
                                setIsEditing={setIsEditing}
                                setEditingId={setEditingId}
                            />
                        )}

                        {activeTab === 'skills' && (
                            <SkillsSection
                                skills={skills}
                                onEdit={handleEdit}
                                onDelete={(id) => handleDelete(id, 'skill')}
                                onSave={(data) => handleSave(data, 'skill')}
                                isEditing={isEditing}
                                editingId={editingId}
                                setIsEditing={setIsEditing}
                                setEditingId={setEditingId}
                            />
                        )}

                        {activeTab === 'experiences' && (
                            <ExperiencesSection
                                experiences={experiences}
                                onEdit={handleEdit}
                                onDelete={(id) => handleDelete(id, 'experience')}
                                onSave={(data) => handleSave(data, 'experience')}
                                isEditing={isEditing}
                                editingId={editingId}
                                setIsEditing={setIsEditing}
                                setEditingId={setEditingId}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function PersonalInfoSection({ personalInfo, onSave }: { personalInfo: PersonalInfo | null, onSave: (data: PersonalInfoFormData) => void }) {
    const [formData, setFormData] = useState({
        name: personalInfo?.name || '',
        title: personalInfo?.title || '',
        description: personalInfo?.description || '',
        email: personalInfo?.email || '',
        phone: personalInfo?.phone || '',
        github: personalInfo?.github || '',
        linkedIn: personalInfo?.linkedIn || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Información Personal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            title="Nombre"
                            placeholder="Ingresa tu nombre"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            title="Título profesional"
                            placeholder="Ej: Desarrollador Full Stack"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        title="Descripción personal"
                        placeholder="Describe tu experiencia..."
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            title="Correo electrónico"
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            title="Número de teléfono"
                            placeholder="+51 999 999 999"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                        <input
                            type="url"
                            value={formData.github}
                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="URL de GitHub"
                            placeholder="https://github.com/tuusuario"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                        <input
                            type="url"
                            value={formData.linkedIn}
                            onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="URL de LinkedIn"
                            placeholder="https://linkedin.com/in/tuusuario"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    )
}

function ProjectsSection({
    projects,
    onEdit,
    onDelete,
    onSave,
    isEditing,
    editingId,
    setIsEditing,
    setEditingId
}: {
    projects: Project[]
    onEdit: (id: string) => void
    onDelete: (id: string) => void
    onSave: (data: ProjectFormData) => void
    isEditing: boolean
    editingId: string | null
    setIsEditing: (value: boolean) => void
    setEditingId: (value: string | null) => void
}) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: '',
        imageUrl: '',
        demoUrl: '',
        githubUrl: '',
        featured: false,
        startDate: '',
        endDate: ''
    })

    const handleEdit = (project: Project) => {
        setFormData({
            title: project.title,
            description: project.description,
            technologies: JSON.parse(project.technologies).join(', '),
            imageUrl: project.imageUrl || '',
            demoUrl: project.demoUrl || '',
            githubUrl: project.githubUrl || '',
            featured: project.featured,
            startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
            endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''
        })
        onEdit(project.id)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const data = {
            ...formData,
            technologies: JSON.stringify(formData.technologies.split(',').map(t => t.trim())),
            // Para campos opcionales, enviar string vacío en lugar de undefined
            imageUrl: formData.imageUrl || '',
            demoUrl: formData.demoUrl || '',
            githubUrl: formData.githubUrl || '',
            // Para fechas, asegurar que estén en formato correcto o string vacío
            startDate: formData.startDate,
            endDate: formData.endDate || ''
        }
        onSave(data)
        setFormData({
            title: '',
            description: '',
            technologies: '',
            imageUrl: '',
            demoUrl: '',
            githubUrl: '',
            featured: false,
            startDate: '',
            endDate: ''
        })
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Proyectos</h2>
                <button
                    onClick={() => {
                        setIsEditing(true)
                        setEditingId(null)
                        setFormData({
                            title: '',
                            description: '',
                            technologies: '',
                            imageUrl: '',
                            demoUrl: '',
                            githubUrl: '',
                            featured: false,
                            startDate: '',
                            endDate: ''
                        })
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Proyecto</span>
                </button>
            </div>

            {isEditing && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                title="Título del proyecto"
                                placeholder="Nombre del proyecto"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                title="Descripción del proyecto"
                                placeholder="Describe el proyecto, sus características y objetivos..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tecnologías (separadas por comas)
                            </label>
                            <input
                                type="text"
                                value={formData.technologies}
                                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="React, Node.js, MongoDB"
                                required
                            />
                        </div>

                        <ImageSelector
                            value={formData.imageUrl}
                            onChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
                            label="Imagen del proyecto"
                            className="col-span-full"
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL Demo</label>
                                <input
                                    type="url"
                                    value={formData.demoUrl}
                                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    title="URL de la demo"
                                    placeholder="https://mi-proyecto-demo.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL GitHub</label>
                                <input
                                    type="url"
                                    value={formData.githubUrl}
                                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    title="URL del repositorio en GitHub"
                                    placeholder="https://github.com/usuario/proyecto"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    title="Fecha de inicio del proyecto"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin (opcional)</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    title="Fecha de finalización del proyecto"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="text-sm font-medium text-gray-700">Proyecto destacado</span>
                            </label>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false)
                                    setEditingId(null)
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                {editingId ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {projects.map((project, index) => (
                    <div key={`project-${project.id}-${index}`} className="bg-white border rounded-lg p-4">
                        <div className="flex gap-4">
                            {/* Imagen del proyecto */}
                            {project.imageUrl && (
                                <div className="flex-shrink-0 relative w-20 h-20">
                                    <Image
                                        src={project.imageUrl}
                                        alt={project.title}
                                        fill
                                        className="object-cover rounded-lg border"
                                    />
                                </div>
                            )}

                            {/* Contenido del proyecto */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold">{project.title}</h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Editar proyecto"
                                            aria-label="Editar proyecto"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(project.id)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Eliminar proyecto"
                                            aria-label="Eliminar proyecto"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-2">{project.description}</p>
                                <p className="text-sm text-gray-500 mb-2">
                                    Inicio: {new Date(project.startDate).toLocaleDateString()}
                                    {project.endDate && ` - Fin: ${new Date(project.endDate).toLocaleDateString()}`}
                                </p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {JSON.parse(project.technologies).map((tech: string, index: number) => (
                                        <span key={`${project.id}-tech-${index}-${tech}`} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                {project.featured && (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                        Destacado
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SkillsSection({
    skills,
    onEdit,
    onDelete,
    onSave,
    isEditing,
    editingId,
    setIsEditing,
    setEditingId
}: {
    skills: Skill[]
    onEdit: (id: string) => void
    onDelete: (id: string) => void
    onSave: (data: SkillFormData) => void
    isEditing: boolean
    editingId: string | null
    setIsEditing: (value: boolean) => void
    setEditingId: (value: string | null) => void
}) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        level: '',
        featured: false
    })

    const handleEdit = (skill: Skill) => {
        setFormData({
            name: skill.name,
            category: skill.category,
            level: skill.level,
            featured: skill.featured
        })
        onEdit(skill.id)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
        setFormData({
            name: '',
            category: '',
            level: '',
            featured: false
        })
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Habilidades</h2>
                <button
                    onClick={() => {
                        setIsEditing(true)
                        setEditingId(null)
                        setFormData({
                            name: '',
                            category: '',
                            level: '',
                            featured: false
                        })
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nueva Habilidad</span>
                </button>
            </div>

            {isEditing && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingId ? 'Editar Habilidad' : 'Nueva Habilidad'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    title="Nombre de la habilidad"
                                    placeholder="Ej: React, JavaScript, Python"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    title="Categoría de la habilidad"
                                    placeholder="Ej: Frontend, Backend, Database"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                            <select
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                title="Nivel de competencia"
                            >
                                <option value="">Seleccionar nivel</option>
                                <option value="Principiante">Principiante</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Avanzado">Avanzado</option>
                                <option value="Experto">Experto</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="text-sm font-medium text-gray-700">Habilidad destacada</span>
                            </label>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false)
                                    setEditingId(null)
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                {editingId ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {skills.map((skill, index) => (
                    <div key={`skill-${skill.id}-${index}`} className="bg-white border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{skill.name}</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(skill)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Editar habilidad"
                                    aria-label="Editar habilidad"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(skill.id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Eliminar habilidad"
                                    aria-label="Eliminar habilidad"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Nivel: {skill.level}</span>
                            {skill.featured && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                    Destacado
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ExperiencesSection({
    experiences,
    onEdit,
    onDelete,
    onSave,
    isEditing,
    editingId,
    setIsEditing,
    setEditingId
}: {
    experiences: Experience[]
    onEdit: (id: string) => void
    onDelete: (id: string) => void
    onSave: (data: ExperienceFormData) => void
    isEditing: boolean
    editingId: string | null
    setIsEditing: (value: boolean) => void
    setEditingId: (value: string | null) => void
}) {
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        description: '',
        startDate: '',
        endDate: '',
        current: false,
        featured: false
    })

    const handleEdit = (experience: Experience) => {
        setFormData({
            company: experience.company,
            position: experience.position,
            description: experience.description,
            startDate: experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : '',
            endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
            current: experience.current,
            featured: experience.featured
        })
        onEdit(experience.id)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
        setFormData({
            company: '',
            position: '',
            description: '',
            startDate: '',
            endDate: '',
            current: false,
            featured: false
        })
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Experiencias</h2>
                <button
                    onClick={() => {
                        setIsEditing(true)
                        setEditingId(null)
                        setFormData({
                            company: '',
                            position: '',
                            description: '',
                            startDate: '',
                            endDate: '',
                            current: false,
                            featured: false
                        })
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nueva Experiencia</span>
                </button>
            </div>

            {isEditing && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingId ? 'Editar Experiencia' : 'Nueva Experiencia'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    title="Nombre de la empresa"
                                    placeholder="Nombre de la empresa"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Posición</label>
                                <input
                                    type="text"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    title="Posición o cargo"
                                    placeholder="Ej: Desarrollador Frontend"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                title="Descripción de responsabilidades y logros"
                                placeholder="Describe tus responsabilidades, logros y tecnologías utilizadas..."
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    title="Fecha de inicio en la empresa"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={formData.current}
                                    title="Fecha de finalización en la empresa"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.current}
                                    onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: e.target.checked ? '' : formData.endDate })}
                                    className="mr-2"
                                />
                                <span className="text-sm font-medium text-gray-700">Trabajo actual</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="text-sm font-medium text-gray-700">Experiencia destacada</span>
                            </label>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false)
                                    setEditingId(null)
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                {editingId ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {experiences.map((experience) => (
                    <div key={experience.id} className="bg-white border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-lg font-semibold">{experience.company}</h3>
                                <p className="text-gray-600">{experience.position}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(experience)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Editar experiencia"
                                    aria-label="Editar experiencia"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(experience.id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Eliminar experiencia"
                                    aria-label="Eliminar experiencia"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-2">{experience.description}</p>
                        <p className="text-sm text-gray-500 mb-2">
                            {new Date(experience.startDate).toLocaleDateString()} -
                            {experience.current ? ' Actual' : ` ${new Date(experience.endDate!).toLocaleDateString()}`}
                        </p>
                        <div className="flex space-x-2">
                            {experience.current && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    Actual
                                </span>
                            )}
                            {experience.featured && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                    Destacado
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
