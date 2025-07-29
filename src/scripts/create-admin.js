import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
    try {
        // Datos del admin
        const adminData = {
            name: 'Administrador',
            email: 'jordidelacruzmoreno@gmail.com',
            password: 'admin'
        }

        // Verificar si ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email: adminData.email }
        })

        if (existingUser) {
            console.log('❌ Ya existe un usuario con este email:', adminData.email)
            return
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(adminData.password, 12)

        // Crear admin
        const admin = await prisma.user.create({
            data: {
                name: adminData.name,
                email: adminData.email,
                password: hashedPassword
            }
        })

        console.log('✅ Usuario administrador creado:')
        console.log('📧 Email:', admin.email)
        console.log('🔑 Contraseña:', adminData.password)
        console.log('⚠️  Cambiar contraseña después del primer login')

    } catch (error) {
        console.error('❌ Error al crear el admin:', error)
    } finally {
        await prisma.$disconnect()
    }
}

createAdmin()
