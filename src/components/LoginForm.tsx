'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react'

interface LoginFormProps {
    onToggleMode: () => void
    isRegisterMode: boolean
}

export default function LoginForm({ onToggleMode, isRegisterMode }: LoginFormProps) {
    const { login, register, isLoading, error, clearError } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

    const validateForm = () => {
        const errors: { [key: string]: string } = {}

        if (isRegisterMode && !formData.name.trim()) {
            errors.name = 'El nombre es requerido'
        }

        if (!formData.email.trim()) {
            errors.email = 'El email es requerido'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'El email no es válido'
        }

        if (!formData.password) {
            errors.password = 'La contraseña es requerida'
        } else if (isRegisterMode && formData.password.length < 6) {
            errors.password = 'La contraseña debe tener al menos 6 caracteres'
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()

        if (!validateForm()) return

        try {
            if (isRegisterMode) {
                await register(formData.name, formData.email, formData.password)
            } else {
                await login(formData.email, formData.password)
            }
        } catch (error) {
            console.error('Error during authentication:', error)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Limpiar error de validación cuando el usuario empiece a escribir
        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: '' }))
        }
        if (error) clearError()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión'}
                    </h1>
                    <p className="text-gray-600">
                        {isRegisterMode
                            ? 'Regístrate para acceder al panel de administración'
                            : 'Accede al panel de administración de tu portafolio'
                        }
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-red-700 text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isRegisterMode && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre completo
                            </label>
                            <div className="relative">
                                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Tu nombre completo"
                                    disabled={isLoading}
                                />
                            </div>
                            {validationErrors.name && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="tu@email.com"
                                disabled={isLoading}
                            />
                        </div>
                        {validationErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder={isRegisterMode ? 'Mínimo 6 caracteres' : 'Tu contraseña'}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {validationErrors.password && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading
                            ? (isRegisterMode ? 'Registrando...' : 'Iniciando sesión...')
                            : (isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión')
                        }
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        {isRegisterMode ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
                        <button
                            onClick={onToggleMode}
                            className="ml-2 text-blue-600 hover:text-blue-700 font-semibold"
                            disabled={isLoading}
                        >
                            {isRegisterMode ? 'Iniciar sesión' : 'Registrarse'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
