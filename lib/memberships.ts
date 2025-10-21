import { http } from "./api";

export interface MembershipCard {
  membershipCardId: number;
  membershipCardName: string;
  discountId?: number | null;
  discountName?: string | null;
  discountType?: string | null;
  discountValue?: number | null;
}

export interface MembershipCardDTO {
  membershipCardName: string;
  discountId?: number | null;
}

export interface UpdateMembershipCardRequestDTO {
  membershipCardName?: string;
  discountId?: number | null;
}

export const membershipsApi = {
  // Get all membership cards
  getAll: (): Promise<MembershipCard[]> =>
    http.get<MembershipCard[]>("/api/membership-cards"),

  // Get by ID
  getById: (id: number): Promise<MembershipCard> =>
    http.get<MembershipCard>(`/api/membership-cards/${id}`),

  // Create
  create: (payload: MembershipCardDTO): Promise<MembershipCard> =>
    http.post<MembershipCard>("/api/membership-cards", payload),

  // Update
  update: (id: number, payload: UpdateMembershipCardRequestDTO): Promise<MembershipCard> =>
    http.put<MembershipCard>(`/api/membership-cards/${id}`, payload),

  // Delete
  delete: (id: number): Promise<void> =>
    http.delete<void>(`/api/membership-cards/${id}`),
};
