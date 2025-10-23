"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Minus, X } from "lucide-react"
import { RefundDTO, RefundDetail, refundsApi } from "@/lib/refunds"
import { Sale } from "@/lib/sales"
import { useToast } from "@/hooks/use-toast"

interface RefundFormSheetProps {
  sale: Sale
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (refund: any) => void
}

export function RefundFormSheet({ sale, open, onOpenChange, onSuccess }: RefundFormSheetProps) {
  const [formData, setFormData] = useState<RefundDTO>({
    saleId: sale.saleId,
    refundAmount: sale.totalAmount,
    refundType: 'Full',
    status: 'Pending',
    refundDetails: []
  })
  const [loading, setLoading] = useState(false)
  const [refundDetails, setRefundDetails] = useState<RefundDetail[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      // Initialize refund details from sale items
      const details: RefundDetail[] = sale.items.map(item => ({
        saleDetailId: item.saleId, // This should be saleDetailId, but we'll use saleId for now
        quantity: item.quantity,
        itemName: `Sản phẩm ${item.itemId}`,
        itemPrice: 0, // This should come from item data
        totalAmount: 0
      }))
      setRefundDetails(details)
      setFormData(prev => ({
        ...prev,
        refundDetails: details
      }))
    }
  }, [open, sale])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.refundAmount <= 0) {
      toast({
        title: "Lỗi",
        description: "Số tiền hoàn phải lớn hơn 0",
        variant: "destructive",
      })
      return
    }

    if (formData.refundAmount > sale.totalAmount) {
      toast({
        title: "Lỗi", 
        description: "Số tiền hoàn không được vượt quá tổng tiền hóa đơn",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await refundsApi.create(formData)
      toast({
        title: "Thành công",
        description: "Đã tạo yêu cầu hoàn tiền thành công",
      })
      onSuccess(result)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo yêu cầu hoàn tiền",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateRefundDetail = (index: number, field: keyof RefundDetail, value: any) => {
    const updated = [...refundDetails]
    updated[index] = { ...updated[index], [field]: value }
    setRefundDetails(updated)
    
    // Recalculate total amount
    const totalAmount = updated.reduce((sum, detail) => sum + (detail.totalAmount || 0), 0)
    setFormData(prev => ({
      ...prev,
      refundDetails: updated,
      refundAmount: totalAmount
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount || 0)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[800px]">
        <SheetHeader>
          <SheetTitle>Tạo yêu cầu hoàn tiền</SheetTitle>
          <SheetDescription>
            Tạo yêu cầu hoàn tiền cho hóa đơn #{sale.saleId}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Sale Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin hóa đơn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mã hóa đơn</Label>
                  <Input value={`#${sale.saleId}`} disabled />
                </div>
                <div>
                  <Label>Ngày bán</Label>
                  <Input value={new Date(sale.saleDate).toLocaleDateString('vi-VN')} disabled />
                </div>
                <div>
                  <Label>Tổng tiền hóa đơn</Label>
                  <Input value={formatCurrency(sale.totalAmount)} disabled />
                </div>
                <div>
                  <Label>Phương thức thanh toán</Label>
                  <Input value={sale.paymentMethod} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin hoàn tiền</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="refundType">Loại hoàn tiền</Label>
                  <Select 
                    value={formData.refundType} 
                    onValueChange={(value: 'Full' | 'Partial') => 
                      setFormData(prev => ({ ...prev, refundType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full">Hoàn toàn bộ</SelectItem>
                      <SelectItem value="Partial">Hoàn một phần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="refundAmount">Số tiền hoàn</Label>
                  <Input
                    id="refundAmount"
                    type="number"
                    value={formData.refundAmount}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      refundAmount: parseFloat(e.target.value) || 0 
                    }))}
                    max={sale.totalAmount}
                    min={0}
                    step="0.01"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="refundReason">Lý do hoàn tiền</Label>
                <Textarea
                  id="refundReason"
                  value={formData.refundReason || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    refundReason: e.target.value 
                  }))}
                  placeholder="Nhập lý do hoàn tiền..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Refund Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chi tiết hoàn tiền</CardTitle>
              <CardDescription>
                Chọn sản phẩm và số lượng cần hoàn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Số lượng gốc</TableHead>
                    <TableHead>Số lượng hoàn</TableHead>
                    <TableHead>Đơn giá</TableHead>
                    <TableHead>Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refundDetails.map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{detail.itemName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{detail.quantity}</Badge>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={detail.quantity}
                          onChange={(e) => updateRefundDetail(index, 'quantity', parseInt(e.target.value) || 0)}
                          min={0}
                          max={detail.quantity}
                        />
                      </TableCell>
                      <TableCell>
                        {formatCurrency(detail.itemPrice || 0)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(detail.totalAmount || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tóm tắt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tổng tiền hóa đơn:</span>
                  <span className="font-medium">{formatCurrency(sale.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số tiền hoàn:</span>
                  <span className="font-medium text-green-600">{formatCurrency(formData.refundAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Còn lại:</span>
                  <span className="font-medium">{formatCurrency(sale.totalAmount - formData.refundAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Tạo yêu cầu hoàn tiền"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
