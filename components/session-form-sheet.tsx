"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Clock, User, Monitor, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { SessionApi, type SessionDTO, type SessionCreateRequest, type SessionUpdateRequest } from "@/lib/sessions"
import { CustomerApi, type CustomerDTO } from "@/lib/customers"
import { ComputerApi, type ComputerDTO } from "@/lib/computers"
import { useNotice } from "@/components/notice-provider"
import { useLoading } from "@/components/loading-provider"

interface SessionFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session?: SessionDTO
  mode: "add" | "edit"
  onSaved?: (session: SessionDTO) => void
}

export function SessionFormSheet({
  open,
  onOpenChange,
  session,
  mode,
  onSaved,
}: SessionFormSheetProps) {
  const { notify } = useNotice()
  const { withLoading } = useLoading()
  
  const [formData, setFormData] = useState({
    customerId: "",
    computerId: "",
    startTime: new Date(),
  })
  
  const [customers, setCustomers] = useState<CustomerDTO[]>([])
  const [computers, setComputers] = useState<ComputerDTO[]>([])
  const [loading, setLoading] = useState(false)

  // Load customers and computers
  useEffect(() => {
    if (open) {
      loadCustomers()
      loadComputers()
    }
  }, [open])

  // Initialize form data
  useEffect(() => {
    if (session && mode === "edit") {
      setFormData({
        customerId: session.customerId.toString(),
        computerId: session.computerId.toString(),
        startTime: new Date(session.startTime),
      })
    } else {
      setFormData({
        customerId: "",
        computerId: "",
        startTime: new Date(),
      })
    }
  }, [session, mode, open])

  const loadCustomers = async () => {
    try {
      const response = await CustomerApi.list({ page: 0, size: 100 })
      setCustomers(response)
    } catch (error) {
      console.error("Error loading customers:", error)
      notify({ type: "error", message: "Lỗi tải danh sách khách hàng" })
    }
  }

  const loadComputers = async () => {
    try {
      const response = await ComputerApi.list({ page: 0, size: 100 })
      setComputers(response.content || [])
    } catch (error) {
      console.error("Error loading computers:", error)
      notify({ type: "error", message: "Lỗi tải danh sách máy tính" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerId || !formData.computerId) {
      notify({ type: "error", message: "Vui lòng chọn khách hàng và máy tính" })
      return
    }

    // Check if computer is available (allow current computer in edit mode)
    const selectedComputer = computers.find(c => c.computerId.toString() === formData.computerId)
    const isCurrentComputer = mode === "edit" && session && selectedComputer?.computerId === session.computerId
    
    if (selectedComputer?.status !== "Available" && !isCurrentComputer) {
      notify({ type: "error", message: "Máy tính đã được chọn không khả dụng" })
      return
    }

    try {
      setLoading(true)
      
      if (mode === "add") {
        const requestData: SessionCreateRequest = {
          customerId: parseInt(formData.customerId),
          computerId: parseInt(formData.computerId),
          startTime: formData.startTime.toISOString(),
        }
        
        const newSession = await withLoading(() => SessionApi.create(requestData))
        notify({ type: "success", message: "Tạo phiên sử dụng thành công" })
        onSaved?.(newSession)
      } else if (mode === "edit" && session) {
        const newComputerId = parseInt(formData.computerId)
        const isComputerChanged = newComputerId !== session.computerId
        
        if (isComputerChanged) {
          // Use changeComputer API for active sessions
          const updatedSession = await withLoading(() => SessionApi.changeComputer(session.sessionId, newComputerId))
          notify({ type: "success", message: "Đổi máy tính thành công" })
          onSaved?.(updatedSession)
        } else {
          // Use regular update for other changes
          const requestData: SessionUpdateRequest = {
            customerId: parseInt(formData.customerId),
            computerId: parseInt(formData.computerId),
            startTime: formData.startTime.toISOString(),
          }
          
          const updatedSession = await withLoading(() => SessionApi.update(session.sessionId, requestData))
          notify({ type: "success", message: "Cập nhật phiên sử dụng thành công" })
          onSaved?.(updatedSession)
        }
      }
      
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error saving session:", error)
      notify({ 
        type: "error", 
        message: `Lỗi ${mode === "add" ? "tạo" : "cập nhật"} phiên: ${error?.message || "Không xác định"}` 
      })
    } finally {
      setLoading(false)
    }
  }

  // For edit mode, include current computer even if it's "In Use"
  const availableComputers = computers.filter(c => {
    if (mode === "edit" && session && c.computerId === session.computerId) {
      return true // Include current computer in edit mode
    }
    return c.status === "Available"
  })
  const selectedCustomer = customers.find(c => c.customerId.toString() === formData.customerId)
  const selectedComputer = computers.find(c => c.computerId.toString() === formData.computerId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {mode === "add" ? "Tạo phiên sử dụng mới" : "Chỉnh sửa phiên sử dụng"}
          </SheetTitle>
          <SheetDescription>
            {mode === "add" 
              ? "Tạo phiên sử dụng mới cho khách hàng" 
              : "Cập nhật thông tin phiên sử dụng"
            }
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {/* Customer Selection */}
          <div className="space-y-2">
            <Label htmlFor="customerId" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Khách hàng *
            </Label>
            <Select
              value={formData.customerId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.customerId} value={customer.customerId.toString()}>
                    {customer.customerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCustomer && (
              <p className="text-sm text-muted-foreground">
                Đã chọn: {selectedCustomer.customerName}
              </p>
            )}
          </div>

          {/* Computer Selection */}
          <div className="space-y-2">
            <Label htmlFor="computerId" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Máy tính *
            </Label>
            <Select
              value={formData.computerId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, computerId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn máy tính" />
              </SelectTrigger>
              <SelectContent>
                {availableComputers.map((computer) => {
                  const isCurrentComputer = mode === "edit" && session && computer.computerId === session.computerId
                  const statusText = isCurrentComputer ? "Đang sử dụng" : "Sẵn sàng"
                  return (
                    <SelectItem key={computer.computerId} value={computer.computerId.toString()}>
                      {computer.computerName} - {statusText}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {selectedComputer && (
              <p className="text-sm text-muted-foreground">
                Đã chọn: {selectedComputer.computerName}
              </p>
            )}
            {availableComputers.length === 0 && (
              <p className="text-sm text-destructive">
                Không có máy tính nào khả dụng
              </p>
            )}
          </div>

          {/* Start Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Thời gian bắt đầu *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.startTime && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startTime ? (
                    format(formData.startTime, "dd/MM/yyyy HH:mm", { locale: vi })
                  ) : (
                    <span>Chọn thời gian</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.startTime}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, startTime: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground">
              Thời gian bắt đầu phiên sử dụng
            </p>
          </div>

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
              type="submit"
              disabled={loading || !formData.customerId || !formData.computerId || availableComputers.length === 0}
              className="flex-1"
            >
              {loading ? "Đang xử lý..." : mode === "add" ? "Tạo phiên" : "Cập nhật"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
