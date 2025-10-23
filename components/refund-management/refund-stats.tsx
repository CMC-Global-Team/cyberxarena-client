"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { Refund } from "@/lib/refunds"

interface RefundStatsProps {
  refunds: Refund[]
  loading?: boolean
}

export function RefundStats({ refunds, loading }: RefundStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount || 0)
  }

  // Calculate stats
  const totalRefunds = refunds.length
  const pendingRefunds = refunds.filter(r => r.status === 'Pending').length
  const approvedRefunds = refunds.filter(r => r.status === 'Approved').length
  const rejectedRefunds = refunds.filter(r => r.status === 'Rejected').length
  const completedRefunds = refunds.filter(r => r.status === 'Completed').length

  const totalRefundAmount = refunds.reduce((sum, refund) => sum + refund.refundAmount, 0)
  const pendingAmount = refunds.filter(r => r.status === 'Pending').reduce((sum, refund) => sum + refund.refundAmount, 0)
  const approvedAmount = refunds.filter(r => r.status === 'Approved').reduce((sum, refund) => sum + refund.refundAmount, 0)
  const completedAmount = refunds.filter(r => r.status === 'Completed').reduce((sum, refund) => sum + refund.refundAmount, 0)

  const approvalRate = totalRefunds > 0 ? ((approvedRefunds + completedRefunds) / totalRefunds * 100).toFixed(1) : '0'
  const completionRate = totalRefunds > 0 ? (completedRefunds / totalRefunds * 100).toFixed(1) : '0'

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Refunds */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng yêu cầu</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRefunds}</div>
          <p className="text-xs text-muted-foreground">
            Tổng số yêu cầu hoàn tiền
          </p>
        </CardContent>
      </Card>

      {/* Pending Refunds */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{pendingRefunds}</div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(pendingAmount)} đang chờ
          </p>
        </CardContent>
      </Card>

      {/* Approved Refunds */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
          <CheckCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{approvedRefunds}</div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(approvedAmount)} đã duyệt
          </p>
        </CardContent>
      </Card>

      {/* Completed Refunds */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{completedRefunds}</div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(completedAmount)} đã hoàn
          </p>
        </CardContent>
      </Card>

      {/* Additional Stats Row */}
      <div className="col-span-full grid gap-4 md:grid-cols-3">
        {/* Total Refund Amount */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng tiền hoàn</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalRefundAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng số tiền đã hoàn
            </p>
          </CardContent>
        </Card>

        {/* Approval Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ duyệt</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRate}%</div>
            <p className="text-xs text-muted-foreground">
              Yêu cầu được duyệt
            </p>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ hoàn thành</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Yêu cầu hoàn thành
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="col-span-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phân tích trạng thái</CardTitle>
            <CardDescription>
              Tổng quan về các yêu cầu hoàn tiền theo trạng thái
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Chờ duyệt
                </Badge>
                <span className="text-sm font-medium">{pendingRefunds}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Đã duyệt
                </Badge>
                <span className="text-sm font-medium">{approvedRefunds}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Từ chối
                </Badge>
                <span className="text-sm font-medium">{rejectedRefunds}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Hoàn thành
                </Badge>
                <span className="text-sm font-medium">{completedRefunds}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
