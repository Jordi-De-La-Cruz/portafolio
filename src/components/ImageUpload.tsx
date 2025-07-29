'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Check } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
    onImageUploaded: (imageUrl: string) => void
    currentImage?: string
    className?: string
}

export default function ImageUpload({
    onImageUploaded,
    currentImage,
    className = ''
}: ImageUploadProps) {
    // Estados del componente
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [preview, setPreview] = useState<string | null>(currentImage || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Manejar selección de archivo
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validar tipo y tamaño
        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
            setError('Solo se permiten imágenes JPG, PNG o WebP')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('El tamaño máximo permitido es 5MB')
            return
        }

        // Mostrar vista previa
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)

        // Iniciar subida
        await uploadFile(file)
    }

    // Subir archivo al servidor
    const uploadFile = async (file: File) => {
        setIsUploading(true)
        setError(null)
        setUploadProgress(0)

        try {
            const formData = new FormData()
            formData.append('file', file)

            // Simular progreso (para UI)
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90))
            }, 200)

            // Realizar petición
            const token = localStorage.getItem('auth_token')
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            clearInterval(progressInterval)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al subir la imagen')
            }

            const result = await response.json()
            setUploadProgress(100)
            onImageUploaded(result.data.url)

            setTimeout(() => setUploadProgress(0), 1000)

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido')
            setPreview(currentImage || null)
        } finally {
            setIsUploading(false)
        }
    }

    // Eliminar imagen seleccionada
    const handleRemoveImage = () => {
        setPreview(null)
        onImageUploaded('')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // Manejar drag and drop
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file && fileInputRef.current) {
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(file)
            fileInputRef.current.files = dataTransfer.files
            handleFileSelect({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>)
        }
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Área de subida */}
            <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isUploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">Subiendo imagen...</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500">{uploadProgress}%</p>
                        </div>
                    </div>
                ) : preview ? (
                    <div className="space-y-3">
                        <div className="relative inline-block">
                            <Image
                                src={preview}
                                alt="Preview"
                                width={192}
                                height={192}
                                className="max-w-full max-h-48 rounded-lg shadow-sm"
                            />
                            <button
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">Haz clic para cambiar</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Sube una imagen</p>
                            <p className="text-xs text-gray-500">o arrástrala aquí</p>
                        </div>
                        <p className="text-xs text-gray-400">Formatos: PNG, JPG, WebP (max 5MB)</p>
                    </div>
                )}
            </div>

            {/* Mensajes de estado */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {uploadProgress === 100 && !error && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-700">Imagen subida correctamente</p>
                </div>
            )}
        </div>
    )
}
