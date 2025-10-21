"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { RechargeHistoryTable } from "./recharge-history-table"

interface Customer {
  customerId: number
  customerName: string
  phoneNumber: string
  membershipCardId: number
  balance: number
  registrationDate: string
  hasAccount?: boolean
}

interface RechargeHistorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer
}

export function RechargeHistorySheet({ 
  open, 
  onOpenChange, 
  customer 
}: RechargeHistorySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border w-full max-w-6xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-foreground">Lịch sử nạp tiền</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {customer.customerName} - {customer.phoneNumber || 'Chưa có số điện thoại'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <RechargeHistoryTable 
            customerId={customer.customerId}
            customerName={customer.customerName}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
