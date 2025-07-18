import { getAllPortafolioData } from '@/lib/db'
import PortafolioClient from '@/components/PortafolioClient'

export default async function Home() {
  const { personalInfo, projects, skills, experiences } = await getAllPortafolioData()

  return (
    <PortafolioClient
      personalInfo={personalInfo}
      featuredProjects={projects}
      featuredSkills={skills}
      experiences={experiences}
    />
  )
}
