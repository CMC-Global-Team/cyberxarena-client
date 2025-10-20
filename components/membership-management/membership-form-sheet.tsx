"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    membership_card_name: "",
    discount_id: null,
  })
  const [loading, setLoading] = useState(false)
  const [discounts, setDiscounts] = useState<Discount[]>([])

  useEffect(() => {
    if (membership && mode === "edit") {
      setFormData({
        membership_card_name: membership.membership_card_name,
        discount_id: membership.discount_id ?? null,
      })
    } else {
      setFormData({ membership_card_name: "", discount_id: null })
    }
  }, [membership, mode])

  useEffect(() => {
    discountsApi.getAll().then(setDiscounts).catch(() => setDiscounts([]))
  }, [])

  const discountOptions = useMemo(() => discounts.map(d => ({
    id: d.discount_id,
    label: d.discount_type === 'Percentage' ? `${d.discount_value}%` : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.discount_value)
  })), [discounts])

  const handleChange = (field: keyof MembershipCardDTO, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value as never }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.membership_card_name.trim()) return
    setLoading(true)
    try {
      await onSubmit({
        membership_card_name: formData.membership_card_name.trim(),
        discount_id: formData.discount_id ?? null,
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
                Add membership
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit membership
              </>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{mode === "add" ? "Add membership" : "Edit membership"}</SheetTitle>
          <SheetDescription>
            {mode === "add" ? "Create a new membership card" : "Update membership card details"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="membership_card_name">Name</Label>
            <Input
              id="membership_card_name"
              value={formData.membership_card_name}
              onChange={e => handleChange("membership_card_name", e.target.value)}
              placeholder="e.g. Silver, Gold, Platinum"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_id">Discount (optional)</Label>
            <Select
              value={formData.discount_id != null ? String(formData.discount_id) : ""}
              onValueChange={value => handleChange("discount_id", value ? Number(value) : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose discount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {discountOptions.map(opt => (
                  <SelectItem key={opt.id} value={String(opt.id)}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{mode === "add" ? "Create" : "Update"}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}


