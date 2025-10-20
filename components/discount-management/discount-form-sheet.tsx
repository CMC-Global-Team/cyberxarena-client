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
    discount_type: 'Flat',
    discount_value: 0
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (discount && mode === "edit") {
      setFormData({
        discount_type: discount.discountType,
        discount_value: discount.discountValue
      })
    } else {
      setFormData({
        discount_type: 'Flat',
        discount_value: 0
      })
    }
  }, [discount, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.discount_value <= 0) {
      toast({
        title: "Lỗi",
        description: "Giá trị giảm giá phải lớn hơn 0",
        variant: "destructive",
      })
      return
    }

    if (formData.discount_type === 'Percentage' && formData.discount_value > 100) {
      toast({
        title: "Lỗi",
        description: "Phần trăm giảm giá không được vượt quá 100%",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await onSuccess(formData)
      setOpen(false)
      setFormData({
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
            <Label htmlFor="discount_type">Loại giảm giá</Label>
            <Select 
              value={formData.discount_type} 
              onValueChange={(value: 'Flat' | 'Percentage') => handleInputChange('discount_type', value)}
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
              type="number"
              min="0"
              max={formData.discount_type === 'Percentage' ? "100" : undefined}
              step={formData.discount_type === 'Percentage' ? "0.01" : "1000"}
              value={formData.discount_value}
              onChange={(e) => handleInputChange('discount_value', parseFloat(e.target.value) || 0)}
              placeholder={formData.discount_type === 'Percentage' ? "Nhập phần trăm (0-100)" : "Nhập số tiền"}
            />
            {formData.discount_type === 'Percentage' && (
              <p className="text-sm text-muted-foreground">
                Nhập giá trị từ 0 đến 100
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
