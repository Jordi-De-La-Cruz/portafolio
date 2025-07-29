import { Calendar, Briefcase, ExternalLink, Github, Code, GraduationCap } from 'lucide-react'
import Image from 'next/image'
import type { Experience, Project, Skill } from '@prisma/client'

// Experience Section
interface ExperienceSectionProps {
    experiences: Experience[]
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
    return (
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
                                    {/* Línea timeline */}
                                    {index !== experiences.length - 1 && (
                                        <div className="absolute left-8 top-16 w-0.5 h-full bg-blue-200"></div>
                                    )}

                                    <div className="flex items-start space-x-6">
                                        {/* Punto timeline */}
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${experience.current ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            <Briefcase className="w-6 h-6" />
                                        </div>

                                        {/* Card experiencia */}
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
    )
}

// Projects Section
interface ProjectsSectionProps {
    featuredProjects: Project[]
}

export function ProjectsSection({ featuredProjects }: ProjectsSectionProps) {
    return (
        <section id="projects" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Proyectos Destacados</h2>
                    <p className="text-xl text-gray-600">Algunos de mis trabajos más recientes</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProjects.map((project, index) => (
                        <div key={`featured-project-${project.id}-${index}`}
                            className="group bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* Imagen proyecto */}
                            {project.imageUrl && (
                                <div className="aspect-video relative overflow-hidden">
                                    <Image
                                        src={project.imageUrl}
                                        alt={project.title}
                                        fill
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            )}

                            {/* Info proyecto */}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>

                                {/* Tags tecnologías */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {JSON.parse(project.technologies).map((tech: string, techIndex: number) => (
                                        <span key={`${project.id}-tech-${techIndex}-${tech}`}
                                            className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Enlaces proyecto */}
                                <div className="flex space-x-4">
                                    {project.demoUrl && (
                                        <a
                                            href={project.demoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Ver demo"
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
    )
}

// Skills Section
interface SkillsSectionProps {
    featuredSkills: Skill[]
}

export function SkillsSection({ featuredSkills }: SkillsSectionProps) {
    return (
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
                                {/* Avatar skill */}
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-white font-bold text-lg">{skill.name[0].toUpperCase()}</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                                    <p className="text-sm text-gray-600">{skill.category}</p>
                                </div>
                            </div>

                            {/* Nivel skill */}
                            <div className="mb-3">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Nivel</span>
                                    <span className="font-medium text-gray-900">{skill.level}</span>
                                    <div className="skill-progress-bar">
                                        <div
                                            className={`skill-progress-fill ${skill.level === 'Principiante' ? 'skill-progress-fill-beginner' :
                                                skill.level === 'Intermedio' ? 'skill-progress-fill-intermediate' :
                                                    skill.level === 'Avanzado' ? 'skill-progress-fill-advanced' : 'skill-progress-fill-expert'
                                                }`}
                                        />
                                    </div>
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
    )
}
