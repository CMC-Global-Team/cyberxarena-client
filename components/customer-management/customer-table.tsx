"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, Mail, Phone, Calendar, DollarSign } from "lucide-react"
import { CustomerActionsSheet } from "@/components/customer-management/customer-actions-sheet"

interface Customer {
  customerId: number
  customerName: string
  phoneNumber: string
  membershipCard: string
  balance: number
  registrationDate: string
  hasAccount?: boolean
}

interface CustomerTableProps {
  customers: Customer[]
  onEdit: (customer: Customer) => void
  onDelete: (customerId: number) => void
  onManageAccount: (customer: Customer) => void
  onAddBalance: (customer: Customer) => void
}

export function CustomerTable({ 
  customers, 
  onEdit, 
  onDelete, 
  onManageAccount, 
  onAddBalance 
}: CustomerTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [accountFilter, setAccountFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("customerId")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [actionsSheetOpen, setActionsSheetOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter((customer) => {
      // Search filter
      const matchesSearch = 
        customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phoneNumber.includes(searchQuery) ||
        customer.membershipCard?.toLowerCase().includes(searchQuery.toLowerCase())

      // Account filter
      const matchesAccount = 
        accountFilter === "all" || 
        (accountFilter === "hasAccount" && customer.hasAccount) ||
        (accountFilter === "noAccount" && !customer.hasAccount)

      return matchesSearch && matchesAccount
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case "customerId":
          aValue = a.customerId
          bValue = b.customerId
          break
        case "customerName":
          aValue = a.customerName
          bValue = b.customerName
          break
        case "phoneNumber":
          aValue = a.phoneNumber || ""
          bValue = b.phoneNumber || ""
          break
        case "membershipCard":
          aValue = a.membershipCard || ""
          bValue = b.membershipCard || ""
          break
        case "balance":
          aValue = a.balance
          bValue = b.balance
          break
        case "registrationDate":
          aValue = new Date(a.registrationDate).getTime()
          bValue = new Date(b.registrationDate).getTime()
          break
        default:
          aValue = a.customerId
          bValue = b.customerId
      }

      if (sortDir === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [customers, searchQuery, accountFilter, sortBy, sortDir])

  const handleOpenActions = (customer: Customer) => {
    setSelectedCustomer(customer)
    setActionsSheetOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, số điện thoại hoặc thẻ thành viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <div className="w-[180px]">
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Tài khoản" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="hasAccount">Có tài khoản</SelectItem>
                  <SelectItem value="noAccount">Chưa có tài khoản</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px]">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customerId">ID</SelectItem>
                  <SelectItem value="customerName">Tên</SelectItem>
                  <SelectItem value="phoneNumber">Số điện thoại</SelectItem>
                  <SelectItem value="membershipCard">Thẻ thành viên</SelectItem>
                  <SelectItem value="balance">Số dư</SelectItem>
                  <SelectItem value="registrationDate">Ngày đăng ký</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[140px]">
              <Select value={sortDir} onValueChange={(v) => setSortDir(v as "asc" | "desc")}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Thứ tự" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Tăng dần</SelectItem>
                  <SelectItem value="desc">Giảm dần</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Khách hàng</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Liên hệ</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Thẻ thành viên</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ngày đăng ký</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Số dư</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tài khoản</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedCustomers.map((customer) => (
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
                        {customer.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {customer.phoneNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {customer.membershipCard ? (
                        <Badge variant="secondary" className="bg-primary/20 text-primary">
                          {customer.membershipCard}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Chưa có</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {formatDate(customer.registrationDate)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        {formatCurrency(customer.balance)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant={customer.hasAccount ? "default" : "secondary"}
                        className={customer.hasAccount ? "bg-green-500/20 text-green-600" : "bg-gray-500/20 text-gray-600"}
                      >
                        {customer.hasAccount ? "Có tài khoản" : "Chưa có"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenActions(customer)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredAndSortedCustomers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không tìm thấy khách hàng nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCustomer && (
        <CustomerActionsSheet
          open={actionsSheetOpen}
          onOpenChange={setActionsSheetOpen}
          customer={selectedCustomer}
          onEdit={onEdit}
          onDelete={onDelete}
          onManageAccount={onManageAccount}
          onAddBalance={onAddBalance}
        />
      )}
    </>
  )
}
