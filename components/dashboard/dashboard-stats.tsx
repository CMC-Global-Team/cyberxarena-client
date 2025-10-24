"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Users, DollarSign, Clock, TrendingUp } from "lucide-react"
import { DashboardStats } from "@/lib/dashboard"

interface DashboardStatsProps {
  stats: DashboardStats
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const statsCards = [
    {
      title: "Tổng máy",
      value: formatNumber(stats.totalComputers),
      description: `${formatNumber(stats.activeComputers)} đang hoạt động`,
      icon: Monitor,
      trend: `+${stats.activeComputers} đang sử dụng`,
    },
    {
      title: "Khách hàng",
      value: formatNumber(stats.totalCustomers),
      description: `${formatNumber(stats.onlineCustomers)} đang online`,
      icon: Users,
      trend: `${stats.onlineCustomers} đang hoạt động`,
    },
    {
      title: "Doanh thu hôm nay",
      value: formatCurrency(stats.todayRevenue),
      description: `Từ ${formatNumber(stats.todayTransactions)} giao dịch`,
      icon: DollarSign,
      trend: `${stats.todayTransactions} giao dịch`,
    },
    {
      title: "Thời gian trung bình",
      value: `${stats.averageSessionDuration.toFixed(1)}h`,
      description: "Mỗi phiên chơi",
      icon: Clock,
      trend: stats.computerUtilizationRate + " sử dụng",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              <div className="flex items-center mt-2 text-xs text-primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
