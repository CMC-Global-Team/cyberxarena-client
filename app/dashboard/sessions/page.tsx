"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Clock, MoreVertical, User, Monitor, Calendar, DollarSign } from "lucide-react"
import { SessionFormSheet } from "@/components/session-form-sheet"
import { SessionActionsSheet } from "@/components/session-actions-sheet"
import { ChangeComputerSheet } from "@/components/change-computer-sheet"
import { SessionTour } from "@/components/session-management/session-tour"
import { TourTrigger } from "@/components/ui/tour-trigger"
import { SessionApi, type SessionDTO } from "@/lib/sessions"
import { useNotice } from "@/components/notice-provider"
import { usePageLoading } from "@/hooks/use-page-loading"
import { OptimizedPageLayout } from "@/components/ui/optimized-page-layout"
import { SessionAnimations } from "@/components/animations/session-animations"

export default function SessionsPage() {
  const { notify } = useNotice()
  const { withPageLoading, isLoading } = usePageLoading()
  const [searchQuery, setSearchQuery] = useState("")
  const [addSheetOpen, setAddSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [actionsSheetOpen, setActionsSheetOpen] = useState(false)
  const [changeComputerSheetOpen, setChangeComputerSheetOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<SessionDTO | null>(null)
  const [sessions, setSessions] = useState<SessionDTO[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [initialLoadCompleted, setInitialLoadCompleted] = useState<boolean>(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("sessionId")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [showTour, setShowTour] = useState(false)

  const loadSessions = async () => {
    setLoading(true)
    try {
      const res = await withPageLoading(() => SessionApi.list({ page: 0, size: 100, sortBy: "sessionId", sortDir: "desc" })) as any
      console.log("Sessions API response:", res)
      console.log("Sessions content:", res?.content)
      setSessions(res?.content || [])
      setInitialLoadCompleted(true)
    } catch (e: any) {
      console.error("Error loading sessions:", e)
      notify({ type: "error", message: `Lỗi tải danh sách: ${e?.message || ''}` })
      setSessions([]) // Set empty array on error
      setInitialLoadCompleted(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()
  }, [])

  // Debounced server filter/sort/search
  useEffect(() => {
    if (!initialLoadCompleted) return
    
    // Skip if no search query and filter is "all" (use initial load result)
    if (!searchQuery && statusFilter === "all" && sortBy === "sessionId" && sortDir === "desc") {
      return
    }
    
    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await withPageLoading(() =>
          SessionApi.search({
            customerName: searchQuery || undefined,
            computerName: searchQuery || undefined,
            status: statusFilter === "all" ? undefined : statusFilter,
            page: 0,
            size: 100,
            sortBy,
            sortDir,
          })
        ) as any
        setSessions(res?.content || [])
      } catch (e: any) {
        notify({ type: "error", message: `Lỗi tìm kiếm: ${e?.message || ''}` })
        setSessions([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }, 400)
    return () => clearTimeout(t)
  }, [searchQuery, statusFilter, sortBy, sortDir, initialLoadCompleted])

  const filteredSessions = useMemo(() => {
    if (!sessions || !Array.isArray(sessions)) return []
    const query = searchQuery || ''
    return sessions.filter((session) => {
      const customerName = session.customerName || ''
      const computerName = session.computerName || ''
      const sessionId = session.sessionId || ''
      
      return (
        customerName.toLowerCase().includes(query.toLowerCase()) ||
        computerName.toLowerCase().includes(query.toLowerCase()) ||
        sessionId.toString().includes(query)
      )
    })
  }, [sessions, searchQuery])

  const handleOpenActions = (session: SessionDTO) => {
    setSelectedSession(session)
    setActionsSheetOpen(true)
  }

  const handleEdit = () => {
    setEditSheetOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedSession?.sessionId) return
    
    try {
      await withPageLoading(() => SessionApi.delete(selectedSession.sessionId))
      setSessions((prev) => (prev || []).filter((s) => s.sessionId !== selectedSession.sessionId))
      notify({ type: "success", message: "Đã xóa phiên sử dụng thành công" })
    } catch (e: any) {
      const errorMsg = e?.message || "Lỗi không xác định"
      console.error("Delete error:", e)
      
      if (errorMsg.includes("409") || errorMsg.includes("Conflict")) {
        notify({ type: "error", message: "Không thể xóa phiên đang hoạt động" })
      } else if (errorMsg.includes("500") || e?.status === 500) {
        notify({ type: "error", message: "Không thể xóa phiên này. Server có thể đang gặp lỗi." })
      } else if (errorMsg.includes("404")) {
        notify({ type: "error", message: "Phiên sử dụng không tồn tại hoặc đã bị xóa" })
      } else {
        notify({ type: "error", message: `Xóa thất bại: ${errorMsg}` })
      }
      // Reload to reflect server state
      await loadSessions()
    }
  }

  const handleEndSession = async () => {
    if (!selectedSession?.sessionId) return
    try {
      const updated = await withPageLoading(() =>
        SessionApi.endSession(selectedSession.sessionId)
      ) as any
      setSessions((prev)=> (prev || []).map((s)=> s.sessionId === updated.sessionId ? updated : s))
      notify({ type: "success", message: "Đã kết thúc phiên sử dụng" })
    } catch (e: any) {
      notify({ type: "error", message: `Kết thúc phiên thất bại: ${e?.message || ''}` })
    }
  }

  const handleChangeComputer = () => {
    setChangeComputerSheetOpen(true)
  }

  const handleComputerChanged = (updatedSession: SessionDTO) => {
    setSessions((prev) => (prev || []).map((s) => s.sessionId === updatedSession.sessionId ? updatedSession : s))
    setActionsSheetOpen(false)
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Active":
      case "ACTIVE":
        return "bg-green-500/20 text-green-600"
      case "Ended":
      case "ENDED":
        return "bg-blue-500/20 text-blue-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status?: string) => {
    console.log('Session status:', status, 'type:', typeof status)
    switch (status) {
      case "Active":
        return "Đang hoạt động"
      case "Ended":
        return "Đã kết thúc"
      case "ACTIVE":
        return "Đang hoạt động"
      case "ENDED":
        return "Đã kết thúc"
      default:
        return `Không xác định (${status || 'undefined'})`
    }
  }

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime)
    const end = endTime ? new Date(endTime) : new Date()
    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffHours}h ${diffMinutes}m`
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <OptimizedPageLayout isLoading={isLoading || loading} pageType="sessions">
      <SessionAnimations>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div data-animate="page-header" className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-foreground" data-tour="page-title">Quản lý phiên sử dụng</h1>
                <TourTrigger onClick={() => setShowTour(true)} />
              </div>
              <p className="text-muted-foreground">Danh sách và thông tin phiên sử dụng</p>
            </div>
            <Button
              onClick={() => setAddSheetOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-tour="add-session-btn"
            >
              <Clock className="h-4 w-4 mr-2" />
              Tạo phiên mới
            </Button>
          </div>

          {/* Search Filter */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div data-animate="search-filter" className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên khách hàng, máy tính hoặc ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                    data-tour="search-input"
                  />
                </div>
                <div className="w-[180px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-secondary border-border" data-tour="status-filter">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="Active">Đang hoạt động</SelectItem>
                      <SelectItem value="Ended">Đã kết thúc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[180px]">
                  <Select value={sortBy} onValueChange={(v)=> setSortBy(v)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sessionId">ID</SelectItem>
                      <SelectItem value="customerName">Khách hàng</SelectItem>
                      <SelectItem value="computerName">Máy tính</SelectItem>
                      <SelectItem value="startTime">Thời gian bắt đầu</SelectItem>
                      <SelectItem value="endTime">Thời gian kết thúc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[140px]">
                  <Select value={sortDir} onValueChange={(v)=> setSortDir(v as any)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Thứ tự" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Tăng dần</SelectItem>
                      <SelectItem value="desc">Giảm dần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div data-animate="sessions-table" className="overflow-x-auto">
                <table className="w-full min-w-[1400px]" data-tour="sessions-table">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Phiên sử dụng</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Khách hàng</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Máy tính</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Thời gian bắt đầu</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Thời gian kết thúc</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Thời gian sử dụng</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.map((session) => (
                      <tr key={session.sessionId} data-animate="table-row" className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/20 flex items-center justify-center text-primary font-medium">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">Phiên #{session.sessionId}</p>
                              <p className="text-xs text-muted-foreground">ID: {session.sessionId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {/* Tên khách hàng */}
                            <div className="text-sm font-semibold text-foreground">
                              {session.customerName || 'Chưa có tên'}
                            </div>

                            {/* Thông tin liên hệ và tài khoản */}
                            <div className="space-y-0.5 text-xs text-muted-foreground">
                              {session.customerPhone && (
                                <div>SĐT: {session.customerPhone}</div>
                              )}

                              {session.membershipCardName && (
                                <div>Thẻ: {session.membershipCardName}</div>
                              )}

                              {session.hasAccount && session.accountUsername && (
                                <div>TK: @{session.accountUsername}</div>
                              )}

                              {session.customerBalance !== undefined && (
                                <div className="font-semibold text-orange-600 dark:text-orange-400">
                                  Số dư: {session.customerBalance.toLocaleString('vi-VN')}đ
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-muted-foreground">
                            <div className="font-medium text-gray-600 dark:text-gray-400">Máy tính</div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                              {session.computerName || 'Chưa chọn máy'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-muted-foreground">
                            <div className="font-medium text-indigo-600 dark:text-indigo-400">Bắt đầu</div>
                            <div className="font-semibold text-indigo-900 dark:text-indigo-100">
                              {session.startTime ? formatDateTime(session.startTime) : 'Chưa bắt đầu'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-muted-foreground">
                            <div className="font-medium text-teal-600 dark:text-teal-400">Kết thúc</div>
                            <div className="font-semibold text-teal-900 dark:text-teal-100">
                              {session.endTime ? formatDateTime(session.endTime) : "Chưa kết thúc"}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-muted-foreground">
                            <div className="font-medium text-amber-600 dark:text-amber-400">Thời lượng</div>
                            <div className="font-bold text-amber-900 dark:text-amber-100">
                              {session.startTime ? formatDuration(session.startTime, session.endTime) : 'Chưa tính'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium ${getStatusColor(session.status || '')}`}
                          >
                            {getStatusText(session.status || '')}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleOpenActions(session)}
                            data-tour="session-actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(!isLoading && !loading && initialLoadCompleted && filteredSessions.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Không tìm thấy phiên sử dụng nào</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Stats */}
          <div data-animate="session-stats" className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng phiên</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{sessions?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {(sessions || []).filter((s) => s.status === "Active").length} đang hoạt động
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Đang hoạt động</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {(sessions || []).filter((s) => s.status === "Active").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {(sessions || []).length > 0 ? Math.round(((sessions || []).filter((s) => s.status === "Active").length / (sessions || []).length) * 100) : 0}% tổng số
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng thời gian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {(sessions || []).reduce((total, session) => {
                    if (!session.startTime) return total
                    const start = new Date(session.startTime)
                    const end = session.endTime ? new Date(session.endTime) : new Date()
                    const diffMs = end.getTime() - start.getTime()
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
                    return total + diffHours
                  }, 0)}h
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tổng thời gian sử dụng
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {(sessions || []).reduce((total, session) => {
                    if (!session.startTime) return total
                    const start = new Date(session.startTime)
                    const end = session.endTime ? new Date(session.endTime) : new Date()
                    const diffMs = end.getTime() - start.getTime()
                    const diffHours = diffMs / (1000 * 60 * 60)
                    return total + (diffHours * Number(session.pricePerHour || 0))
                  }, 0).toLocaleString('vi-VN')}đ
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tổng doanh thu từ phiên
                </p>
              </CardContent>
            </Card>
          </div>

      <SessionFormSheet
        open={addSheetOpen}
        onOpenChange={setAddSheetOpen}
        mode="add"
        onSaved={(newSession: any)=>{
          if (newSession) setSessions((prev)=> [newSession, ...(prev || [])])
        }}
      />

      {selectedSession && (
        <>
          <SessionFormSheet
            key={selectedSession?.sessionId ?? 'edit'}
            open={editSheetOpen}
            onOpenChange={setEditSheetOpen}
            session={selectedSession as SessionDTO}
            mode="edit"
            onSaved={(updated: any)=>{
              if (!updated) return
              setSessions((prev)=> (prev || []).map((s)=> s.sessionId === updated.sessionId ? updated : s))
            }}
          />

          <SessionActionsSheet
            open={actionsSheetOpen}
            onOpenChange={setActionsSheetOpen}
            session={selectedSession ? {
              id: selectedSession.sessionId,
              customerName: selectedSession.customerName,
              customerPhone: selectedSession.customerPhone,
              customerBalance: selectedSession.customerBalance,
              membershipCardName: selectedSession.membershipCardName,
              hasAccount: selectedSession.hasAccount,
              accountUsername: selectedSession.accountUsername,
              computerName: selectedSession.computerName,
              status: selectedSession.status as string,
            } : (null as unknown as any)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onEndSession={handleEndSession}
            onChangeComputer={handleChangeComputer}
          />
        </>
      )}

      {/* Change Computer Sheet */}
      {selectedSession && (
        <ChangeComputerSheet
          open={changeComputerSheetOpen}
          onOpenChange={setChangeComputerSheetOpen}
          session={selectedSession}
          onComputerChanged={handleComputerChanged}
        />
      )}

      {/* Session Tour */}
      <SessionTour 
        isOpen={showTour} 
        onClose={() => setShowTour(false)} 
        />
        </div>
      </SessionAnimations>
    </OptimizedPageLayout>
  )
}
