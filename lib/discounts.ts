import { http } from "./api";

export interface Discount {
  discountId: number;
  discountType: 'Flat' | 'Percentage';
  discountValue: number;
}

export interface DiscountDTO {
  discount_type: 'Flat' | 'Percentage';
  discount_value: number;
}

export interface UpdateDiscountRequestDTO {
  discount_type?: 'Flat' | 'Percentage';
  discount_value?: number;
}

// Helper function to convert server response to client format
const convertServerToClient = (serverDiscount: any): Discount => ({
  discountId: serverDiscount.discount_id,
  discountType: serverDiscount.discount_type,
  discountValue: serverDiscount.discount_value
});

export const discountsApi = {
  // Lấy tất cả discount
  getAll: async (): Promise<Discount[]> => {
    const serverDiscounts = await http.get<any[]>("/discounts");
    return serverDiscounts.map(convertServerToClient);
  },

  // Lấy discount theo ID
  getById: async (id: number): Promise<Discount> => {
    const serverDiscount = await http.get<any>(`/discounts/${id}`);
    return convertServerToClient(serverDiscount);
  },

  // Lấy discount theo loại
  getByType: async (type: 'Flat' | 'Percentage'): Promise<Discount[]> => {
    const serverDiscounts = await http.get<any[]>(`/discounts/type/${type}`);
    return serverDiscounts.map(convertServerToClient);
  },

  // Tạo discount mới
  create: async (discount: DiscountDTO): Promise<Discount> => {
    const serverDiscount = await http.post<any>("/discounts", discount);
    return convertServerToClient(serverDiscount);
  },

  // Cập nhật discount
  update: async (id: number, discount: UpdateDiscountRequestDTO): Promise<Discount> => {
    const serverDiscount = await http.put<any>(`/discounts/${id}`, discount);
    return convertServerToClient(serverDiscount);
  },

  // Xóa discount
  delete: (id: number): Promise<void> => 
    http.delete<void>(`/discounts/${id}`),
};
