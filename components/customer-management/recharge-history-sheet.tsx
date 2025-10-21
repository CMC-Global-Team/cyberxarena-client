"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-foreground">Lịch sử nạp tiền</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {customer.customerName} - {customer.phoneNumber || 'Chưa có số điện thoại'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex-1 overflow-hidden">
          <RechargeHistoryTable 
            customerId={customer.customerId}
            customerName={customer.customerName}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
