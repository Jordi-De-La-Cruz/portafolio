'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react'

interface LoginFormProps {
    onToggleMode: () => void
    isRegisterMode: boolean
}

interface FormData {
    name: string
    email: string
    password: string
}

export default function LoginForm({ onToggleMode, isRegisterMode }: LoginFormProps) {
    // Contexto de autenticación
    const { login, register, isLoading, error, clearError } = useAuth()

    // Estados del componente
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: ''
    })
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

    // Validación del formulario
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {}

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
            errors.password = 'Mínimo 6 caracteres'
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Manejar envío del formulario
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
        } catch (err) {
            console.error('Error de autenticación:', err)
        }
    }

    // Actualizar campos del formulario
    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        // Limpiar errores al escribir
        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: '' }))
        }

        // Limpiar errores del servidor
        if (error) clearError()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
                {/* Encabezado */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión'}
                    </h1>
                    <p className="text-gray-600">
                        {isRegisterMode
                            ? 'Regístrate para acceder al panel'
                            : 'Accede a tu panel de administración'
                        }
                    </p>
                </div>

                {/* Mensaje de error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-red-700 text-sm">{error}</span>
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campo Nombre (solo registro) */}
                    {isRegisterMode && (
                        <FormField
                            label="Nombre completo"
                            type="text"
                            value={formData.name}
                            onChange={(value) => handleInputChange('name', value)}
                            placeholder="Tu nombre completo"
                            icon={<User className="w-5 h-5 text-gray-400" />}
                            error={validationErrors.name}
                            disabled={isLoading}
                        />
                    )}

                    {/* Campo Email */}
                    <FormField
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(value) => handleInputChange('email', value)}
                        placeholder="tu@email.com"
                        icon={<Mail className="w-5 h-5 text-gray-400" />}
                        error={validationErrors.email}
                        disabled={isLoading}
                    />

                    {/* Campo Contraseña */}
                    <PasswordField
                        label="Contraseña"
                        value={formData.password}
                        onChange={(value) => handleInputChange('password', value)}
                        placeholder={isRegisterMode ? 'Mínimo 6 caracteres' : 'Tu contraseña'}
                        showPassword={showPassword}
                        onToggleShowPassword={() => setShowPassword(!showPassword)}
                        error={validationErrors.password}
                        disabled={isLoading}
                    />

                    {/* Botón de envío */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading
                            ? (isRegisterMode ? 'Registrando...' : 'Iniciando...')
                            : (isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión')
                        }
                    </button>
                </form>

                {/* Cambiar entre login/registro */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        {isRegisterMode ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
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

// Componente para campos de formulario genéricos
function FormField({
    label,
    type,
    value,
    onChange,
    placeholder,
    icon,
    error,
    disabled
}: {
    label: string
    type: string
    value: string
    onChange: (value: string) => void
    placeholder: string
    icon: React.ReactNode
    error?: string
    disabled?: boolean
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {icon}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )
}

// Componente especializado para contraseñas
function PasswordField({
    label,
    value,
    onChange,
    placeholder,
    showPassword,
    onToggleShowPassword,
    error,
    disabled
}: {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder: string
    showPassword: boolean
    onToggleShowPassword: () => void
    error?: string
    disabled?: boolean
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                <button
                    type="button"
                    onClick={onToggleShowPassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={disabled}
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )
}
