import { z } from 'zod'

// Validaciones para PersonalInfo
export const personalInfoSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(100),
    email: z.string().email('Email inválido'),
    phone: z.string().min(1, 'El teléfono es requerido'),
    title: z.string().min(1, 'El título es requerido').max(200),
    description: z.string().min(1, 'La descripción es requerida').max(1000),
    location: z.string().optional(),
    github: z.string().url('URL de GitHub inválida').optional().or(z.literal('')),
    linkedIn: z.string().url('URL de LinkedIn inválida').optional().or(z.literal(''))
})

// Validaciones para Project
export const projectSchema = z.object({
    title: z.string().min(1, 'El título es requerido').max(200),
    description: z.string().min(1, 'La descripción es requerida').max(1000),
    imageUrl: z.string().optional().or(z.literal('')),
    demoUrl: z.string().optional().or(z.literal('')),
    githubUrl: z.string().optional().or(z.literal('')),
    technologies: z.string().min(1, 'Las tecnologías son requeridas'),
    featured: z.boolean().default(false),
    startDate: z.string().min(1, 'La fecha de inicio es requerida'),
    endDate: z.string().optional().or(z.literal(''))
})

// Validaciones para Skill
export const skillSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(100),
    category: z.string().min(1, 'La categoría es requerida').max(100),
    level: z.enum(['Principiante', 'Intermedio', 'Avanzado', 'Experto'], {
        message: 'Nivel inválido'
    }),
    icon: z.string().optional(),
    featured: z.boolean().default(false)
})

// Validaciones para Experience
export const experienceSchema = z.object({
    company: z.string().min(1, 'La empresa es requerida').max(200),
    position: z.string().min(1, 'El puesto es requerido').max(200),
    description: z.string().min(1, 'La descripción es requerida').max(1000),
    startDate: z.string().min(1, 'La fecha de inicio es requerida'),
    endDate: z.string().optional().or(z.literal('')),
    current: z.boolean().default(false),
    featured: z.boolean().default(false)
})

// Tipos TypeScript derivados de los schemas
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type SkillInput = z.infer<typeof skillSchema>
export type ExperienceInput = z.infer<typeof experienceSchema>

// Utilidad para manejar errores de validación
export function handleValidationError(error: z.ZodError) {
    const errorMessages = error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
    }));

    return {
        error: 'Datos de entrada inválidos',
        details: errorMessages
    };
}
