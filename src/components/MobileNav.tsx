'use client'

import { useState } from 'react'
import { Menu, X, Home, User, Briefcase, Code, Settings, Mail, Shield } from 'lucide-react'

interface MobileNavProps {
  personalName?: string
}

export default function MobileNav({ personalName = 'Jordi De la Cruz' }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '#inicio', label: 'Inicio', icon: Home },
    { href: '#about', label: 'Sobre mí', icon: User },
    { href: '#experience', label: 'Experiencia', icon: Briefcase },
    { href: '#projects', label: 'Proyectos', icon: Code },
    { href: '#skills', label: 'Habilidades', icon: Settings },
    { href: '#services', label: 'Servicios', icon: Settings },
    { href: '#contact', label: 'Contacto', icon: Mail },
    { href: '/admin', label: 'Admin', icon: Shield }
  ]

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 hover:text-blue-600 p-2"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">{personalName}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="p-6">
              <ul className="space-y-4">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isAdmin = item.href === '/admin'
                  
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isAdmin
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
