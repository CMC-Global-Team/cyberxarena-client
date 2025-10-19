"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"

interface Customer {
  customerId: number
  customerName: string
  phoneNumber: string
  membershipCard: string
  balance: number
  registrationDate: string
}

interface AccountFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer
  mode: "create" | "edit"
  onSubmit: (data: AccountFormData) => Promise<void>
}

interface AccountFormData {
  username: string
  password: string
}

export function AccountFormSheet({ 
  open, 
  onOpenChange, 
  customer, 
  mode, 
  onSubmit 
}: AccountFormSheetProps) {
  const [formData, setFormData] = useState<AccountFormData>({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (open) {
      setFormData({
        username: "",
        password: "",
      })
      setError("")
    }
  }, [open])

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

  const handleUsernameChange = (value: string) => {
    // Chỉ cho phép chữ cái, số và dấu gạch dưới
    const cleaned = value.replace(/[^a-zA-Z0-9_]/g, '')
    setFormData({ ...formData, username: cleaned })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">
            {mode === "create" ? "Tạo tài khoản" : "Cập nhật tài khoản"}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {customer.customerName} - {customer.phoneNumber || 'Chưa có số điện thoại'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">
              Tên đăng nhập *
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              className="bg-secondary border-border"
              required
              minLength={3}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              Chỉ được sử dụng chữ cái, số và dấu gạch dưới (3-50 ký tự)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Mật khẩu *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Nhập mật khẩu"
                className="bg-secondary border-border pr-10"
                required
                minLength={6}
                maxLength={255}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Mật khẩu phải có ít nhất 6 ký tự
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
                mode === "create" ? "Tạo tài khoản" : "Cập nhật"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
