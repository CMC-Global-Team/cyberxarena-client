import { http } from "./api";

export type SaleStatus = 'Pending' | 'Paid' | 'Cancelled';

export interface SaleDetail {
  saleId: number;
  itemId: number;
  quantity: number;
}

export interface SaleItem {
  itemId: number;
  quantity: number;
}

export interface Sale {
  saleId: number;
  customerId: number;
  saleDate: string; // LocalDateTime -> string
  items: SaleDetail[];
  paymentMethod: string;
  totalAmount: number; // BigDecimal -> number
  discountId?: number;
  note?: string;
  status: SaleStatus;
}

export interface SaleDTO {
  customerId: number;
  saleDate: string;
  items: SaleDetail[];
  paymentMethod: string;
  totalAmount?: number;
  discountId?: number;
  note?: string;
  status: SaleStatus;
}

export interface UpdateSaleRequestDTO {
  customerId?: number;
  paymentMethod?: string;
  discountId?: number;
  note?: string;
}

export interface UpdateSaleStatusDTO {
  status: SaleStatus;
}

export interface SaleSearchParams {
  sortBy?: string;
  sortOrder?: string;
  saleId?: number;
  customerId?: number;
  customerName?: string;
}

export const salesApi = {
  // Tạo sale mới
  create: (sale: SaleDTO, customerId: number): Promise<Sale> => 
    http.post<Sale>(`/sale?customerId=${customerId}`, sale),

  // Cập nhật sale
  update: (id: number, sale: UpdateSaleRequestDTO): Promise<Sale> => 
    http.put<Sale>(`/sale/${id}`, sale),

  // Cập nhật trạng thái sale
  updateStatus: (id: number, status: UpdateSaleStatusDTO): Promise<Sale> => 
    http.patch<Sale>(`/sale/${id}/status`, status),

  // Xóa sale
  delete: (id: number): Promise<void> => 
    http.delete<void>(`/sale/${id}`),

  // Tìm kiếm sale
  search: (params: SaleSearchParams): Promise<Sale[]> => {
    const query = new URLSearchParams();
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);
    if (params.saleId) query.set("saleId", String(params.saleId));
    if (params.customerId) query.set("customerId", String(params.customerId));
    if (params.customerName) query.set("customerName", params.customerName);
    
    const path = `/sale/search${query.toString() ? `?${query.toString()}` : ""}`;
    return http.get<Sale[]>(path);
  },
};
