import { getAllPortafolioData } from '@/lib/db'
import AdminClient from '@/components/AdminClient'

export default async function AdminPage() {
    const { personalInfo, projects, skills, experiences } = await getAllPortafolioData()

    return (
        <AdminClient
            personalInfo={personalInfo}
            projects={projects}
            skills={skills}
            experiences={experiences}
        />
    )
}
