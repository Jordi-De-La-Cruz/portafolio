import Link from 'next/link'
import { Home, LogOut, UserCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminHeader() {
    const { user, logout } = useAuth()

    return (
        <header className="bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    <div className="text-2xl font-bold text-gray-900">
                        Panel de Administración
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Usuario actual */}
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <UserCircle className="w-4 h-4" />
                            <span>Hola, {user?.name}</span>
                        </div>

                        {/* Navegación */}
                        <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600">
                            <Home className="w-4 h-4 mr-2" />
                            Volver al sitio
                        </Link>

                        <button
                            onClick={logout}
                            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    )
}
