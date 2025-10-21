"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { membershipsApi, type MembershipCard } from "@/lib/memberships"

interface CustomerFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: {
    id: number
    customerName: string
    phoneNumber: string
    membershipCardId: number
    balance: number
  }
  mode: "add" | "edit"
}

export function CustomerFormSheet({ open, onOpenChange, customer, mode }: CustomerFormSheetProps) {
  const [formData, setFormData] = useState({
    customerName: customer?.customerName || "",
    phoneNumber: customer?.phoneNumber || "",
    membershipCardId: customer?.membershipCardId || 0,
    balance: customer?.balance?.toString() || "0",
  })
  const [membershipCards, setMembershipCards] = useState<MembershipCard[]>([])
  const [isLoadingCards, setIsLoadingCards] = useState(false)

  useEffect(() => {
    const loadMembershipCards = async () => {
      setIsLoadingCards(true)
      try {
        const cards = await membershipsApi.getAll()
        setMembershipCards(cards)
      } catch (error) {
        console.error("Failed to load membership cards:", error)
      } finally {
        setIsLoadingCards(false)
      }
    }

    if (open) {
      loadMembershipCards()
    }
  }, [open])

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
            <Label htmlFor="customerName" className="text-foreground">
              Họ và tên
            </Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Nhập họ và tên"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-foreground">
              Số điện thoại
            </Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="0901234567"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="membershipCardId" className="text-foreground">
              Thẻ thành viên
            </Label>
            <Select
              value={formData.membershipCardId ? String(formData.membershipCardId) : ""}
              onValueChange={(value) => setFormData({ ...formData, membershipCardId: parseInt(value) || 0 })}
              disabled={isLoadingCards}
            >
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder={isLoadingCards ? "Đang tải..." : "Chọn thẻ thành viên"} />
              </SelectTrigger>
              <SelectContent>
                {membershipCards.map((card) => (
                  <SelectItem key={card.membershipCardId} value={String(card.membershipCardId)}>
                    {card.membershipCardName}
                    {card.isDefault && " (Mặc định)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance" className="text-foreground">
              Số dư ban đầu
            </Label>
            <Input
              id="balance"
              type="number"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              placeholder="0"
              className="bg-secondary border-border"
              min="0"
              step="1000"
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
