import { ProjectInput, SkillInput, ExperienceInput, PersonalInfoInput } from './validations'

// Configuración base del cliente API
class ApiClient {
  private baseUrl: string
  private token: string | null = null
  private isRetrying: boolean = false

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ''

    // Intentar obtener token del localStorage en el cliente
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
      console.log('🔧 ApiClient inicializado con token:', this.token ? 'Existe' : 'No existe')
    }
  }

  // Método para establecer el token de autenticación
  setToken(token: string) {
    console.log('🎫 ApiClient.setToken llamado con:', token ? 'Token válido' : 'Token vacío')
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
      console.log('💾 Token guardado en localStorage')
    }
  }

  // Método para limpiar el token
  clearToken() {
    console.log('🧹 ApiClient.clearToken llamado')
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      console.log('🗑️ Token removido de localStorage')

      // Disparar evento personalizado para que otros componentes puedan reaccionar
      window.dispatchEvent(new CustomEvent('auth-token-cleared'))
    }
  }

  // Verificar si hay token
  hasValidToken(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      return !!token
    }
    return !!this.token
  }

  // Método base para hacer peticiones HTTP
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

          // No reintentar automáticamente para evitar bucles
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

  // ===== MÉTODOS DE AUTENTICACIÓN =====

  async login(email: string, password: string) {
    console.log('🔐 ApiClient.login:', email)
    const response = await this.request<{
      data: { user: any; token: string }
      message: string
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    console.log('✅ Login exitoso, estableciendo token...')
    this.setToken(response.data.token)
    return response
  }

  async register(name: string, email: string, password: string) {
    console.log('📝 ApiClient.register:', { name, email })
    const response = await this.request<{
      data: { user: any; token: string }
      message: string
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })

    console.log('✅ Registro exitoso, estableciendo token...')
    this.setToken(response.data.token)
    return response
  }

  async verifyToken() {
    console.log('🔍 ApiClient.verifyToken')
    return this.request<{
      data: { user: any }
      message: string
    }>('/auth/verify')
  }

  async logout() {
    console.log('🚪 ApiClient.logout')
    try {
      await this.request('/auth/logout', { method: 'POST' })
    } catch (error) {
      console.log('Error en logout del servidor, pero limpiando token local')
    } finally {
      this.clearToken()
    }
  }

  // ===== MÉTODOS PARA PROYECTOS =====

  async getProjects(params?: {
    page?: number
    limit?: number
    featured?: boolean
    search?: string
  }) {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString())
    if (params?.search) searchParams.append('search', params.search)

    const query = searchParams.toString()
    return this.request<{
      data: any[]
      meta: {
        page: number
        limit: number
        totalCount: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
      }
    }>(`/admin/projects${query ? `?${query}` : ''}`)
  }

  async getProject(id: string) {
    return this.request<{ data: any }>(`/admin/projects/${id}`)
  }

  async createProject(data: ProjectInput) {
    return this.request<{
      data: any
      message: string
    }>('/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProject(id: string, data: ProjectInput) {
    return this.request<{
      data: any
      message: string
    }>(`/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: string) {
    return this.request<{ message: string }>(`/admin/projects/${id}`, {
      method: 'DELETE',
    })
  }

  // ===== MÉTODOS PARA HABILIDADES =====

  async getSkills(params?: {
    page?: number
    limit?: number
    featured?: boolean
    search?: string
  }) {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString())
    if (params?.search) searchParams.append('search', params.search)

    const query = searchParams.toString()
    return this.request<{
      data: any[]
      meta: any
    }>(`/admin/skills${query ? `?${query}` : ''}`)
  }

  async createSkill(data: SkillInput) {
    return this.request<{
      data: any
      message: string
    }>('/admin/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateSkill(id: string, data: SkillInput) {
    return this.request<{
      data: any
      message: string
    }>(`/admin/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteSkill(id: string) {
    return this.request<{ message: string }>(`/admin/skills/${id}`, {
      method: 'DELETE',
    })
  }

  // ===== MÉTODOS PARA EXPERIENCIAS =====

  async getExperiences(params?: {
    page?: number
    limit?: number
    current?: boolean
    search?: string
  }) {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.current !== undefined) searchParams.append('current', params.current.toString())
    if (params?.search) searchParams.append('search', params.search)

    const query = searchParams.toString()
    return this.request<{
      data: any[]
      meta: any
    }>(`/admin/experiences${query ? `?${query}` : ''}`)
  }

  async createExperience(data: ExperienceInput) {
    return this.request<{
      data: any
      message: string
    }>('/admin/experiences', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateExperience(id: string, data: ExperienceInput) {
    return this.request<{
      data: any
      message: string
    }>(`/admin/experiences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteExperience(id: string) {
    return this.request<{ message: string }>(`/admin/experiences/${id}`, {
      method: 'DELETE',
    })
  }

  // ===== MÉTODOS PARA INFORMACIÓN PERSONAL =====

  async updatePersonalInfo(data: PersonalInfoInput) {
    return this.request<{
      data: any
      message: string
    }>('/admin/personal', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // ===== MÉTODOS PARA ESTADÍSTICAS =====

  async getDashboardStats() {
    return this.request<{
      data: {
        overview: {
          totalProjects: number
          featuredProjects: number
          totalSkills: number
          featuredSkills: number
          totalExperiences: number
          projectsCompletionRate: number
        }
        currentJob: any
        recentActivity: {
          recentProjects: any[]
        }
        skillsDistribution: Array<{
          category: string
          count: number
        }>
        summary: {
          lastUpdated: string
          hasPersonalInfo: boolean
        }
      }
      message: string
    }>('/admin/stats')
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient()

// Hook personalizado para usar en componentes React
export function useApiClient() {
  return apiClient
}
