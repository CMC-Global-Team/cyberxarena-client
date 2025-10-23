"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  History, 
  Clock, 
  User, 
  Calendar, 
  Monitor, 
  Phone, 
  CreditCard, 
  MapPin,
  DollarSign,
  Activity,
  Users,
  Timer
} from "lucide-react"
import { ComputerApi, type ComputerUsageStats } from "@/lib/computers"
import { SessionApi, type SessionDTO } from "@/lib/sessions"
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
  const [enrichedBySessionId, setEnrichedBySessionId] = useState<Map<number, SessionDTO>>(new Map())

  const loadUsageStats = async () => {
    try {
      setLoading(true)
      const stats = await withPageLoading(() => ComputerApi.getUsageStats(computerId))
      setUsageStats(stats)

      // Enrich each recent session with full customer/account/membership info
      if (stats?.recentSessions?.length) {
        console.log('Original usage stats sessions:', stats.recentSessions)
        const sessionIds = stats.recentSessions.map(s => s.sessionId)
        console.log('Session IDs to enrich:', sessionIds)
        
        const results = await Promise.allSettled(sessionIds.map(id => SessionApi.getById(id)))
        const map = new Map<number, SessionDTO>()
        
        results.forEach((r, idx) => {
          if (r.status === "fulfilled" && r.value) {
            console.log(`Enriched session ${sessionIds[idx]}:`, r.value)
            map.set(sessionIds[idx], r.value)
          } else {
            console.error(`Failed to enrich session ${sessionIds[idx]}:`, r.status === "rejected" ? r.reason : "Unknown error")
          }
        })
        
        console.log('Final enriched map:', map)
        setEnrichedBySessionId(map)
      } else {
        setEnrichedBySessionId(new Map())
      }
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
        return 'bg-green-500/20 text-green-600 border-green-200'
      case 'active':
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-600 border-blue-200'
      case 'cancelled':
        return 'bg-red-500/20 text-red-600 border-red-200'
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-200'
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
      <DialogContent className="max-w-[98vw] w-[98vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-1 text-xl">
            <History className="h-5 w-5 text-primary" />
            Lịch sử sử dụng máy tính
          </DialogTitle>
          <DialogDescription className="text-xs">
            {computerName} - Chi tiết lịch sử và thống kê sử dụng
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <div className="text-lg text-muted-foreground">Đang tải thông tin...</div>
              </div>
            </div>
          ) : usageStats ? (
            <div className="h-full flex flex-col gap-3">
              {/* Thống kê tổng quan */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1">
                      <Timer className="h-2 w-2" />
                      Tổng thời gian
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {formatDuration(usageStats.totalHours)}
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {usageStats.totalHours.toFixed(2)} giờ
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium text-green-700 dark:text-green-300 flex items-center gap-1">
                      <Users className="h-2 w-2" />
                      Tổng phiên
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-green-900 dark:text-green-100">
                      {usageStats.totalSessions}
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      phiên sử dụng
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium text-purple-700 dark:text-purple-300 flex items-center gap-1">
                      <Calendar className="h-2 w-2" />
                      Lần cuối
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs font-bold text-purple-900 dark:text-purple-100">
                      {formatDateTime(usageStats.lastUsed)}
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      {new Date(usageStats.lastUsed).toLocaleDateString('vi-VN')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium text-orange-700 dark:text-orange-300 flex items-center gap-1">
                      <Monitor className="h-2 w-2" />
                      Máy tính
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs font-bold text-orange-900 dark:text-orange-100">
                      {usageStats.computerName}
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      ID: {usageStats.computerId}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Lịch sử chi tiết */}
              <Card className="flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center gap-1">
                    <History className="h-2 w-2" />
                    Lịch sử phiên sử dụng chi tiết
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <ScrollArea className="h-[300px]">
                    {usageStats.recentSessions && usageStats.recentSessions.length > 0 ? (
                      <div className="space-y-1 pr-4">
                        {usageStats.recentSessions.map((session, index) => {
                          const enriched = enrichedBySessionId.get(session.sessionId)
                          console.log(`Session ${session.sessionId} enriched data:`, enriched)
                          console.log(`Session ${session.sessionId} original data:`, session)
                          
                          // Ưu tiên dữ liệu từ enriched, fallback về session gốc
                          const displayName = enriched?.customerName || session.customerName || 'Không có tên'
                          const displayPhone = enriched?.customerPhone || session.customerPhone || 'Chưa có'
                          const displayCard = enriched?.membershipCardName || session.membershipCardName || 'Chưa có'
                          const displayAccount = enriched?.accountUsername || 'Chưa có'
                          
                          // Debug: Kiểm tra từng field
                          console.log(`Session ${session.sessionId} field analysis:`, {
                            'enriched.customerName': enriched?.customerName,
                            'session.customerName': session.customerName,
                            'final displayName': displayName,
                            'enriched.customerPhone': enriched?.customerPhone,
                            'session.customerPhone': session.customerPhone,
                            'final displayPhone': displayPhone
                          })
                          
                          return (
                          <div key={session.sessionId} className="border border-border rounded-lg p-3 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                            {/* Header với thông tin phiên */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-1">
                                <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                                  <User className="h-2 w-2 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-base text-foreground">{displayName}</h3>
                                  <p className="text-xs text-muted-foreground">Phiên #{session.sessionId}</p>
                                </div>
                              </div>
                              <Badge className={`${getStatusColor(session.status)} border text-xs px-2 py-1`}>
                                {getStatusText(session.status)}
                              </Badge>
                            </div>

                            {/* Thông tin chi tiết trong grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                              {/* Thông tin thời gian */}
                              <div className="space-y-1">
                                <h4 className="font-medium text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-2 w-2" />
                                  Thời gian
                                </h4>
                                <div className="space-y-1 text-xs">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-2 w-2 text-muted-foreground" />
                                    <span className="font-medium">Bắt đầu:</span>
                                    <span className="text-foreground">{formatDateTime(session.startTime)}</span>
                                  </div>
                                  {session.endTime && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-2 w-2 text-muted-foreground" />
                                      <span className="font-medium">Kết thúc:</span>
                                      <span className="text-foreground">{formatDateTime(session.endTime)}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Timer className="h-2 w-2 text-muted-foreground" />
                                    <span className="font-medium">Thời lượng:</span>
                                    <span className="text-foreground font-medium text-primary">{formatDuration(session.durationHours)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Thông tin khách hàng */}
                              <div className="space-y-1">
                                <h4 className="font-medium text-xs text-muted-foreground flex items-center gap-1">
                                  <User className="h-2 w-2" />
                                  Thông tin khách hàng
                                </h4>
                                <div className="space-y-1 text-xs">
                                  <div className="flex items-center gap-1">
                                    <User className="h-2 w-2 text-muted-foreground" />
                                    <span className="font-medium">Tên:</span>
                                    <span className="text-foreground font-medium">{displayName}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-2 w-2 text-muted-foreground" />
                                    <span className="font-medium">SĐT:</span>
                                    <span className="text-foreground">{displayPhone || 'Chưa có'}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <CreditCard className="h-2 w-2 text-muted-foreground" />
                                    <span className="font-medium">Thẻ:</span>
                                    <span className="text-foreground">{displayCard || 'Chưa có'}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <CreditCard className="h-2 w-2 text-muted-foreground" />
                                    <span className="font-medium">Tài khoản:</span>
                                    <span className="text-foreground">{displayAccount ? `@${displayAccount}` : 'Chưa có'}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Thông tin phiên */}
                              <div className="space-y-1">
                                <h4 className="font-medium text-xs text-muted-foreground flex items-center gap-1">
                                  <Activity className="h-2 w-2" />
                                  Thông tin phiên
                                </h4>
                                <div className="space-y-1 text-xs">
                                  <div className="flex items-center gap-1">
                                    <Monitor className="h-2 w-2 text-muted-foreground" />
                                    <span className="font-medium">Máy:</span>
                                    <span className="text-foreground">{computerName}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-2 w-2 text-muted-foreground" />
                                    <span className="font-medium">Trạng thái:</span>
                                    <span className="text-foreground">{getStatusText(session.status)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-2 w-2 text-muted-foreground" />
                                    <span className="font-medium">ID phiên:</span>
                                    <span className="text-foreground font-mono">#{session.sessionId}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {index < usageStats.recentSessions.length - 1 && (
                              <Separator className="mt-4" />
                            )}
                          </div>
                        )})}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">Chưa có lịch sử sử dụng</h3>
                        <p className="text-xs text-muted-foreground">Máy tính này chưa có phiên sử dụng nào</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">Không thể tải thông tin</h3>
                <p className="text-xs text-muted-foreground">Vui lòng thử lại sau</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}