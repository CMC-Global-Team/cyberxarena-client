import { http } from "./api"
import { CustomerApi } from "./customers"
import { AccountApi } from "./customers"
import { ComputerApi } from "./computers"
import { membershipsApi } from "./memberships"

export interface SessionDTO {
  sessionId: number
  customerId: number
  customerName?: string
  customerPhone?: string
  customerBalance?: number
  membershipCardId?: number
  membershipCardName?: string
  hasAccount?: boolean
  accountUsername?: string
  computerId: number
  computerName?: string
  startTime: string
  endTime?: string
  status?: "Active" | "Ended" // Optional because server doesn't return this field
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
  // Helper function to enrich session data with customer and computer names
  private static async enrichSessionData(sessions: SessionDTO[]): Promise<SessionDTO[]> {
    if (!sessions || sessions.length === 0) return sessions

    try {
      console.log('Enriching session data for:', sessions.length, 'sessions')
      
      // Get all unique customer and computer IDs
      const customerIds = [...new Set(sessions.map(s => s.customerId))]
      const computerIds = [...new Set(sessions.map(s => s.computerId))]
      console.log('Customer IDs:', customerIds)
      console.log('Computer IDs:', computerIds)

      // Fetch customer, computer, account, and membership data in parallel
      const [customers, computersResponse, accountsResponse, memberships] = await Promise.all([
        CustomerApi.list({ page: 0, size: 1000 }),
        ComputerApi.list({ page: 0, size: 1000 }),
        AccountApi.search({ page: 0, size: 1000 }),
        membershipsApi.getAll()
      ])

      console.log('Customers fetched:', customers)
      console.log('Computers fetched:', computersResponse)
      console.log('Accounts fetched:', accountsResponse)
      console.log('Memberships fetched:', memberships)

      // Create lookup maps
      const customerMap = new Map(customers.map(c => [c.customerId, c]))
      const computerMap = new Map((computersResponse.content || []).map(c => [c.computerId, c]))
      const accountMap = new Map((accountsResponse.content || []).map(a => [a.customerId, a]))
      const membershipMap = new Map(memberships.map(m => [m.membershipCardId, m]))

      console.log('Customer map:', customerMap)
      console.log('Computer map:', computerMap)
      console.log('Account map:', accountMap)
      console.log('Membership map:', membershipMap)

      // Enrich session data
      const enrichedSessions = sessions.map(session => {
        const customer = customerMap.get(session.customerId)
        const computer = computerMap.get(session.computerId)
        const account = accountMap.get(session.customerId)
        const membership = customer ? membershipMap.get(customer.membershipCardId) : null

        return {
          ...session,
          customerName: customer?.customerName || 'Unknown Customer',
          customerPhone: customer?.phoneNumber,
          customerBalance: customer?.balance,
          membershipCardId: customer?.membershipCardId,
          membershipCardName: membership?.membershipCardName,
          hasAccount: !!account,
          accountUsername: account?.username,
          computerName: computer?.computerName || 'Unknown Computer',
          pricePerHour: computer?.pricePerHour, // Get price from computer
          // Calculate status based on endTime
          status: (session.endTime ? 'Ended' : 'Active') as "Active" | "Ended"
        }
      })

      console.log('Enriched sessions:', enrichedSessions)
      return enrichedSessions
    } catch (error) {
      console.error('Error enriching session data:', error)
      return sessions
    }
  }

  static async list(params: SessionListParams = {}): Promise<SessionListResponse> {
    const searchParams = new URLSearchParams()
    
    if (params.page !== undefined) searchParams.append('page', params.page.toString())
    if (params.size !== undefined) searchParams.append('size', params.size.toString())
    if (params.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params.sortDir) searchParams.append('sortDir', params.sortDir)

    const response = await http.get<SessionListResponse>(`/sessions?${searchParams.toString()}`)
    
    // Enrich the session data with customer and computer names
    if (response.content) {
      response.content = await this.enrichSessionData(response.content)
    }
    
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
    
    // Enrich the session data with customer and computer names
    if (response.content) {
      response.content = await this.enrichSessionData(response.content)
    }
    
    return response
  }

  static async getById(sessionId: number): Promise<SessionDTO> {
    const response = await http.get<SessionDTO>(`/sessions/${sessionId}`)
    const enrichedSessions = await this.enrichSessionData([response])
    return enrichedSessions[0]
  }

  static async create(data: SessionCreateRequest): Promise<SessionDTO> {
    const response = await http.post<SessionDTO>('/sessions', data)
    const enrichedSessions = await this.enrichSessionData([response])
    return enrichedSessions[0]
  }

  static async update(sessionId: number, data: SessionUpdateRequest): Promise<SessionDTO> {
    const response = await http.put<SessionDTO>(`/sessions/${sessionId}`, data)
    const enrichedSessions = await this.enrichSessionData([response])
    return enrichedSessions[0]
  }

  static async delete(sessionId: number): Promise<void> {
    await http.delete(`/sessions/${sessionId}`)
  }

  static async getActiveSessions(): Promise<SessionDTO[]> {
    const response = await http.get<SessionDTO[]>('/sessions/active')
    return await this.enrichSessionData(response)
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

  // End session - kết thúc phiên sử dụng
  static async endSession(sessionId: number): Promise<SessionDTO> {
    const response = await http.post<SessionDTO>(`/sessions/${sessionId}/end`)
    const enrichedSessions = await this.enrichSessionData([response])
    return enrichedSessions[0]
  }

  // Change computer - đổi máy trong phiên
  static async changeComputer(sessionId: number, newComputerId: number): Promise<SessionDTO> {
    const response = await http.put<SessionDTO>(`/sessions/${sessionId}/change-computer`, {
      computerId: newComputerId
    })
    const enrichedSessions = await this.enrichSessionData([response])
    return enrichedSessions[0]
  }
}
