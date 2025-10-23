"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { History, Clock, User, Calendar, Monitor } from "lucide-react"
import { ComputerApi, type ComputerUsageStats } from "@/lib/computers"
import { useNotice } from "@/components/notice-provider"
import { usePageLoading } from "@/hooks/use-page-loading"

interface ComputerUsageHistorySheetProps {
  computerId: number
  computerName: string
  children: React.ReactNode
}

export function ComputerUsageHistorySheet({ computerId, computerName, children }: ComputerUsageHistorySheetProps) {
  const { notify } = useNotice()
  const { withPageLoading } = usePageLoading()
  const [open, setOpen] = useState(false)
  const [usageStats, setUsageStats] = useState<ComputerUsageStats | null>(null)
  const [loading, setLoading] = useState(false)

  const loadUsageStats = async () => {
    try {
      setLoading(true)
      const stats = await withPageLoading(() => ComputerApi.getUsageStats(computerId))
      setUsageStats(stats)
    } catch (e: any) {
      notify({ type: "error", message: `Lỗi tải lịch sử sử dụng: ${e?.message || ''}` })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      loadUsageStats()
    }
  }, [open])

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
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    return `${wholeHours}h ${minutes}m`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'finished':
        return 'bg-green-500/20 text-green-600'
      case 'active':
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-600'
      case 'cancelled':
        return 'bg-red-500/20 text-red-600'
      default:
        return 'bg-gray-500/20 text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'finished':
        return 'Hoàn thành'
      case 'active':
      case 'in_progress':
        return 'Đang sử dụng'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[700px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Lịch sử sử dụng - {computerName}
          </SheetTitle>
          <SheetDescription>
            Thống kê và lịch sử sử dụng máy tính
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Đang tải...</div>
            </div>
          ) : usageStats ? (
            <>
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
                      {formatDuration(usageStats.totalHours)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {usageStats.totalHours.toFixed(2)} giờ
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Tổng phiên
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {usageStats.totalSessions}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      phiên sử dụng
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
                      {formatDateTime(usageStats.lastUsed)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(usageStats.lastUsed).toLocaleDateString('vi-VN')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Lịch sử phiên gần đây */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Phiên sử dụng gần đây
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {usageStats.recentSessions && usageStats.recentSessions.length > 0 ? (
                    <div className="space-y-3">
                      {usageStats.recentSessions.map((session) => (
                        <div key={session.sessionId} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground">{session.customerName}</span>
                              <Badge className={getStatusColor(session.status)}>
                                {getStatusText(session.status)}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>Bắt đầu: {formatDateTime(session.startTime)}</div>
                              {session.endTime && (
                                <div>Kết thúc: {formatDateTime(session.endTime)}</div>
                              )}
                              <div>Thời gian: {formatDuration(session.durationHours)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có phiên sử dụng nào
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Không thể tải thông tin lịch sử
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}