import { useState } from 'react'
import type { PersonalInfoFormData, ProjectFormData, SkillFormData, ExperienceFormData } from '@/types/admin'

export function useAdminActions() {
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const handleEdit = (id: string) => {
        setEditingId(id)
        setIsEditing(true)
    }

    // Eliminar elemento
    const handleDelete = async (id: string, type: 'project' | 'skill' | 'experience') => {
        if (!confirm('¿Estás seguro de eliminar este elemento?')) return

        try {
            const token = localStorage.getItem('auth_token')
            if (!token) throw new Error('Token no encontrado')

            const response = await fetch(`/api/admin/${type}s/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                window.location.reload()
            } else {
                console.error('Error del servidor:', await response.json())
            }
        } catch (error) {
            console.error('Error al eliminar:', error)
        }
    }

    // Guardar elemento
    const handleSave = async (
        data: PersonalInfoFormData | ProjectFormData | SkillFormData | ExperienceFormData,
        type: 'personal' | 'project' | 'skill' | 'experience'
    ) => {
        try {
            const token = localStorage.getItem('auth_token')
            if (!token) throw new Error('Token no encontrado')

            // Configurar endpoint
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
                console.error('Error del servidor:', await response.json())
            }
        } catch (error) {
            console.error('Error al guardar:', error)
        }
    }

    return {
        isEditing,
        editingId,
        setIsEditing,
        setEditingId,
        handleEdit,
        handleDelete,
        handleSave
    }
}
