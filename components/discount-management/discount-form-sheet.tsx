"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Plus, Edit } from "lucide-react"
import { Discount, DiscountDTO } from "@/lib/discounts"
import { useToast } from "@/hooks/use-toast"
import { 
  validateDiscountName, 
  validateDiscountValue,
  formatNumber,
  parseFormattedNumber,
  type ValidationResult 
} from "@/lib/validation"

interface DiscountFormSheetProps {
  discount?: Discount
  mode: "add" | "edit"
  onSuccess: (data: DiscountDTO) => void
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DiscountFormSheet({ discount, mode, onSuccess, children, open: controlledOpen, onOpenChange }: DiscountFormSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const [formData, setFormData] = useState<DiscountDTO>({
    discount_name: '',
    discount_type: 'Flat',
    discount_value: 0
  })
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  const [displayValue, setDisplayValue] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (discount && mode === "edit") {
      setFormData({
        discount_name: discount.discountName,
        discount_type: discount.discountType,
        discount_value: discount.discountValue
      })
      if (discount.discountType === 'Flat') {
        setDisplayValue(formatNumber(discount.discountValue))
      } else {
        setDisplayValue(String(discount.discountValue))
      }
    } else {
      setFormData({
        discount_name: '',
        discount_type: 'Flat',
        discount_value: 0
      })
      setDisplayValue("")
    }
    setValidationErrors({})
  }, [discount, mode])

  // Real-time validation handlers
  const handleDiscountNameChange = (value: string) => {
    setFormData({ ...formData, discount_name: value })
    
    const validation = validateDiscountName(value)
    if (!validation.isValid && validation.message) {
      setValidationErrors(prev => ({ ...prev, discount_name: validation.message! }))
    } else {
      setValidationErrors(prev => ({ ...prev, discount_name: '' }))
    }
  }

  const handleDiscountTypeChange = (value: 'Flat' | 'Percentage') => {
    setFormData({ ...formData, discount_type: value, discount_value: 0 })
    setDisplayValue("")
    setValidationErrors(prev => ({ ...prev, discount_value: '' }))
  }

  const handleDiscountValueChange = (value: string) => {
    if (formData.discount_type === 'Flat') {
      // Remove all non-digit characters to get clean number
      const cleanValue = value.replace(/[^\d]/g, '')
      const numericValue = parseFloat(cleanValue) || 0
      
      setFormData({ ...formData, discount_value: numericValue })
      
      // Auto-format with commas if there's a value
      if (numericValue > 0) {
        setDisplayValue(formatNumber(numericValue))
      } else {
        setDisplayValue(cleanValue) // Show what user is typing
      }
    } else {
      // For percentage, allow decimal input
      const numericValue = parseFloat(value) || 0
      setFormData({ ...formData, discount_value: numericValue })
      setDisplayValue(value)
    }
    
    const validation = validateDiscountValue(formData.discount_value, formData.discount_type)
    if (!validation.isValid && validation.message) {
      setValidationErrors(prev => ({ ...prev, discount_value: validation.message! }))
    } else {
      setValidationErrors(prev => ({ ...prev, discount_value: '' }))
    }
  }

  const validateFormData = (): boolean => {
    const validations = {
      discount_name: validateDiscountName(formData.discount_name),
      discount_value: validateDiscountValue(formData.discount_value, formData.discount_type)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateFormData()) {
      return
    }

    try {
      setLoading(true)
      await onSuccess(formData)
      setOpen(false)
      setFormData({
        discount_name: '',
        discount_type: 'Flat',
        discount_value: 0
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof DiscountDTO, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button>
            {mode === "add" ? (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Thêm giảm giá
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {mode === "add" ? "Thêm giảm giá mới" : "Chỉnh sửa giảm giá"}
          </SheetTitle>
          <SheetDescription>
            {mode === "add" 
              ? "Thêm một loại giảm giá mới vào hệ thống"
              : "Cập nhật thông tin giảm giá"
            }
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="discount_name">Tên giảm giá</Label>
            <Input
              id="discount_name"
              type="text"
              value={formData.discount_name}
              onChange={(e) => handleDiscountNameChange(e.target.value)}
              placeholder="Nhập tên giảm giá"
              maxLength={100}
              className={validationErrors.discount_name ? 'border-red-500' : ''}
              required
            />
            {validationErrors.discount_name ? (
              <p className="text-xs text-red-500">{validationErrors.discount_name}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Tên giảm giá để phân biệt các loại giảm giá khác nhau
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_type">Loại giảm giá</Label>
            <Select 
              value={formData.discount_type} 
              onValueChange={handleDiscountTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại giảm giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Flat">Cố định (VND)</SelectItem>
                <SelectItem value="Percentage">Phần trăm (%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_value">
              Giá trị giảm giá
              {formData.discount_type === 'Percentage' ? ' (%)' : ' (VND)'}
            </Label>
            <Input
              id="discount_value"
              type="text"
              value={displayValue}
              onChange={(e) => handleDiscountValueChange(e.target.value)}
              placeholder={formData.discount_type === 'Percentage' ? "Nhập phần trăm (0-100)" : "Nhập số tiền"}
              className={validationErrors.discount_value ? 'border-red-500' : ''}
            />
            {validationErrors.discount_value ? (
              <p className="text-xs text-red-500">{validationErrors.discount_value}</p>
            ) : formData.discount_type === 'Percentage' ? (
              <p className="text-sm text-muted-foreground">
                Nhập giá trị từ 1 đến 100
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nhập số tiền từ 1,000 VND
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : (mode === "add" ? "Thêm" : "Cập nhật")}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
