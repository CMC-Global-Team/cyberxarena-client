import { http } from "./api";

export interface MembershipCard {
  membership_card_id: number;
  membership_card_name: string;
  discount_id?: number | null;
}

export interface MembershipCardDTO {
  membership_card_name: string;
  discount_id?: number | null;
}

export interface UpdateMembershipCardRequestDTO {
  membership_card_name?: string;
  discount_id?: number | null;
}

export const membershipsApi = {
  // Get all membership cards
  getAll: (): Promise<MembershipCard[]> =>
    http.get<MembershipCard[]>("/membership-cards"),

  // Get by ID
  getById: (id: number): Promise<MembershipCard> =>
    http.get<MembershipCard>(`/membership-cards/${id}`),

  // Create
  create: (payload: MembershipCardDTO): Promise<MembershipCard> =>
    http.post<MembershipCard>("/membership-cards", payload),

  // Update
  update: (id: number, payload: UpdateMembershipCardRequestDTO): Promise<MembershipCard> =>
    http.put<MembershipCard>(`/membership-cards/${id}`, payload),

  // Delete
  delete: (id: number): Promise<void> =>
    http.delete<void>(`/membership-cards/${id}`),
};
