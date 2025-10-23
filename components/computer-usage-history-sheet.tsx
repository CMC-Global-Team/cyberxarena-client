"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { History, Clock, User, Calendar, Monitor, MapPin, Phone, Mail, CreditCard } from "lucide-react"
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[99vw] w-[99vw] max-h-[98vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <History className="h-6 w-6" />
            Lịch sử sử dụng - {computerName}
          </DialogTitle>
          <DialogDescription className="text-base">
            Thống kê chi tiết và lịch sử sử dụng máy tính
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-muted-foreground text-xl">Đang tải thông tin...</div>
            </div>
          ) : usageStats ? (
            <>
              {/* Thống kê tổng quan */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card className="border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Tổng giờ chạy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {formatDuration(usageStats.totalHours)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {usageStats.totalHours.toFixed(2)} giờ
                    </p>
                  </CardContent>
                </Card>

                <Card className="border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Tổng phiên
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {usageStats.totalSessions}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      phiên sử dụng
                    </p>
                  </CardContent>
                </Card>

                <Card className="border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Lần sử dụng cuối
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-foreground mb-1">
                      {formatDateTime(usageStats.lastUsed)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(usageStats.lastUsed).toLocaleDateString('vi-VN')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Máy tính
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-foreground mb-1">
                      {usageStats.computerName}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ID: {usageStats.computerId}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-6" />

              {/* Lịch sử phiên gần đây */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Lịch sử phiên sử dụng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {usageStats.recentSessions && usageStats.recentSessions.length > 0 ? (
                    <div className="space-y-4">
                      {usageStats.recentSessions.map((session, index) => (
                        <div key={session.sessionId} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-foreground mb-1">{session.customerName}</h3>
                                <p className="text-sm text-muted-foreground">Phiên #{session.sessionId}</p>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(session.status)} text-sm px-3 py-1`}>
                              {getStatusText(session.status)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Bắt đầu:</span>
                                <span className="text-foreground">{formatDateTime(session.startTime)}</span>
                              </div>
                              {session.endTime && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">Kết thúc:</span>
                                  <span className="text-foreground">{formatDateTime(session.endTime)}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Thời gian:</span>
                                <span className="text-foreground font-semibold">{formatDuration(session.durationHours)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Trạng thái:</span>
                                <span className="text-foreground">{getStatusText(session.status)}</span>
                              </div>
                            </div>
                          </div>
                          
                          {index < usageStats.recentSessions.length - 1 && (
                            <Separator className="mt-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Monitor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">Chưa có phiên sử dụng</h3>
                      <p className="text-sm text-muted-foreground">Máy tính này chưa có lịch sử sử dụng nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-12">
              <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Không thể tải thông tin</h3>
              <p className="text-sm text-muted-foreground">Vui lòng thử lại sau</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}