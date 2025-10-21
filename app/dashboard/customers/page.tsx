"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, HelpCircle } from "lucide-react"
import { CustomerTable } from "@/components/customer-management/customer-table"
import { CustomerFormSheet } from "@/components/customer-management/customer-form-sheet"
import { AccountFormSheet } from "@/components/customer-management/account-form-sheet"
import { AddBalanceSheet } from "@/components/customer-management/add-balance-sheet"
import { RechargeHistorySheet } from "@/components/customer-management/recharge-history-sheet"
import { CustomerStats } from "@/components/customer-management/customer-stats"
import { BalanceWarningList } from "@/components/customer-management/balance-warning"
import { CustomerTour } from "@/components/customer-management/customer-tour"
import { CustomerRankInfo } from "@/components/customer-management/customer-rank-info"
import { DiscountCalculator } from "@/components/customer-management/discount-calculator"
import { CustomerApi, AccountApi, type CustomerDTO, type AccountDTO, CreateCustomerRequestDTO } from "@/lib/customers"
import { useNotice } from "@/components/notice-provider"
import { usePageLoading } from "@/hooks/use-page-loading"
import { PageLoadingOverlay } from "@/components/ui/page-loading-overlay"

interface Customer extends CustomerDTO {
  hasAccount?: boolean
}

interface CustomerFormData {
  customerName: string
  phoneNumber: string
  membershipCardId: number
  balance: number
}

interface AccountFormData {
  username: string
  password: string
}

export default function CustomersPage() {
  const { notify } = useNotice()
  const { withPageLoading, isLoading } = usePageLoading()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [accounts, setAccounts] = useState<AccountDTO[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [addSheetOpen, setAddSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [accountSheetOpen, setAccountSheetOpen] = useState(false)
  const [addBalanceSheetOpen, setAddBalanceSheetOpen] = useState(false)
  const [rechargeHistorySheetOpen, setRechargeHistorySheetOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showTour, setShowTour] = useState(false)
  const [showRankInfo, setShowRankInfo] = useState(false)
  const [showDiscountCalculator, setShowDiscountCalculator] = useState(false)

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const res = await withPageLoading(() => CustomerApi.list({ page: 0, size: 100, sortBy: "customerId", sortDir: "asc" }))
      setCustomers(res)
    } catch (e: any) {
      notify({ type: "error", message: `Lỗi tải danh sách khách hàng: ${e?.message || ''}` })
    } finally {
      setLoading(false)
    }
  }

  const loadAccounts = async () => {
    try {
      const res = await withPageLoading(() => AccountApi.search({ page: 0, size: 1000 }))
      setAccounts(res.content)
    } catch (e: any) {
      console.warn("Could not load accounts:", e?.message || '')
      // Don't show error for accounts as it's optional
    }
  }

  useEffect(() => {
    loadCustomers()
    loadAccounts()
  }, [])

  // Merge customers with account info
  const customersWithAccounts = useMemo(() => {
    return customers.map(customer => ({
      ...customer,
      hasAccount: accounts.some(account => account.customerId === customer.customerId)
    }))
  }, [customers, accounts])

  const handleCreateCustomer = async (data: CustomerFormData) => {
    try {
      const newCustomer = await withPageLoading(() => CustomerApi.create({
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        membershipCardId: data.membershipCardId,
        balance: data.balance
      }))
      
      setCustomers(prev => [...prev, { ...newCustomer, hasAccount: false }])
      notify({ type: "success", message: "Đã thêm khách hàng thành công" })
    } catch (e: any) {
      notify({ type: "error", message: `Lỗi thêm khách hàng: ${e?.message || ''}` })
      throw e
    }
  }

  const handleUpdateCustomer = async (data: CustomerFormData) => {
    if (!selectedCustomer) return
    
    try {
      const updatedCustomer = await withPageLoading(() => CustomerApi.update(selectedCustomer.customerId, {
        ...selectedCustomer,
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        membershipCardId: data.membershipCardId,
        balance: data.balance
      }))
      
      setCustomers(prev => prev.map(c => 
        c.customerId === selectedCustomer.customerId 
          ? { ...updatedCustomer, hasAccount: c.hasAccount }
          : c
      ))
      notify({ type: "success", message: "Đã cập nhật khách hàng thành công" })
    } catch (e: any) {
      notify({ type: "error", message: `Lỗi cập nhật khách hàng: ${e?.message || ''}` })
      throw e
    }
  }

  const handleDeleteCustomer = async (customerId: number) => {
    try {
      await withPageLoading(() => CustomerApi.delete(customerId))
      setCustomers(prev => prev.filter(c => c.customerId !== customerId))
      setAccounts(prev => prev.filter(a => a.customerId !== customerId))
      notify({ type: "success", message: "Đã xóa khách hàng thành công" })
    } catch (e: any) {
      const errorMsg = e?.message || "Lỗi không xác định"
      
      if (errorMsg.includes("409") || errorMsg.includes("Conflict")) {
        notify({ type: "error", message: "Không thể xóa khách hàng có tài khoản hoặc có dữ liệu liên quan" })
      } else if (errorMsg.includes("500") || e?.status === 500) {
        notify({ type: "error", message: "Không thể xóa khách hàng này. Server có thể đang gặp lỗi hoặc khách hàng có dữ liệu liên quan không thể xóa." })
      } else if (errorMsg.includes("404")) {
        notify({ type: "error", message: "Khách hàng không tồn tại hoặc đã bị xóa" })
      } else {
        notify({ type: "error", message: `Xóa thất bại: ${errorMsg}` })
      }
      
      // Reload to reflect server state
      await loadCustomers()
      await loadAccounts()
    }
  }

  const handleCreateAccount = async (data: AccountFormData) => {
    if (!selectedCustomer) return
    
    try {
      const newAccount = await withPageLoading(() => AccountApi.create({
        customerId: selectedCustomer.customerId,
        username: data.username,
        password: data.password
      }))
      
      setAccounts(prev => [...prev, newAccount])
      setCustomers(prev => prev.map(c => 
        c.customerId === selectedCustomer.customerId 
          ? { ...c, hasAccount: true }
          : c
      ))
      notify({ type: "success", message: "Đã tạo tài khoản thành công" })
    } catch (e: any) {
      const errorMsg = e?.message || "Lỗi không xác định"
      
      if (errorMsg.includes("username") && errorMsg.includes("exists")) {
        notify({ type: "error", message: "Tên đăng nhập đã tồn tại" })
      } else {
        notify({ type: "error", message: `Lỗi tạo tài khoản: ${errorMsg}` })
      }
      throw e
    }
  }

  const handleUpdateAccount = async (data: AccountFormData) => {
    if (!selectedCustomer) return
    
    try {
      const updateData: any = { username: data.username }
      if (data.password && data.password.trim() !== "") {
        updateData.password = data.password
      }
      
      const updatedAccount = await withPageLoading(() => AccountApi.update(selectedCustomer.customerId, updateData))
      
      setAccounts(prev => prev.map(a => 
        a.customerId === selectedCustomer.customerId 
          ? { ...a, username: updatedAccount.username }
          : a
      ))
      notify({ type: "success", message: "Đã cập nhật tài khoản thành công" })
    } catch (e: any) {
      const errorMsg = e?.message || "Lỗi không xác định"
      
      if (errorMsg.includes("username") && errorMsg.includes("exists")) {
        notify({ type: "error", message: "Tên đăng nhập đã tồn tại" })
      } else {
        notify({ type: "error", message: `Lỗi cập nhật tài khoản: ${errorMsg}` })
      }
      throw e
    }
  }

  const handleAddBalanceAmount = async (amount: number) => {
    if (!selectedCustomer) return
    
    try {
      const updatedCustomer = await withPageLoading(() => CustomerApi.update(selectedCustomer.customerId, {
        ...selectedCustomer,
        balance: selectedCustomer.balance + amount
      }))
      
      setCustomers(prev => prev.map(c => 
        c.customerId === selectedCustomer.customerId 
          ? { ...updatedCustomer, hasAccount: c.hasAccount }
          : c
      ))
      notify({ type: "success", message: `Đã nạp ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)} thành công` })
    } catch (e: any) {
      notify({ type: "error", message: `Lỗi nạp tiền: ${e?.message || ''}` })
      throw e
    }
  }

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setEditSheetOpen(true)
  }

  const handleManageAccount = (customer: Customer) => {
    setSelectedCustomer(customer)
    setAccountSheetOpen(true)
  }

  const handleAddBalance = (customer: Customer) => {
    setSelectedCustomer(customer)
    setAddBalanceSheetOpen(true)
  }

  const handleViewRechargeHistory = (customer: Customer) => {
    setSelectedCustomer(customer)
    setRechargeHistorySheetOpen(true)
  }

  const handleViewRankInfo = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowRankInfo(true)
  }

  const handleOpenDiscountCalculator = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowDiscountCalculator(true)
  }

  // Calculate stats
  const totalCustomers = customersWithAccounts.length
  const activeCustomers = customersWithAccounts.filter(c => c.hasAccount).length
  const totalBalance = customersWithAccounts.reduce((sum, c) => sum + c.balance, 0)
  const newCustomersThisMonth = customersWithAccounts.filter(c => {
    const regDate = new Date(c.registrationDate)
    const now = new Date()
    return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="p-6 space-y-6 relative">
      <PageLoadingOverlay isLoading={isLoading} pageType="customers" />
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-foreground" data-tour="page-title">Quản lý khách hàng</h1>
              <HelpCircle 
                className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-600 transition-colors" 
                onClick={() => setShowTour(true)}
                title="Hướng dẫn sử dụng"
              />
            </div>
            <p className="text-muted-foreground">Danh sách và thông tin khách hàng, quản lý tài khoản</p>
          </div>
          <Button
            onClick={() => setAddSheetOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            data-tour="add-customer-btn"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm khách hàng
          </Button>
        </div>

        <div data-tour="customer-stats">
          <CustomerStats 
            totalCustomers={totalCustomers}
            activeCustomers={activeCustomers}
            totalBalance={totalBalance}
            newCustomersThisMonth={newCustomersThisMonth}
          />
        </div>

        <div data-tour="balance-warning">
          <BalanceWarningList customers={customersWithAccounts} />
        </div>

        <div data-tour="customer-table">
          <CustomerTable 
            customers={customersWithAccounts}
            onEdit={handleEdit}
            onDelete={handleDeleteCustomer}
            onManageAccount={handleManageAccount}
            onAddBalance={handleAddBalance}
            onViewRechargeHistory={handleViewRechargeHistory}
            onViewRankInfo={handleViewRankInfo}
            onOpenDiscountCalculator={handleOpenDiscountCalculator}
          />
        </div>

        <CustomerFormSheet 
          open={addSheetOpen} 
          onOpenChange={setAddSheetOpen} 
          mode="add" 
          onSubmit={handleCreateCustomer}
        />

        {selectedCustomer && (
          <>
            <CustomerFormSheet
              open={editSheetOpen}
              onOpenChange={setEditSheetOpen}
              customer={selectedCustomer}
              mode="edit"
              onSubmit={handleUpdateCustomer}
            />

            <AccountFormSheet
              open={accountSheetOpen}
              onOpenChange={setAccountSheetOpen}
              customer={selectedCustomer}
              mode="create"
              onSubmit={handleCreateAccount}
              onUpdate={handleUpdateAccount}
            />

            <AddBalanceSheet
              open={addBalanceSheetOpen}
              onOpenChange={setAddBalanceSheetOpen}
              customer={selectedCustomer}
              onSubmit={handleAddBalanceAmount}
            />

            <RechargeHistorySheet
              open={rechargeHistorySheetOpen}
              onOpenChange={setRechargeHistorySheetOpen}
              customer={selectedCustomer}
            />
          </>
        )}

        <CustomerTour 
          isActive={showTour} 
          onComplete={() => setShowTour(false)} 
        />

        {/* Rank Info Sheet */}
        {selectedCustomer && showRankInfo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Thông tin Rank</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowRankInfo(false)}
                  >
                    ✕
                  </Button>
                </div>
                <CustomerRankInfo 
                  customerId={selectedCustomer.customerId}
                  customerName={selectedCustomer.customerName}
                  onRankUpdated={() => {
                    loadCustomers()
                    setShowRankInfo(false)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Discount Calculator Sheet */}
        {selectedCustomer && showDiscountCalculator && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Tính Discount</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowDiscountCalculator(false)}
                  >
                    ✕
                  </Button>
                </div>
                <DiscountCalculator 
                  customerId={selectedCustomer.customerId}
                  customerName={selectedCustomer.customerName}
                />
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
