"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Users, Trash2, X, ArrowDown } from "lucide-react"
import { MembershipCard } from "@/lib/memberships"

interface MembershipDeleteConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  membership: MembershipCard | null
  onConfirm: () => void
  loading?: boolean
}

export function MembershipDeleteConfirmationModal({
  open,
  onOpenChange,
  membership,
  onConfirm,
  loading = false
}: MembershipDeleteConfirmationModalProps) {
  const [usageInfo, setUsageInfo] = useState<{
    isUsed: boolean;
    usageCount: number;
    customers: Array<{
      customerId: number;
      customerName: string;
      phoneNumber: string;
      balance: number;
    }>;
  } | null>(null)
  const [checkingUsage, setCheckingUsage] = useState(false)

  const handleCheckUsage = async () => {
    if (!membership) return
    
    setCheckingUsage(true)
    try {
      const { membershipsApi } = await import("@/lib/memberships")
      const usage = await membershipsApi.checkUsage(membership.membershipCardId)
      setUsageInfo(usage)
    } catch (error) {
      console.error("Error checking membership usage:", error)
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

  // Check usage when modal opens
  React.useEffect(() => {
    if (open && membership && !usageInfo && !checkingUsage) {
      handleCheckUsage()
    }
  }, [open, membership])

  if (!membership) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Xác nhận xóa gói thành viên
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa gói thành viên "{membership.membershipCardName}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Membership Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Thông tin gói thành viên:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tên gói:</span>
                <span className="font-medium">{membership.membershipCardName}</span>
              </div>
              <div className="flex justify-between">
                <span>Ngưỡng nạp tiền:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                  }).format(membership.rechargeThreshold)}
                </span>
              </div>
              {membership.discountName && (
                <>
                  <div className="flex justify-between">
                    <span>Giảm giá:</span>
                    <Badge variant="secondary">{membership.discountName}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Loại giảm giá:</span>
                    <Badge variant={membership.discountType === 'Percentage' ? 'default' : 'secondary'}>
                      {membership.discountType === 'Percentage' ? 'Phần trăm' : 'Cố định'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Giá trị giảm giá:</span>
                    <span className="font-medium">
                      {membership.discountType === 'Percentage' 
                        ? `${membership.discountValue}%` 
                        : new Intl.NumberFormat('vi-VN', { 
                            style: 'currency', 
                            currency: 'VND' 
                          }).format(membership.discountValue)
                      }
                    </span>
                  </div>
                </>
              )}
              {membership.isDefault && (
                <div className="flex justify-between">
                  <span>Trạng thái:</span>
                  <Badge variant="default" className="bg-green-500/20 text-green-600">
                    Mặc định
                  </Badge>
                </div>
              )}
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
                    <strong>Cảnh báo:</strong> Gói thành viên này đang được sử dụng bởi {usageInfo.usageCount} khách hàng.
                    Việc xóa sẽ cập nhật rank của tất cả khách hàng này xuống mức thấp hơn.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    <strong>An toàn:</strong> Gói thành viên này không được sử dụng bởi khách hàng nào.
                  </AlertDescription>
                </Alert>
              )}

              {/* Customers List */}
              {usageInfo.isUsed && usageInfo.customers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Các khách hàng đang sử dụng:</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {usageInfo.customers.map((customer) => (
                      <div key={customer.customerId} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium">{customer.customerName}</span>
                          <span className="text-xs text-muted-foreground">{customer.phoneNumber}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {new Intl.NumberFormat('vi-VN', { 
                            style: 'currency', 
                            currency: 'VND' 
                          }).format(customer.balance)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rank Update Warning */}
              {usageInfo.isUsed && (
                <Alert className="border-blue-200 bg-blue-50">
                  <ArrowDown className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Lưu ý:</strong> Sau khi xóa, hệ thống sẽ tự động cập nhật rank của tất cả khách hàng 
                    đang sử dụng gói này xuống mức rank có ngưỡng nạp tiền thấp hơn gói hiện tại.
                  </AlertDescription>
                </Alert>
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
