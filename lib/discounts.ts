import { http } from "./api";

export interface Discount {
  discount_id: number;
  discount_type: 'Flat' | 'Percentage';
  discount_value: number;
}

export interface DiscountDTO {
  discount_type: 'Flat' | 'Percentage';
  discount_value: number;
}

export interface UpdateDiscountRequestDTO {
  discount_type?: 'Flat' | 'Percentage';
  discount_value?: number;
}

export const discountsApi = {
  // Lấy tất cả discount
  getAll: (): Promise<Discount[]> => 
    http.get<Discount[]>("/discounts"),

  // Lấy discount theo ID
  getById: (id: number): Promise<Discount> => 
    http.get<Discount>(`/discounts/${id}`),

  // Lấy discount theo loại
  getByType: (type: 'Flat' | 'Percentage'): Promise<Discount[]> => 
    http.get<Discount[]>(`/discounts/type/${type}`),

  // Tạo discount mới
  create: (discount: DiscountDTO): Promise<Discount> => 
    http.post<Discount>("/discounts", discount),

  // Cập nhật discount
  update: (id: number, discount: UpdateDiscountRequestDTO): Promise<Discount> => 
    http.put<Discount>(`/discounts/${id}`, discount),

  // Xóa discount
  delete: (id: number): Promise<void> => 
    http.delete<void>(`/discounts/${id}`),
};
