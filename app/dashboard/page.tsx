"use client"

import { useEffect, useState } from "react"
import { dashboardApi, DashboardStats, ComputerStatus } from "@/lib/dashboard"
import { DashboardStats as DashboardStatsComponent } from "@/components/dashboard/dashboard-stats"
import { Computer3DViewer } from "@/components/dashboard/computer-3d-viewer"
import { ComputerStatusCard } from "@/components/dashboard/computer-status"
import { OptimizedPageLayout } from "@/components/ui/optimized-page-layout"
import { DashboardAnimations } from "@/components/animations/dashboard-animations"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [computerStatus, setComputerStatus] = useState<ComputerStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [statsData, statusData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getComputerStatus()
        ])
        
        setStats(statsData)
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

  return (
    <OptimizedPageLayout isLoading={loading} pageType="customers">
      <DashboardAnimations>
        <div className="p-6 space-y-6">
          <div data-animate="page-header">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Tổng quan hệ thống CyberX Arena</p>
          </div>

          {/* Stats Section - Hiển thị lỗi nếu không load được */}
          {error ? (
            <div data-animate="error-state" className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-destructive">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-medium">Không thể tải dữ liệu thống kê</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 px-3 py-1.5 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : stats ? (
            <div data-animate="dashboard-stats">
              <DashboardStatsComponent stats={stats} />
            </div>
          ) : (
            <div data-animate="loading-state" className="bg-muted/50 border border-border rounded-lg p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">Đang tải thống kê...</span>
              </div>
            </div>
          )}

          <div data-animate="grid-container" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3D Viewer - Luôn hiển thị */}
            <div data-animate="computer-3d-viewer">
              <Computer3DViewer />
            </div>
            
            {/* Computer Status - Hiển thị lỗi nếu không load được */}
            {error ? (
              <div data-animate="error-state" className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-destructive">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="font-medium">Không thể tải trạng thái máy tính</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            ) : computerStatus ? (
              <div data-animate="computer-status">
                <ComputerStatusCard status={computerStatus} />
              </div>
            ) : (
              <div data-animate="loading-state" className="bg-muted/50 border border-border rounded-lg p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-muted-foreground">Đang tải trạng thái...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardAnimations>
    </OptimizedPageLayout>
  )
}
