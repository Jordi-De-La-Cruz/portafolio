import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Crear usuario admin
    const hashedPassword = await bcrypt.hash('admin123', 10)

    await prisma.user.upsert({
        where: { email: 'jordi.delacruz@tecsup.edu.pe' },
        update: {},
        create: {
            email: 'jordi.delacruz@tecsup.edu.pe',
            name: 'Jordi De la Cruz',
            password: hashedPassword,
        },
    })

    // Información personal inicial
    await prisma.personalInfo.upsert({
        where: { id: 'personal-info-1' },
        update: {},
        create: {
            id: 'personal-info-1',
            name: 'Jordi De la Cruz',
            email: 'jordi.delacruz@tecsup.edu.pe',
            phone: '(+51) 900-000-000',
            title: 'Desarrollador Full Stack',
            description: 'Desarrollador de software egresado de la carrera de Diseño y Desarrollo de Software, con experiencia comprobada en proyectos full-stack y desarrollo móvil.',
            location: 'Trujillo, La Libertad, PE',
            github: 'https://github.com/jordidelacr',
            linkedIn: 'https://linkedin.com/in/jordidelacr',
        },
    })

    // Proyecto ejemplo
    await prisma.project.create({
        data: {
            title: 'Sistema de Control de Presupuesto',
            description: 'Sistema desarrollado en Excel con macros avanzadas para el control y seguimiento de presupuestos empresariales.',
            technologies: JSON.stringify(['Excel', 'VBA', 'Power Query']),
            featured: true,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-28'),
        },
    })

    // Experiencia ejemplo
    await prisma.experience.create({
        data: {
            company: 'Empresa de Desarrollo',
            position: 'Programador Web',
            description: 'Desarrollé aplicaciones empresariales utilizando PHP, Laravel y Vue.js, logrando una mejora del 30% en la eficiencia operativa.',
            startDate: new Date('2024-08-01'),
            endDate: new Date('2024-10-31'),
            current: false,
        },
    })

    // Habilidades ejemplo
    const skills = [
        { name: 'React', category: 'Frontend', level: 'Avanzado' },
        { name: 'Laravel', category: 'Backend', level: 'Intermedio' },
        { name: 'Vue.js', category: 'Frontend', level: 'Intermedio' },
        { name: 'PostgreSQL', category: 'Base de Datos', level: 'Intermedio' },
        { name: 'TypeScript', category: 'Frontend', level: 'Avanzado' },
    ]

    for (const skill of skills) {
        await prisma.skill.create({
            data: {
                name: skill.name,
                category: skill.category,
                level: skill.level,
                featured: skill.name === 'React' || skill.name === 'TypeScript',
            },
        })
    }

    console.log('✅ Datos iniciales creados correctamente')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
