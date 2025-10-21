"use client"

// @ts-ignore
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
// @ts-ignore
import { Calculator, Percent, DollarSign, Receipt } from "lucide-react"
import { membershipDiscountApi, type DiscountCalculationDTO } from "@/lib/memberships"
import { useNotice } from "@/components/notice-provider"

interface DiscountCalculatorProps {
  customerId: number
  customerName: string
  onDiscountCalculated?: (result: DiscountCalculationDTO) => void
}

export function DiscountCalculator({ customerId, customerName, onDiscountCalculated }: DiscountCalculatorProps) {
  const { notify } = useNotice()
  const [amount, setAmount] = useState<string>("")
  const [result, setResult] = useState<DiscountCalculationDTO | null>(null)
  const [calculating, setCalculating] = useState(false)

  const handleCalculate = async () => {
    const numAmount = Number(amount)
    if (!numAmount || numAmount <= 0) {
      notify({ type: "error", message: "Vui lòng nhập số tiền hợp lệ" })
      return
    }

    try {
      setCalculating(true)
      const calculation = await membershipDiscountApi.calculateDetails(customerId, numAmount)
      setResult(calculation)
      onDiscountCalculated?.(calculation)
    } catch (e: any) {
      notify({ type: "error", message: `Lỗi tính discount: ${e?.message || ''}` })
    } finally {
      setCalculating(false)
    }
  }

  const handleClear = () => {
    setAmount("")
    setResult(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Tính Discount
        </CardTitle>
        <CardDescription>
          Tính toán discount cho {customerName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Số tiền (VND)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Nhập số tiền cần tính discount"
            min="0"
          />
        </div>

        {/* Calculate Button */}
        <Button 
          onClick={handleCalculate} 
          disabled={calculating || !amount}
          className="w-full"
        >
          <Calculator className="h-4 w-4 mr-2" />
          {calculating ? "Đang tính..." : "Tính Discount"}
        </Button>

        {/* Result */}
        {result && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              <span className="font-medium">Kết quả tính toán</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Membership Info */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Thẻ thành viên</span>
                <Badge variant="default" className="bg-blue-500/20 text-blue-600">
                  {result.membershipCardName}
                </Badge>
              </div>

              {/* Original Amount */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Số tiền gốc</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(result.originalAmount)}
                </span>
              </div>

              {/* Discount Info */}
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Discount</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-700 dark:text-green-300">
                    {result.discountType === 'Percentage' 
                      ? `${result.discountValue}%` 
                      : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(result.discountValue)
                    }
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(result.discountAmount)}
                  </div>
                </div>
              </div>

              {/* Final Amount */}
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Số tiền cuối</span>
                </div>
                <span className="font-bold text-lg text-primary">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(result.finalAmount)}
                </span>
              </div>
            </div>

            {/* Clear Button */}
            <Button 
              onClick={handleClear} 
              variant="outline" 
              className="w-full"
            >
              Tính lại
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
