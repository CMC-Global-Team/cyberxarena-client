"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Edit, Trash2, DollarSign, History } from "lucide-react"

interface CustomerActionsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: {
    id: number
    name: string
    email: string
    phone: string
  }
  onEdit: () => void
  onDelete: () => void
}

export function CustomerActionsSheet({ open, onOpenChange, customer, onEdit, onDelete }: CustomerActionsSheetProps) {
  const handleEdit = () => {
    onOpenChange(false)
    onEdit()
  }

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customer.name}"?`)) {
      console.log("[v0] Deleting customer:", customer.id)
      // TODO: Handle delete
      onDelete()
      onOpenChange(false)
    }
  }

  const handleAddBalance = () => {
    console.log("[v0] Add balance for customer:", customer.id)
    // TODO: Handle add balance
    onOpenChange(false)
  }

  const handleViewHistory = () => {
    console.log("[v0] View history for customer:", customer.id)
    // TODO: Handle view history
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Thao tác khách hàng</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {customer.name} - {customer.email}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3 mt-6">
          <Button
            onClick={handleEdit}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-border hover:bg-secondary bg-transparent"
          >
            <Edit className="h-4 w-4" />
            <span>Chỉnh sửa thông tin</span>
          </Button>

          <Button
            onClick={handleAddBalance}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-border hover:bg-secondary bg-transparent"
          >
            <DollarSign className="h-4 w-4" />
            <span>Nạp tiền</span>
          </Button>

          <Button
            onClick={handleViewHistory}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-border hover:bg-secondary bg-transparent"
          >
            <History className="h-4 w-4" />
            <span>Xem lịch sử</span>
          </Button>

          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleDelete}
              variant="outline"
              className="w-full justify-start gap-3 h-12 border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              <span>Xóa khách hàng</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
