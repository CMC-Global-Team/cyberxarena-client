"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, DollarSign } from "lucide-react"

interface Customer {
  customerId: number
  customerName: string
  phoneNumber: string
  membershipCard: string
  balance: number
  registrationDate: string
}

interface AddBalanceSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer
  onSubmit: (amount: number) => Promise<void>
}

export function AddBalanceSheet({ 
  open, 
  onOpenChange, 
  customer, 
  onSubmit 
}: AddBalanceSheetProps) {
  const [amount, setAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await onSubmit(amount)
      setAmount(0)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Nạp tiền</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {customer.customerName} - Số dư hiện tại: {formatCurrency(customer.balance)}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground">
              Số tiền nạp *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                min="1000"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="Nhập số tiền"
                className="bg-secondary border-border pl-10"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Số tiền tối thiểu: 1,000 VND
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Chọn nhanh</Label>
            <div className="grid grid-cols-2 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount)}
                  className="border-border hover:bg-secondary"
                >
                  {formatCurrency(quickAmount)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Tổng số dư sau nạp</Label>
            <div className="p-3 bg-secondary rounded-md">
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(customer.balance + amount)}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border"
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isLoading || amount < 1000}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                `Nạp ${formatCurrency(amount)}`
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
