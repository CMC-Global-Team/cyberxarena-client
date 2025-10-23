"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Monitor, AlertTriangle, CheckCircle } from "lucide-react"
import { ComputerApi, type ComputerDTO } from "@/lib/computers"
import { SessionApi, type SessionDTO } from "@/lib/sessions"
import { useNotice } from "@/components/notice-provider"
import { useLoading } from "@/components/loading-provider"

interface ChangeComputerSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: SessionDTO
  onComputerChanged?: (updatedSession: SessionDTO) => void
}

export function ChangeComputerSheet({
  open,
  onOpenChange,
  session,
  onComputerChanged
}: ChangeComputerSheetProps) {
  const { notify } = useNotice()
  const { withLoading } = useLoading()
  
  const [selectedComputerId, setSelectedComputerId] = useState<string>("")
  const [computers, setComputers] = useState<ComputerDTO[]>([])
  const [loading, setLoading] = useState(false)

  // Load available computers
  useEffect(() => {
    if (open) {
      loadComputers()
    }
  }, [open])

  const loadComputers = async () => {
    try {
      setLoading(true)
      const response = await ComputerApi.list({ page: 0, size: 100 })
      // Filter out current computer and only show available ones
      const availableComputers = (response.content || []).filter(
        computer => computer.computerId !== session.computerId && computer.status === "Available"
      )
      setComputers(availableComputers)
    } catch (error) {
      console.error("Error loading computers:", error)
      notify({ type: "error", message: "Lỗi tải danh sách máy tính" })
    } finally {
      setLoading(false)
    }
  }

  const handleChangeComputer = async () => {
    if (!selectedComputerId) {
      notify({ type: "error", message: "Vui lòng chọn máy tính mới" })
      return
    }

    try {
      setLoading(true)
      const updatedSession = await withLoading(() => 
        SessionApi.changeComputer(session.sessionId, parseInt(selectedComputerId))
      )
      
      notify({ type: "success", message: "Đổi máy thành công" })
      onComputerChanged?.(updatedSession)
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error changing computer:", error)
      notify({ 
        type: "error", 
        message: `Lỗi đổi máy: ${error?.message || "Không xác định"}` 
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedComputer = computers.find(c => c.computerId.toString() === selectedComputerId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Đổi máy tính
          </SheetTitle>
          <SheetDescription>
            Chuyển phiên #{session.sessionId} sang máy tính khác
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Current Session Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin phiên hiện tại</h3>
            <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Khách hàng:</span>
                <span className="text-sm">{session.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Máy hiện tại:</span>
                <span className="text-sm">{session.computerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Thời gian bắt đầu:</span>
                <span className="text-sm">
                  {new Date(session.startTime).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>

          {/* Computer Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Chọn máy tính mới *
            </Label>
            <Select
              value={selectedComputerId}
              onValueChange={setSelectedComputerId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn máy tính mới" />
              </SelectTrigger>
              <SelectContent>
                {computers.map((computer) => (
                  <SelectItem key={computer.computerId} value={computer.computerId.toString()}>
                    {computer.computerName} - Sẵn sàng
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedComputer && (
              <p className="text-sm text-muted-foreground">
                Đã chọn: {selectedComputer.computerName}
              </p>
            )}
            {computers.length === 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Không có máy tính nào khả dụng để đổi
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Warning */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Lưu ý:</strong> Khi đổi máy, máy tính hiện tại sẽ được giải phóng và máy tính mới sẽ được sử dụng. 
              Thời gian sử dụng sẽ được tính tiếp từ thời điểm hiện tại.
            </AlertDescription>
          </Alert>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={handleChangeComputer}
              disabled={loading || !selectedComputerId || computers.length === 0}
              className="flex-1"
            >
              {loading ? "Đang xử lý..." : "Đổi máy"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
