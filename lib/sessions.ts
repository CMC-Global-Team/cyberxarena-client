import { api } from "./api"

export interface SessionDTO {
  sessionId: number
  customerId: number
  customerName: string
  computerId: number
  computerName: string
  startTime: string
  endTime?: string
  status: "Active" | "Ended"
  pricePerHour?: number
  totalAmount?: number
}

export interface SessionCreateRequest {
  customerId: number
  computerId: number
  startTime?: string
}

export interface SessionUpdateRequest {
  customerId?: number
  computerId?: number
  startTime?: string
  endTime?: string
}

export interface SessionSearchParams {
  customerName?: string
  computerName?: string
  status?: string
  page?: number
  size?: number
  sortBy?: string
  sortDir?: "asc" | "desc"
}

export interface SessionListParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: "asc" | "desc"
}

export interface SessionListResponse {
  content: SessionDTO[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export class SessionApi {
  static async list(params: SessionListParams = {}): Promise<SessionListResponse> {
    const searchParams = new URLSearchParams()
    
    if (params.page !== undefined) searchParams.append('page', params.page.toString())
    if (params.size !== undefined) searchParams.append('size', params.size.toString())
    if (params.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params.sortDir) searchParams.append('sortDir', params.sortDir)

    const response = await api.get(`/sessions?${searchParams.toString()}`)
    return response.data
  }

  static async search(params: SessionSearchParams): Promise<SessionListResponse> {
    const searchParams = new URLSearchParams()
    
    if (params.customerName) searchParams.append('customerName', params.customerName)
    if (params.computerName) searchParams.append('computerName', params.computerName)
    if (params.status) searchParams.append('status', params.status)
    if (params.page !== undefined) searchParams.append('page', params.page.toString())
    if (params.size !== undefined) searchParams.append('size', params.size.toString())
    if (params.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params.sortDir) searchParams.append('sortDir', params.sortDir)

    const response = await api.get(`/sessions/search?${searchParams.toString()}`)
    return response.data
  }

  static async getById(sessionId: number): Promise<SessionDTO> {
    const response = await api.get(`/sessions/${sessionId}`)
    return response.data
  }

  static async create(data: SessionCreateRequest): Promise<SessionDTO> {
    const response = await api.post('/sessions', data)
    return response.data
  }

  static async update(sessionId: number, data: SessionUpdateRequest): Promise<SessionDTO> {
    const response = await api.put(`/sessions/${sessionId}`, data)
    return response.data
  }

  static async delete(sessionId: number): Promise<void> {
    await api.delete(`/sessions/${sessionId}`)
  }

  static async endSession(sessionId: number): Promise<SessionDTO> {
    const response = await api.post(`/sessions/${sessionId}/end`)
    return response.data
  }

  static async getActiveSessions(): Promise<SessionDTO[]> {
    const response = await api.get('/sessions/active')
    return response.data
  }

  static async getSessionStats(): Promise<{
    totalSessions: number
    activeSessions: number
    totalRevenue: number
    averageSessionDuration: number
  }> {
    const response = await api.get('/sessions/stats')
    return response.data
  }
}
