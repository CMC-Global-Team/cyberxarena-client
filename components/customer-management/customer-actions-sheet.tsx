"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Edit, Trash2, DollarSign, User, Key, History, Crown, Calculator } from "lucide-react"

interface Customer {
  customerId: number
  customerName: string
  phoneNumber: string
  membershipCardId: number
  balance: number
  registrationDate: string
  hasAccount?: boolean
}

interface CustomerActionsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
  onManageAccount: (customer: Customer) => void
  onAddBalance: (customer: Customer) => void
  onViewRechargeHistory: (customer: Customer) => void
  onViewRankInfo: (customer: Customer) => void
  onOpenDiscountCalculator: (customer: Customer) => void
}

export function CustomerActionsSheet({ 
  open, 
  onOpenChange, 
  customer, 
  onEdit, 
  onDelete, 
  onManageAccount, 
  onAddBalance,
  onViewRechargeHistory,
  onViewRankInfo,
  onOpenDiscountCalculator
}: CustomerActionsSheetProps) {
  const handleEdit = () => {
    onOpenChange(false)
    onEdit(customer)
  }

  const handleDelete = () => {
    onDelete(customer)
    onOpenChange(false)
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

  const handleViewRankInfo = () => {
    onOpenChange(false)
    onViewRankInfo(customer)
  }

  const handleOpenDiscountCalculator = () => {
    onOpenChange(false)
    onOpenDiscountCalculator(customer)
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

          <Button
            onClick={handleViewRankInfo}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-border hover:bg-secondary bg-transparent"
          >
            <Crown className="h-4 w-4" />
            <span>Thông tin Rank</span>
          </Button>

          <Button
            onClick={handleOpenDiscountCalculator}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-border hover:bg-secondary bg-transparent"
          >
            <Calculator className="h-4 w-4" />
            <span>Tính Discount</span>
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
