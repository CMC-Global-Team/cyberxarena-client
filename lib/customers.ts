import { http } from "./api";

// Types matching server DTOs
export interface CustomerDTO {
  customerId: number;
  customerName: string;
  phoneNumber: string;
  membershipCardId: number;
  balance: number; // BigDecimal -> number
  registrationDate: string; // LocalDateTime -> string
}

export interface AccountDTO {
  accountId: number;
  customerId: number;
  username: string;
  password: string;
  customerName: string;
  phoneNumber: string;
  membershipCardId: number;
}

export interface CreateAccountRequestDTO {
  customerId: number;
  username: string;
  password: string;
}

export interface UpdateAccountRequestDTO {
  username?: string;
  password?: string;
}

// Spring Page response shape
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page index
}

export const CustomerApi = {
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
    const path = `/customers${query.toString() ? `?${query.toString()}` : ""}`;
    return http.get<CustomerDTO[]>(path);
  },
  
  search: (params: {
    name?: string;
    phone?: string;
    email?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    const query = new URLSearchParams();
    if (params?.name) query.set("name", params.name);
    if (params?.phone) query.set("phone", params.phone);
    if (params?.email) query.set("email", params.email);
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    if (params?.sortOrder) query.set("sortOrder", params.sortOrder);
    const path = `/customers/search${query.toString() ? `?${query.toString()}` : ""}`;
    return http.get<CustomerDTO[]>(path);
  },
  
  getById: (id: number) => http.get<CustomerDTO>(`/customers/${id}`),
  create: (data: CustomerDTO) => http.post<CustomerDTO>("/customers", data),
  update: (id: number, data: CustomerDTO) => http.put<CustomerDTO>(`/customers/${id}`, data),
  delete: (id: number) => http.delete<void>(`/customers/${id}`),
};

export const AccountApi = {
  search: (params: {
    username?: string;
    customerName?: string;
    phoneNumber?: string;
    membershipCardId?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }) => {
    const query = new URLSearchParams();
    if (params?.username) query.set("username", params.username);
    if (params?.customerName) query.set("customerName", params.customerName);
    if (params?.phoneNumber) query.set("phoneNumber", params.phoneNumber);
    if (params?.membershipCardId !== undefined) query.set("membershipCardId", String(params.membershipCardId));
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.size !== undefined) query.set("size", String(params.size));
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    if (params?.sortDirection) query.set("sortDirection", params.sortDirection);
    const path = `/accounts/search${query.toString() ? `?${query.toString()}` : ""}`;
    return http.get<PageResponse<AccountDTO>>(path);
  },
  
  getByUsername: (username: string) => http.get<AccountDTO>(`/accounts/username/${username}`),
  getByCustomerId: (customerId: number) => http.get<AccountDTO>(`/accounts/customer/${customerId}`),
  checkUsernameExists: (username: string) => http.get<boolean>(`/accounts/check-username/${username}`),
  
  create: (data: CreateAccountRequestDTO) => http.post<AccountDTO>("/accounts", data),
  update: (customerId: number, data: UpdateAccountRequestDTO) => 
    http.put<AccountDTO>(`/accounts/customer/${customerId}`, data),
  delete: (customerId: number) => http.delete<string>(`/accounts/customer/${customerId}`),
};
