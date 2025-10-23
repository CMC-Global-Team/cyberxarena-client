import { http } from "./api";

export interface Item {
  itemId: number;
  itemName: string;
  itemCategory?: string;
  price: number;
  stock: number;
  supplierName?: string;
}

export interface ItemDTO {
  itemName: string;
  itemCategory?: string;
  price: number;
  stock: number;
  supplierName?: string;
}

export interface UpdateItemRequestDTO {
  itemName?: string;
  itemCategory?: string;
  price?: number;
  stock?: number;
  supplierName?: string;
}

export const itemsApi = {
  // Lấy tất cả items
  getAll: (): Promise<Item[]> => 
    http.get<Item[]>("/products"),

  // Lấy item theo ID
  getById: (id: number): Promise<Item> => 
    http.get<Item>(`/products/${id}`),

  // Lấy item theo tên
  getByName: (name: string): Promise<Item> => 
    http.get<Item>(`/products/name/${encodeURIComponent(name)}`),

  // Lấy item theo danh mục
  getByCategory: (category: string): Promise<Item[]> => 
    http.get<Item[]>(`/products/category/${encodeURIComponent(category)}`),

  // Lấy item theo nhà cung cấp
  getBySupplier: (supplier: string): Promise<Item[]> => 
    http.get<Item[]>(`/products/supplier/${encodeURIComponent(supplier)}`),

  // Lấy item sắp hết hàng
  getLowStock: (threshold: number = 10): Promise<Item[]> => 
    http.get<Item[]>(`/products/low-stock?threshold=${threshold}`),

  // Lấy item theo khoảng giá
  getByPriceRange: (minPrice: number, maxPrice: number): Promise<Item[]> => 
    http.get<Item[]>(`/products/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`),

  // Tạo item mới
  create: (item: ItemDTO): Promise<Item> => 
    http.post<Item>("/products", item),

  // Cập nhật item
  update: (id: number, item: UpdateItemRequestDTO): Promise<Item> => 
    http.put<Item>(`/products/${id}`, item),

  // Xóa item
  delete: (id: number): Promise<void> => 
    http.delete<void>(`/products/${id}`),
};
