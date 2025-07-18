'use client'

import { useState, useEffect } from 'react'
import { Search, Grid, Check, Loader2, Image as ImageIcon } from 'lucide-react'

interface ImageGalleryProps {
    onImageSelect: (imageUrl: string) => void
    selectedImage?: string
    isOpen: boolean
    onClose: () => void
}

interface ImageFile {
    fileName: string
    url: string
    size: number
    uploadedAt: string
}

export default function ImageGallery({ onImageSelect, selectedImage, isOpen, onClose }: ImageGalleryProps) {
    const [images, setImages] = useState<ImageFile[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        if (isOpen) {
            fetchImages()
        }
    }, [isOpen, currentPage])

    const fetchImages = async () => {
        setIsLoading(true)
        try {
            // Obtener el token del localStorage
            const token = localStorage.getItem('auth_token')

            const response = await fetch(`/api/upload?page=${currentPage}&limit=20`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const result = await response.json()
                setImages(result.data)
            }
        } catch (error) {
            console.error('Error fetching images:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredImages = images.filter(image =>
        image.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Galería de Imágenes</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                    >
                        ×
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 border-b">
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar imágenes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-48">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : filteredImages.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredImages.map((image) => (
                                <div
                                    key={image.fileName}
                                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedImage === image.url
                                        ? 'border-blue-500 ring-2 ring-blue-200'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => onImageSelect(image.url)}
                                >
                                    <div className="aspect-square relative">
                                        <img
                                            src={image.url}
                                            alt={image.fileName}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all" />

                                        {/* Selected indicator */}
                                        {selectedImage === image.url && (
                                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Image info */}
                                    <div className="p-3 bg-white">
                                        <p className="text-xs font-medium text-gray-900 truncate">
                                            {image.fileName}
                                        </p>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>{formatFileSize(image.size)}</span>
                                            <span>{formatDate(image.uploadedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">
                                {searchTerm ? 'No se encontraron imágenes' : 'No hay imágenes subidas'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                    <p className="text-sm text-gray-500">
                        {filteredImages.length} imagen{filteredImages.length !== 1 ? 'es' : ''}
                        {searchTerm && ' encontrada(s)'}
                    </p>
                    <div className="flex space-x-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        {selectedImage && (
                            <button
                                onClick={() => {
                                    onImageSelect(selectedImage)
                                    onClose()
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Seleccionar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
