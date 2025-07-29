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
    // Estados de autenticación
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const isAuthenticated = !!user

    // Verificar token al inicializar
    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('auth_token')
            if (!token) {
                setIsLoading(false)
                return
            }

            try {
                apiClient.setToken(token)
                const response = await apiClient.verifyToken()
                setUser(response.data.user)
            } catch (error) {
                console.error('Error al verificar el token', error)
                handleLogout()
            }
            finally {
                setIsLoading(false)
            }
        }

        verifyToken()
    }, [])

    // Manejar logout limpio
    const handleLogout = () => {
        localStorage.removeItem('auth_token')
        apiClient.clearToken()
        setUser(null)
        setError(null)
    }

    // Login de usuario
    const login = async (email: string, password: string) => {
        try {
            setError(null)
            setIsLoading(true)

            const response = await apiClient.login(email, password)
            if (!response.data.token) {
                throw new Error('Error de autenticación')
            }

            setUser(response.data.user)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error en login')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Registro de usuario
    const register = async (name: string, email: string, password: string) => {
        try {
            setError(null)
            setIsLoading(true)

            const response = await apiClient.register(name, email, password)
            if (!response.data.token) {
                throw new Error('Error en registro')
            }

            setUser(response.data.user)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error en registro')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Limpiar errores
    const clearError = () => setError(null)

    // Proveedor de contexto
    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout: handleLogout,
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
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider')
    }
    return context
}
