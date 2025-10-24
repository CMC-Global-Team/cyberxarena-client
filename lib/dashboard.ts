import { http } from "./api";

export interface DashboardStats {
  totalComputers: number;
  activeComputers: number;
  totalCustomers: number;
  onlineCustomers: number;
  todayRevenue: number;
  todayTransactions: number;
  averageSessionDuration: number;
  computerUtilizationRate: string;
  maintenanceComputers: number;
  availableComputers: number;
}

export interface RecentActivity {
  id: number;
  computerName: string;
  action: string;
  customerName: string;
  timestamp: string;
  timeAgo: string;
}

export interface ComputerStatus {
  totalComputers: number;
  activeComputers: number;
  availableComputers: number;
  maintenanceComputers: number;
  utilizationRate: string;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
  transactions: number;
}

export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    return http.get<DashboardStats>("/dashboard/stats");
  },

  // Get recent activities
  getRecentActivities: async (limit: number = 10): Promise<RecentActivity[]> => {
    return http.get<RecentActivity[]>(`/dashboard/recent-activities?limit=${limit}`);
  },

  // Get computer status overview
  getComputerStatus: async (): Promise<ComputerStatus> => {
    return http.get<ComputerStatus>("/dashboard/computer-status");
  },

  // Get revenue trend for last 7 days
  getRevenueTrend: async (): Promise<RevenueTrend[]> => {
    return http.get<RevenueTrend[]>("/dashboard/revenue-trend");
  },
};
