'use client'

import { useState } from 'react'
import { BarChart3, User, Code, Settings, Briefcase } from 'lucide-react'
import { useAdminActions } from '@/hooks/useAdminActions'
import AdminHeader from './AdminHeader'
import PersonalSection from './PersonalSection'
import ProjectsSection from './ProjectsSection'
import SkillsSection from './SkillsSection'
import ExperiencesSection from './ExperiencesSection'
import DashboardStats from '@/components/DashboardStats'
import type { AdminClientProps, ActiveTab } from '@/types/admin'

const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'personal', label: 'Información Personal', icon: User },
    { id: 'projects', label: 'Proyectos', icon: Code },
    { id: 'skills', label: 'Habilidades', icon: Settings },
    { id: 'experiences', label: 'Experiencias', icon: Briefcase }
]

export default function AdminClient({ personalInfo, projects, skills, experiences }: AdminClientProps) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
    const adminActions = useAdminActions()

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    {/* Tabs de navegación */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as ActiveTab)}
                                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Contenido de las secciones */}
                    <div className="p-6">
                        {activeTab === 'dashboard' && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
                                <DashboardStats />
                            </div>
                        )}

                        {activeTab === 'personal' && (
                            <PersonalSection
                                personalInfo={personalInfo}
                                onSave={(data) => adminActions.handleSave(data, 'personal')}
                            />
                        )}

                        {activeTab === 'projects' && (
                            <ProjectsSection
                                projects={projects}
                                onSave={(data) => adminActions.handleSave(data, 'project')}
                                {...adminActions}
                            />
                        )}

                        {activeTab === 'skills' && (
                            <SkillsSection
                                skills={skills}
                                onSave={(data) => adminActions.handleSave(data, 'skill')}
                                {...adminActions}
                            />
                        )}

                        {activeTab === 'experiences' && (
                            <ExperiencesSection
                                experiences={experiences}
                                onSave={(data) => adminActions.handleSave(data, 'experience')}
                                {...adminActions}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
