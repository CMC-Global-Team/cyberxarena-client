"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, DollarSign, TrendingUp, Users } from "lucide-react"
import { Sale } from "@/lib/sales"

interface SaleStatsProps {
  sales: Sale[]
  loading?: boolean
  refunds?: any[] // Danh sách refund để loại trừ khỏi tính toán
}

export function SaleStats({ sales, loading, refunds = [] }: SaleStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount || 0)
  }

  const calculateStats = () => {
    if (sales.length === 0) {
      return {
        totalSales: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        totalItems: 0,
        uniqueCustomers: 0
      }
    }

    // Lọc ra những sales đã có refund (không tính vào doanh thu)
    const salesWithoutRefund = sales.filter(sale => {
      const hasRefund = refunds.some(refund => refund.saleId === sale.saleId)
      return !hasRefund
    })

    const totalRevenue = salesWithoutRefund.reduce((sum, sale) => sum + sale.totalAmount, 0)
    const totalItems = sales.reduce((sum, sale) => sum + sale.items.length, 0)
    const uniqueCustomers = new Set(sales.map(sale => sale.customerId)).size
    const averageOrderValue = salesWithoutRefund.length > 0 ? totalRevenue / salesWithoutRefund.length : 0

    return {
      totalSales: sales.length,
      totalRevenue,
      averageOrderValue,
      totalItems,
      uniqueCustomers
    }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardTitle>
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-1" />
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng hóa đơn</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSales}</div>
          <p className="text-xs text-muted-foreground">
            hóa đơn trong hệ thống
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            tổng doanh thu
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Giá trị trung bình</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.averageOrderValue)}</div>
          <p className="text-xs text-muted-foreground">
            mỗi hóa đơn
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sản phẩm bán</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalItems}</div>
          <p className="text-xs text-muted-foreground">
            sản phẩm đã bán
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
