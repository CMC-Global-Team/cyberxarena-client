import { http } from "./api";

export interface Discount {
  discountId: number;
  discountName: string;
  discountType: 'Flat' | 'Percentage';
  discountValue: number;
}

export interface DiscountDTO {
  discount_name: string;
  discount_type: 'Flat' | 'Percentage';
  discount_value: number;
}

export interface UpdateDiscountRequestDTO {
  discount_name?: string;
  discount_type?: 'Flat' | 'Percentage';
  discount_value?: number;
}

// Helper function to convert server response to client format
const convertServerToClient = (serverDiscount: any): Discount => ({
  discountId: serverDiscount.discountId,
  discountName: serverDiscount.discountName,
  discountType: serverDiscount.discountType,
  discountValue: serverDiscount.discountValue
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

  // Kiểm tra discount có đang được sử dụng không
  checkUsage: async (id: number): Promise<{
    isUsed: boolean;
    usageCount: number;
    membershipCards: Array<{
      membershipCardId: number;
      membershipCardName: string;
      rechargeThreshold: number;
    }>;
  }> => {
    return await http.get(`/discounts/${id}/usage`);
  },

  // Xóa discount
  delete: (id: number): Promise<void> => 
    http.delete<void>(`/discounts/${id}`),
};
