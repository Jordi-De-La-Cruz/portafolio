'use client'

import { useState, useEffect } from 'react'
import type { PersonalInfo, Project, Skill, Experience } from '@prisma/client'
import { Header, HeroSection, AboutSection } from './portfolio/HeaderSections'
import { ExperienceSection, ProjectsSection, SkillsSection } from './portfolio/ContentSections'
import { ServicesSection, ContactSection, Footer } from './portfolio/FooterSections'

interface PortafolioClientProps {
  personalInfo: PersonalInfo | null
  featuredProjects: Project[]
  featuredSkills: Skill[]
  experiences: Experience[]
}

export default function PortafolioClient({
  personalInfo,
  featuredProjects,
  featuredSkills,
  experiences
}: PortafolioClientProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header personalInfo={personalInfo} />

      <HeroSection personalInfo={personalInfo} isLoaded={isLoaded} />

      <AboutSection
        personalInfo={personalInfo}
        featuredProjects={featuredProjects}
        featuredSkills={featuredSkills}
        experiences={experiences}
      />

      <ExperienceSection experiences={experiences} />

      <ProjectsSection featuredProjects={featuredProjects} />

      <SkillsSection featuredSkills={featuredSkills} />

      <ServicesSection />

      <ContactSection personalInfo={personalInfo} />

      <Footer personalInfo={personalInfo} />
    </div>
  )
}
