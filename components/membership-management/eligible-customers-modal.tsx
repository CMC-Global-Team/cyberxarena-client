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
}

interface EligibleCustomersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  membershipCardId: number | null
  membershipCardName: string
  onConfirm: (selectedCustomerIds: number[]) => void
  loading?: boolean
}

export function EligibleCustomersModal({
  open,
  onOpenChange,
  membershipCardId,
  membershipCardName,
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
      setSelectedCustomerIds(eligibleCustomers.map(c => c.customerId))
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
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <Checkbox
                  id="select-all"
                  checked={selectedCustomerIds.length === eligibleCustomers.length && eligibleCustomers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Chọn tất cả ({eligibleCustomers.length} khách hàng)
                </label>
              </div>

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
                    {eligibleCustomers.map((customer) => (
                      <TableRow key={customer.customerId}>
                        <TableCell>
                          <Checkbox
                            checked={selectedCustomerIds.includes(customer.customerId)}
                            onCheckedChange={(checked) => handleSelectCustomer(customer.customerId, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{customer.customerName}</TableCell>
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
                          <Badge variant="secondary">
                            {customer.currentMembershipCardName}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              {selectedCustomerIds.length > 0 && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Đã chọn {selectedCustomerIds.length} khách hàng</strong> để cập nhật lên gói "{membershipCardName}"
                  </AlertDescription>
                </Alert>
              )}
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
