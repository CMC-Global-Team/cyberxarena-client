import { http } from "./api";

export interface Product {
  itemId: number;
  itemName: string;
  itemCategory?: string;
  price: number;
  stock: number;
  supplierName?: string;
}

// Spring Page response shape
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page index
}

export interface ProductDTO {
  itemName: string;
  itemCategory?: string;
  price: number;
  stock: number;
  supplierName?: string;
}

export interface UpdateProductRequestDTO {
  itemName?: string;
  itemCategory?: string;
  price?: number;
  stock?: number;
  supplierName?: string;
}

export const productsApi = {
  // Lấy tất cả sản phẩm với pagination
  getAll: (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  }): Promise<PageResponse<Product>> => {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.size !== undefined) query.set("size", String(params.size));
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    if (params?.sortDir) query.set("sortDir", params.sortDir);
    const path = `/products${query.toString() ? `?${query.toString()}` : ""}`;
    return http.get<PageResponse<Product>>(path);
  },

  // Lấy sản phẩm theo ID
  getById: (id: number): Promise<Product> => 
    http.get<Product>(`/products/${id}`),

  // Lấy sản phẩm theo tên
  getByName: (name: string): Promise<Product> => 
    http.get<Product>(`/products/name/${encodeURIComponent(name)}`),

  // Lấy sản phẩm theo danh mục
  getByCategory: (category: string): Promise<Product[]> => 
    http.get<Product[]>(`/products/category/${encodeURIComponent(category)}`),

  // Lấy sản phẩm theo nhà cung cấp
  getBySupplier: (supplier: string): Promise<Product[]> => 
    http.get<Product[]>(`/products/supplier/${encodeURIComponent(supplier)}`),

  // Lấy sản phẩm sắp hết hàng
  getLowStock: (threshold: number = 10): Promise<Product[]> => 
    http.get<Product[]>(`/products/low-stock?threshold=${threshold}`),

  // Lấy sản phẩm theo khoảng giá
  getByPriceRange: (minPrice: number, maxPrice: number): Promise<Product[]> => 
    http.get<Product[]>(`/products/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`),

  // Tạo sản phẩm mới
  create: (product: ProductDTO): Promise<Product> => 
    http.post<Product>("/products", product),

  // Cập nhật sản phẩm
  update: (id: number, product: UpdateProductRequestDTO): Promise<Product> => 
    http.put<Product>(`/products/${id}`, product),

  // Xóa sản phẩm
  delete: (id: number): Promise<void> => 
    http.delete<void>(`/products/${id}`),
};
