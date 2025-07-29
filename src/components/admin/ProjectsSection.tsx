import { useState } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2 } from 'lucide-react'
import ImageSelector from '@/components/ImageSelector'
import type { ProjectFormData } from '@/types/admin'
import type { Project } from '@prisma/client'

interface ProjectsSectionProps {
    projects: Project[]
    onSave: (data: ProjectFormData) => void
    isEditing: boolean
    editingId: string | null
    setIsEditing: (value: boolean) => void
    setEditingId: (value: string | null) => void
    handleEdit: (id: string) => void
    handleDelete: (id: string, type: 'project' | 'skill' | 'experience') => void
}

export default function ProjectsSection({
    projects,
    onSave,
    isEditing,
    editingId,
    setIsEditing,
    setEditingId,
    handleEdit,
    handleDelete
}: ProjectsSectionProps) {
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

    // Manejar edición de proyecto
    const handleEditProject = (project: Project) => {
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
        handleEdit(project.id)
    }

    // Agregar nuevo proyecto
    const handleAddNew = () => {
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
        setIsEditing(true)
        setEditingId(null)
    }

    // Enviar formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const data = {
            ...formData,
            technologies: JSON.stringify(formData.technologies.split(',').map(t => t.trim())),
            imageUrl: formData.imageUrl || '',
            demoUrl: formData.demoUrl || '',
            githubUrl: formData.githubUrl || '',
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
            {/* Header con botón agregar */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Proyectos</h2>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Proyecto</span>
                </button>
            </div>

            {/* Formulario de edición/creación */}
            {isEditing && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Título */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                placeholder="Nombre del proyecto"
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                placeholder="Describe el proyecto..."
                            />
                        </div>

                        {/* Tecnologías */}
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

                        {/* Selector de imagen */}
                        <ImageSelector
                            value={formData.imageUrl}
                            onChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
                            label="Imagen del proyecto"
                        />

                        {/* URLs */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL Demo</label>
                                <input
                                    type="url"
                                    value={formData.demoUrl}
                                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    placeholder="https://github.com/usuario/proyecto"
                                />
                            </div>
                        </div>

                        {/* Fechas */}
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

                        {/* Checkbox destacado */}
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

                        {/* Botones */}
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

            {/* Lista de proyectos */}
            <div className="grid gap-4">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white border rounded-lg p-4">
                        <div className="flex gap-4">
                            {/* Imagen */}
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

                            {/* Contenido */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold">{project.title}</h3>

                                    {/* Acciones */}
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditProject(project)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Editar"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id, 'project')}
                                            className="text-red-600 hover:text-red-800"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-2">{project.description}</p>

                                {/* Fechas */}
                                <p className="text-sm text-gray-500 mb-2">
                                    Inicio: {new Date(project.startDate).toLocaleDateString()}
                                    {project.endDate && ` - Fin: ${new Date(project.endDate).toLocaleDateString()}`}
                                </p>

                                {/* Tecnologías */}
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {JSON.parse(project.technologies).map((tech: string, index: number) => (
                                        <span
                                            key={`${project.id}-tech-${index}`}
                                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Badge destacado */}
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
