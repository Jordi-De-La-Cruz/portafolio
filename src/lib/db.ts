import { PrismaClient } from '@prisma/client'

// Crear instancia global de Prisma para evitar múltiples conexiones
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getPersonalInfo() {
  try {
    return await prisma.personalInfo.findFirst()
  } catch (error) {
    console.error('Error fetching personal info:', error)
    return null
  }
}

export async function getFeaturedProjects() {
  try {
    return await prisma.project.findMany({
      where: { featured: true },
      take: 6,
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function getFeaturedSkills() {
  try {
    return await prisma.skill.findMany({
      where: { featured: true },
      take: 9,
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching skills:', error)
    return []
  }
}

export async function getFeaturedExperiences() {
  try {
    return await prisma.experience.findMany({
      orderBy: [
        { current: 'desc' },
        { startDate: 'desc' }
      ],
      take: 5 // Mostrar solo las 5 más recientes en el portafolio
    })
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return []
  }
}

// Función optimizada para Server Components - Portafolio público
export async function getAllPortafolioData() {
  try {
    const [personalInfo, projects, skills, experiences] = await Promise.all([
      getPersonalInfo(),
      getFeaturedProjects(),
      getFeaturedSkills(),
      getFeaturedExperiences()
    ])

    return {
      personalInfo,
      projects,
      skills,
      experiences
    }
  } catch (error) {
    console.error('Error fetching portafolio data:', error)
    return {
      personalInfo: null,
      projects: [],
      skills: [],
      experiences: []
    }
  }
}

// ===== FUNCIONES PARA EL ADMIN =====

// Función para obtener todos los proyectos (incluyendo no destacados)
export async function getAllProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching all projects:', error)
    return []
  }
}

// Función para obtener todas las habilidades (incluyendo no destacadas)
export async function getAllSkills() {
  try {
    return await prisma.skill.findMany({
      orderBy: { name: 'asc' }
    })
  } catch (error) {
    console.error('Error fetching all skills:', error)
    return []
  }
}

// Función para obtener todas las experiencias
export async function getAllExperiences() {
  try {
    return await prisma.experience.findMany({
      orderBy: [
        { current: 'desc' },
        { startDate: 'desc' }
      ]
    })
  } catch (error) {
    console.error('Error fetching all experiences:', error)
    return []
  }
}

// Función para obtener todos los datos (incluyendo no destacados) para el admin
export async function getAllAdminData() {
  try {
    const [personalInfo, projects, skills, experiences] = await Promise.all([
      getPersonalInfo(),
      getAllProjects(),
      getAllSkills(),
      getAllExperiences()
    ])

    return {
      personalInfo,
      projects,
      skills,
      experiences
    }
  } catch (error) {
    console.error('Error fetching admin data:', error)
    return {
      personalInfo: null,
      projects: [],
      skills: [],
      experiences: []
    }
  }
}
