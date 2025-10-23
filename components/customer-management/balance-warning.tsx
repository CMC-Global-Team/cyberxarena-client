"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, DollarSign } from "lucide-react"

interface BalanceWarningProps {
  balance: number
  customerName: string
  showInTable?: boolean
}

export function BalanceWarning({ balance, customerName, showInTable = false }: BalanceWarningProps) {
  const LOW_BALANCE_THRESHOLD = 50000 // 50,000 VND
  const ZERO_BALANCE_THRESHOLD = 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (balance <= ZERO_BALANCE_THRESHOLD) {
    if (showInTable) {
      return (
        <Badge variant="destructive" className="bg-red-500/20 text-red-600 border-red-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Hết tiền
        </Badge>
      )
    }
    
    return (
      <Alert variant="destructive" className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Cảnh báo:</strong> Khách hàng <strong>{customerName}</strong> đã hết tiền ({formatCurrency(balance)}). 
          Vui lòng nạp tiền để tiếp tục sử dụng dịch vụ.
        </AlertDescription>
      </Alert>
    )
  }

  if (balance <= LOW_BALANCE_THRESHOLD) {
    if (showInTable) {
      return (
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Sắp hết
        </Badge>
      )
    }
    
    return (
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Chú ý:</strong> Khách hàng <strong>{customerName}</strong> có số dư thấp ({formatCurrency(balance)}). 
          Nên nạp thêm tiền để tránh gián đoạn dịch vụ.
        </AlertDescription>
      </Alert>
    )
  }

  return null
}

export function BalanceWarningList({ customers }: { customers: Array<{ customerId: number; customerName: string; balance: number }> }) {
  const lowBalanceCustomers = customers.filter(c => c.balance <= 50000)
  
  if (lowBalanceCustomers.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        Cảnh báo số dư thấp
      </h3>
      <div className="space-y-2">
        {lowBalanceCustomers.map(customer => (
          <BalanceWarning 
            key={customer.customerId}
            balance={customer.balance}
            customerName={customer.customerName}
          />
        ))}
      </div>
    </div>
  )
}
