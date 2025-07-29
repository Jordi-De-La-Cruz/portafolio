'use client'

import { useState } from 'react'
import { Upload, Grid, LucideIcon } from 'lucide-react'
import ImageUpload from './ImageUpload'
import ImageGallery from './ImageGallery'
import Image from 'next/image'

interface ImageSelectorProps {
    value: string
    onChange: (imageUrl: string) => void
    label?: string
    required?: boolean
    className?: string
}

export default function ImageSelector({
    value,
    onChange,
    label = 'Imagen',
    required = false,
    className = ''
}: ImageSelectorProps) {
    // Estados para controlar la pestaña activa y la galería
    const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload')
    const [isGalleryOpen, setIsGalleryOpen] = useState(false)

    // Configuración de las pestañas disponibles
    const tabs: Array<{ id: 'upload' | 'gallery', label: string, icon: LucideIcon }> = [
        { id: 'upload', label: 'Subir Nueva', icon: Upload },
        { id: 'gallery', label: 'Galería', icon: Grid }
    ]

    return (
        <div className={className}>
            {/* Etiqueta del selector */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Navegación por pestañas */}
            <div className="flex space-x-1 mb-4 p-1 bg-gray-100 rounded-lg">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                if (tab.id === 'gallery') {
                                    setIsGalleryOpen(true)
                                } else {
                                    setActiveTab(tab.id)
                                }
                            }}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Contenido según pestaña activa */}
            <div className="space-y-4">
                {activeTab === 'upload' && (
                    <ImageUpload
                        onImageUploaded={onChange}
                        currentImage={value}
                    />
                )}
            </div>

            {/* Vista previa de la imagen seleccionada */}
            {value && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Imagen actual:</p>
                    <div className="flex items-center space-x-3">
                        <Image
                            src={value}
                            alt="Imagen seleccionada"
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 truncate">{value}</p>
                            <button
                                onClick={() => onChange('')}
                                className="text-xs text-red-600 hover:text-red-700 mt-1"
                            >
                                Eliminar imagen
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de galería de imágenes */}
            <ImageGallery
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                onImageSelect={(imageUrl) => {
                    onChange(imageUrl)
                    setIsGalleryOpen(false)
                    setActiveTab('upload')
                }}
                selectedImage={value}
            />
        </div>
    )
}
