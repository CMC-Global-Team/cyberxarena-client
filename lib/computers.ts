import { http } from "./api";

// Types matching server DTO
export interface ComputerDTO {
  computerId: number;
  computerName: string;
  specifications: Record<string, unknown>;
  ipAddress: string;
  pricePerHour: number; // BigDecimal -> number
  status: "Available" | "In_Use" | "Broken" | string;
  lastUsed?: string; // ISO date string
  totalHours?: number;
  totalSessions?: number;
}

export interface ComputerUsageStats {
  computerId: number;
  computerName: string;
  lastUsed: string;
  totalHours: number;
  totalSessions: number;
  recentSessions: SessionUsageHistory[];
}

export interface SessionUsageHistory {
  sessionId: number;
  customerName: string;
  startTime: string;
  endTime?: string;
  durationHours: number;
  status: string;
}

// Spring Page response shape
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page index
}

export const ComputerApi = {
  list: (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  }) => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.size !== undefined) query.set("size", String(params.size));
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    if (params?.sortDir) query.set("sortDir", params.sortDir);
    const path = `/computers${query.toString() ? `?${query.toString()}` : ""}`;
    return http.get<PageResponse<ComputerDTO>>(path);
  },
  search: (params: {
    name?: string;
    ip?: string;
    status?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  }) => {
    const query = new URLSearchParams();
    if (params?.name) query.set("name", params.name);
    if (params?.ip) query.set("ip", params.ip);
    if (params?.status) query.set("status", params.status);
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.size !== undefined) query.set("size", String(params.size));
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    if (params?.sortDir) query.set("sortDir", params.sortDir);
    const path = `/computers/search${query.toString() ? `?${query.toString()}` : ""}`;
    return http.get<PageResponse<ComputerDTO>>(path);
  },
  create: (data: Omit<ComputerDTO, "computerId">) => http.post<ComputerDTO>("/computers", data),
  update: (id: number, data: Omit<ComputerDTO, "computerId">) => http.put<ComputerDTO>(`/computers/${id}`, data),
  delete: (id: number) => http.delete<void>(`/computers/${id}`),
  getUsageStats: (id: number) => http.get<ComputerUsageStats>(`/computers/${id}/usage-history`),
};


