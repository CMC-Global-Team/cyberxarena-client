"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Percent, DollarSign, TrendingUp, Hash } from "lucide-react"
import { Discount } from "@/lib/discounts"

interface DiscountStatsProps {
  discounts: Discount[]
}

export function DiscountStats({ discounts }: DiscountStatsProps) {
  const totalDiscounts = discounts.length
  const flatDiscounts = discounts.filter(d => d.discountType === 'Flat').length
  const percentageDiscounts = discounts.filter(d => d.discountType === 'Percentage').length
  
  const totalFlatValue = discounts
    .filter(d => d.discountType === 'Flat')
    .reduce((sum, d) => sum + d.discountValue, 0)
  
  const averagePercentage = percentageDiscounts > 0 
    ? discounts
        .filter(d => d.discountType === 'Percentage')
        .reduce((sum, d) => sum + d.discountValue, 0) / percentageDiscounts
    : 0

  const maxFlatDiscount = discounts
    .filter(d => d.discountType === 'Flat')
    .reduce((max, d) => Math.max(max, d.discountValue), 0)

  const maxPercentageDiscount = discounts
    .filter(d => d.discountType === 'Percentage')
    .reduce((max, d) => Math.max(max, d.discountValue), 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng số discount</CardTitle>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDiscounts}</div>
          <p className="text-xs text-muted-foreground">
            Tất cả loại giảm giá
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Giảm giá cố định</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{flatDiscounts}</div>
          <p className="text-xs text-muted-foreground">
            Tổng giá trị: {new Intl.NumberFormat('vi-VN', { 
              style: 'currency', 
              currency: 'VND' 
            }).format(totalFlatValue)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Giảm giá phần trăm</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{percentageDiscounts}</div>
          <p className="text-xs text-muted-foreground">
            Trung bình: {averagePercentage.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Giảm giá cao nhất</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {maxFlatDiscount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Cố định:</span>
                <Badge variant="secondary">
                  {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                  }).format(maxFlatDiscount)}
                </Badge>
              </div>
            )}
            {maxPercentageDiscount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Phần trăm:</span>
                <Badge variant="default">
                  {maxPercentageDiscount}%
                </Badge>
              </div>
            )}
            {maxFlatDiscount === 0 && maxPercentageDiscount === 0 && (
              <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
