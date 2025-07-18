import { getAllAdminData } from '@/lib/db'
import AdminClient from '@/components/AdminClient'
import ProtectedRoute from '@/components/ProtectedRoute'

export default async function AdminPage() {
  const { personalInfo, projects, skills, experiences } = await getAllAdminData()
  
  return (
    <ProtectedRoute>
      <AdminClient
        personalInfo={personalInfo}
        projects={projects}
        skills={skills}
        experiences={experiences}
      />
    </ProtectedRoute>
  )
}
