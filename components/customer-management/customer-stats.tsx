"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CustomerStatsProps {
  totalCustomers: number
  activeCustomers: number
  totalBalance: number
  newCustomersThisMonth: number
}

export function CustomerStats({ 
  totalCustomers, 
  activeCustomers, 
  totalBalance, 
  newCustomersThisMonth 
}: CustomerStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Tổng khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalCustomers}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {activeCustomers} đang hoạt động
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số dư</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(totalBalance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Trung bình {formatCurrency(totalCustomers > 0 ? totalBalance / totalCustomers : 0)}/khách
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Khách hàng mới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">+{newCustomersThisMonth}</div>
          <p className="text-xs text-muted-foreground mt-1">Trong tháng này</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Tỷ lệ hoạt động</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Khách hàng có tài khoản
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
