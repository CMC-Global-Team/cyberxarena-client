"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Package } from "lucide-react"
import { Product } from "@/lib/products"
import { ProductActionsSheet } from "./product-actions-sheet"

interface ProductTableProps {
  products: Product[]
  loading?: boolean
  onRefresh?: () => void
}

const categories = [
  "Đồ uống",
  "Đồ ăn nhanh", 
  "Đồ ăn vặt",
  "Thuốc lá",
  "Khác"
]

export function ProductTable({ products, loading, onRefresh }: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Hết hàng</Badge>
    } else if (stock <= 10) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Sắp hết</Badge>
    } else {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Còn hàng</Badge>
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplierName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || product.itemCategory === categoryFilter
    
    const matchesStock = stockFilter === "all" || 
                        (stockFilter === "low" && product.stock <= 10) ||
                        (stockFilter === "out" && product.stock === 0) ||
                        (stockFilter === "available" && product.stock > 10)
    
    return matchesSearch && matchesCategory && matchesStock
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="border rounded-lg">
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Bộ lọc và tìm kiếm */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên sản phẩm hoặc nhà cung cấp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tồn kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="available">Còn hàng</SelectItem>
              <SelectItem value="low">Sắp hết</SelectItem>
              <SelectItem value="out">Hết hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tổng sản phẩm</span>
          </div>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-green-600" />
            <span className="text-sm text-muted-foreground">Còn hàng</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {products.filter(p => p.stock > 10).length}
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-muted-foreground">Sắp hết</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {products.filter(p => p.stock <= 10 && p.stock > 0).length}
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-red-600" />
            <span className="text-sm text-muted-foreground">Hết hàng</span>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {products.filter(p => p.stock === 0).length}
          </p>
        </div>
      </div>

      {/* Bảng sản phẩm */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead>Nhà cung cấp</TableHead>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Không tìm thấy sản phẩm nào
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.itemId}>
                  <TableCell className="font-medium">{product.itemId}</TableCell>
                  <TableCell className="font-medium">{product.itemName}</TableCell>
                  <TableCell>
                    {product.itemCategory ? (
                      <Badge variant="outline">{product.itemCategory}</Badge>
                    ) : (
                      <span className="text-muted-foreground">Chưa phân loại</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{product.stock}</span>
                      {getStockBadge(product.stock)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.supplierName || (
                      <span className="text-muted-foreground">Chưa có</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div data-tour="product-actions">
                      <ProductActionsSheet 
                        product={product} 
                        onSuccess={onRefresh}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Thông tin kết quả */}
      <div className="text-sm text-muted-foreground">
        Hiển thị {filteredProducts.length} trong tổng số {products.length} sản phẩm
      </div>
    </div>
  )
}
