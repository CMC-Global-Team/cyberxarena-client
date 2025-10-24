"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertTriangle, DollarSign, Users } from "lucide-react"
import { useState } from "react"

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
  const [isOpen, setIsOpen] = useState(false)
  const lowBalanceCustomers = customers.filter(c => c.balance <= 50000)
  const zeroBalanceCustomers = customers.filter(c => c.balance <= 0)
  const nearZeroCustomers = customers.filter(c => c.balance > 0 && c.balance <= 50000)
  
  if (lowBalanceCustomers.length === 0) {
    return null
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Cảnh báo số dư thấp
        </h3>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Xem danh sách ({lowBalanceCustomers.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Danh sách khách hàng có số dư thấp
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Khách hàng hết tiền */}
              {zeroBalanceCustomers.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Khách hàng hết tiền ({zeroBalanceCustomers.length})
                  </h4>
                  <div className="space-y-2">
                    {zeroBalanceCustomers.map(customer => (
                      <Alert key={customer.customerId} variant="destructive" className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>{customer.customerName}</strong> - {formatCurrency(customer.balance)}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {/* Khách hàng sắp hết tiền */}
              {nearZeroCustomers.length > 0 && (
                <div>
                  <h4 className="font-semibold text-yellow-600 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Khách hàng sắp hết tiền ({nearZeroCustomers.length})
                  </h4>
                  <div className="space-y-2">
                    {nearZeroCustomers.map(customer => (
                      <Alert key={customer.customerId} className="border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>{customer.customerName}</strong> - {formatCurrency(customer.balance)}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Hiển thị tóm tắt ngắn gọn */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">
            {zeroBalanceCustomers.length > 0 && `${zeroBalanceCustomers.length} khách hàng hết tiền`}
            {zeroBalanceCustomers.length > 0 && nearZeroCustomers.length > 0 && ", "}
            {nearZeroCustomers.length > 0 && `${nearZeroCustomers.length} khách hàng sắp hết tiền`}
          </span>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          Nhấn "Xem danh sách" để xem chi tiết và thực hiện nạp tiền
        </p>
      </div>
    </div>
  )
}
