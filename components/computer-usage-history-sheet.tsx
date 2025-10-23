"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Monitor, User, Calendar, Activity, History } from "lucide-react"
import { ComputerApi, type ComputerUsageStats, type SessionUsageHistory } from "@/lib/computers"
import { useNotice } from "@/components/notice-provider"
import { useLoading } from "@/components/loading-provider"

interface ComputerUsageHistorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  computerId: number
  computerName: string
}

export function ComputerUsageHistorySheet({
  open,
  onOpenChange,
  computerId,
  computerName,
}: ComputerUsageHistorySheetProps) {
  const { notify } = useNotice()
  const { withLoading } = useLoading()
  const [usageStats, setUsageStats] = useState<ComputerUsageStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && computerId) {
      loadUsageStats()
    }
  }, [open, computerId])

  const loadUsageStats = async () => {
    try {
      setLoading(true)
      const stats = await withLoading(() => ComputerApi.getUsageStats(computerId))
      setUsageStats(stats)
    } catch (error: any) {
      console.error("Error loading usage stats:", error)
      notify({ type: "error", message: `Lỗi tải thống kê sử dụng: ${error?.message || "Không xác định"}` })
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    return `${h}h ${m}m`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-500/20 text-blue-600"
      case "Ended":
        return "bg-green-500/20 text-green-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "Active":
        return "Đang sử dụng"
      case "Ended":
        return "Đã kết thúc"
      default:
        return "Không xác định"
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[800px] max-h-screen overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Lịch sử sử dụng - {computerName}
          </SheetTitle>
          <SheetDescription>
            Thống kê chi tiết về việc sử dụng máy tính
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : usageStats ? (
          <div className="space-y-6 py-6">
            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Tổng giờ chạy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {usageStats.totalHours.toFixed(1)}h
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tổng thời gian sử dụng
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Tổng phiên
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {usageStats.totalSessions}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Số phiên sử dụng
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Lần sử dụng cuối
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium text-foreground">
                    {usageStats.lastUsed ? formatDateTime(usageStats.lastUsed) : "Chưa có"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Thời gian gần nhất
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Lịch sử phiên gần đây */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <History className="h-5 w-5" />
                Lịch sử phiên gần đây
              </h3>
              
              {usageStats.recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {usageStats.recentSessions.map((session) => (
                    <Card key={session.sessionId} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Phiên #{session.sessionId}</span>
                          </div>
                          <Badge className={getStatusColor(session.status)}>
                            {getStatusText(session.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Khách hàng:</span>
                            <span className="font-medium">{session.customerName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Thời gian:</span>
                            <span className="font-medium">{formatDuration(session.durationHours)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Bắt đầu:</span>
                            <span className="font-medium">{formatDateTime(session.startTime)}</span>
                          </div>
                          
                          {session.endTime && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">Kết thúc:</span>
                              <span className="font-medium">{formatDateTime(session.endTime)}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Chưa có lịch sử sử dụng</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không thể tải thông tin</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
