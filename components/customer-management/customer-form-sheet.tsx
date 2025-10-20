"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface Customer {
  customerId: number
  customerName: string
  phoneNumber: string
  membershipCard: string
  balance: number
  registrationDate: string
}

interface CustomerFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer
  mode: "add" | "edit"
  onSubmit: (data: CustomerFormData) => Promise<void>
}

interface CustomerFormData {
  customerName: string
  phoneNumber: string
  membershipCard: string
  balance: number
}

export function CustomerFormSheet({ 
  open, 
  onOpenChange, 
  customer, 
  mode, 
  onSubmit 
}: CustomerFormSheetProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    customerName: "",
    phoneNumber: "",
    membershipCard: "",
    balance: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (customer && mode === "edit") {
      setFormData({
        customerName: customer.customerName,
        phoneNumber: customer.phoneNumber || "",
        membershipCard: customer.membershipCard || "",
        balance: customer.balance,
      })
    } else {
      setFormData({
        customerName: "",
        phoneNumber: "",
        membershipCard: "",
        balance: 0,
      })
    }
    setError("")
  }, [customer, mode, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await onSubmit(formData)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneChange = (value: string) => {
    // Chỉ cho phép số và dấu +
    const cleaned = value.replace(/[^\d+]/g, '')
    if (cleaned.startsWith('+84')) {
      setFormData({ ...formData, phoneNumber: cleaned })
    } else if (cleaned.startsWith('0')) {
      setFormData({ ...formData, phoneNumber: cleaned })
    } else if (cleaned === '') {
      setFormData({ ...formData, phoneNumber: '' })
    }
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
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="customerName" className="text-foreground">
              Họ và tên *
            </Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Nhập họ và tên"
              className="bg-secondary border-border"
              required
              minLength={2}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-foreground">
              Số điện thoại
            </Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="0901234567 hoặc +84901234567"
              className="bg-secondary border-border"
            />
            <p className="text-xs text-muted-foreground">
              Định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="membershipCard" className="text-foreground">
              Thẻ thành viên
            </Label>
            <Input
              id="membershipCard"
              value={formData.membershipCard}
              onChange={(e) => setFormData({ ...formData, membershipCard: e.target.value })}
              placeholder="Nhập mã thẻ thành viên"
              className="bg-secondary border-border"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance" className="text-foreground">
              Số dư ban đầu *
            </Label>
            <Input
              id="balance"
              type="number"
              min="0"
              step="1000"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className="bg-secondary border-border"
              required
            />
            <p className="text-xs text-muted-foreground">
              Số dư không được âm
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border"
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                mode === "add" ? "Thêm khách hàng" : "Cập nhật"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
