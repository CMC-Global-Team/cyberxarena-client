"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Plus, Edit } from "lucide-react"
import type { MembershipCard, MembershipCardDTO } from "@/lib/memberships"
import { discountsApi, type Discount } from "@/lib/discounts"
import { 
  validateMembershipCardName, 
  validateRechargeThreshold,
  formatNumber,
  parseFormattedNumber,
  type ValidationResult 
} from "@/lib/validation"

interface MembershipFormSheetProps {
  membership?: MembershipCard | null
  mode: "add" | "edit"
  onSubmit: (data: MembershipCardDTO) => Promise<void>
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

export function MembershipFormSheet({ membership, mode, onSubmit, open: controlledOpen, onOpenChange, children }: MembershipFormSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const [formData, setFormData] = useState<MembershipCardDTO>({
    membershipCardName: "",
    discountId: null,
    rechargeThreshold: 0,
    isDefault: false,
  })
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  const [displayThreshold, setDisplayThreshold] = useState("")
  const [loading, setLoading] = useState(false)
  const [discounts, setDiscounts] = useState<Discount[]>([])

  useEffect(() => {
    if (membership && mode === "edit") {
      setFormData({
        membershipCardName: membership.membershipCardName,
        discountId: membership.discountId ?? null,
        rechargeThreshold: membership.rechargeThreshold ?? 0,
        isDefault: membership.isDefault ?? false,
      })
      setDisplayThreshold(formatNumber(membership.rechargeThreshold ?? 0))
    } else {
      setFormData({ membershipCardName: "", discountId: null, rechargeThreshold: 0, isDefault: false })
      setDisplayThreshold("")
    }
    setValidationErrors({})
  }, [membership, mode])

  useEffect(() => {
    discountsApi.getAll().then(setDiscounts).catch(() => setDiscounts([]))
  }, [])

  const discountOptions = useMemo(() => discounts.map(d => ({
    id: d.discountId,
    label: `${d.discountName} (${d.discountType === 'Percentage' ? 'Phần trăm' : 'Cố định'}) - ${d.discountType === 'Percentage' ? `${d.discountValue}%` : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.discountValue)}`
  })), [discounts])

  // Real-time validation handlers
  const handleMembershipNameChange = (value: string) => {
    setFormData({ ...formData, membershipCardName: value })
    
    const validation = validateMembershipCardName(value)
    if (!validation.isValid && validation.message) {
      setValidationErrors(prev => ({ ...prev, membershipCardName: validation.message! }))
    } else {
      setValidationErrors(prev => ({ ...prev, membershipCardName: '' }))
    }
  }

  const handleThresholdChange = (value: string) => {
    // Remove all non-digit characters to get clean number
    const cleanValue = value.replace(/[^\d]/g, '')
    const numericValue = parseFloat(cleanValue) || 0
    
    setFormData({ ...formData, rechargeThreshold: numericValue })
    
    // Auto-format with commas if there's a value
    if (numericValue > 0) {
      setDisplayThreshold(formatNumber(numericValue))
    } else {
      setDisplayThreshold(cleanValue) // Show what user is typing
    }
    
    const validation = validateRechargeThreshold(numericValue)
    if (!validation.isValid && validation.message) {
      setValidationErrors(prev => ({ ...prev, rechargeThreshold: validation.message! }))
    } else {
      setValidationErrors(prev => ({ ...prev, rechargeThreshold: '' }))
    }
  }

  const validateFormData = (): boolean => {
    const validations = {
      membershipCardName: validateMembershipCardName(formData.membershipCardName),
      rechargeThreshold: validateRechargeThreshold(formData.rechargeThreshold)
    }

    let isValid = true
    const errorMap: {[key: string]: string} = {}
    
    Object.entries(validations).forEach(([field, result]) => {
      if (!result.isValid && result.message) {
        errorMap[field] = result.message
        isValid = false
      }
    })
    
    setValidationErrors(errorMap)
    return isValid
  }

  const handleChange = (field: keyof MembershipCardDTO, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value as never }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateFormData()) {
      return
    }
    setLoading(true)
    try {
      await onSubmit({
        membershipCardName: formData.membershipCardName.trim(),
        discountId: formData.discountId ?? null,
        rechargeThreshold: formData.rechargeThreshold ?? 0,
        isDefault: formData.isDefault ?? false,
      })
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button>
            {mode === "add" ? (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Thêm thẻ thành viên
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Sửa thẻ thành viên
              </>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{mode === "add" ? "Thêm thẻ thành viên" : "Sửa thẻ thành viên"}</SheetTitle>
          <SheetDescription>
            {mode === "add" ? "Tạo thẻ thành viên mới" : "Cập nhật thông tin thẻ thành viên"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="membershipCardName">Tên thẻ thành viên</Label>
            <Input
              id="membershipCardName"
              value={formData.membershipCardName}
              onChange={e => handleMembershipNameChange(e.target.value)}
              placeholder="Ví dụ: Bạc, Vàng, Bạch kim"
              className={validationErrors.membershipCardName ? 'border-red-500' : ''}
            />
            {validationErrors.membershipCardName && (
              <p className="text-xs text-red-500">{validationErrors.membershipCardName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rechargeThreshold">Ngưỡng nạp tiền (VND)</Label>
            <Input
              id="rechargeThreshold"
              type="text"
              value={displayThreshold}
              onChange={e => handleThresholdChange(e.target.value)}
              placeholder="Ví dụ: 100,000"
              className={validationErrors.rechargeThreshold ? 'border-red-500' : ''}
            />
            {validationErrors.rechargeThreshold && (
              <p className="text-xs text-red-500">{validationErrors.rechargeThreshold}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountId">Giảm giá (tùy chọn)</Label>
            <Select
              value={formData.discountId != null ? String(formData.discountId) : "none"}
              onValueChange={value => handleChange("discountId", value === "none" ? null : Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giảm giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không có</SelectItem>
                {discountOptions.map(opt => (
                  <SelectItem key={opt.id} value={String(opt.id)}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isDefault"
              checked={formData.isDefault ?? false}
              onCheckedChange={(checked) => handleChange("isDefault", checked)}
            />
            <Label htmlFor="isDefault" className="text-sm font-medium">
              Đặt làm thẻ mặc định
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Khi bật, thẻ này sẽ được tự động gán cho khách hàng mới nếu họ không chọn thẻ cụ thể.
          </p>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Hủy</Button>
            <Button type="submit" disabled={loading}>{mode === "add" ? "Tạo" : "Cập nhật"}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}


