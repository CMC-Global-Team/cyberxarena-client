"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MoreHorizontal, Edit, ShoppingCart, Eye, RotateCcw, Clock, XCircle, CheckCircle, AlertCircle } from "lucide-react"
import { Sale, SaleStatus } from "@/lib/sales"
import { useToast } from "@/hooks/use-toast"

interface SaleTableProps {
  sales: Sale[]
  loading?: boolean
  onEdit: (sale: Sale) => void
  onView: (sale: Sale) => void
  onRefund: (sale: Sale) => void
  onUpdateStatus: (sale: Sale, status: SaleStatus) => void
  refunds?: any[] // Danh sách refund để kiểm tra điều kiện
}

export function SaleTable({ sales, loading, onEdit, onView, onRefund, onUpdateStatus, refunds = [] }: SaleTableProps) {
  const { toast } = useToast()

  // Kiểm tra xem hóa đơn có thể chỉnh sửa không (trong vòng 24h)
  const canEditSale = (sale: Sale) => {
    const saleDate = new Date(sale.saleDate)
    const now = new Date()
    const hoursDiff = (now.getTime() - saleDate.getTime()) / (1000 * 60 * 60)
    return hoursDiff <= 24 // Chỉ cho phép chỉnh sửa trong 24h
  }

  // Kiểm tra xem hóa đơn có thể hoàn tiền không
  const canRefundSale = (sale: Sale) => {
    // Chỉ cho phép hoàn tiền khi hóa đơn đã thanh toán
    if (sale.status !== 'Paid') return false

    // Kiểm tra xem hóa đơn đã có refund chưa
    const hasRefund = refunds.some(refund => refund.saleId === sale.saleId)
    if (hasRefund) return false

    // Kiểm tra thời gian (có thể hoàn tiền trong vòng 7 ngày)
    const saleDate = new Date(sale.saleDate)
    const now = new Date()
    const daysDiff = (now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 7 // Chỉ cho phép hoàn tiền trong 7 ngày
  }

  // Lấy lý do không thể hoàn tiền
  const getRefundDisabledReason = (sale: Sale) => {
    // Kiểm tra trạng thái hóa đơn
    if (sale.status !== 'Paid') {
      return "Chỉ có thể hoàn tiền hóa đơn đã thanh toán"
    }

    const hasRefund = refunds.some(refund => refund.saleId === sale.saleId)
    if (hasRefund) return "Hóa đơn đã có yêu cầu hoàn tiền"

    const saleDate = new Date(sale.saleDate)
    const now = new Date()
    const daysDiff = (now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysDiff > 7) return "Quá 7 ngày kể từ ngày bán"

    return ""
  }

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

  // Render status badge
  const renderStatusBadge = (sale: Sale) => {
    // Kiểm tra xem sale có refund được duyệt không
    const approvedRefund = refunds.find(refund => 
      refund.saleId === sale.saleId && 
      (refund.status === 'Approved' || refund.status === 'Completed')
    )
    
    if (approvedRefund) {
      return (
        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
          <RotateCcw className="h-3 w-3 mr-1" />
          Đã hoàn tiền
        </Badge>
      )
    }

    switch (sale.status) {
      case 'Pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Đang chờ thanh toán
          </Badge>
        )
      case 'Paid':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đã thanh toán
          </Badge>
        )
      case 'Cancelled':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Đã hủy
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            {sale.status}
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hóa đơn</CardTitle>
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hóa đơn</CardTitle>
          <CardDescription>
            Quản lý các hóa đơn bán hàng trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có hóa đơn nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Ngày bán</TableHead>
                  <TableHead>Số lượng sản phẩm</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Phương thức thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.saleId}>
                    <TableCell className="font-medium">
                      #{sale.saleId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {sale.customerName || `Khách hàng #${sale.customerId}`}
                    </TableCell>
                    <TableCell>
                      {formatDate(sale.saleDate)}
                    </TableCell>
                    <TableCell>
                      {sale.items.length} sản phẩm
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(sale.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {sale.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge(sale)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div data-tour="sale-actions" className="flex items-center justify-end space-x-2">
                        {/* Button hoàn tiền nổi bật */}
                        {canRefundSale(sale) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRefund(sale)}
                            className="text-orange-600 border-orange-200 hover:bg-orange-50"
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Hoàn tiền
                          </Button>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled
                                  className="text-gray-400 border-gray-200"
                                >
                                  <RotateCcw className="h-4 w-4 mr-1" />
                                  Hoàn tiền
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{getRefundDisabledReason(sale)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        
                        {/* Dropdown menu cho các action khác */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(sale)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          
                          {/* Chỉnh sửa - chỉ trong 24h */}
                          {canEditSale(sale) ? (
                            <DropdownMenuItem onClick={() => onEdit(sale)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem disabled>
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa (hết hạn)
                            </DropdownMenuItem>
                          )}

                          {/* Update Status - chỉ cho phép từ Pending sang Paid hoặc Cancelled */}
                          {sale.status === 'Pending' ? (
                            <>
                              <DropdownMenuItem 
                                onClick={() => {
                                  console.log('Clicked Paid button for sale:', sale)
                                  onUpdateStatus(sale, 'Paid')
                                }}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Đánh dấu đã thanh toán
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  console.log('Clicked Cancelled button for sale:', sale)
                                  onUpdateStatus(sale, 'Cancelled')
                                }}
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Hủy hóa đơn
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <DropdownMenuItem disabled>
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Không thể thay đổi trạng thái ({sale.status})
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </>
  )
}
