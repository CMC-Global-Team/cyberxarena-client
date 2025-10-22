"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Edit, Trash2, Key, Eye, Shield } from "lucide-react"

interface AccountActionsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: {
    accountId: number
    customerId: number
    username: string
    customerName: string
    phoneNumber: string
    membershipCardId: number
  }
  onEdit: () => void
  onDelete: () => void
}

export function AccountActionsSheet({ open, onOpenChange, account, onEdit, onDelete }: AccountActionsSheetProps) {
  const handleEdit = () => {
    onOpenChange(false)
    onEdit()
  }

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${account.username}" của khách hàng "${account.customerName}"?`)) {
      console.log("[v0] Deleting account:", account.accountId)
      // TODO: Handle delete
      onDelete()
      onOpenChange(false)
    }
  }

  const handleChangePassword = () => {
    console.log("[v0] Change password for account:", account.accountId)
    // TODO: Handle change password
    onOpenChange(false)
  }

  const handleViewDetails = () => {
    console.log("[v0] View account details:", account.accountId)
    // TODO: Handle view details
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Thao tác tài khoản</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {account.username} - {account.customerName}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3 mt-6">
          <div className="p-4 bg-secondary rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-foreground">{account.username}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Khách hàng: {account.customerName}
            </p>
            <p className="text-sm text-muted-foreground">
              SĐT: {account.phoneNumber} • Thẻ: {account.membershipCard}
            </p>
          </div>

          <Button
            onClick={handleEdit}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-border hover:bg-secondary bg-transparent"
          >
            <Edit className="h-4 w-4" />
            <span>Chỉnh sửa thông tin</span>
          </Button>

          <Button
            onClick={handleChangePassword}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-border hover:bg-secondary bg-transparent"
          >
            <Key className="h-4 w-4" />
            <span>Đổi mật khẩu</span>
          </Button>

          <Button
            onClick={handleViewDetails}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-border hover:bg-secondary bg-transparent"
          >
            <Eye className="h-4 w-4" />
            <span>Xem chi tiết</span>
          </Button>

          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleDelete}
              variant="outline"
              className="w-full justify-start gap-3 h-12 border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              <span>Xóa tài khoản</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
