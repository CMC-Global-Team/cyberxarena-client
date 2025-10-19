"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ComputerApi, type ComputerDTO } from "@/lib/computers"
import { useToast } from "@/components/ui/use-toast"
import { useLoading } from "@/components/loading-provider"

interface ComputerFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  computer?: ComputerDTO
  mode: "add" | "edit"
  onSaved?: (computer?: ComputerDTO) => void
}

export function ComputerFormSheet({ open, onOpenChange, computer, mode, onSaved }: ComputerFormSheetProps) {
  const { toast } = useToast()
  const { withLoading } = useLoading()
  const [formData, setFormData] = useState({
    name: computer?.computerName || "",
    ipAddress: computer?.ipAddress || "",
    cpu: String(computer?.specifications?.cpu ?? ""),
    ram: String(computer?.specifications?.ram ?? ""),
    gpu: String(computer?.specifications?.gpu ?? ""),
    status: (computer?.status as string) || "Available",
    hourlyRate: computer ? String(computer.pricePerHour) : "15000",
  })

  // Sync form when the selected computer changes or when sheet opens
  useEffect(() => {
    if (!open) return
    setFormData({
      name: computer?.computerName || "",
      ipAddress: computer?.ipAddress || "",
      cpu: String(computer?.specifications?.cpu ?? ""),
      ram: String(computer?.specifications?.ram ?? ""),
      gpu: String(computer?.specifications?.gpu ?? ""),
      status: (computer?.status as string) || "Available",
      hourlyRate: computer ? String(computer.pricePerHour) : "15000",
    })
  }, [computer, mode, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const dto: Omit<ComputerDTO, "computerId"> = {
      computerName: formData.name,
      ipAddress: formData.ipAddress,
      pricePerHour: Number(formData.hourlyRate),
      status: formData.status,
      specifications: {
        cpu: formData.cpu,
        ram: formData.ram,
        gpu: formData.gpu,
      },
    }
    try {
      if (mode === "add") {
        const created = await withLoading(() => ComputerApi.create(dto))
        onSaved?.(created)
      } else if (mode === "edit" && computer?.computerId) {
        const updated = await withLoading(() => ComputerApi.update(computer.computerId, dto))
        onSaved?.(updated)
      }
      onOpenChange(false)
    } catch (err: any) {
      // keep sheet open, optionally handle error notice at parent level if needed
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">
            {mode === "add" ? "Thêm máy tính mới" : "Chỉnh sửa máy tính"}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {mode === "add" ? "Nhập thông tin máy tính mới vào hệ thống" : "Cập nhật thông tin máy tính"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Tên máy tính
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Máy tính 01"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ipAddress" className="text-foreground">
              Địa chỉ IP
            </Label>
            <Input
              id="ipAddress"
              value={formData.ipAddress}
              onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
              placeholder="192.168.1.101"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpu" className="text-foreground">
              CPU
            </Label>
            <Input
              id="cpu"
              value={formData.cpu}
              onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
              placeholder="Intel i5-12400F"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ram" className="text-foreground">
              RAM
            </Label>
            <Input
              id="ram"
              value={formData.ram}
              onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
              placeholder="16GB DDR4"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gpu" className="text-foreground">
              GPU
            </Label>
            <Input
              id="gpu"
              value={formData.gpu}
              onChange={(e) => setFormData({ ...formData, gpu: e.target.value })}
              placeholder="RTX 3060"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-foreground">
              Trạng thái
            </Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Sẵn sàng</SelectItem>
                <SelectItem value="In_Use">Đang sử dụng</SelectItem>
                <SelectItem value="Broken">Bảo trì</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourlyRate" className="text-foreground">
              Giá/giờ
            </Label>
            <Input
              id="hourlyRate"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              placeholder="15,000đ/h"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border"
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              {mode === "add" ? "Thêm máy tính" : "Cập nhật"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
