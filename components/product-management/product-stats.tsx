"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react"
import { Product } from "@/lib/products"

interface ProductStatsProps {
  products: Product[]
}

export function ProductStats({ products }: ProductStatsProps) {
  const totalProducts = products.length
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0)
  const lowStockProducts = products.filter(p => p.stock <= 10 && p.stock > 0).length
  const outOfStockProducts = products.filter(p => p.stock === 0).length
  const availableProducts = products.filter(p => p.stock > 10).length

  // Thống kê theo danh mục
  const categoryStats = products.reduce((acc, product) => {
    const category = product.itemCategory || "Chưa phân loại"
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Top 5 sản phẩm có giá trị tồn kho cao nhất
  const topValueProducts = products
    .map(product => ({
      ...product,
      totalValue: product.price * product.stock
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Sản phẩm trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trị tồn kho</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Tổng giá trị hàng tồn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp hết hàng</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              Cần nhập thêm
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              Cần nhập gấp
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thống kê theo danh mục */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố theo danh mục</CardTitle>
            <CardDescription>
              Số lượng sản phẩm theo từng danh mục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryStats)
                .sort(([,a], [,b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / totalProducts) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Top sản phẩm có giá trị cao */}
        <Card>
          <CardHeader>
            <CardTitle>Top sản phẩm giá trị cao</CardTitle>
            <CardDescription>
              Sản phẩm có giá trị tồn kho cao nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topValueProducts.map((product, index) => (
                <div key={product.itemId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.itemName}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.stock} sản phẩm
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {formatPrice(product.totalValue)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(product.price)}/sản phẩm
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cảnh báo tồn kho */}
      {(lowStockProducts > 0 || outOfStockProducts > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Cảnh báo tồn kho
            </CardTitle>
            <CardDescription className="text-orange-700">
              Có sản phẩm cần được nhập thêm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {outOfStockProducts > 0 && (
                <p className="text-sm text-red-700">
                  ⚠️ <strong>{outOfStockProducts}</strong> sản phẩm đã hết hàng
                </p>
              )}
              {lowStockProducts > 0 && (
                <p className="text-sm text-orange-700">
                  ⚠️ <strong>{lowStockProducts}</strong> sản phẩm sắp hết hàng (≤10 sản phẩm)
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
