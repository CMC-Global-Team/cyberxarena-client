"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Calendar } from "lucide-react"

interface RevenueFormSheetProps {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (data: any) => void
}

export function RevenueFormSheet({ children, open, onOpenChange, onSuccess }: RevenueFormSheetProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSuccess(formData)
      onOpenChange(false)
      setFormData({ startDate: "", endDate: "" })
    } catch (error) {
      console.error("Error generating reports:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Tạo báo cáo doanh thu</span>
          </SheetTitle>
          <SheetDescription>
            Tạo báo cáo doanh thu cho khoảng thời gian được chọn
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="startDate">Từ ngày</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">Đến ngày</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo báo cáo"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
