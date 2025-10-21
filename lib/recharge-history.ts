import { api } from './api'

export interface RechargeHistoryDTO {
  rechargeId: number
  customerId: number
  amount: number
  rechargeDate: string
  customerName: string
}

export interface CreateRechargeHistoryRequestDTO {
  customerId: number
  amount: number
}

export interface RechargeHistorySearchRequestDTO {
  customerId?: number
  startDate?: string
  endDate?: string
  customerName?: string
}

export interface RechargeHistoryPageResponse {
  content: RechargeHistoryDTO[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      unsorted: boolean
    }
  }
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  numberOfElements: number
}

export class RechargeHistoryApi {
  static async create(data: CreateRechargeHistoryRequestDTO): Promise<RechargeHistoryDTO> {
    const response = await api.post('/recharge-history', data)
    return response.data
  }

  static async getById(rechargeId: number): Promise<RechargeHistoryDTO> {
    const response = await api.get(`/recharge-history/${rechargeId}`)
    return response.data
  }

  static async getAll(params?: {
    page?: number
    size?: number
    sortBy?: string
    sortDir?: 'asc' | 'desc'
  }): Promise<RechargeHistoryPageResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page !== undefined) searchParams.append('page', params.page.toString())
    if (params?.size !== undefined) searchParams.append('size', params.size.toString())
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortDir) searchParams.append('sortDir', params.sortDir)

    const response = await api.get(`/recharge-history?${searchParams.toString()}`)
    return response.data
  }

  static async getByCustomerId(customerId: number): Promise<RechargeHistoryDTO[]> {
    const response = await api.get(`/recharge-history/customer/${customerId}`)
    return response.data
  }

  static async getByCustomerIdPaged(
    customerId: number,
    params?: {
      page?: number
      size?: number
      sortBy?: string
      sortDir?: 'asc' | 'desc'
    }
  ): Promise<RechargeHistoryPageResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page !== undefined) searchParams.append('page', params.page.toString())
    if (params?.size !== undefined) searchParams.append('size', params.size.toString())
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortDir) searchParams.append('sortDir', params.sortDir)

    const response = await api.get(`/recharge-history/customer/${customerId}/paged?${searchParams.toString()}`)
    return response.data
  }

  static async search(
    filters: RechargeHistorySearchRequestDTO,
    params?: {
      page?: number
      size?: number
      sortBy?: string
      sortDir?: 'asc' | 'desc'
    }
  ): Promise<RechargeHistoryPageResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page !== undefined) searchParams.append('page', params.page.toString())
    if (params?.size !== undefined) searchParams.append('size', params.size.toString())
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortDir) searchParams.append('sortDir', params.sortDir)

    const response = await api.post(`/recharge-history/search?${searchParams.toString()}`, filters)
    return response.data
  }

  static async getTotalByCustomerId(customerId: number): Promise<number> {
    const response = await api.get(`/recharge-history/customer/${customerId}/total`)
    return response.data
  }

  static async getTotalByCustomerIdInDateRange(
    customerId: number,
    startDate: string,
    endDate: string
  ): Promise<number> {
    const response = await api.get(
      `/recharge-history/customer/${customerId}/total/date-range?startDate=${startDate}&endDate=${endDate}`
    )
    return response.data
  }

  static async delete(rechargeId: number): Promise<void> {
    await api.delete(`/recharge-history/${rechargeId}`)
  }
}
