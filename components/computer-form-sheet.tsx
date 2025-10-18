"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface ComputerFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  computer?: {
    id: number
    name: string
    ipAddress: string
    cpu: string
    ram: string
    gpu: string
    status: string
    hourlyRate: string
  }
  mode: "add" | "edit"
}

export function ComputerFormSheet({ open, onOpenChange, computer, mode }: ComputerFormSheetProps) {
  const [formData, setFormData] = useState({
    name: computer?.name || "",
    ipAddress: computer?.ipAddress || "",
    cpu: computer?.cpu || "",
    ram: computer?.ram || "",
    gpu: computer?.gpu || "",
    status: computer?.status || "available",
    hourlyRate: computer?.hourlyRate || "15,000đ/h",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted:", formData)
    // TODO: Handle form submission
    onOpenChange(false)
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
                <SelectItem value="available">Sẵn sàng</SelectItem>
                <SelectItem value="occupied">Đang sử dụng</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourlyRate" className="text-foreground">
              Giá/giờ
            </Label>
            <Input
              id="hourlyRate"
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
