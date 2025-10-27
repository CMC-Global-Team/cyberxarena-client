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
    
    const path = `/revenue${query.toString() ? `?${query.toString()}` : ""}`;
    return http.get<RevenuePageResponse>(path);
  },

  // Tạo báo cáo doanh thu cho khoảng thời gian
  generateReports: (request: GenerateRevenueRequest): Promise<Revenue[]> => {
    const query = new URLSearchParams();
    query.set("startDate", request.startDate);
    query.set("endDate", request.endDate);
    
    return http.post<Revenue[]>(`/revenue/generate?${query.toString()}`);
  },

  // Tính lại báo cáo doanh thu cho một ngày cụ thể
  recalculateReport: (date: string): Promise<Revenue> => {
    return http.put<Revenue>(`/revenue/recalculate?date=${date}`);
  },

  // Lấy thống kê tổng quan (tính từ dữ liệu getAll)
  getStats: async (startDate?: string, endDate?: string): Promise<{
    totalRevenue: number;
    totalComputerUsageRevenue: number;
    totalSalesRevenue: number;
    averageDailyRevenue: number;
    revenueGrowth: number;
  }> => {
    try {
      // Lấy tất cả dữ liệu revenue
      const data = await revenueApi.getAll({ 
        page: 0, 
        size: 1000, // Lấy nhiều để tính stats
        startDate, 
        endDate 
      });
      
      const revenues = data.content || [];
      
      console.log('🔍 Revenue API getStats - Raw data:', data);
      console.log('🔍 Revenue API getStats - Revenues array:', revenues);
      console.log('🔍 Revenue API getStats - Revenues length:', revenues.length);
      
      if (revenues.length === 0) {
        console.log('⚠️ No revenue data found');
        return {
          totalRevenue: 0,
          totalComputerUsageRevenue: 0,
          totalSalesRevenue: 0,
          averageDailyRevenue: 0,
          revenueGrowth: 0
        };
      }

      // Tính toán stats
      const totalRevenue = revenues.reduce((sum, r) => sum + r.totalRevenue, 0);
      const totalComputerUsageRevenue = revenues.reduce((sum, r) => sum + r.computerUsageRevenue, 0);
      const totalSalesRevenue = revenues.reduce((sum, r) => sum + r.salesRevenue, 0);
      const averageDailyRevenue = totalRevenue / revenues.length;
      
      console.log('💰 Calculated stats:', {
        totalRevenue,
        totalComputerUsageRevenue,
        totalSalesRevenue,
        averageDailyRevenue
      });
      
      // Tính revenue growth (so với kỳ trước - giả sử)
      const revenueGrowth = 0; // TODO: Implement proper growth calculation
      
      return {
        totalRevenue,
        totalComputerUsageRevenue,
        totalSalesRevenue,
        averageDailyRevenue,
        revenueGrowth
      };
    } catch (error) {
      console.error("Error calculating stats:", error);
      return {
        totalRevenue: 0,
        totalComputerUsageRevenue: 0,
        totalSalesRevenue: 0,
        averageDailyRevenue: 0,
        revenueGrowth: 0
      };
    }
  },

  // Lấy dữ liệu cho biểu đồ theo thời gian (tính từ dữ liệu getAll)
  getChartData: async (startDate: string, endDate: string, interval: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<{
    labels: string[];
    computerUsageRevenue: number[];
    salesRevenue: number[];
    totalRevenue: number[];
  }> => {
    try {
      const data = await revenueApi.getAll({ 
        page: 0, 
        size: 1000,
        startDate, 
        endDate,
        sortBy: 'date',
        sortOrder: 'asc'
      });
      
      const revenues = data.content || [];
      
      // Format data for charts
      const labels = revenues.map(r => {
        const date = new Date(r.date);
        return date.toLocaleDateString('vi-VN', { 
          day: '2-digit', 
          month: '2-digit' 
        });
      });
      
      const computerUsageRevenue = revenues.map(r => r.computerUsageRevenue);
      const salesRevenue = revenues.map(r => r.salesRevenue);
      const totalRevenue = revenues.map(r => r.totalRevenue);
      
      return {
        labels,
        computerUsageRevenue,
        salesRevenue,
        totalRevenue
      };
    } catch (error) {
      console.error("Error getting chart data:", error);
      return {
        labels: [],
        computerUsageRevenue: [],
        salesRevenue: [],
        totalRevenue: []
      };
    }
  }
};
