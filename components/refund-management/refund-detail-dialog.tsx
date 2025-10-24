"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, CheckCircle, XCircle, RotateCcw, Package, DollarSign, Hash } from "lucide-react"
import { Refund } from "@/lib/refunds"
import { Sale } from "@/lib/sales"

interface RefundDetailDialogProps {
  refund: Refund | null
  open: boolean
  onOpenChange: (open: boolean) => void
  sale?: Sale
}

export function RefundDetailDialog({ refund, open, onOpenChange, sale }: RefundDetailDialogProps) {
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

  if (!refund) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Chi tiết hoàn tiền #{refund.refundId}
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về yêu cầu hoàn tiền
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin chung */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID Hoàn tiền</label>
                  <p className="text-lg font-semibold">#{refund.refundId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID Hóa đơn</label>
                  <p className="text-lg font-semibold">#{refund.saleId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ngày yêu cầu</label>
                  <p className="text-sm">{formatDate(refund.refundDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Người xử lý</label>
                  <p className="text-sm">{refund.processedBy || 'Chưa xử lý'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Loại hoàn tiền</label>
                  <div className="mt-1">{getTypeBadge(refund.refundType)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(refund.status)}</div>
                </div>
              </div>
              
              {refund.refundReason && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Lý do hoàn tiền</label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-md">{refund.refundReason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thông tin khách hàng */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tên khách hàng</label>
                  <p className="text-sm font-medium">{refund.customerName || `Khách hàng #${refund.saleId}`}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Số điện thoại</label>
                  <p className="text-sm">{refund.customerPhone || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ngày mua hàng</label>
                  <p className="text-sm">{refund.originalSaleDate ? formatDate(refund.originalSaleDate) : '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tổng tiền hóa đơn</label>
                  <p className="text-sm font-semibold">{formatCurrency(refund.originalSaleAmount || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chi tiết sản phẩm hoàn tiền */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Chi tiết sản phẩm hoàn tiền
              </CardTitle>
              <CardDescription>
                Danh sách sản phẩm được hoàn tiền
              </CardDescription>
            </CardHeader>
            <CardContent>
              {refund.refundDetails && refund.refundDetails.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Số lượng gốc</TableHead>
                      <TableHead className="text-right">Số lượng hoàn</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                      <TableHead className="text-center">Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {refund.refundDetails.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {detail.itemName || `Sản phẩm ${detail.saleDetailId}`}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(detail.itemPrice || 0)}
                        </TableCell>
                        <TableCell className="text-right">
                          {/* Số lượng gốc từ sale details - tìm theo saleDetailId */}
                          {(() => {
                            // Tìm sale detail tương ứng với refund detail
                            const saleDetail = sale?.items?.find(item => item.saleDetailId === detail.saleDetailId);
                            return saleDetail?.quantity || '-';
                          })()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {detail.quantity}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(detail.totalAmount || 0)}
                        </TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            const saleDetail = sale?.items?.find(item => item.saleDetailId === detail.saleDetailId);
                            const originalQuantity = saleDetail?.quantity || 0;
                            const refundQuantity = detail.quantity || 0;
                            
                            if (refundQuantity > originalQuantity) {
                              return (
                                <Badge variant="destructive" className="text-xs">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Vượt quá
                                </Badge>
                              );
                            } else if (refundQuantity === originalQuantity) {
                              return (
                                <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Hoàn đủ
                                </Badge>
                              );
                            } else {
                              return (
                                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                  <Package className="h-3 w-3 mr-1" />
                                  Hoàn một phần
                                </Badge>
                              );
                            }
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Không có chi tiết sản phẩm</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tổng kết */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Tổng kết
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tổng tiền hóa đơn:</span>
                  <span className="text-sm">{formatCurrency(refund.originalSaleAmount || 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Số tiền hoàn:</span>
                  <span className="text-lg font-bold text-red-600">{formatCurrency(refund.refundAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tỷ lệ hoàn:</span>
                  <span className="text-sm font-medium">
                    {refund.originalSaleAmount ? 
                      `${((refund.refundAmount / refund.originalSaleAmount) * 100).toFixed(1)}%` : 
                      '100%'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
