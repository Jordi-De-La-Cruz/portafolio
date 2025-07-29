import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import type { SkillFormData } from '@/types/admin'
import type { Skill } from '@prisma/client'

interface SkillsSectionProps {
    skills: Skill[]
    onSave: (data: SkillFormData) => void
    isEditing: boolean
    editingId: string | null
    setIsEditing: (value: boolean) => void
    setEditingId: (value: string | null) => void
    handleEdit: (id: string) => void
    handleDelete: (id: string, type: 'project' | 'skill' | 'experience') => void
}

export default function SkillsSection({
    skills,
    onSave,
    isEditing,
    editingId,
    setIsEditing,
    setEditingId,
    handleEdit,
    handleDelete
}: SkillsSectionProps) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        level: '',
        featured: false
    })

    // Manejar edición
    const handleEditSkill = (skill: Skill) => {
        setFormData({
            name: skill.name,
            category: skill.category,
            level: skill.level,
            featured: skill.featured
        })
        handleEdit(skill.id)
    }

    // Agregar nueva habilidad
    const handleAddNew = () => {
        setFormData({
            name: '',
            category: '',
            level: '',
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
            name: '',
            category: '',
            level: '',
            featured: false
        })
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Habilidades</h2>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nueva Habilidad</span>
                </button>
            </div>

            {/* Formulario */}
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

            {/* Lista de habilidades */}
            <div className="grid gap-4">
                {skills.map((skill) => (
                    <div key={skill.id} className="bg-white border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{skill.name}</h3>

                            {/* Acciones */}
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditSkill(skill)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Editar"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(skill.id, 'skill')}
                                    className="text-red-600 hover:text-red-800"
                                    title="Eliminar"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Categoría: {skill.category}</span>
                            <span className="text-sm text-gray-600">• Nivel: {skill.level}</span>
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
