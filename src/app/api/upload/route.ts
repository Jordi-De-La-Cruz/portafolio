import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, stat, readdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Configuración básica
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Helper: Crear directorio si no existe
async function ensureUploadDir() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true })
    }
}

// Helper: Validaciones de archivo
function validateFile(file: File) {
    const errors = []
    if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push('Solo se permiten imágenes JPG, PNG o WebP')
    }
    if (file.size > MAX_FILE_SIZE) {
        errors.push(`Tamaño máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    }
    return errors
}

// Helper: Generar nombre único con timestamp + UUID
function generateFileName(originalName: string): string {
    const ext = path.extname(originalName)
    return `${Date.now()}-${uuidv4()}${ext}`
}

// POST - Subida de archivos
export async function POST(request: NextRequest) {
    try {
        await ensureUploadDir()
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'Archivo no recibido' },
                { status: 400 }
            )
        }

        const validationErrors = validateFile(file)
        if (validationErrors.length > 0) {
            return NextResponse.json(
                { error: 'Validación fallida', details: validationErrors },
                { status: 400 }
            )
        }

        const fileName = generateFileName(file.name)
        const filePath = path.join(UPLOAD_DIR, fileName)

        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(filePath, buffer)

        return NextResponse.json({
            success: true,
            data: {
                fileName,
                url: `/uploads/${fileName}`,
                size: file.size,
                type: file.type
            }
        })

    } catch (error) {
        console.error('[UPLOAD_ERROR]', error)
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        )
    }
}

// GET - Listado paginado de imágenes
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')

        await ensureUploadDir()
        const files = await readdir(UPLOAD_DIR)

        const imageFiles = (await Promise.all(
            files
                .filter(file => ['.jpg', '.jpeg', '.png', '.webp']
                    .includes(path.extname(file).toLowerCase()))
                .map(async file => {
                    const stats = await stat(path.join(UPLOAD_DIR, file))
                    return {
                        fileName: file,
                        url: `/uploads/${file}`,
                        size: stats.size,
                        uploadedAt: stats.birthtime
                    }
                })
        )).sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())

        const startIdx = (page - 1) * limit
        return NextResponse.json({
            data: imageFiles.slice(startIdx, startIdx + limit),
            meta: {
                page,
                limit,
                totalCount: imageFiles.length,
                totalPages: Math.ceil(imageFiles.length / limit)
            }
        })

    } catch (error) {
        console.error('[FETCH_IMAGES_ERROR]', error)
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        )
    }
}
