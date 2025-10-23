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
      <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] overflow-y-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-muted-foreground flex items-center gap-2">
                      <Clock className="h-6 w-6" />
                      Tổng giờ chạy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-foreground mb-2">
                      {formatDuration(usageStats.totalHours)}
                    </div>
                    <p className="text-base text-muted-foreground">
                      {usageStats.totalHours.toFixed(2)} giờ
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-muted-foreground flex items-center gap-2">
                      <User className="h-6 w-6" />
                      Tổng phiên
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-foreground mb-2">
                      {usageStats.totalSessions}
                    </div>
                    <p className="text-base text-muted-foreground">
                      phiên sử dụng
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-6 w-6" />
                      Lần sử dụng cuối
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-foreground mb-2">
                      {formatDateTime(usageStats.lastUsed)}
                    </div>
                    <p className="text-base text-muted-foreground">
                      {new Date(usageStats.lastUsed).toLocaleDateString('vi-VN')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-muted-foreground flex items-center gap-2">
                      <Monitor className="h-6 w-6" />
                      Máy tính
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-foreground mb-2">
                      {usageStats.computerName}
                    </div>
                    <p className="text-base text-muted-foreground">
                      ID: {usageStats.computerId}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-8" />

              {/* Lịch sử phiên gần đây */}
              <Card className="border-2">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <Monitor className="h-7 w-7" />
                    Lịch sử phiên sử dụng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {usageStats.recentSessions && usageStats.recentSessions.length > 0 ? (
                    <div className="space-y-6">
                      {usageStats.recentSessions.map((session, index) => (
                        <div key={session.sessionId} className="border-2 border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 bg-primary/20 rounded-full flex items-center justify-center">
                                <User className="h-7 w-7 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-bold text-xl text-foreground mb-1">{session.customerName}</h3>
                                <p className="text-base text-muted-foreground">Phiên #{session.sessionId}</p>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(session.status)} text-base px-4 py-2`}>
                              {getStatusText(session.status)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 text-base">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <span className="font-semibold">Bắt đầu:</span>
                                <span className="text-foreground font-medium">{formatDateTime(session.startTime)}</span>
                              </div>
                              {session.endTime && (
                                <div className="flex items-center gap-3 text-base">
                                  <Calendar className="h-5 w-5 text-muted-foreground" />
                                  <span className="font-semibold">Kết thúc:</span>
                                  <span className="text-foreground font-medium">{formatDateTime(session.endTime)}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 text-base">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <span className="font-semibold">Thời gian:</span>
                                <span className="text-foreground font-bold text-lg">{formatDuration(session.durationHours)}</span>
                              </div>
                              <div className="flex items-center gap-3 text-base">
                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                                <span className="font-semibold">Trạng thái:</span>
                                <span className="text-foreground font-medium">{getStatusText(session.status)}</span>
                              </div>
                            </div>
                          </div>
                          
                          {index < usageStats.recentSessions.length - 1 && (
                            <Separator className="mt-6" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Monitor className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-muted-foreground mb-3">Chưa có phiên sử dụng</h3>
                      <p className="text-base text-muted-foreground">Máy tính này chưa có lịch sử sử dụng nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-16">
              <History className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-3">Không thể tải thông tin</h3>
              <p className="text-base text-muted-foreground">Vui lòng thử lại sau</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}