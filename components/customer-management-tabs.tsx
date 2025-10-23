"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserPlus, MoreVertical, Mail, Phone, Calendar, Users, UserCheck, Shield } from "lucide-react"
import { CustomerFormSheet } from "@/components/customer-form-sheet"
import { CustomerActionsSheet } from "@/components/customer-actions-sheet"
import { AccountFormSheet } from "@/components/account-form-sheet"
import { AccountActionsSheet } from "@/components/account-actions-sheet"
import { membershipsApi, type MembershipCard } from "@/lib/memberships"
import { CustomerApi, type CustomerDTO } from "@/lib/customers"
import { AccountApi, type AccountDTO } from "@/lib/customers"
import { useNotice } from "@/components/notice-provider"
import { usePageLoading } from "@/hooks/use-page-loading"

export function CustomerManagementTabs() {
  const { notify } = useNotice()
  const { withPageLoading } = usePageLoading()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("customers")
  
  // Customer states
  const [addCustomerSheetOpen, setAddCustomerSheetOpen] = useState(false)
  const [editCustomerSheetOpen, setEditCustomerSheetOpen] = useState(false)
  const [customerActionsSheetOpen, setCustomerActionsSheetOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDTO | null>(null)
  const [customers, setCustomers] = useState<CustomerDTO[]>([])

  // Account states
  const [addAccountSheetOpen, setAddAccountSheetOpen] = useState(false)
  const [editAccountSheetOpen, setEditAccountSheetOpen] = useState(false)
  const [accountActionsSheetOpen, setAccountActionsSheetOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<AccountDTO | null>(null)
  const [accounts, setAccounts] = useState<AccountDTO[]>([])
  const [membershipCards, setMembershipCards] = useState<MembershipCard[]>([])
  const [isLoadingCards, setIsLoadingCards] = useState(false)

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingCards(true)
      try {
        const [cards, customersData, accountsData] = await Promise.all([
          membershipsApi.getAll(),
          CustomerApi.list({ page: 0, size: 100 }),
          AccountApi.search({ page: 0, size: 100 })
        ])
        setMembershipCards(cards)
        setCustomers(customersData)
        setAccounts(accountsData.content || [])
      } catch (error) {
        console.error("Failed to load data:", error)
        notify({ type: "error", message: "Lỗi tải dữ liệu" })
      } finally {
        setIsLoadingCards(false)
      }
    }

    loadData()
  }, [])

  const getMembershipCardName = (membershipCardId: number) => {
    const card = membershipCards.find(c => c.membershipCardId === membershipCardId)
    return card ? `${card.membershipCardName}${card.isDefault ? ' (Mặc định)' : ''}` : 'Không xác định'
  }

  // Helper function to check if customer has account
  const getCustomerHasAccount = (customerId: number) => {
    return accounts.some(account => account.customerId === customerId)
  }

  const filteredCustomers = customers.filter(
    (customer) => {
      const membershipCardName = getMembershipCardName(customer.membershipCardId)
      return customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phoneNumber.includes(searchQuery) ||
        membershipCardName.toLowerCase().includes(searchQuery.toLowerCase())
    }
  )

  const filteredAccounts = accounts.filter(
    (account) => {
      const membershipCardName = getMembershipCardName(account.membershipCardId)
      return account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.phoneNumber.includes(searchQuery) ||
        membershipCardName.toLowerCase().includes(searchQuery.toLowerCase())
    }
  )

  const handleOpenCustomerActions = (customer: any) => {
    setSelectedCustomer(customer)
    setCustomerActionsSheetOpen(true)
  }

  const handleOpenAccountActions = (account: any) => {
    setSelectedAccount(account)
    setAccountActionsSheetOpen(true)
  }

  const handleEditCustomer = () => {
    setEditCustomerSheetOpen(true)
  }

  const handleEditAccount = () => {
    setEditAccountSheetOpen(true)
  }

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer?.customerId) return
    
    try {
      await withPageLoading(() => CustomerApi.delete(selectedCustomer.customerId))
      setCustomers(prev => prev.filter(c => c.customerId !== selectedCustomer.customerId))
      notify({ type: "success", message: "Đã xóa khách hàng thành công" })
    } catch (error: any) {
      notify({ type: "error", message: `Xóa khách hàng thất bại: ${error?.message || "Không xác định"}` })
    }
  }

  const handleDeleteAccount = async () => {
    if (!selectedAccount?.customerId) return
    
    try {
      await withPageLoading(() => AccountApi.delete(selectedAccount.customerId))
      setAccounts(prev => prev.filter(a => a.customerId !== selectedAccount.customerId))
      notify({ type: "success", message: "Đã xóa tài khoản thành công" })
    } catch (error: any) {
      notify({ type: "error", message: `Xóa tài khoản thất bại: ${error?.message || "Không xác định"}` })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý khách hàng & Tài khoản</h1>
          <p className="text-muted-foreground">Quản lý thông tin khách hàng và tài khoản người dùng</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Quản lý khách hàng
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Quản lý tài khoản
          </TabsTrigger>
        </TabsList>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên, số điện thoại hoặc thẻ thành viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>
            <Button
              onClick={() => setAddCustomerSheetOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm khách hàng
            </Button>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Danh sách khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Khách hàng</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Liên hệ</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ngày đăng ký</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Số dư</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tài khoản</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.customerId} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/20 flex items-center justify-center text-primary font-medium">
                              {customer.customerName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{customer.customerName}</p>
                              <p className="text-xs text-muted-foreground">ID: #{customer.customerId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {customer.phoneNumber}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Thẻ: {getMembershipCardName(customer.membershipCardId)}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {formatDate(customer.registrationDate)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-foreground">
                            {formatCurrency(customer.balance)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${
                            getCustomerHasAccount(customer.customerId)
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                          }`}>
                            <UserCheck className="h-3 w-3 mr-1" />
                            {getCustomerHasAccount(customer.customerId) ? "Có tài khoản" : "Chưa có"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleOpenCustomerActions(customer)}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Không tìm thấy khách hàng nào</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{customers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {customers.filter((c) => c.hasAccount).length} có tài khoản
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số dư</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(customers.reduce((sum, c) => sum + c.balance, 0))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Trung bình {formatCurrency(customers.reduce((sum, c) => sum + c.balance, 0) / customers.length)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Khách hàng mới</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">+12</div>
                <p className="text-xs text-muted-foreground mt-1">Trong tháng này</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo username, tên khách hàng hoặc số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>
            <Button
              onClick={() => setAddAccountSheetOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm tài khoản
            </Button>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Danh sách tài khoản</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tài khoản</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Khách hàng</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Liên hệ</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Thẻ thành viên</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map((account) => (
                      <tr key={account.accountId} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                              <Shield className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{account.username}</p>
                              <p className="text-xs text-muted-foreground">ID: #{account.accountId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-primary/20 flex items-center justify-center text-primary font-medium text-xs">
                              {account.customerName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{account.customerName}</p>
                              <p className="text-xs text-muted-foreground">Customer ID: #{account.customerId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {account.phoneNumber}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-foreground">{getMembershipCardName(account.membershipCardId)}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleOpenAccountActions(account)}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredAccounts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Không tìm thấy tài khoản nào</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng tài khoản</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{accounts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {customers.length - accounts.length} chưa có tài khoản
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Tài khoản hoạt động</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{accounts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">100% đang hoạt động</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Tài khoản mới</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">+5</div>
                <p className="text-xs text-muted-foreground mt-1">Trong tháng này</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Customer Sheets */}
      <CustomerFormSheet 
        open={addCustomerSheetOpen} 
        onOpenChange={setAddCustomerSheetOpen} 
        mode="add"
        onSaved={(newCustomer) => {
          if (newCustomer) setCustomers(prev => [newCustomer, ...prev])
        }}
      />

      {selectedCustomer && (
        <>
          <CustomerFormSheet
            open={editCustomerSheetOpen}
            onOpenChange={setEditCustomerSheetOpen}
            customer={selectedCustomer}
            mode="edit"
            onSaved={(updatedCustomer) => {
              if (updatedCustomer) setCustomers(prev => prev.map(c => c.customerId === updatedCustomer.customerId ? updatedCustomer : c))
            }}
          />

          <CustomerActionsSheet
            open={customerActionsSheetOpen}
            onOpenChange={setCustomerActionsSheetOpen}
            customer={selectedCustomer}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
          />
        </>
      )}

      {/* Account Sheets */}
      <AccountFormSheet 
        open={addAccountSheetOpen} 
        onOpenChange={setAddAccountSheetOpen} 
        mode="add"
        customers={customers.filter(c => !getCustomerHasAccount(c.customerId))}
        onSaved={(newAccount) => {
          if (newAccount) setAccounts(prev => [newAccount, ...prev])
        }}
      />

      {selectedAccount && (
        <>
          <AccountFormSheet
            open={editAccountSheetOpen}
            onOpenChange={setEditAccountSheetOpen}
            account={selectedAccount}
            mode="edit"
            customers={customers}
            onSaved={(updatedAccount) => {
              if (updatedAccount) setAccounts(prev => prev.map(a => a.customerId === updatedAccount.customerId ? updatedAccount : a))
            }}
          />

          <AccountActionsSheet
            open={accountActionsSheetOpen}
            onOpenChange={setAccountActionsSheetOpen}
            account={selectedAccount}
            onEdit={handleEditAccount}
            onDelete={handleDeleteAccount}
          />
        </>
      )}
    </div>
  )
}
