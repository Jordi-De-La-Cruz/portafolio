import type { PersonalInfo, Project, Skill, Experience } from '@prisma/client'

// Tipos para formularios
export type PersonalInfoFormData = {
    name: string
    title: string
    description: string
    email: string
    phone: string
    github: string
    linkedIn: string
}

export type ProjectFormData = {
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

export type SkillFormData = {
    name: string
    category: string
    level: string
    featured: boolean
}

export type ExperienceFormData = {
    company: string
    position: string
    description: string
    startDate: string
    endDate: string
    current: boolean
    featured: boolean
}

export interface AdminClientProps {
    personalInfo: PersonalInfo | null
    projects: Project[]
    skills: Skill[]
    experiences: Experience[]
}

export type ActiveTab = 'dashboard' | 'personal' | 'projects' | 'skills' | 'experiences'
