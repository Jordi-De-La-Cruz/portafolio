import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, stat, readdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Configuración
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Asegurar que el directorio de uploads existe
async function ensureUploadDir() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true })
    }
}

// Validar archivo
function validateFile(file: File) {
    const errors: string[] = []

    if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push('Tipo de archivo no permitido. Solo se permiten: JPG, PNG, WebP')
    }

    if (file.size > MAX_FILE_SIZE) {
        errors.push(`El archivo es muy grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    }

    return errors
}

// Generar nombre único para el archivo
function generateFileName(originalName: string): string {
    const extension = path.extname(originalName)
    const uuid = uuidv4()
    const timestamp = Date.now()
    return `${timestamp}-${uuid}${extension}`
}

export async function POST(request: NextRequest) {
    try {
        // Verificar que el directorio existe
        await ensureUploadDir()

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No se recibió ningún archivo' },
                { status: 400 }
            )
        }

        // Validar archivo
        const validationErrors = validateFile(file)
        if (validationErrors.length > 0) {
            return NextResponse.json(
                {
                    error: 'Archivo inválido',
                    details: validationErrors
                },
                { status: 400 }
            )
        }

        // Generar nombre único
        const fileName = generateFileName(file.name)
        const filePath = path.join(UPLOAD_DIR, fileName)

        // Convertir archivo a buffer y guardarlo
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)

        // URL pública del archivo
        const publicUrl = `/uploads/${fileName}`

        return NextResponse.json({
            message: 'Archivo subido exitosamente',
            data: {
                fileName,
                originalName: file.name,
                size: file.size,
                type: file.type,
                url: publicUrl
            }
        })

    } catch (error) {
        console.error('Error uploading file:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

// GET - Obtener lista de imágenes subidas
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')

        await ensureUploadDir()

        const files = await readdir(UPLOAD_DIR)

        // Filtrar solo imágenes y obtener información
        const imageFiles = await Promise.all(
            files
                .filter((file: string) => {
                    const ext = path.extname(file).toLowerCase()
                    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
                })
                .map(async (file: string) => {
                    const fileStat = await stat(path.join(UPLOAD_DIR, file))
                    return {
                        fileName: file,
                        url: `/uploads/${file}`,
                        size: fileStat.size,
                        uploadedAt: fileStat.birthtime
                    }
                })
        ).then(files => 
            files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        )

        // Paginación
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedFiles = imageFiles.slice(startIndex, endIndex)

        return NextResponse.json({
            data: paginatedFiles,
            meta: {
                page,
                limit,
                totalCount: imageFiles.length,
                totalPages: Math.ceil(imageFiles.length / limit)
            }
        })

    } catch (error) {
        console.error('Error fetching images:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
