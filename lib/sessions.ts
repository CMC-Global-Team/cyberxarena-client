import { http } from "./api"

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

    const response = await http.get<SessionListResponse>(`/sessions?${searchParams.toString()}`)
    return response
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

    const response = await http.get<SessionListResponse>(`/sessions/search?${searchParams.toString()}`)
    return response
  }

  static async getById(sessionId: number): Promise<SessionDTO> {
    const response = await http.get<SessionDTO>(`/sessions/${sessionId}`)
    return response
  }

  static async create(data: SessionCreateRequest): Promise<SessionDTO> {
    const response = await http.post<SessionDTO>('/sessions', data)
    return response
  }

  static async update(sessionId: number, data: SessionUpdateRequest): Promise<SessionDTO> {
    const response = await http.put<SessionDTO>(`/sessions/${sessionId}`, data)
    return response
  }

  static async delete(sessionId: number): Promise<void> {
    await http.delete(`/sessions/${sessionId}`)
  }

  static async endSession(sessionId: number): Promise<SessionDTO> {
    const response = await http.post<SessionDTO>(`/sessions/${sessionId}/end`)
    return response
  }

  static async getActiveSessions(): Promise<SessionDTO[]> {
    const response = await http.get<SessionDTO[]>('/sessions/active')
    return response
  }

  static async getSessionStats(): Promise<{
    totalSessions: number
    activeSessions: number
    totalRevenue: number
    averageSessionDuration: number
  }> {
    const response = await http.get<{
      totalSessions: number
      activeSessions: number
      totalRevenue: number
      averageSessionDuration: number
    }>('/sessions/stats')
    return response
  }
}
