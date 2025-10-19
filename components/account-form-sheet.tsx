"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

interface AccountFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: {
    accountId: number
    customerId: number
    username: string
    customerName: string
    phoneNumber: string
    membershipCard: string
  }
  customers: Array<{
    id: number
    customerName: string
    phoneNumber: string
    membershipCard: string
    hasAccount?: boolean
  }>
  mode: "add" | "edit"
}

export function AccountFormSheet({ open, onOpenChange, account, customers, mode }: AccountFormSheetProps) {
  const [formData, setFormData] = useState({
    customerId: account?.customerId || "",
    username: account?.username || "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    if (mode === "edit" && account) {
      setFormData({
        customerId: account.customerId.toString(),
        username: account.username,
        password: "",
        confirmPassword: "",
      })
    } else {
      setFormData({
        customerId: "",
        username: "",
        password: "",
        confirmPassword: "",
      })
    }
    setErrors({})
    setUsernameAvailable(null)
  }, [open, mode, account])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerId) {
      newErrors.customerId = "Vui lòng chọn khách hàng"
    }

    if (!formData.username) {
      newErrors.username = "Tên đăng nhập không được để trống"
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự"
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
    }

    if (mode === "add" && !formData.password) {
      newErrors.password = "Mật khẩu không được để trống"
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null)
      return
    }

    setIsCheckingUsername(true)
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const isAvailable = !["admin", "user", "test"].includes(username.toLowerCase())
      setUsernameAvailable(isAvailable)
    } catch (error) {
      console.error("Error checking username:", error)
      setUsernameAvailable(null)
    } finally {
      setIsCheckingUsername(false)
    }
  }

  const handleUsernameChange = (value: string) => {
    setFormData({ ...formData, username: value })
    if (mode === "add") {
      checkUsernameAvailability(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (mode === "add" && usernameAvailable === false) {
      setErrors({ ...errors, username: "Tên đăng nhập đã được sử dụng" })
      return
    }

    console.log("[v0] Account form submitted:", formData)
    // TODO: Handle form submission
    onOpenChange(false)
  }

  const selectedCustomer = customers.find(c => c.id.toString() === formData.customerId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">
            {mode === "add" ? "Thêm tài khoản mới" : "Chỉnh sửa tài khoản"}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {mode === "add" 
              ? "Tạo tài khoản đăng nhập cho khách hàng" 
              : "Cập nhật thông tin tài khoản"
            }
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="customerId" className="text-foreground">
              Khách hàng
            </Label>
            <Select
              value={formData.customerId.toString()}
              onValueChange={(value) => setFormData({ ...formData, customerId: value })}
              disabled={mode === "edit"}
            >
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Chọn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{customer.customerName}</span>
                      <span className="text-xs text-muted-foreground">
                        {customer.phoneNumber} - {customer.membershipCard}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customerId && (
              <p className="text-sm text-destructive">{errors.customerId}</p>
            )}
          </div>

          {selectedCustomer && (
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-sm font-medium text-foreground">{selectedCustomer.customerName}</p>
              <p className="text-xs text-muted-foreground">
                {selectedCustomer.phoneNumber} • {selectedCustomer.membershipCard}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">
              Tên đăng nhập
            </Label>
            <div className="relative">
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                className="bg-secondary border-border"
                required
              />
              {isCheckingUsername && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              )}
              {!isCheckingUsername && usernameAvailable !== null && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameAvailable ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username}</p>
            )}
            {usernameAvailable === true && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Tên đăng nhập có thể sử dụng
                </AlertDescription>
              </Alert>
            )}
            {usernameAvailable === false && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  Tên đăng nhập đã được sử dụng
                </AlertDescription>
              </Alert>
            )}
          </div>

          {mode === "add" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Nhập mật khẩu"
                  className="bg-secondary border-border"
                  required={mode === "add"}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Xác nhận mật khẩu
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Nhập lại mật khẩu"
                  className="bg-secondary border-border"
                  required={mode === "add"}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            </>
          )}

          {mode === "edit" && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Để thay đổi mật khẩu, vui lòng sử dụng chức năng "Đổi mật khẩu" trong menu thao tác.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border"
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={mode === "add" && usernameAvailable === false}
            >
              {mode === "add" ? "Tạo tài khoản" : "Cập nhật"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
