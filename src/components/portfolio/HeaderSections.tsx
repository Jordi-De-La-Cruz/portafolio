import { Code, MapPin, Mail, Phone, Calendar, Award, Briefcase, Star } from 'lucide-react'
import type { PersonalInfo, Project, Skill, Experience } from '@prisma/client'
import MobileNav from '../MobileNav'

// Header Component
interface HeaderProps {
    personalInfo: PersonalInfo | null
}

export function Header({ personalInfo }: HeaderProps) {
    return (
        <header className="bg-white shadow-sm fixed w-full top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="text-2xl font-bold text-gray-900">
                        {personalInfo?.name || 'Jordi De la Cruz'}
                    </div>

                    {/* Nav desktop */}
                    <div className="hidden md:flex space-x-8">
                        <a href="#inicio" className="text-gray-600 hover:text-blue-600 transition-colors">Inicio</a>
                        <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">Sobre mí</a>
                        <a href="#experience" className="text-gray-600 hover:text-blue-600 transition-colors">Experiencia</a>
                        <a href="#projects" className="text-gray-600 hover:text-blue-600 transition-colors">Proyectos</a>
                        <a href="#skills" className="text-gray-600 hover:text-blue-600 transition-colors">Habilidades</a>
                        <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">Servicios</a>
                        <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contacto</a>
                        <a href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Admin
                        </a>
                    </div>

                    <MobileNav personalName={personalInfo?.name} />
                </div>
            </nav>
        </header>
    )
}

// Hero Section Component
interface HeroSectionProps {
    personalInfo: PersonalInfo | null
    isLoaded: boolean
}

export function HeroSection({ personalInfo, isLoaded }: HeroSectionProps) {
    return (
        <section id="inicio" className="bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Contenido principal */}
                        <div>
                            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                                Hola, soy <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                                    {personalInfo?.name || 'Jordi De la Cruz'}
                                </span>
                            </h1>
                            <h2 className="text-2xl lg:text-3xl mb-6 text-blue-100">
                                {personalInfo?.title || 'Desarrollador Full Stack'}
                            </h2>
                            <p className="text-lg mb-8 max-w-2xl text-blue-50 leading-relaxed">
                                {personalInfo?.description || 'Desarrollador de software con experiencia en proyectos full-stack y desarrollo móvil.'}
                            </p>

                            {/* Botones CTA */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="#contact" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 text-center">
                                    Contactar
                                </a>
                                <a href="#projects" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 text-center">
                                    Ver Proyectos
                                </a>
                            </div>
                        </div>

                        {/* Avatar circular */}
                        <div className="hidden lg:flex justify-center">
                            <div className="w-80 h-80 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <div className="w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                    <Code className="w-32 h-32 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// About Section Component
interface AboutSectionProps {
    personalInfo: PersonalInfo | null
    featuredProjects: Project[]
    featuredSkills: Skill[]
    experiences: Experience[]
}

export function AboutSection({
    personalInfo,
    featuredProjects,
    featuredSkills,
    experiences
}: AboutSectionProps) {
    return (
        <section id="about" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Título sección */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Sobre Mí</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Apasionado por la tecnología y el desarrollo de soluciones innovadoras
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Info personal */}
                    <div className="space-y-6">
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {personalInfo?.description || 'Soy un desarrollador full-stack con más de 3 años de experiencia creando aplicaciones web y móviles. Me especializo en tecnologías modernas como React, Node.js, y bases de datos tanto SQL como NoSQL.'}
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Mi enfoque se centra en escribir código limpio, mantenible y escalable. Disfruto trabajando en equipo y siempre estoy buscando nuevas tecnologías y mejores prácticas para mejorar mis habilidades.
                        </p>

                        {/* Datos contacto */}
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">{personalInfo?.location || 'Trujillo, Perú'}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">{personalInfo?.email || 'email@ejemplo.com'}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">{personalInfo?.phone || '+51 900-000-000'}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">Disponible para proyectos</span>
                            </div>
                        </div>
                    </div>

                    {/* Cards estadísticas */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-6 rounded-xl text-center">
                            <Award className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-900 mb-1">{featuredProjects.length}+</div>
                            <div className="text-gray-600">Proyectos Completados</div>
                        </div>
                        <div className="bg-green-50 p-6 rounded-xl text-center">
                            <Code className="w-8 h-8 text-green-600 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-900 mb-1">{featuredSkills.length}+</div>
                            <div className="text-gray-600">Tecnologías</div>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-xl text-center">
                            <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-900 mb-1">{experiences.length}+</div>
                            <div className="text-gray-600">Años de Experiencia</div>
                        </div>
                        <div className="bg-orange-50 p-6 rounded-xl text-center">
                            <Star className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-gray-900 mb-1">4.9</div>
                            <div className="text-gray-600">Rating Promedio</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
