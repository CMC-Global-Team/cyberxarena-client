"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Users, Trash2, X } from "lucide-react"
import { Discount } from "@/lib/discounts"

interface DiscountDeleteConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  discount: Discount | null
  onConfirm: () => void
  loading?: boolean
}

export function DiscountDeleteConfirmationModal({
  open,
  onOpenChange,
  discount,
  onConfirm,
  loading = false
}: DiscountDeleteConfirmationModalProps) {
  const [usageInfo, setUsageInfo] = useState<{
    isUsed: boolean;
    usageCount: number;
    membershipCards: Array<{
      membershipCardId: number;
      membershipCardName: string;
      rechargeThreshold: number;
    }>;
  } | null>(null)
  const [checkingUsage, setCheckingUsage] = useState(false)

  const handleCheckUsage = async () => {
    if (!discount) return
    
    setCheckingUsage(true)
    try {
      const { discountsApi } = await import("@/lib/discounts")
      const usage = await discountsApi.checkUsage(discount.discountId)
      setUsageInfo(usage)
    } catch (error) {
      console.error("Error checking discount usage:", error)
    } finally {
      setCheckingUsage(false)
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    setUsageInfo(null)
    onOpenChange(false)
  }

  // Reset usage info when discount changes
  React.useEffect(() => {
    setUsageInfo(null)
  }, [discount])

  // Check usage when modal opens
  React.useEffect(() => {
    if (open && discount && !usageInfo && !checkingUsage) {
      handleCheckUsage()
    }
  }, [open, discount, usageInfo, checkingUsage])

  if (!discount) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Xác nhận xóa mã giảm giá
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa mã giảm giá "{discount.discountName}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Discount Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Thông tin mã giảm giá:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tên:</span>
                <span className="font-medium">{discount.discountName}</span>
              </div>
              <div className="flex justify-between">
                <span>Loại:</span>
                <Badge variant={discount.discountType === 'Percentage' ? 'default' : 'secondary'}>
                  {discount.discountType === 'Percentage' ? 'Phần trăm' : 'Cố định'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Giá trị:</span>
                <span className="font-medium">
                  {discount.discountType === 'Percentage' 
                    ? `${discount.discountValue}%` 
                    : new Intl.NumberFormat('vi-VN', { 
                        style: 'currency', 
                        currency: 'VND' 
                      }).format(discount.discountValue)
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Usage Check */}
          {checkingUsage && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">Đang kiểm tra...</span>
            </div>
          )}

          {/* Usage Information */}
          {usageInfo && (
            <div className="space-y-3">
              {usageInfo.isUsed ? (
                <Alert className="border-orange-200 bg-orange-50">
                  <Users className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Cảnh báo:</strong> Mã giảm giá này đang được sử dụng bởi {usageInfo.usageCount} gói thành viên.
                    Việc xóa có thể ảnh hưởng đến các gói thành viên đang sử dụng.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    <strong>An toàn:</strong> Mã giảm giá này không được sử dụng bởi gói thành viên nào.
                  </AlertDescription>
                </Alert>
              )}

              {/* Membership Cards List */}
              {usageInfo.isUsed && usageInfo.membershipCards.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Các gói thành viên đang sử dụng:</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {usageInfo.membershipCards.map((card) => (
                      <div key={card.membershipCardId} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                        <span className="font-medium">{card.membershipCardName}</span>
                        <span className="text-muted-foreground">
                          {new Intl.NumberFormat('vi-VN', { 
                            style: 'currency', 
                            currency: 'VND' 
                          }).format(card.rechargeThreshold)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm} 
            disabled={loading || checkingUsage}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {loading ? "Đang xóa..." : "Xác nhận xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
