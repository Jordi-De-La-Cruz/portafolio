'use client'

import { useState, useEffect } from 'react'
import { Github, Linkedin, Mail, Phone, MapPin, Calendar, ExternalLink, Star, Quote, Award, Code, Briefcase, GraduationCap } from 'lucide-react'
import type { PersonalInfo, Project, Skill, Experience } from '@prisma/client'
import MobileNav from './MobileNav'

interface PortafolioClientProps {
  personalInfo: PersonalInfo | null
  featuredProjects: Project[]
  featuredSkills: Skill[]
  experiences: Experience[]
}

export default function PortafolioClient({ personalInfo, featuredProjects, featuredSkills, experiences }: PortafolioClientProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-gray-900">
              {personalInfo?.name || 'Jordi De la Cruz'}
            </div>
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

      {/* Hero Section */}
      <section id="inicio" className="bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                  Hola, soy <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">{personalInfo?.name || 'Jordi De la Cruz'}</span>
                </h1>
                <h2 className="text-2xl lg:text-3xl mb-6 text-blue-100">
                  {personalInfo?.title || 'Desarrollador Full Stack'}
                </h2>
                <p className="text-lg mb-8 max-w-2xl text-blue-50 leading-relaxed">
                  {personalInfo?.description || 'Desarrollador de software con experiencia en proyectos full-stack y desarrollo móvil.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#contact" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 text-center">
                    Contactar
                  </a>
                  <a href="#projects" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 text-center">
                    Ver Proyectos
                  </a>
                </div>
              </div>

              {/* Avatar/Image placeholder */}
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

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sobre Mí</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Apasionado por la tecnología y el desarrollo de soluciones innovadoras
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {personalInfo?.description || 'Soy un desarrollador full-stack con más de 3 años de experiencia creando aplicaciones web y móviles. Me especializo en tecnologías modernas como React, Node.js, y bases de datos tanto SQL como NoSQL.'}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Mi enfoque se centra en escribir código limpio, mantenible y escalable. Disfruto trabajando en equipo y siempre estoy buscando nuevas tecnologías y mejores prácticas para mejorar mis habilidades.
              </p>

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

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Experiencia Profesional</h2>
            <p className="text-xl text-gray-600">Mi trayectoria profesional y logros</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {experiences.length > 0 ? (
              <div className="space-y-8">
                {experiences.map((experience, index) => (
                  <div key={experience.id} className="relative">
                    {/* Timeline line */}
                    {index !== experiences.length - 1 && (
                      <div className="absolute left-8 top-16 w-0.5 h-full bg-blue-200"></div>
                    )}

                    <div className="flex items-start space-x-6">
                      {/* Timeline dot */}
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${experience.current
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                        }`}>
                        <Briefcase className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="bg-white rounded-xl shadow-md p-6 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{experience.position}</h3>
                            <h4 className="text-lg text-blue-600 font-medium">{experience.company}</h4>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-2 md:mt-0">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(experience.startDate).toLocaleDateString('es-ES', {
                              month: 'long',
                              year: 'numeric'
                            })} - {experience.current ? 'Presente' :
                              experience.endDate ? new Date(experience.endDate).toLocaleDateString('es-ES', {
                                month: 'long',
                                year: 'numeric'
                              }) : 'Presente'
                            }
                            {experience.current && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Actual
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{experience.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay experiencias registradas aún</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Proyectos Destacados</h2>
            <p className="text-xl text-gray-600">Algunos de mis trabajos más recientes</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <div key={`featured-project-${project.id}-${index}`} className="group bg-white rounded-xl shadow-lg overflow-hidden">
                {project.imageUrl && (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {JSON.parse(project.technologies).map((tech: string, techIndex: number) => (
                      <span key={`${project.id}-tech-${techIndex}-${tech}`} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-gray-600 hover:text-gray-700 font-medium transition-colors"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Código
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {featuredProjects.length === 0 && (
            <div className="text-center py-12">
              <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay proyectos destacados aún</p>
            </div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Habilidades & Tecnologías</h2>
            <p className="text-xl text-gray-600">Tecnologías y herramientas que domino</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredSkills.map((skill, index) => (
              <div key={`featured-skill-${skill.id}-${index}`} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">{skill.name[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                    <p className="text-sm text-gray-600">{skill.category}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Nivel</span>
                    <span className="font-medium text-gray-900">{skill.level}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: skill.level === 'Principiante' ? '25%' :
                          skill.level === 'Intermedio' ? '50%' :
                            skill.level === 'Avanzado' ? '75%' : '90%'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {featuredSkills.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay habilidades destacadas aún</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Servicios</h2>
            <p className="text-xl text-gray-600">¿En qué puedo ayudarte?</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Desarrollo Web</h3>
              <p className="text-gray-700 leading-relaxed">
                Desarrollo de aplicaciones web modernas y responsivas utilizando las últimas tecnologías como React, Vue.js, y Node.js.
              </p>
            </div>

            <div className="group p-8 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 transition-all duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Consultoría Técnica</h3>
              <p className="text-gray-700 leading-relaxed">
                Asesoramiento en arquitectura de software, selección de tecnologías y mejores prácticas de desarrollo.
              </p>
            </div>

            <div className="group p-8 rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 hover:from-purple-100 hover:to-violet-200 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Optimización</h3>
              <p className="text-gray-700 leading-relaxed">
                Mejora del rendimiento, SEO y experiencia de usuario de aplicaciones web existentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Testimonios</h2>
            <p className="text-xl text-gray-600">Lo que dicen mis clientes</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-blue-600 mr-3" />
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Excelente trabajo en el desarrollo de nuestra plataforma. Muy profesional y cumplió con todos los tiempos establecidos."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">María González</h4>
                  <p className="text-sm text-gray-600">CEO, TechStart</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-blue-600 mr-3" />
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Su conocimiento técnico y capacidad para resolver problemas complejos es impresionante. Recomendado 100%."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Carlos Mendoza</h4>
                  <p className="text-sm text-gray-600">CTO, InnovateLab</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-blue-600 mr-3" />
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Trabajar con él fue una experiencia fantástica. Entrega código limpio y siempre está disponible para soporte."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ana Rodríguez</h4>
                  <p className="text-sm text-gray-600">Directora, WebStudio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Tienes un proyecto en mente?</h2>
            <p className="text-xl text-gray-600">Conversemos sobre cómo puedo ayudarte</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-600 mr-4" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href={`mailto:${personalInfo?.email}`} className="text-blue-600 hover:text-blue-700">
                        {personalInfo?.email || 'jordi.delacruz@tecsup.edu.pe'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-600 mr-4" />
                    <div>
                      <p className="font-medium text-gray-900">Teléfono</p>
                      <a href={`tel:${personalInfo?.phone}`} className="text-blue-600 hover:text-blue-700">
                        {personalInfo?.phone || '(+51) 900-000-000'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-600 mr-4" />
                    <div>
                      <p className="font-medium text-gray-900">Ubicación</p>
                      <p className="text-gray-600">{personalInfo?.location || 'Trujillo, La Libertad, Perú'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Sígueme</h3>
                <div className="flex space-x-4">
                  {personalInfo?.github && (
                    <a
                      href={personalInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                  )}
                  {personalInfo?.linkedIn && (
                    <a
                      href={personalInfo.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Envíame un mensaje</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="¿En qué puedo ayudarte?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Cuéntame sobre tu proyecto..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">{personalInfo?.name || 'Jordi De la Cruz'}</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                {personalInfo?.title || 'Desarrollador Full Stack'} apasionado por crear soluciones tecnológicas innovadoras y eficientes.
              </p>
              <div className="flex space-x-4">
                {personalInfo?.github && (
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                )}
                {personalInfo?.linkedIn && (
                  <a
                    href={personalInfo.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                )}
                <a
                  href={`mailto:${personalInfo?.email}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#inicio" className="text-gray-400 hover:text-white transition-colors">Inicio</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">Sobre mí</a></li>
                <li><a href="#experience" className="text-gray-400 hover:text-white transition-colors">Experiencia</a></li>
                <li><a href="#projects" className="text-gray-400 hover:text-white transition-colors">Proyectos</a></li>
                <li><a href="#skills" className="text-gray-400 hover:text-white transition-colors">Habilidades</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-400">Desarrollo Web</span></li>
                <li><span className="text-gray-400">Desarrollo Móvil</span></li>
                <li><span className="text-gray-400">Consultoría Técnica</span></li>
                <li><span className="text-gray-400">Optimización</span></li>
                <li><span className="text-gray-400">Mantenimiento</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} {personalInfo?.name || 'Jordi De la Cruz'}. Todos los derechos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Hecho con ❤️ en Trujillo, Perú
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
