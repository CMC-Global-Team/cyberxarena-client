"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Monitor, MoreVertical, Cpu, HardDrive, Wifi, Calendar, History, Clock } from "lucide-react"
import { ComputerFormSheet } from "@/components/computer-form-sheet"
import { ComputerActionsSheet } from "@/components/computer-actions-sheet"
import { ComputerTour } from "@/components/computer-management/computer-tour"
import { ComputerUsageHistorySheet } from "@/components/computer-usage-history-sheet"
import { ComputerApi, type ComputerDTO, type ComputerUsageStats } from "@/lib/computers"
import { useNotice } from "@/components/notice-provider"
import { usePageLoading } from "@/hooks/use-page-loading"
import { OptimizedPageLayout } from "@/components/ui/optimized-page-layout"
import { ComputerAnimations } from "@/components/animations/computer-animations"
import { TourTrigger } from "@/components/ui/tour-trigger"
import { LottieInlineLoading } from "@/components/ui/lottie-loading"

export default function ComputersPage() {
  const { notify } = useNotice()
  const { withPageLoading, isLoading } = usePageLoading()
  const [searchQuery, setSearchQuery] = useState("")
  const [addSheetOpen, setAddSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [actionsSheetOpen, setActionsSheetOpen] = useState(false)
  const [selectedComputer, setSelectedComputer] = useState<ComputerDTO | null>(null)
  const [computers, setComputers] = useState<ComputerDTO[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("computerId")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [showTour, setShowTour] = useState(false)
  const [usageStats, setUsageStats] = useState<Map<number, ComputerUsageStats>>(new Map())

  const loadComputers = async () => {
    try {
      setLoading(true)
      const res = await withPageLoading(() => ComputerApi.list({ page: 0, size: 100, sortBy: "computerId", sortDir: "asc" }))
      setComputers(res.content)
      
      // Load usage stats for all computers
      const statsMap = new Map<number, ComputerUsageStats>()
      for (const computer of res.content) {
        try {
          const stats = await ComputerApi.getUsageStats(computer.computerId)
          statsMap.set(computer.computerId, stats)
        } catch (e) {
          // Silently fail for individual computer stats
          console.warn(`Failed to load usage stats for computer ${computer.computerId}:`, e)
        }
      }
      setUsageStats(statsMap)
    } catch (e: any) {
      notify({ type: "error", message: `Lỗi tải danh sách: ${e?.message || ''}` })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComputers()
  }, [])

  // Debounced server filter/sort/search
  useEffect(() => {
    const toApiStatus = (s: string | undefined) => (s === "In Use" ? "In_Use" : s)
    const t = setTimeout(async () => {
      try {
        setLoading(true)
        const res = await withPageLoading(() =>
          ComputerApi.search({
            name: searchQuery || undefined,
            status: statusFilter === "all" ? undefined : toApiStatus(statusFilter),
            page: 0,
            size: 100,
            sortBy,
            sortDir,
          })
        )
        setComputers(res.content)
      } catch (e: any) {
        notify({ type: "error", message: `Lỗi tìm kiếm: ${e?.message || ''}` })
      } finally {
        setLoading(false)
      }
    }, 400)
    return () => clearTimeout(t)
  }, [searchQuery, statusFilter, sortBy, sortDir])

  const filteredComputers = useMemo(() => {
    return computers.filter((computer) => {
      const cpu = String(computer.specifications?.cpu ?? "")
      const ram = String(computer.specifications?.ram ?? "")
      const gpu = String(computer.specifications?.gpu ?? "")
      return (
        computer.computerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        computer.ipAddress.includes(searchQuery) ||
        cpu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ram.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gpu.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [computers, searchQuery])

  const handleOpenActions = (computer: ComputerDTO) => {
    setSelectedComputer(computer)
    setActionsSheetOpen(true)
  }

  const handleEdit = () => {
    setEditSheetOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedComputer?.computerId) return
    
    // Check if computer is in use - only block deletion for "In Use" status
    if (selectedComputer.status === "In Use" || selectedComputer.status === "In_Use") {
      notify({ type: "error", message: "Không thể xóa máy tính khi đang có người sử dụng" })
      return
    }
    
    try {
      await withPageLoading(() => ComputerApi.delete(selectedComputer.computerId))
      setComputers((prev) => prev.filter((c) => c.computerId !== selectedComputer.computerId))
      notify({ type: "success", message: "Đã xóa máy tính thành công" })
    } catch (e: any) {
      const errorMsg = e?.message || "Lỗi không xác định"
      console.error("Delete error:", e)
      
      if (errorMsg.includes("409") || errorMsg.includes("Conflict")) {
        notify({ type: "error", message: "Không thể xóa máy tính đang được sử dụng hoặc có dữ liệu liên quan" })
      } else if (errorMsg.includes("500") || e?.status === 500) {
        notify({ type: "error", message: "Không thể xóa máy tính này. Server có thể đang gặp lỗi hoặc máy tính có dữ liệu liên quan không thể xóa." })
      } else if (errorMsg.includes("404")) {
        notify({ type: "error", message: "Máy tính không tồn tại hoặc đã bị xóa" })
      } else {
        notify({ type: "error", message: `Xóa thất bại: ${errorMsg}` })
      }
      // Reload to reflect server state
      await loadComputers()
    }
  }

  const handleMaintenance = async () => {
    if (!selectedComputer?.computerId) return
    try {
      const updated = await withPageLoading(() =>
        ComputerApi.update(selectedComputer.computerId, {
          computerName: selectedComputer.computerName,
          ipAddress: selectedComputer.ipAddress,
          pricePerHour: Number(selectedComputer.pricePerHour),
          status: "Broken",
          specifications: selectedComputer.specifications || {},
        })
      )
      setComputers((prev)=> prev.map((c)=> c.computerId === updated.computerId ? updated : c))
      notify({ type: "success", message: "Đã chuyển sang chế độ bảo trì" })
    } catch (e: any) {
      notify({ type: "error", message: `Chuyển bảo trì thất bại: ${e?.message || ''}` })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
      case "AVAILABLE":
        return "bg-green-500/20 text-green-600"
      case "In_Use":
      case "In Use":
      case "IN_USE":
        return "bg-blue-500/20 text-blue-600"
      case "Broken":
      case "BROKEN":
        return "bg-yellow-500/20 text-yellow-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    // Debug: log the actual status value
    console.log('Status received:', status, 'Type:', typeof status)
    switch (status) {
      case "Available":
        return "Sẵn sàng"
      case "In_Use":
      case "In Use":
        return "Đang sử dụng"
      case "Broken":
        return "Bảo trì"
      case "IN_USE":
        return "Đang sử dụng"
      case "AVAILABLE":
        return "Sẵn sàng"
      case "BROKEN":
        return "Bảo trì"
      default:
        return "Không xác định"
    }
  }

  return (
    <OptimizedPageLayout isLoading={isLoading} pageType="computers">
      <ComputerAnimations>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div data-animate="page-header" className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-foreground" data-tour="page-title">Quản lý máy tính</h1>
                <TourTrigger onClick={() => setShowTour(true)} />
              </div>
              <p className="text-muted-foreground">Danh sách và thông tin máy tính</p>
            </div>
            <Button
              onClick={() => setAddSheetOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-tour="add-computer-btn"
            >
              <Monitor className="h-4 w-4 mr-2" />
              Thêm máy tính
            </Button>
          </div>

          {/* Search Filter */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div data-animate="search-filter" className="flex flex-wrap items-center gap-4" data-tour="search-filter">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên, IP hoặc CPU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                  />
                </div>
                <div className="w-[180px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="Available">Sẵn sàng</SelectItem>
                      <SelectItem value="In Use">Đang sử dụng</SelectItem>
                      <SelectItem value="Broken">Bảo trì</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[180px]">
                  <Select value={sortBy} onValueChange={(v)=> setSortBy(v)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computerId">ID</SelectItem>
                      <SelectItem value="computerName">Tên</SelectItem>
                      <SelectItem value="ipAddress">IP</SelectItem>
                      <SelectItem value="pricePerHour">Giá/giờ</SelectItem>
                      <SelectItem value="status">Trạng thái</SelectItem>
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
              <div data-animate="computer-table" className="overflow-x-auto" data-tour="computer-table">
                <table className="w-full min-w-[1200px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Máy tính</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cấu hình</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Lần sử dụng cuối</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tổng giờ chạy</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Giá/giờ</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="py-12">
                          <LottieInlineLoading text="Đang tải danh sách máy tính..." />
                        </td>
                      </tr>
                    ) : (
                      filteredComputers.map((computer) => (
                      <tr key={computer.computerId} data-animate="table-row" className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/20 flex items-center justify-center text-primary font-medium">
                              <Monitor className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{computer.computerName}</p>
                              <p className="text-xs text-muted-foreground">IP: {computer.ipAddress}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <Cpu className="h-3 w-3 text-muted-foreground" />
                              {String(computer.specifications?.cpu ?? "")}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <HardDrive className="h-3 w-3 text-muted-foreground" />
                              {String(computer.specifications?.ram ?? "")}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <Wifi className="h-3 w-3 text-muted-foreground" />
                              {String(computer.specifications?.gpu ?? "")}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {usageStats.get(computer.computerId)?.lastUsed ? 
                              new Date(usageStats.get(computer.computerId)!.lastUsed).toLocaleDateString('vi-VN') : 
                              'Chưa sử dụng'
                            }
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {usageStats.get(computer.computerId)?.totalHours ? 
                              `${usageStats.get(computer.computerId)!.totalHours.toFixed(1)}h` : 
                              '0h'
                            }
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-foreground">{Intl.NumberFormat("vi-VN").format(Number(computer.pricePerHour))}đ/h</span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium ${getStatusColor(computer.status)}`}
                          >
                            {getStatusText(computer.status)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <ComputerUsageHistorySheet 
                              computerId={computer.computerId} 
                              computerName={computer.computerName}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                data-tour="computer-history"
                              >
                                <History className="h-4 w-4 mr-1" />
                                Lịch sử
                              </Button>
                            </ComputerUsageHistorySheet>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleOpenActions(computer)}
                              data-tour="computer-actions"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {(!loading && filteredComputers.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Không tìm thấy máy tính nào</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Computer Stats */}
          <div data-animate="computer-stats" className="grid grid-cols-1 md:grid-cols-4 gap-4" data-tour="computer-stats">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng máy tính</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{computers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {computers.filter((c) => c.status === "Available").length} sẵn sàng
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Đang sử dụng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {computers.filter((c) => c.status === "In_Use").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {computers.length > 0 ? Math.round((computers.filter((c) => c.status === "In_Use").length / computers.length) * 100) : 0}% tổng số
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng giờ chạy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {Array.from(usageStats.values()).reduce((total, stats) => total + (stats.totalHours || 0), 0).toFixed(1)}h
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Array.from(usageStats.values()).reduce((total, stats) => total + (stats.totalSessions || 0), 0)} phiên
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Bảo trì</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {computers.filter((c) => c.status === "Broken").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Máy cần sửa chữa</p>
              </CardContent>
            </Card>
          </div>

      <ComputerFormSheet
        open={addSheetOpen}
        onOpenChange={setAddSheetOpen}
        mode="add"
        onSaved={(newComputer)=>{
          if (newComputer) setComputers((prev)=> [newComputer, ...prev])
        }}
        existingComputers={computers}
      />

      {selectedComputer && (
        <>
          <ComputerFormSheet
            key={selectedComputer?.computerId ?? 'edit'}
            open={editSheetOpen}
            onOpenChange={setEditSheetOpen}
            computer={selectedComputer as ComputerDTO}
            mode="edit"
            onSaved={(updated)=>{
              if (!updated) return
              setComputers((prev)=> prev.map((c)=> c.computerId === updated.computerId ? updated : c))
            }}
            existingComputers={computers}
          />

          <ComputerActionsSheet
            open={actionsSheetOpen}
            onOpenChange={setActionsSheetOpen}
            computer={selectedComputer ? {
              id: selectedComputer.computerId,
              name: selectedComputer.computerName,
              ipAddress: selectedComputer.ipAddress,
              status: selectedComputer.status as string,
            } : (null as unknown as any)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMaintenance={handleMaintenance}
          />
        </>
      )}

      <ComputerTour 
        isActive={showTour} 
        onComplete={() => setShowTour(false)} 
      />
        </div>
      </ComputerAnimations>
    </OptimizedPageLayout>
  )
}