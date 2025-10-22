"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, AlertTriangle, User } from "lucide-react"

interface CustomerDeleteConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: {
    customerId: number
    customerName: string
    phoneNumber?: string
    balance: number
    membershipCardName?: string
  } | null
  onConfirm: () => void
  loading?: boolean
}

export function CustomerDeleteConfirmationModal({
  open,
  onOpenChange,
  customer,
  onConfirm,
  loading = false
}: CustomerDeleteConfirmationModalProps) {
  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Xác nhận xóa khách hàng
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{customer.customerName}</h3>
                <p className="text-sm text-muted-foreground">
                  ID: #{customer.customerId}
                  {customer.phoneNumber && ` • ${customer.phoneNumber}`}
                </p>
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Số dư hiện tại:</span>
                <p className="font-medium">
                  {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                  }).format(customer.balance)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Gói thành viên:</span>
                <p className="font-medium">
                  {customer.membershipCardName || "Chưa có"}
                </p>
              </div>
            </div>
          </div>

          {/* Warning Alert */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Cảnh báo:</strong> Việc xóa khách hàng sẽ:
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>Xóa vĩnh viễn tất cả thông tin khách hàng</li>
                <li>Xóa tài khoản đăng nhập (nếu có)</li>
                <li>Xóa lịch sử nạp tiền</li>
                <li>Không thể khôi phục dữ liệu</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa khách hàng
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
