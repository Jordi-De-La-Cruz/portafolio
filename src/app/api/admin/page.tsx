import { getAllPortafolioData } from '@/lib/db'

// Componente cliente que renderiza la vista
import AdminClient from '@/components/admin/AdminClient'

export default async function AdminPage() {
    // Obtener datos
    const { personalInfo, projects, skills, experiences } = await getAllPortafolioData()

    // Renderizar componente con datos
    return (
        <AdminClient
            personalInfo={personalInfo}
            projects={projects}
            skills={skills}
            experiences={experiences}
        />
    )
}
