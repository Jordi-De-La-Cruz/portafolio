import { Code, Briefcase, Award, Quote, Star, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react'
import type { PersonalInfo } from '@prisma/client'

// Services Section
export function ServicesSection() {
    return (
        <section id="services" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Servicios</h2>
                    <p className="text-xl text-gray-600">¿En qué puedo ayudarte?</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Desarrollo Web */}
                    <div className="group p-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 transition-all duration-300">
                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Code className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Desarrollo Web</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Desarrollo de aplicaciones web modernas y responsivas utilizando las últimas tecnologías como React, Vue.js, y Node.js.
                        </p>
                    </div>

                    {/* Consultoría */}
                    <div className="group p-8 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 transition-all duration-300">
                        <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Consultoría Técnica</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Asesoramiento en arquitectura de software, selección de tecnologías y mejores prácticas de desarrollo.
                        </p>
                    </div>

                    {/* Optimización */}
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

                {/* Testimonials */}
                <div className="mt-20">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Testimonios</h3>
                        <p className="text-xl text-gray-600">Lo que dicen mis clientes</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Testimonio 1 */}
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
                                &quot;Excelente trabajo en el desarrollo de nuestra plataforma. Muy profesional y cumplió con todos los tiempos establecidos.&quot;
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">María González</h4>
                                    <p className="text-sm text-gray-600">CEO, TechStart</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonio 2 */}
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
                                &quot;Su conocimiento técnico y capacidad para resolver problemas complejos es impresionante. Recomendado 100%.&quot;
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Carlos Mendoza</h4>
                                    <p className="text-sm text-gray-600">CTO, InnovateLab</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonio 3 */}
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
                                &quot;Trabajar con él fue una experiencia fantástica. Entrega código limpio y siempre está disponible para soporte.&quot;
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
            </div>
        </section>
    )
}

// Contact Section
interface ContactSectionProps {
    personalInfo: PersonalInfo | null
}

export function ContactSection({ personalInfo }: ContactSectionProps) {
    return (
        <section id="contact" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Tienes un proyecto en mente?</h2>
                    <p className="text-xl text-gray-600">Conversemos sobre cómo puedo ayudarte</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Info contacto */}
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

                        {/* Redes sociales */}
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Sígueme</h3>
                            <div className="flex space-x-4">
                                {personalInfo?.github && (
                                    <a
                                        href={personalInfo.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
                                        title="GitHub"
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
                                        title="LinkedIn"
                                    >
                                        <Linkedin className="w-6 h-6" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Formulario contacto */}
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
    )
}

// Footer Component
interface FooterProps {
    personalInfo: PersonalInfo | null
}

export function Footer({ personalInfo }: FooterProps) {
    return (
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
                                    title="GitHub"
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
                                    title="LinkedIn"
                                >
                                    <Linkedin className="w-6 h-6" />
                                </a>
                            )}
                            <a
                                href={`mailto:${personalInfo?.email}`}
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Email"
                            >
                                <Mail className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Enlaces rápidos */}
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

                    {/* Servicios */}
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

                {/* Copyright */}
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
    )
}
