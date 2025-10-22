import { http } from "./api";

export interface MembershipCard {
  membershipCardId: number;
  membershipCardName: string;
  discountId?: number | null;
  discountName?: string | null;
  discountType?: string | null;
  discountValue?: number | null;
  rechargeThreshold: number;
  isDefault: boolean;
}

export interface MembershipCardDTO {
  membershipCardName: string;
  discountId?: number | null;
  rechargeThreshold: number;
  isDefault?: boolean;
}

export interface UpdateMembershipCardRequestDTO {
  membershipCardName?: string;
  discountId?: number | null;
  rechargeThreshold?: number;
  isDefault?: boolean;
}

// New interfaces for rank management
export interface MembershipRankInfoDTO {
  customerId: number;
  customerName: string;
  currentMembershipCardId: number;
  currentMembershipCardName: string;
  currentTotalRecharge: number;
  currentBalance: number;
  nextMembershipCardId?: number;
  nextMembershipCardName?: string;
  nextMembershipCardThreshold?: number;
  amountNeededForNextRank?: number;
}

export interface DiscountCalculationDTO {
  customerId: number;
  customerName: string;
  membershipCardId: number;
  membershipCardName: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  discountType: string;
  discountValue: number;
  discountName: string;
}

export const membershipsApi = {
  // Get all membership cards
  getAll: (): Promise<MembershipCard[]> =>
    http.get<MembershipCard[]>("/membership-cards"),

  // Get by ID
  getById: (id: number): Promise<MembershipCard> =>
    http.get<MembershipCard>(`/membership-cards/${id}`),

  // Get default membership card
  getDefault: (): Promise<MembershipCard> =>
    http.get<MembershipCard>("/membership-cards/default"),

  // Create
  create: (payload: MembershipCardDTO): Promise<MembershipCard> =>
    http.post<MembershipCard>("/membership-cards", payload),

  // Update
  update: (id: number, payload: UpdateMembershipCardRequestDTO): Promise<MembershipCard> =>
    http.put<MembershipCard>(`/membership-cards/${id}`, payload),

  // Kiểm tra membership card có đang được sử dụng không
  checkUsage: async (id: number): Promise<{
    isUsed: boolean;
    usageCount: number;
    customers: Array<{
      customerId: number;
      customerName: string;
      phoneNumber: string;
      balance: number;
    }>;
  }> => {
    return await http.get(`/membership-cards/${id}/usage`);
  },

  // Get eligible customers for membership card
  getEligibleCustomers: async (id: number): Promise<Array<{
    customerId: number;
    customerName: string;
    phoneNumber: string;
    currentBalance: number;
    totalRecharge: number;
    currentMembershipCardId: number;
    currentMembershipCardName: string;
    currentMembershipThreshold?: number;
  }>> => {
    return await http.get(`/membership-cards/${id}/eligible-customers`);
  },

  // Update eligible customers to membership card
  updateEligibleCustomers: async (id: number, customerIds: number[]): Promise<string> => {
    return await http.post(`/membership-cards/${id}/update-eligible-customers`, customerIds);
  },

  // Delete
  delete: (id: number): Promise<void> =>
    http.delete<void>(`/membership-cards/${id}`),
};

// Membership Rank API
export const membershipRankApi = {
  // Get rank info for customer
  getRankInfo: (customerId: number): Promise<MembershipRankInfoDTO> =>
    http.get<MembershipRankInfoDTO>(`/membership-ranks/customer/${customerId}`),

  // Get current membership card
  getCurrentCard: (customerId: number): Promise<MembershipCard> =>
    http.get<MembershipCard>(`/membership-ranks/customer/${customerId}/current`),

  // Get next membership card
  getNextCard: (customerId: number): Promise<MembershipCard> =>
    http.get<MembershipCard>(`/membership-ranks/customer/${customerId}/next`),

  // Update customer rank
  updateRank: (customerId: number): Promise<void> =>
    http.post<void>(`/membership-ranks/customer/${customerId}/update`),

  // Update all customer ranks
  updateAllRanks: (): Promise<void> =>
    http.post<void>("/membership-ranks/update-all"),
};

// Membership Discount API
export const membershipDiscountApi = {
  // Calculate discount for customer
  calculateDiscount: (customerId: number, amount: number): Promise<number> =>
    http.post<number>(`/membership-discounts/calculate/${customerId}?amount=${amount}`),

  // Calculate final amount after discount
  calculateFinalAmount: (customerId: number, amount: number): Promise<number> =>
    http.post<number>(`/membership-discounts/calculate-final/${customerId}?amount=${amount}`),

  // Get detailed discount calculation
  calculateDetails: (customerId: number, amount: number): Promise<DiscountCalculationDTO> =>
    http.post<DiscountCalculationDTO>(`/membership-discounts/calculate-details/${customerId}?amount=${amount}`),

  // Get discount info for customer
  getDiscountInfo: (customerId: number): Promise<DiscountCalculationDTO> =>
    http.get<DiscountCalculationDTO>(`/membership-discounts/info/${customerId}`),
};
