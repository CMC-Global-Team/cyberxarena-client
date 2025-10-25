"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { membershipsApi, type MembershipCard } from "@/lib/memberships"
import { 
  validateName, 
  validatePhoneNumber, 
  validateBalance, 
  validateMembershipCard,
  validateForm,
  type ValidationResult 
} from "@/lib/validation"

interface Customer {
  customerId: number
  customerName: string
  phoneNumber: string
  membershipCardId: number
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
  membershipCardId: number
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
    membershipCardId: 0,
    balance: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [membershipCards, setMembershipCards] = useState<MembershipCard[]>([])
  const [isLoadingCards, setIsLoadingCards] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    if (customer && mode === "edit") {
      setFormData({
        customerName: customer.customerName,
        phoneNumber: customer.phoneNumber || "",
        membershipCardId: customer.membershipCardId || 0,
        balance: customer.balance,
      })
    } else {
      setFormData({
        customerName: "",
        phoneNumber: "",
        membershipCardId: 0,
        balance: 0,
      })
    }
    setError("")
  }, [customer, mode, open])

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

  const validateFormData = (): boolean => {
    const validations = {
      customerName: validateName(formData.customerName),
      phoneNumber: validatePhoneNumber(formData.phoneNumber),
      balance: validateBalance(formData.balance),
      membershipCardId: validateMembershipCard(formData.membershipCardId)
    }

    const { isValid, errors } = validateForm(validations)
    
    if (!isValid) {
      const errorMap: {[key: string]: string} = {}
      Object.entries(validations).forEach(([field, result]) => {
        if (!result.isValid && result.message) {
          errorMap[field] = result.message
        }
      })
      setValidationErrors(errorMap)
      return false
    }

    setValidationErrors({})
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateFormData()) {
      return
    }

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
    
    // Real-time validation
    const validation = validatePhoneNumber(cleaned)
    if (!validation.isValid && validation.message) {
      setValidationErrors(prev => ({ ...prev, phoneNumber: validation.message! }))
    } else {
      setValidationErrors(prev => ({ ...prev, phoneNumber: '' }))
    }
  }

  const handleNameChange = (value: string) => {
    setFormData({ ...formData, customerName: value })
    
    // Real-time validation
    const validation = validateName(value)
    if (!validation.isValid && validation.message) {
      setValidationErrors(prev => ({ ...prev, customerName: validation.message! }))
    } else {
      setValidationErrors(prev => ({ ...prev, customerName: '' }))
    }
  }

  const handleBalanceChange = (value: number) => {
    setFormData({ ...formData, balance: value })
    
    // Real-time validation
    const validation = validateBalance(value)
    if (!validation.isValid && validation.message) {
      setValidationErrors(prev => ({ ...prev, balance: validation.message! }))
    } else {
      setValidationErrors(prev => ({ ...prev, balance: '' }))
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
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Nhập họ và tên"
              className={`bg-secondary border-border ${validationErrors.customerName ? 'border-red-500' : ''}`}
              required
              minLength={2}
              maxLength={100}
            />
            {validationErrors.customerName && (
              <p className="text-xs text-red-500">{validationErrors.customerName}</p>
            )}
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
              className={`bg-secondary border-border ${validationErrors.phoneNumber ? 'border-red-500' : ''}`}
            />
            {validationErrors.phoneNumber ? (
              <p className="text-xs text-red-500">{validationErrors.phoneNumber}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx
              </p>
            )}
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
              Số dư ban đầu *
            </Label>
            <Input
              id="balance"
              type="number"
              min="0"
              step="1000"
              value={formData.balance}
              onChange={(e) => handleBalanceChange(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className={`bg-secondary border-border ${validationErrors.balance ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.balance ? (
              <p className="text-xs text-red-500">{validationErrors.balance}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Số dư không được âm
              </p>
            )}
            {formData.balance > 0 && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  <strong>Lưu ý:</strong> 
                  {mode === "add" ? "Số dư ban đầu" : "Thay đổi số dư"} sẽ được ghi vào lịch sử nạp tiền và 
                  {formData.membershipCardId === 0 ? 
                    " rank sẽ được tự động cập nhật dựa trên ngưỡng nạp tiền." :
                    " rank sẽ không được tự động cập nhật vì bạn đã chọn thẻ thành viên cụ thể."
                  }
                </AlertDescription>
              </Alert>
            )}
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
