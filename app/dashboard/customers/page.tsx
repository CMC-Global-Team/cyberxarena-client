"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserPlus, MoreVertical, Mail, Phone, Calendar } from "lucide-react"
import { CustomerFormSheet } from "@/components/customer-form-sheet"
import { CustomerActionsSheet } from "@/components/customer-actions-sheet"

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [addSheetOpen, setAddSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [actionsSheetOpen, setActionsSheetOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  const customers = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0901234567",
      memberSince: "15/01/2024",
      totalHours: 125,
      balance: "50,000đ",
      status: "active",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0912345678",
      memberSince: "20/02/2024",
      totalHours: 89,
      balance: "120,000đ",
      status: "active",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0923456789",
      memberSince: "05/03/2024",
      totalHours: 234,
      balance: "0đ",
      status: "active",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@email.com",
      phone: "0934567890",
      memberSince: "12/03/2024",
      totalHours: 67,
      balance: "200,000đ",
      status: "active",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@email.com",
      phone: "0945678901",
      memberSince: "18/04/2024",
      totalHours: 156,
      balance: "75,000đ",
      status: "inactive",
    },
  ]

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery),
  )

  const handleOpenActions = (customer: any) => {
    setSelectedCustomer(customer)
    setActionsSheetOpen(true)
  }

  const handleEdit = () => {
    setEditSheetOpen(true)
  }

  const handleDelete = () => {
    console.log("[v0] Customer deleted")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý khách hàng</h1>
          <p className="text-muted-foreground">Danh sách và thông tin khách hàng</p>
        </div>
        <Button
          onClick={() => setAddSheetOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm khách hàng
        </Button>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ngày tham gia</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tổng giờ chơi</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Số dư</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/20 flex items-center justify-center text-primary font-medium">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">ID: #{customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {customer.memberSince}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-foreground">{customer.totalHours}h</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-foreground">{customer.balance}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium ${
                          customer.status === "active" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {customer.status === "active" ? "Hoạt động" : "Không hoạt động"}
                      </span>
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
              {customers.filter((c) => c.status === "active").length} đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng giờ chơi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {customers.reduce((sum, c) => sum + c.totalHours, 0)}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Trung bình {Math.round(customers.reduce((sum, c) => sum + c.totalHours, 0) / customers.length)}h/khách
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

      <CustomerFormSheet open={addSheetOpen} onOpenChange={setAddSheetOpen} mode="add" />

      {selectedCustomer && (
        <>
          <CustomerFormSheet
            open={editSheetOpen}
            onOpenChange={setEditSheetOpen}
            customer={selectedCustomer}
            mode="edit"
          />

          <CustomerActionsSheet
            open={actionsSheetOpen}
            onOpenChange={setActionsSheetOpen}
            customer={selectedCustomer}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  )
}
