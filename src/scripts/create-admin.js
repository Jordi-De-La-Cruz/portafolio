const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
    try {
        // Datos del administrador
        const adminData = {
            name: 'Administrador',
            email: 'jordidelacruzmoreno@gmail.com',
            password: 'admin'
        }

        // Verificar si ya existe un usuario con este email
        const existingUser = await prisma.user.findUnique({
            where: { email: adminData.email }
        })

        if (existingUser) {
            console.log('❌ Ya existe un usuario con este email:', adminData.email)
            return
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(adminData.password, 12)

        // Crear usuario administrador
        const admin = await prisma.user.create({
            data: {
                name: adminData.name,
                email: adminData.email,
                password: hashedPassword
            }
        })

        console.log('✅ Usuario administrador creado exitosamente:')
        console.log('📧 Email:', admin.email)
        console.log('🔑 Contraseña:', adminData.password)
        console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login')

    } catch (error) {
        console.error('❌ Error creando usuario administrador:', error)
    } finally {
        await prisma.$disconnect()
    }
}

createAdmin()
