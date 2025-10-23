"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Sale } from "@/lib/sales"

interface SaleDeleteConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale: Sale | null
  onConfirm: () => void
  loading?: boolean
}

export function SaleDeleteConfirmationModal({ 
  open, 
  onOpenChange, 
  sale, 
  onConfirm, 
  loading = false 
}: SaleDeleteConfirmationModalProps) {
  if (!sale) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount || 0)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa hóa đơn</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa hóa đơn #{sale.saleId}?
            <br />
            <br />
            <strong>Thông tin hóa đơn:</strong>
            <br />
            • Khách hàng: #{sale.customerId}
            <br />
            • Tổng tiền: {formatCurrency(sale.totalAmount)}
            <br />
            • Số lượng sản phẩm: {sale.items.length}
            <br />
            <br />
            <span className="text-destructive font-medium">
              Hành động này không thể hoàn tác!
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Đang xóa..." : "Xóa hóa đơn"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
