"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Users, DollarSign, TrendingUp, Clock, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { dashboardApi, DashboardStats, RecentActivity, ComputerStatus } from "@/lib/dashboard"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [computerStatus, setComputerStatus] = useState<ComputerStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [statsData, activitiesData, statusData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentActivities(5),
          dashboardApi.getComputerStatus()
        ])
        
        setStats(statsData)
        setRecentActivities(activitiesData)
        setComputerStatus(statusData)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Không thể tải dữ liệu dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Đang tải dữ liệu...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  const statsCards = stats ? [
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
  ] : []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan hệ thống CyberX Arena</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.computerName}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.timeAgo}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Không có hoạt động gần đây</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Trạng thái máy</CardTitle>
            <CardDescription>Tình trạng hoạt động của các máy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {computerStatus ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-primary" />
                      <span className="text-sm text-foreground">Đang sử dụng</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{formatNumber(computerStatus.activeComputers)} máy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-muted" />
                      <span className="text-sm text-foreground">Trống</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{formatNumber(computerStatus.availableComputers)} máy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-destructive" />
                      <span className="text-sm text-foreground">Bảo trì</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{formatNumber(computerStatus.maintenanceComputers)} máy</span>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Tỷ lệ sử dụng</span>
                      <span className="text-sm font-medium text-foreground">{computerStatus.utilizationRate}</span>
                    </div>
                    <div className="h-2 bg-secondary overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: computerStatus.utilizationRate }} 
                      />
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Không thể tải trạng thái máy</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
