"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Edit, Trash2, DollarSign, User, Key, History } from "lucide-react"

interface Customer {
  customerId: number
  customerName: string
  phoneNumber: string
  membershipCard: string
  balance: number
  registrationDate: string
  hasAccount?: boolean
}

interface CustomerActionsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer
  onEdit: (customer: Customer) => void
  onDelete: (customerId: number) => void
  onManageAccount: (customer: Customer) => void
  onAddBalance: (customer: Customer) => void
  onViewRechargeHistory: (customer: Customer) => void
}

export function CustomerActionsSheet({ 
  open, 
  onOpenChange, 
  customer, 
  onEdit, 
  onDelete, 
  onManageAccount, 
  onAddBalance,
  onViewRechargeHistory
}: CustomerActionsSheetProps) {
  const handleEdit = () => {
    onOpenChange(false)
    onEdit(customer)
  }

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customer.customerName}"?`)) {
      onDelete(customer.customerId)
      onOpenChange(false)
    }
  }

  const handleManageAccount = () => {
    onOpenChange(false)
    onManageAccount(customer)
  }

  const handleAddBalance = () => {
    onOpenChange(false)
    onAddBalance(customer)
  }

  const handleViewRechargeHistory = () => {
    onOpenChange(false)
    onViewRechargeHistory(customer)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Thao tác khách hàng</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {customer.customerName} - {customer.phoneNumber || 'Chưa có số điện thoại'}
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
            onClick={handleViewRechargeHistory}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-border hover:bg-secondary bg-transparent"
          >
            <History className="h-4 w-4" />
            <span>Lịch sử nạp tiền</span>
          </Button>

          <Button
            onClick={handleManageAccount}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-border hover:bg-secondary bg-transparent"
          >
            <User className="h-4 w-4" />
            <span>{customer.hasAccount ? 'Quản lý tài khoản' : 'Tạo tài khoản'}</span>
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
