"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, BarChart3, Calendar } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface RevenueStatsProps {
  stats: {
    totalRevenue: number;
    totalComputerUsageRevenue: number;
    totalSalesRevenue: number;
    averageDailyRevenue: number;
    revenueGrowth: number;
  };
  loading: boolean;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export function RevenueStats({ stats, loading, dateRange }: RevenueStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getGrowthColor = (value: number) => {
    if (value > 0) return "text-green-600"
    if (value < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getGrowthIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4" />
    if (value < 0) return <TrendingDown className="h-4 w-4" />
    return <BarChart3 className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <span>Khoảng thời gian:</span>
            <span>{format(new Date(dateRange.startDate), 'dd/MM/yyyy', { locale: vi })}</span>
            <span>-</span>
            <span>{format(new Date(dateRange.endDate), 'dd/MM/yyyy', { locale: vi })}</span>
          </div>
        </CardContent>
      </Card>

      {/* Computer Usage Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doanh thu sử dụng máy</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalComputerUsageRevenue)}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <span>Tỷ lệ:</span>
            <span>{((stats.totalComputerUsageRevenue / stats.totalRevenue) * 100).toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Sales Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doanh thu bán hàng</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalSalesRevenue)}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <span>Tỷ lệ:</span>
            <span>{((stats.totalSalesRevenue / stats.totalRevenue) * 100).toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Average Daily Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doanh thu trung bình/ngày</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.averageDailyRevenue)}</div>
          <div className="flex items-center space-x-1 text-xs">
            {getGrowthIcon(stats.revenueGrowth)}
            <span className={getGrowthColor(stats.revenueGrowth)}>
              {formatPercentage(stats.revenueGrowth)}
            </span>
            <span className="text-muted-foreground">so với kỳ trước</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
