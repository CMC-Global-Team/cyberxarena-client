"use client"

import { useEffect, useState } from "react"
import { dashboardApi, DashboardStats, RecentActivity, ComputerStatus } from "@/lib/dashboard"
import { DashboardStats as DashboardStatsComponent } from "@/components/dashboard/dashboard-stats"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { ComputerStatusCard } from "@/components/dashboard/computer-status"
import { DashboardLoading } from "@/components/dashboard/dashboard-loading"
import { DashboardError } from "@/components/dashboard/dashboard-error"

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

  if (loading) {
    return <DashboardLoading />
  }

  if (error) {
    return <DashboardError error={error} onRetry={() => window.location.reload()} />
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan hệ thống CyberX Arena</p>
      </div>

      {stats && <DashboardStatsComponent stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities activities={recentActivities} />
        {computerStatus && <ComputerStatusCard status={computerStatus} />}
      </div>
    </div>
  )
}
