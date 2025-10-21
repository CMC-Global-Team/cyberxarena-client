import { http } from './api'

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
    return await http.post<RechargeHistoryDTO>('/recharge-history', data)
  }

  static async getById(rechargeId: number): Promise<RechargeHistoryDTO> {
    return await http.get<RechargeHistoryDTO>(`/recharge-history/${rechargeId}`)
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

    return await http.get<RechargeHistoryPageResponse>(`/recharge-history?${searchParams.toString()}`)
  }

  static async getByCustomerId(customerId: number): Promise<RechargeHistoryDTO[]> {
    return await http.get<RechargeHistoryDTO[]>(`/recharge-history/customer/${customerId}`)
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

    return await http.get<RechargeHistoryPageResponse>(`/recharge-history/customer/${customerId}/paged?${searchParams.toString()}`)
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

    return await http.post<RechargeHistoryPageResponse>(`/recharge-history/search?${searchParams.toString()}`, filters)
  }

  static async getTotalByCustomerId(customerId: number): Promise<number> {
    return await http.get<number>(`/recharge-history/customer/${customerId}/total`)
  }

  static async getTotalByCustomerIdInDateRange(
    customerId: number,
    startDate: string,
    endDate: string
  ): Promise<number> {
    return await http.get<number>(
      `/recharge-history/customer/${customerId}/total/date-range?startDate=${startDate}&endDate=${endDate}`
    )
  }

  static async delete(rechargeId: number): Promise<void> {
    await http.delete(`/recharge-history/${rechargeId}`)
  }
}
