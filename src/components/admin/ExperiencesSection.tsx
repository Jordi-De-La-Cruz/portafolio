import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import type { ExperienceFormData } from '@/types/admin'
import type { Experience } from '@prisma/client'

interface ExperiencesSectionProps {
    experiences: Experience[]
    onSave: (data: ExperienceFormData) => void
    isEditing: boolean
    editingId: string | null
    setIsEditing: (value: boolean) => void
    setEditingId: (value: string | null) => void
    handleEdit: (id: string) => void
    handleDelete: (id: string, type: 'project' | 'skill' | 'experience') => void
}

export default function ExperiencesSection({
    experiences,
    onSave,
    isEditing,
    editingId,
    setIsEditing,
    setEditingId,
    handleEdit,
    handleDelete
}: ExperiencesSectionProps) {
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        description: '',
        startDate: '',
        endDate: '',
        current: false,
        featured: false
    })

    // Manejar edición
    const handleEditExperience = (experience: Experience) => {
        setFormData({
            company: experience.company,
            position: experience.position,
            description: experience.description,
            startDate: experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : '',
            endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
            current: experience.current,
            featured: experience.featured
        })
        handleEdit(experience.id)
    }

    // Agregar nueva experiencia
    const handleAddNew = () => {
        setFormData({
            company: '',
            position: '',
            description: '',
            startDate: '',
            endDate: '',
            current: false,
            featured: false
        })
        setIsEditing(true)
        setEditingId(null)
    }

    // Enviar formulario
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
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Experiencias</h2>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nueva Experiencia</span>
                </button>
            </div>

            {/* Formulario */}
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
                                placeholder="Describe responsabilidades y logros..."
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
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        current: e.target.checked,
                                        endDate: e.target.checked ? '' : formData.endDate
                                    })}
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

            {/* Lista de experiencias */}
            <div className="grid gap-4">
                {experiences.map((experience) => (
                    <div key={experience.id} className="bg-white border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-lg font-semibold">{experience.company}</h3>
                                <p className="text-gray-600">{experience.position}</p>
                            </div>

                            {/* Acciones */}
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditExperience(experience)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Editar"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(experience.id, 'experience')}
                                    className="text-red-600 hover:text-red-800"
                                    title="Eliminar"
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
