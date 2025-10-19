"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Monitor, MoreVertical, Cpu, HardDrive, Wifi, Calendar } from "lucide-react"
import { ComputerFormSheet } from "@/components/computer-form-sheet"
import { ComputerActionsSheet } from "@/components/computer-actions-sheet"
import { ComputerApi, type ComputerDTO } from "@/lib/computers"
import { useNotice } from "@/components/notice-provider"

export default function ComputersPage() {
  const { notify } = useNotice()
  const [searchQuery, setSearchQuery] = useState("")
  const [addSheetOpen, setAddSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [actionsSheetOpen, setActionsSheetOpen] = useState(false)
  const [selectedComputer, setSelectedComputer] = useState<ComputerDTO | null>(null)
  const [computers, setComputers] = useState<ComputerDTO[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const loadComputers = async () => {
    try {
      setLoading(true)
      const res = await ComputerApi.list({ page: 0, size: 100, sortBy: "computerId", sortDir: "asc" })
      setComputers(res.content)
    } catch (e: any) {
      notify({ type: "error", message: `Lỗi tải danh sách: ${e?.message || ''}` })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComputers()
  }, [])

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
    try {
      await ComputerApi.delete(selectedComputer.computerId)
      setComputers((prev) => prev.filter((c) => c.computerId !== selectedComputer.computerId))
      notify({ type: "success", message: "Đã xóa máy tính" })
    } catch (e: any) {
      notify({ type: "error", message: `Xóa thất bại: ${e?.message || ''}` })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500/20 text-green-600"
      case "In_Use":
        return "bg-blue-500/20 text-blue-600"
      case "Broken":
        return "bg-yellow-500/20 text-yellow-600"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "Available":
        return "Sẵn sàng"
      case "In_Use":
        return "Đang sử dụng"
      case "Broken":
        return "Bảo trì"
      default:
        return "Không xác định"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý máy tính</h1>
          <p className="text-muted-foreground">Danh sách và thông tin máy tính</p>
        </div>
        <Button
          onClick={() => setAddSheetOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Monitor className="h-4 w-4 mr-2" />
          Thêm máy tính
        </Button>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, IP hoặc CPU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
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
                {filteredComputers.map((computer) => (
                  <tr key={computer.computerId} className="border-b border-border hover:bg-secondary/50 transition-colors">
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
                        {/* no lastUsed in DTO */}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {/* no totalHours in DTO */}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenActions(computer)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              {/* No totalHours in DTO */}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {/* Placeholder */}
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
      />

      {selectedComputer && (
        <>
          <ComputerFormSheet
            open={editSheetOpen}
            onOpenChange={setEditSheetOpen}
            computer={selectedComputer as ComputerDTO}
            mode="edit"
            onSaved={(updated)=>{
              if (!updated) return
              setComputers((prev)=> prev.map((c)=> c.computerId === updated.computerId ? updated : c))
            }}
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
          />
        </>
      )}
    </div>
  )
}
