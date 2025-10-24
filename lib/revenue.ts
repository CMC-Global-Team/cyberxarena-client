import { http } from "./api";

export interface Revenue {
  revenueId: number;
  date: string; // LocalDate -> string
  computerUsageRevenue: number; // BigDecimal -> number
  salesRevenue: number; // BigDecimal -> number
  totalRevenue: number; // Calculated field
}

export interface RevenueDTO {
  revenueId?: number;
  date: string;
  computerUsageRevenue: number;
  salesRevenue: number;
  totalRevenue?: number;
}

export interface GenerateRevenueRequest {
  startDate: string;
  endDate: string;
}

export interface RevenueSearchParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export interface RevenuePageResponse {
  content: Revenue[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const revenueApi = {
  // Lấy tất cả revenue với phân trang
  getAll: (params: RevenueSearchParams = {}): Promise<RevenuePageResponse> => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.size !== undefined) query.set("size", String(params.size));
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);
    if (params.startDate) query.set("startDate", params.startDate);
    if (params.endDate) query.set("endDate", params.endDate);
    
    const path = `/api/v1/revenue${query.toString() ? `?${query.toString()}` : ""}`;
    return http.get<RevenuePageResponse>(path);
  },

  // Tạo báo cáo doanh thu cho khoảng thời gian
  generateReports: (request: GenerateRevenueRequest): Promise<Revenue[]> => {
    const query = new URLSearchParams();
    query.set("startDate", request.startDate);
    query.set("endDate", request.endDate);
    
    return http.post<Revenue[]>(`/api/v1/revenue/generate?${query.toString()}`);
  },

  // Tính lại báo cáo doanh thu cho một ngày cụ thể
  recalculateReport: (date: string): Promise<Revenue> => {
    return http.put<Revenue>(`/api/v1/revenue/recalculate?date=${date}`);
  },

  // Lấy thống kê tổng quan
  getStats: async (startDate?: string, endDate?: string): Promise<{
    totalRevenue: number;
    totalComputerUsageRevenue: number;
    totalSalesRevenue: number;
    averageDailyRevenue: number;
    revenueGrowth: number;
  }> => {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    
    const path = `/api/v1/revenue/stats${params.toString() ? `?${params.toString()}` : ""}`;
    return http.get(path);
  },

  // Lấy dữ liệu cho biểu đồ theo thời gian
  getChartData: async (startDate: string, endDate: string, interval: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<{
    labels: string[];
    computerUsageRevenue: number[];
    salesRevenue: number[];
    totalRevenue: number[];
  }> => {
    const params = new URLSearchParams();
    params.set("startDate", startDate);
    params.set("endDate", endDate);
    params.set("interval", interval);
    
    const path = `/api/v1/revenue/chart-data?${params.toString()}`;
    return http.get(path);
  }
};
