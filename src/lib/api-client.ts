import { ProjectInput, SkillInput, ExperienceInput, PersonalInfoInput } from './validations'
import type {
  User,
  Project,
  Skill,
  Experience,
  PersonalInfo
} from '@prisma/client'

// Interfaces para estructuras de datos comunes
export interface PaginationMeta {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface DashboardOverview {
  totalProjects: number
  featuredProjects: number
  totalSkills: number
  featuredSkills: number
  totalExperiences: number
  projectsCompletionRate: number
}

export interface CurrentJob extends Experience {
  durationMonths: number
}

export interface SkillDistribution {
  category: string
  count: number
}

export interface RecentActivity {
  recentProjects: Project[]
}

export interface DashboardStats {
  overview: DashboardOverview
  currentJob: CurrentJob | null
  recentActivity: RecentActivity
  skillsDistribution: SkillDistribution[]
}

// Interfaces para respuestas de la API
export interface AuthResponse {
  data: {
    user: User
    token: string
  }
  message: string
}

export interface ProjectResponse {
  data: Project
  message?: string
}

export interface ProjectsResponse {
  data: Project[]
  meta: PaginationMeta
}

export interface SkillResponse {
  data: Skill
  message?: string
}

export interface SkillsResponse {
  data: Skill[]
  meta: PaginationMeta
}

export interface ExperienceResponse {
  data: Experience
  message?: string
}

export interface ExperiencesResponse {
  data: Experience[]
  meta: PaginationMeta
}

export interface PersonalInfoResponse {
  data: PersonalInfo
  message: string
}

export interface DashboardStatsResponse {
  data: DashboardStats
  message: string
}

export interface MessageResponse {
  message: string
}

export interface UserResponse {
  data: { user: User }
  message: string
}

// Clase principal del cliente API
class ApiClient {
  private baseUrl: string
  private token: string | null = null
  private isRetrying: boolean = false

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ''

    // Inicialización del token desde localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
      console.log('🔧 ApiClient inicializado con token:', this.token ? 'Existe' : 'No existe')
    }
  }

  // Métodos para manejo de autenticación
  setToken(token: string) {
    console.log('🎫 ApiClient.setToken llamado con:', token ? 'Token válido' : 'Token vacío')
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
      console.log('💾 Token guardado en localStorage')
    }
  }

  clearToken() {
    console.log('🧹 ApiClient.clearToken llamado')
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      console.log('🗑️ Token removido de localStorage')
      window.dispatchEvent(new CustomEvent('auth-token-cleared'))
    }
  }

  hasValidToken(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      return !!token
    }
    return !!this.token
  }

  // Método base para todas las peticiones HTTP
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Verificar que hay token antes de hacer la petición
    if (!this.hasValidToken() && !endpoint.includes('/auth/')) {
      console.log('❌ No hay token válido para la petición a:', endpoint)
      throw new Error('No hay sesión activa')
    }

    const url = `${this.baseUrl}/api${endpoint}`

    console.log(`📡 ApiClient.request: ${options.method || 'GET'} ${url}`)
    console.log('🎫 Token actual:', this.token ? `${this.token.substring(0, 20)}...` : 'No existe')

    // Actualizar token desde localStorage por si cambió
    if (typeof window !== 'undefined') {
      const currentToken = localStorage.getItem('auth_token')
      if (currentToken !== this.token) {
        this.token = currentToken
      }
    }

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      console.log(`📡 Respuesta de ${endpoint}:`, response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`❌ Error en ${endpoint}:`, errorData)

        // Si es error 401, limpiar token
        if (response.status === 401) {
          console.log('🔒 Error 401: Token inválido, limpiando...')
          this.clearToken()
          throw new Error('Token inválido o expirado')
        }

        throw new Error(errorData.error || `Error ${response.status}`)
      }

      const data = await response.json()
      console.log(`✅ Respuesta exitosa de ${endpoint}`)
      return data
    } catch (error) {
      console.error(`❌ Error en petición ${endpoint}:`, error)
      throw error
    }
  }

  // Métodos para autenticación
  async login(email: string, password: string): Promise<AuthResponse> {
    console.log('🔐 ApiClient.login:', email)
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    console.log('✅ Login exitoso, estableciendo token...')
    this.setToken(response.data.token)
    return response
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    console.log('📝 ApiClient.register:', { name, email })
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })

    console.log('✅ Registro exitoso, estableciendo token...')
    this.setToken(response.data.token)
    return response
  }

  async verifyToken(): Promise<UserResponse> {
    console.log('🔍 ApiClient.verifyToken')
    return this.request<UserResponse>('/auth/verify')
  }

  async logout(): Promise<void> {
    console.log('🚪 ApiClient.logout')
    try {
      await this.request<MessageResponse>('/auth/logout', { method: 'POST' })
    } catch (error: unknown) {
      console.log('Error en logout del servidor, pero limpiando token local:', error)
    } finally {
      this.clearToken()
    }
  }

  // Métodos para proyectos
  async getProjects(params?: {
    page?: number
    limit?: number
    featured?: boolean
    search?: string
  }): Promise<ProjectsResponse> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString())
    if (params?.search) searchParams.append('search', params.search)

    const query = searchParams.toString()
    return this.request<ProjectsResponse>(`/admin/projects${query ? `?${query}` : ''}`)
  }

  async getProject(id: string): Promise<ProjectResponse> {
    return this.request<ProjectResponse>(`/admin/projects/${id}`)
  }

  async createProject(data: ProjectInput): Promise<ProjectResponse> {
    return this.request<ProjectResponse>('/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProject(id: string, data: ProjectInput): Promise<ProjectResponse> {
    return this.request<ProjectResponse>(`/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(`/admin/projects/${id}`, {
      method: 'DELETE',
    })
  }

  // Métodos para habilidades
  async getSkills(params?: {
    page?: number
    limit?: number
    featured?: boolean
    search?: string
  }): Promise<SkillsResponse> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString())
    if (params?.search) searchParams.append('search', params.search)

    const query = searchParams.toString()
    return this.request<SkillsResponse>(`/admin/skills${query ? `?${query}` : ''}`)
  }

  async createSkill(data: SkillInput): Promise<SkillResponse> {
    return this.request<SkillResponse>('/admin/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateSkill(id: string, data: SkillInput): Promise<SkillResponse> {
    return this.request<SkillResponse>(`/admin/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteSkill(id: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(`/admin/skills/${id}`, {
      method: 'DELETE',
    })
  }

  // Métodos para experiencias
  async getExperiences(params?: {
    page?: number
    limit?: number
    current?: boolean
    search?: string
  }): Promise<ExperiencesResponse> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.current !== undefined) searchParams.append('current', params.current.toString())
    if (params?.search) searchParams.append('search', params.search)

    const query = searchParams.toString()
    return this.request<ExperiencesResponse>(`/admin/experiences${query ? `?${query}` : ''}`)
  }

  async createExperience(data: ExperienceInput): Promise<ExperienceResponse> {
    return this.request<ExperienceResponse>('/admin/experiences', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateExperience(id: string, data: ExperienceInput): Promise<ExperienceResponse> {
    return this.request<ExperienceResponse>(`/admin/experiences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteExperience(id: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(`/admin/experiences/${id}`, {
      method: 'DELETE',
    })
  }

  // Métodos para información personal
  async updatePersonalInfo(data: PersonalInfoInput): Promise<PersonalInfoResponse> {
    return this.request<PersonalInfoResponse>('/admin/personal', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Métodos para estadísticas
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    return this.request<DashboardStatsResponse>('/admin/stats')
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient()

// Hook para usar el cliente en componentes React
export function useApiClient() {
  return apiClient
}
