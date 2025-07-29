'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Check } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
    onImageUploaded: (imageUrl: string) => void
    currentImage?: string
    className?: string
}

export default function ImageUpload({ onImageUploaded, currentImage, className = '' }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [preview, setPreview] = useState<string | null>(currentImage || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validaciones del lado del cliente
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!validTypes.includes(file.type)) {
            setError('Tipo de archivo no válido. Solo se permiten JPG, PNG y WebP')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('El archivo es muy grande. Máximo 5MB')
            return
        }

        // Mostrar preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)

        // Subir archivo
        await uploadFile(file)
    }

    const uploadFile = async (file: File) => {
        setIsUploading(true)
        setError(null)
        setUploadProgress(0)

        try {
            const formData = new FormData()
            formData.append('file', file)

            // Obtener el token del localStorage
            const token = localStorage.getItem('auth_token')

            // Simular progreso
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return 90
                    }
                    return prev + 10
                })
            }, 200)

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            })

            clearInterval(progressInterval)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al subir imagen')
            }

            const result = await response.json()
            setUploadProgress(100)

            onImageUploaded(result.data.url)

            setTimeout(() => {
                setUploadProgress(0)
            }, 1000)

        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Error al subir imagen')
            setPreview(currentImage || null)
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemoveImage = () => {
        setPreview(null)
        onImageUploaded('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        if (file) {
            // Simular selección de archivo
            const input = fileInputRef.current
            if (input) {
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(file)
                input.files = dataTransfer.files
                handleFileSelect({ target: input } as React.ChangeEvent<HTMLInputElement>)
            }
        }
    }

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault()
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Área de upload */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isUploading
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
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
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
                                className="max-w-full max-h-48 rounded-lg shadow-sm"
                            />
                            <button
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">
                            Haz clic para cambiar la imagen
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Haz clic para subir una imagen
                            </p>
                            <p className="text-xs text-gray-500">
                                o arrastra y suelta aquí
                            </p>
                        </div>
                        <p className="text-xs text-gray-400">
                            PNG, JPG, WebP hasta 5MB
                        </p>
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Estado de éxito */}
            {uploadProgress === 100 && !error && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-green-700">Imagen subida exitosamente</p>
                </div>
            )}
        </div>
    )
}
