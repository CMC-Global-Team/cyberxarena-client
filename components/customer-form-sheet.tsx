"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface CustomerFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: {
    id: number
    name: string
    email: string
    phone: string
    balance: string
  }
  mode: "add" | "edit"
}

export function CustomerFormSheet({ open, onOpenChange, customer, mode }: CustomerFormSheetProps) {
  const [formData, setFormData] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    balance: customer?.balance || "0đ",
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
            {mode === "add" ? "Thêm khách hàng mới" : "Chỉnh sửa khách hàng"}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {mode === "add" ? "Nhập thông tin khách hàng mới vào hệ thống" : "Cập nhật thông tin khách hàng"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Họ và tên
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập họ và tên"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@email.com"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">
              Số điện thoại
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0901234567"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance" className="text-foreground">
              Số dư ban đầu
            </Label>
            <Input
              id="balance"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              placeholder="0đ"
              className="bg-secondary border-border"
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
              {mode === "add" ? "Thêm khách hàng" : "Cập nhật"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
