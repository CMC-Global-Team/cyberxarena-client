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
      <DialogContent 
        className="bg-card border-border overflow-hidden flex flex-col p-0"
        style={{
          width: '98vw',
          maxWidth: '98vw',
          height: '98vh',
          maxHeight: '98vh'
        }}
      >
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-foreground">Lịch sử nạp tiền</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {customer.customerName} - {customer.phoneNumber || 'Chưa có số điện thoại'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden px-6 pb-6">
          <RechargeHistoryTable 
            customerId={customer.customerId}
            customerName={customer.customerName}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
