"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, TrendingUp, DollarSign, BarChart3, Calendar } from "lucide-react"
import { Revenue, revenueApi } from "@/lib/revenue"
import { useToast } from "@/hooks/use-toast"
import { RevenueStats } from "@/components/revenue-management/revenue-stats"
import { RevenueTable } from "@/components/revenue-management/revenue-table"
import { RevenueChart } from "@/components/revenue-management/revenue-chart-recharts"
import { RevenueFormSheet } from "@/components/revenue-management/revenue-form-sheet"
import { RevenueTour } from "@/components/revenue-management/revenue-tour"
import { TourTrigger } from "@/components/ui/tour-trigger"
import { RevenueAnimations } from "@/components/animations/revenue-animations"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { OptimizedPageLayout } from "@/components/ui/optimized-page-layout"
import { LottieInlineLoading } from "@/components/ui/lottie-loading"

export default function RevenuePage() {
  const [revenues, setRevenues] = useState<Revenue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  })
  const [activeTab, setActiveTab] = useState<"overview" | "reports" | "analytics">("overview")
  const [formOpen, setFormOpen] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalComputerUsageRevenue: 0,
    totalSalesRevenue: 0,
    averageDailyRevenue: 0,
    revenueGrowth: 0
  })
  const { toast } = useToast()

  // GSAP scroll animation refs
  const pageRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  // Load revenue data
  const loadRevenues = async () => {
    try {
      setLoading(true)
      const data = await revenueApi.getAll({
        page: 0,
        size: 100,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        sortBy: 'date',
        sortOrder: 'desc'
      })
      setRevenues(data.content || [])
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu doanh thu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Load stats
  const loadStats = async () => {
    try {
      const data = await revenueApi.getStats(dateRange.startDate, dateRange.endDate)
      setStats(data)
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  // Generate revenue reports
  const handleGenerateReports = async () => {
    try {
      setLoading(true)
      const reports = await revenueApi.generateReports({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      })
      setRevenues(reports)
      toast({
        title: "Thành công",
        description: "Đã tạo báo cáo doanh thu thành công",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo báo cáo doanh thu",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Recalculate revenue for specific date
  const handleRecalculateRevenue = async (date: string) => {
    try {
      await revenueApi.recalculateReport(date)
      toast({
        title: "Thành công",
        description: "Đã tính lại doanh thu thành công",
      })
      loadRevenues()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tính lại doanh thu",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    loadRevenues()
    loadStats()
  }, [dateRange])

  // Filter revenues based on search term
  const filteredRevenues = revenues.filter(revenue => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      revenue.revenueId.toString().includes(searchLower) ||
      revenue.date.includes(searchLower) ||
      revenue.totalRevenue.toString().includes(searchLower)
    )
  })

  return (
    <OptimizedPageLayout isLoading={loading} pageType="revenue">
      <RevenueAnimations>
        <div ref={pageRef} className="space-y-6">
        {/* Header */}
        <div data-animate="page-header" className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold tracking-tight" data-tour="page-title">Quản lý doanh thu</h1>
              <TourTrigger onClick={() => setShowTour(true)} />
            </div>
            <p className="text-muted-foreground">
              Theo dõi và phân tích doanh thu từ sử dụng máy tính và bán hàng
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                loadRevenues()
                loadStats()
              }}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>

        {/* Date Range Filter */}
        <Card data-animate="date-filter">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Bộ lọc thời gian</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Từ ngày:</label>
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-40"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Đến ngày:</label>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-40"
                />
              </div>
              <Button onClick={handleGenerateReports} disabled={loading}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Tạo báo cáo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div data-animate="tabs-container">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "overview" | "reports" | "analytics")}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Tổng quan</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Báo cáo</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Phân tích</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Revenue Stats */}
              <div ref={statsRef} data-tour="revenue-stats" data-animate="stats-card">
                <RevenueStats 
                  stats={stats} 
                  loading={loading}
                  dateRange={dateRange}
                />
              </div>

              {/* Revenue Chart */}
              <div ref={chartRef} data-tour="revenue-chart" data-animate="chart-container">
                <RevenueChart 
                  revenues={revenues}
                  loading={loading}
                  dateRange={dateRange}
                />
              </div>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              {/* Revenue Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Báo cáo doanh thu</CardTitle>
                      <CardDescription>
                        Chi tiết doanh thu theo từng ngày
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative" data-tour="revenue-search">
                        <Input
                          placeholder="Tìm kiếm báo cáo..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent data-animate="table-container">
                  <RevenueTable
                    revenues={filteredRevenues}
                    loading={loading}
                    onRecalculate={handleRecalculateRevenue}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Phân tích chi tiết</CardTitle>
                  <CardDescription>
                    Biểu đồ và thống kê chi tiết về doanh thu
                  </CardDescription>
                </CardHeader>
                <CardContent data-animate="chart-container">
                  <RevenueChart 
                    revenues={revenues}
                    loading={loading}
                    dateRange={dateRange}
                    showAnalytics={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Tour */}
        <RevenueTour 
          isActive={showTour} 
          onComplete={() => setShowTour(false)} 
        />
        </div>
      </RevenueAnimations>
    </OptimizedPageLayout>
  )
}
