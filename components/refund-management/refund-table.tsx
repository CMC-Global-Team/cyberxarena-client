"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, CheckCircle, XCircle, Clock, RotateCcw } from "lucide-react"
import { Refund } from "@/lib/refunds"
import { useToast } from "@/hooks/use-toast"

interface RefundTableProps {
  refunds: Refund[]
  loading?: boolean
  onView: (refund: Refund) => void
  onUpdateStatus: (id: number, status: 'Pending' | 'Approved' | 'Rejected' | 'Completed') => void
}

export function RefundTable({ refunds, loading, onView, onUpdateStatus }: RefundTableProps) {
  const { toast } = useToast()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount || 0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Chờ duyệt</Badge>
      case 'Approved':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Đã duyệt</Badge>
      case 'Rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Từ chối</Badge>
      case 'Completed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Hoàn thành</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Full':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Hoàn toàn bộ</Badge>
      case 'Partial':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">Hoàn một phần</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const handleStatusUpdate = async (id: number, status: 'Pending' | 'Approved' | 'Rejected' | 'Completed') => {
    try {
      await onUpdateStatus(id, status)
      toast({
        title: "Thành công",
        description: `Đã cập nhật trạng thái thành ${status}`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hoàn tiền</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách hoàn tiền</CardTitle>
        <CardDescription>
          Quản lý các yêu cầu hoàn tiền trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        {refunds.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <RotateCcw className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có yêu cầu hoàn tiền nào</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Hóa đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày yêu cầu</TableHead>
                <TableHead>Số tiền hoàn</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người xử lý</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refunds.map((refund) => (
                <TableRow key={refund.refundId}>
                  <TableCell className="font-medium">
                    #{refund.refundId}
                  </TableCell>
                  <TableCell className="font-medium">
                    #{refund.saleId}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{refund.customerName || `Khách hàng #${refund.saleId}`}</div>
                      {refund.customerPhone && (
                        <div className="text-sm text-muted-foreground">{refund.customerPhone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(refund.refundDate)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(refund.refundAmount)}
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(refund.refundType)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(refund.status)}
                  </TableCell>
                  <TableCell>
                    {refund.processedBy || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(refund)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        {refund.status === 'Pending' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(refund.refundId, 'Approved')}
                              className="text-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Duyệt
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(refund.refundId, 'Rejected')}
                              className="text-red-600"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Từ chối
                            </DropdownMenuItem>
                          </>
                        )}
                        {refund.status === 'Approved' && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(refund.refundId, 'Completed')}
                            className="text-blue-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Hoàn thành
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
