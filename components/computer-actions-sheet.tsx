"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Edit, Trash2, Power, Settings, History } from "lucide-react"

interface ComputerActionsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  computer: {
    id: number
    name: string
    ipAddress: string
    status: string
  }
  onEdit: () => void
  onDelete: () => void
}

export function ComputerActionsSheet({ open, onOpenChange, computer, onEdit, onDelete }: ComputerActionsSheetProps) {
  const handleEdit = () => {
    onOpenChange(false)
    onEdit()
  }

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa máy tính "${computer.name}"?`)) {
      console.log("[v0] Deleting computer:", computer.id)
      // TODO: Handle delete
      onDelete()
      onOpenChange(false)
    }
  }

  const handleRestart = () => {
    console.log("[v0] Restarting computer:", computer.id)
    // TODO: Handle restart
    onOpenChange(false)
  }

  const handleMaintenance = () => {
    console.log("[v0] Setting maintenance mode for computer:", computer.id)
    // TODO: Handle maintenance mode
    onOpenChange(false)
  }

  const handleViewHistory = () => {
    console.log("[v0] View history for computer:", computer.id)
    // TODO: Handle view history
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Thao tác máy tính</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {computer.name} - {computer.ipAddress}
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
            onClick={handleRestart}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-border hover:bg-secondary bg-transparent"
          >
            <Power className="h-4 w-4" />
            <span>Khởi động lại</span>
          </Button>

          <Button
            onClick={handleMaintenance}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-border hover:bg-secondary bg-transparent"
          >
            <Settings className="h-4 w-4" />
            <span>Chế độ bảo trì</span>
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
              <span>Xóa máy tính</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
