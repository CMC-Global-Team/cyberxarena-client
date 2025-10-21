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
    isDefault: false,
  })
  const [loading, setLoading] = useState(false)
  const [discounts, setDiscounts] = useState<Discount[]>([])

  useEffect(() => {
    if (membership && mode === "edit") {
      setFormData({
        membershipCardName: membership.membershipCardName,
        discountId: membership.discountId ?? null,
        isDefault: membership.isDefault ?? false,
      })
    } else {
      setFormData({ membershipCardName: "", discountId: null, isDefault: false })
    }
  }, [membership, mode])

  useEffect(() => {
    discountsApi.getAll().then(setDiscounts).catch(() => setDiscounts([]))
  }, [])

  const discountOptions = useMemo(() => discounts.map(d => ({
    id: d.discountId,
    label: `${d.discountName} (${d.discountType === 'Percentage' ? 'Phần trăm' : 'Cố định'}) - ${d.discountType === 'Percentage' ? `${d.discountValue}%` : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.discountValue)}`
  })), [discounts])

  const handleChange = (field: keyof MembershipCardDTO, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value as never }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.membershipCardName.trim()) return
    setLoading(true)
    try {
      await onSubmit({
        membershipCardName: formData.membershipCardName.trim(),
        discountId: formData.discountId ?? null,
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
              onChange={e => handleChange("membershipCardName", e.target.value)}
              placeholder="Ví dụ: Bạc, Vàng, Bạch kim"
            />
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


