'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'

interface User {
    id: string
    email: string
    name: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    error: string | null
    clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const isAuthenticated = !!user

    // Verificar token al cargar la aplicación
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem('auth_token')
                console.log('🔍 Verificando token:', token ? 'Existe' : 'No existe')

                if (!token) {
                    console.log('❌ No hay token, usuario no autenticado')
                    setIsLoading(false)
                    return
                }

                // Asegurarse de que el apiClient tenga el token
                apiClient.setToken(token)

                console.log('📡 Verificando token con servidor...')
                const response = await apiClient.verifyToken()

                console.log('✅ Token válido, usuario autenticado:', response.data.user)
                setUser(response.data.user)
            } catch (error) {
                console.error('❌ Error verificando token:', error)
                // Token inválido, limpiar todo
                localStorage.removeItem('auth_token')
                apiClient.clearToken()
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        verifyToken()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            setError(null)
            setIsLoading(true)

            console.log('🔐 Intentando login con:', email)
            const response = await apiClient.login(email, password)

            console.log('✅ Login exitoso:', response.data.user)
            console.log('🎫 Token recibido:', response.data.token ? 'Sí' : 'No')

            // Verificar que el token existe
            if (!response.data.token) {
                throw new Error('No se recibió token del servidor')
            }

            // El token ya se guarda en apiClient.login(), pero verificamos
            const savedToken = localStorage.getItem('auth_token')
            console.log('💾 Token guardado en localStorage:', savedToken ? 'Sí' : 'No')

            // Verificar que el token esté correctamente configurado en apiClient
            if (savedToken) {
                console.log('🔍 Token en localStorage:', savedToken.substring(0, 20) + '...')
                // Forzar que el apiClient tenga el token
                apiClient.setToken(savedToken)
            }

            setUser(response.data.user)
            console.log('👤 Usuario establecido en contexto')

        } catch (error: any) {
            console.error('❌ Error en login:', error)
            setError(error.message || 'Error al iniciar sesión')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (name: string, email: string, password: string) => {
        try {
            setError(null)
            setIsLoading(true)

            console.log('📝 Intentando registro con:', { name, email })
            const response = await apiClient.register(name, email, password)

            console.log('✅ Registro exitoso:', response.data.user)
            console.log('🎫 Token recibido:', response.data.token ? 'Sí' : 'No')

            // Verificar que el token existe
            if (!response.data.token) {
                throw new Error('No se recibió token del servidor')
            }

            // El token ya se guarda en apiClient.register(), pero verificamos
            const savedToken = localStorage.getItem('auth_token')
            console.log('💾 Token guardado en localStorage:', savedToken ? 'Sí' : 'No')

            setUser(response.data.user)
            console.log('👤 Usuario establecido en contexto')

        } catch (error: any) {
            console.error('❌ Error en registro:', error)
            setError(error.message || 'Error al registrarse')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        console.log('🚪 Cerrando sesión...')
        localStorage.removeItem('auth_token')
        apiClient.clearToken()
        setUser(null)
        setError(null)
        console.log('✅ Sesión cerrada')
    }

    const clearError = () => {
        setError(null)
    }

    // Escuchar cuando el token sea limpiado por error 401
    useEffect(() => {
        const handleTokenError = () => {
            console.log('🚨 Token error detectado, cerrando sesión automáticamente')
            if (user) {
                setUser(null)
                setError('Sesión expirada, por favor inicia sesión nuevamente')
            }
        }

        // Verificar si el token fue limpiado
        const currentToken = localStorage.getItem('auth_token')
        if (user && !currentToken) {
            handleTokenError()
        }
    }, [user])

    // Debug: Log del estado actual
    console.log('🔄 AuthContext estado:', {
        isAuthenticated,
        isLoading,
        user: user ? user.email : null,
        error,
        tokenInStorage: typeof window !== 'undefined' ? !!localStorage.getItem('auth_token') : 'N/A'
    })

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        error,
        clearError
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
