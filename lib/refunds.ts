import { http } from "./api";

export interface RefundDetail {
  refundDetailId?: number;
  refundId?: number;
  saleDetailId: number;
  quantity: number;
  itemName?: string;
  itemPrice?: number;
  totalAmount?: number;
}

export interface Refund {
  refundId: number;
  saleId: number;
  refundDate: string;
  refundAmount: number;
  refundReason?: string;
  refundType: 'Full' | 'Partial';
  processedBy?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  refundDetails?: RefundDetail[];
  customerName?: string;
  customerPhone?: string;
  originalSaleDate?: string;
  originalSaleAmount?: number;
}

export interface RefundDTO {
  saleId: number;
  refundDate?: string;
  refundAmount: number;
  refundReason?: string;
  refundType: 'Full' | 'Partial';
  processedBy?: string;
  status?: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  refundDetails?: RefundDetail[];
}

export interface RefundSearchParams {
  status?: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  processedBy?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export const refundsApi = {
  // Tạo refund mới
  create: (refund: RefundDTO): Promise<Refund> => 
    http.post<Refund>('/refund', refund),

  // Cập nhật refund
  update: (id: number, refund: RefundDTO): Promise<Refund> => 
    http.put<Refund>(`/refund/${id}`, refund),

  // Xóa refund
  delete: (id: number): Promise<void> => 
    http.delete<void>(`/refund/${id}`),

  // Lấy refund theo ID
  getById: (id: number): Promise<Refund> => 
    http.get<Refund>(`/refund/${id}`),

  // Lấy tất cả refund với phân trang
  getAll: (params: { page?: number; size?: number; sortBy?: string; sortDir?: string }): Promise<{
    content: Refund[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.size !== undefined) query.set("size", String(params.size));
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortDir) query.set("sortDir", params.sortDir);
    
    const path = `/refund${query.toString() ? `?${query.toString()}` : ""}`;
    return http.get(path);
  },

  // Tìm kiếm refund với filter
  search: (params: RefundSearchParams): Promise<{
    content: Refund[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> => {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.processedBy) query.set("processedBy", params.processedBy);
    if (params.startDate) query.set("startDate", params.startDate);
    if (params.endDate) query.set("endDate", params.endDate);
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.size !== undefined) query.set("size", String(params.size));
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortDir) query.set("sortDir", params.sortDir);
    
    const path = `/refund/search${query.toString() ? `?${query.toString()}` : ""}`;
    return http.get(path);
  },

  // Lấy refund theo sale ID
  getBySaleId: (saleId: number): Promise<Refund[]> => 
    http.get<Refund[]>(`/refund/sale/${saleId}`),

  // Lấy refund theo customer ID
  getByCustomerId: (customerId: number, params: { page?: number; size?: number; sortBy?: string; sortDir?: string }): Promise<{
    content: Refund[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.size !== undefined) query.set("size", String(params.size));
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortDir) query.set("sortDir", params.sortDir);
    
    const path = `/refund/customer/${customerId}${query.toString() ? `?${query.toString()}` : ""}`;
    return http.get(path);
  },

  // Cập nhật status của refund
  updateStatus: (id: number, status: 'Pending' | 'Approved' | 'Rejected' | 'Completed', processedBy?: string): Promise<Refund> => {
    const query = new URLSearchParams();
    query.set("status", status);
    if (processedBy) query.set("processedBy", processedBy);
    
    return http.patch<Refund>(`/refund/${id}/status?${query.toString()}`);
  },

  // Lấy thống kê refund theo status
  getCountByStatus: (status: 'Pending' | 'Approved' | 'Rejected' | 'Completed'): Promise<number> => 
    http.get<number>(`/refund/stats/count?status=${status}`),

  // Lấy tổng số tiền hoàn theo status
  getTotalAmountByStatus: (status: 'Pending' | 'Approved' | 'Rejected' | 'Completed'): Promise<number> => 
    http.get<number>(`/refund/stats/amount?status=${status}`),

  // Kiểm tra xem sale đã có refund chưa
  hasRefundForSale: (saleId: number): Promise<boolean> => 
    http.get<boolean>(`/refund/check/sale/${saleId}`),

  // Lấy refund đang pending
  getPending: (params: { page?: number; size?: number; sortBy?: string; sortDir?: string }): Promise<{
    content: Refund[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.size !== undefined) query.set("size", String(params.size));
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortDir) query.set("sortDir", params.sortDir);
    
    const path = `/refund/pending${query.toString() ? `?${query.toString()}` : ""}`;
    return http.get(path);
  },
};
