"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, TrendingUp } from "lucide-react"
import { Revenue } from "@/lib/revenue"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface RevenueTableProps {
  revenues: Revenue[];
  loading: boolean;
  onRecalculate: (date: string) => void;
}

export function RevenueTable({ revenues, loading, onRecalculate }: RevenueTableProps) {
  const [recalculating, setRecalculating] = useState<number | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleRecalculate = async (revenueId: number, date: string) => {
    setRecalculating(revenueId)
    try {
      await onRecalculate(date)
    } finally {
      setRecalculating(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (revenues.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có dữ liệu doanh thu</h3>
            <p className="text-muted-foreground">
              Không có dữ liệu doanh thu trong khoảng thời gian đã chọn
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead className="text-right">Doanh thu sử dụng máy</TableHead>
                <TableHead className="text-right">Doanh thu bán hàng</TableHead>
                <TableHead className="text-right">Tổng doanh thu</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenues.map((revenue, index) => (
                <TableRow key={revenue.revenueId} data-animate="table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                  <TableCell className="font-medium">
                    #{revenue.revenueId}
                  </TableCell>
                  <TableCell>
                    {format(new Date(revenue.date), 'dd/MM/yyyy', { locale: vi })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">{formatCurrency(revenue.computerUsageRevenue)}</div>
                    <div className="text-xs text-muted-foreground">
                      {((revenue.computerUsageRevenue / revenue.totalRevenue) * 100).toFixed(1)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">{formatCurrency(revenue.salesRevenue)}</div>
                    <div className="text-xs text-muted-foreground">
                      {((revenue.salesRevenue / revenue.totalRevenue) * 100).toFixed(1)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-bold text-lg">{formatCurrency(revenue.totalRevenue)}</div>
                    <Badge variant="secondary" className="text-xs">
                      Tổng cộng
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecalculate(revenue.revenueId, revenue.date)}
                      disabled={recalculating === revenue.revenueId}
                    >
                      {recalculating === revenue.revenueId ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      <span className="ml-2">Tính lại</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
