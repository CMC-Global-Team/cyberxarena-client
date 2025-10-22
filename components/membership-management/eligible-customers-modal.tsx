"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, CheckCircle, AlertCircle } from "lucide-react"
import { membershipsApi } from "@/lib/memberships"

interface EligibleCustomer {
  customerId: number;
  customerName: string;
  phoneNumber: string;
  currentBalance: number;
  totalRecharge: number;
  currentMembershipCardId: number;
  currentMembershipCardName: string;
  currentMembershipThreshold?: number; // Ngưỡng của gói hiện tại
}

interface EligibleCustomersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  membershipCardId: number | null
  membershipCardName: string
  membershipCardThreshold: number // Ngưỡng của gói đang kiểm tra
  onConfirm: (selectedCustomerIds: number[]) => void
  loading?: boolean
}

export function EligibleCustomersModal({
  open,
  onOpenChange,
  membershipCardId,
  membershipCardName,
  membershipCardThreshold,
  onConfirm,
  loading = false
}: EligibleCustomersModalProps) {
  const [eligibleCustomers, setEligibleCustomers] = useState<EligibleCustomer[]>([])
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<number[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEligibleCustomers = async () => {
    if (!membershipCardId) return
    
    setLoadingCustomers(true)
    setError(null)
    try {
      const customers = await membershipsApi.getEligibleCustomers(membershipCardId)
      setEligibleCustomers(customers)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách khách hàng")
    } finally {
      setLoadingCustomers(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Chỉ chọn những khách hàng có thể chọn được (không có gói cao hơn và không có cùng gói)
      const selectableCustomers = eligibleCustomers.filter(customer => {
        const hasHigherMembership = customer.currentMembershipThreshold && 
                                  customer.currentMembershipThreshold > membershipCardThreshold;
        const hasSameMembership = customer.currentMembershipCardId === membershipCardId;
        return !hasHigherMembership && !hasSameMembership;
      });
      setSelectedCustomerIds(selectableCustomers.map(c => c.customerId))
    } else {
      setSelectedCustomerIds([])
    }
  }

  const handleSelectCustomer = (customerId: number, checked: boolean) => {
    if (checked) {
      setSelectedCustomerIds(prev => [...prev, customerId])
    } else {
      setSelectedCustomerIds(prev => prev.filter(id => id !== customerId))
    }
  }

  const handleConfirm = () => {
    onConfirm(selectedCustomerIds)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setSelectedCustomerIds([])
    onOpenChange(false)
  }

  // Fetch eligible customers when modal opens
  useEffect(() => {
    if (open && membershipCardId) {
      fetchEligibleCustomers()
    }
  }, [open, membershipCardId])

  if (!membershipCardId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Khách hàng phù hợp với gói "{membershipCardName}"
          </DialogTitle>
          <DialogDescription>
            Danh sách khách hàng có tổng nạp tiền đủ điều kiện cho gói thành viên mới
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {loadingCustomers ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Đang tải danh sách khách hàng...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : eligibleCustomers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Không có khách hàng nào phù hợp với gói thành viên này</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Select All */}
              {(() => {
                const selectableCustomers = eligibleCustomers.filter(customer => {
                  const hasHigherMembership = customer.currentMembershipThreshold && 
                                            customer.currentMembershipThreshold > membershipCardThreshold;
                  const hasSameMembership = customer.currentMembershipCardId === membershipCardId;
                  return !hasHigherMembership && !hasSameMembership;
                });
                const allSelectableSelected = selectableCustomers.length > 0 && 
                  selectableCustomers.every(customer => selectedCustomerIds.includes(customer.customerId));
                
                return (
                  <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                    <Checkbox
                      id="select-all"
                      checked={allSelectableSelected}
                      onCheckedChange={handleSelectAll}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium">
                      Chọn tất cả có thể nâng cấp ({selectableCustomers.length} khách hàng)
                    </label>
                  </div>
                );
              })()}

              {/* Customers Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Tên khách hàng</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead>Số dư hiện tại</TableHead>
                      <TableHead>Tổng nạp tiền</TableHead>
                      <TableHead>Gói hiện tại</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eligibleCustomers.map((customer) => {
                      // Kiểm tra trạng thái khách hàng
                      const hasHigherMembership = customer.currentMembershipThreshold && 
                                                customer.currentMembershipThreshold > membershipCardThreshold;
                      const hasSameMembership = customer.currentMembershipCardId === membershipCardId;
                      const hasLowerMembership = customer.currentMembershipThreshold && 
                                               customer.currentMembershipThreshold < membershipCardThreshold;
                      
                      return (
                        <TableRow 
                          key={customer.customerId}
                          className={
                            hasHigherMembership ? "bg-amber-50 border-amber-200" :
                            hasSameMembership ? "bg-blue-50 border-blue-200" :
                            hasLowerMembership ? "bg-green-50 border-green-200" : ""
                          }
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedCustomerIds.includes(customer.customerId)}
                              onCheckedChange={(checked) => handleSelectCustomer(customer.customerId, checked as boolean)}
                              disabled={hasHigherMembership || hasSameMembership} // Không cho chọn nếu đã có gói cao hơn hoặc cùng gói
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {customer.customerName}
                              {hasHigherMembership && (
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                                  Đã có gói cao hơn
                                </Badge>
                              )}
                              {hasSameMembership && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                                  Đã có gói này
                                </Badge>
                              )}
                              {hasLowerMembership && (
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                  Có thể nâng cấp
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{customer.phoneNumber || "-"}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('vi-VN', { 
                              style: 'currency', 
                              currency: 'VND' 
                            }).format(customer.currentBalance)}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {new Intl.NumberFormat('vi-VN', { 
                                style: 'currency', 
                                currency: 'VND' 
                              }).format(customer.totalRecharge)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge 
                                variant={
                                  hasHigherMembership ? "default" :
                                  hasSameMembership ? "default" :
                                  "secondary"
                                }
                                className={
                                  hasHigherMembership ? "bg-amber-100 text-amber-800" :
                                  hasSameMembership ? "bg-blue-100 text-blue-800" :
                                  ""
                                }
                              >
                                {customer.currentMembershipCardName}
                              </Badge>
                              {(hasHigherMembership || hasSameMembership) && customer.currentMembershipThreshold && (
                                <span className={`text-xs ${
                                  hasHigherMembership ? "text-amber-600" :
                                  hasSameMembership ? "text-blue-600" :
                                  "text-muted-foreground"
                                }`}>
                                  Ngưỡng: {new Intl.NumberFormat('vi-VN', { 
                                    style: 'currency', 
                                    currency: 'VND' 
                                  }).format(customer.currentMembershipThreshold)}
                                </span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              {(() => {
                const higherMembershipCount = eligibleCustomers.filter(customer => 
                  customer.currentMembershipThreshold && 
                  customer.currentMembershipThreshold > membershipCardThreshold
                ).length;
                
                const sameMembershipCount = eligibleCustomers.filter(customer => 
                  customer.currentMembershipCardId === membershipCardId
                ).length;
                
                const lowerMembershipCount = eligibleCustomers.filter(customer => 
                  customer.currentMembershipThreshold && 
                  customer.currentMembershipThreshold < membershipCardThreshold
                ).length;
                
                const selectableCount = lowerMembershipCount;
                
                return (
                  <div className="space-y-2">
                    {selectedCustomerIds.length > 0 && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <strong>Đã chọn {selectedCustomerIds.length} khách hàng</strong> để cập nhật lên gói "{membershipCardName}"
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {higherMembershipCount > 0 && (
                      <Alert className="border-amber-200 bg-amber-50">
                        <AlertDescription className="text-amber-800">
                          <strong>Lưu ý:</strong> {higherMembershipCount} khách hàng đã có gói cao hơn "{membershipCardName}" 
                          và không thể được cập nhật xuống gói thấp hơn.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {sameMembershipCount > 0 && (
                      <Alert className="border-blue-200 bg-blue-50">
                        <AlertDescription className="text-blue-800">
                          <strong>Thông tin:</strong> {sameMembershipCount} khách hàng đã có gói "{membershipCardName}" rồi.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="text-sm text-muted-foreground">
                      Tổng: {eligibleCustomers.length} khách hàng phù hợp | 
                      Có thể nâng cấp: {selectableCount} | 
                      Đã có gói này: {sameMembershipCount} | 
                      Đã có gói cao hơn: {higherMembershipCount}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Hủy
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={loading || selectedCustomerIds.length === 0}
          >
            {loading ? "Đang cập nhật..." : `Cập nhật ${selectedCustomerIds.length} khách hàng`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
