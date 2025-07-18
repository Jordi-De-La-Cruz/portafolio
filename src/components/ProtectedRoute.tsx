'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import LoginForm from './LoginForm'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth()
    const [isRegisterMode, setIsRegisterMode] = useState(false)

    // Debug: Log del estado
    console.log('🛡️ ProtectedRoute render:', {
        isAuthenticated,
        isLoading,
        user: user ? user.email : null
    })

    // Mostrar loading mientras verifica la autenticación
    if (isLoading) {
        console.log('⏳ ProtectedRoute: Mostrando loading...')
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Verificando autenticación...</p>
                </div>
            </div>
        )
    }

    // Si no está autenticado, mostrar formulario de login
    if (!isAuthenticated) {
        console.log('🔒 ProtectedRoute: Usuario no autenticado, mostrando login')
        return (
            <LoginForm
                onToggleMode={() => setIsRegisterMode(!isRegisterMode)}
                isRegisterMode={isRegisterMode}
            />
        )
    }

    // Si está autenticado, mostrar el contenido protegido
    console.log('✅ ProtectedRoute: Usuario autenticado, mostrando contenido')
    return <>{children}</>
}
