"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { CustomerTable } from "@/components/customer-management/customer-table"
import { CustomerFormSheet } from "@/components/customer-management/customer-form-sheet"
import { AccountFormSheet } from "@/components/customer-management/account-form-sheet"
import { AddBalanceSheet } from "@/components/customer-management/add-balance-sheet"
import { CustomerStats } from "@/components/customer-management/customer-stats"

interface Customer {
  customerId: number
  customerName: string
  phoneNumber: string
  membershipCard: string
  balance: number
  registrationDate: string
  hasAccount?: boolean
}

interface CustomerFormData {
  customerName: string
  phoneNumber: string
  membershipCard: string
  balance: number
}

interface AccountFormData {
  username: string
  password: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [addSheetOpen, setAddSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [accountSheetOpen, setAccountSheetOpen] = useState(false)
  const [addBalanceSheetOpen, setAddBalanceSheetOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  // Mock data - sẽ thay thế bằng API calls
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        customerId: 1,
        customerName: "Nguyễn Văn A",
        phoneNumber: "0901234567",
        membershipCard: "VIP001",
        balance: 50000,
        registrationDate: "2024-01-15T00:00:00",
        hasAccount: true,
      },
      {
        customerId: 2,
        customerName: "Trần Thị B",
        phoneNumber: "0912345678",
        membershipCard: "GOLD002",
        balance: 120000,
        registrationDate: "2024-02-20T00:00:00",
        hasAccount: true,
      },
      {
        customerId: 3,
        customerName: "Lê Văn C",
        phoneNumber: "0923456789",
        membershipCard: "",
        balance: 0,
        registrationDate: "2024-03-05T00:00:00",
        hasAccount: false,
      },
      {
        customerId: 4,
        customerName: "Phạm Thị D",
        phoneNumber: "0934567890",
        membershipCard: "SILVER003",
        balance: 200000,
        registrationDate: "2024-03-12T00:00:00",
        hasAccount: true,
      },
      {
        customerId: 5,
        customerName: "Hoàng Văn E",
        phoneNumber: "0945678901",
        membershipCard: "",
        balance: 75000,
        registrationDate: "2024-04-18T00:00:00",
        hasAccount: false,
      },
    ]
    setCustomers(mockCustomers)
  }, [])

  const handleCreateCustomer = async (data: CustomerFormData) => {
    // TODO: Implement API call
    console.log("Creating customer:", data)
    // Mock implementation
    const newCustomer: Customer = {
      customerId: customers.length + 1,
      customerName: data.customerName,
      phoneNumber: data.phoneNumber,
      membershipCard: data.membershipCard,
      balance: data.balance,
      registrationDate: new Date().toISOString(),
      hasAccount: false,
    }
    setCustomers([...customers, newCustomer])
  }

  const handleUpdateCustomer = async (data: CustomerFormData) => {
    // TODO: Implement API call
    console.log("Updating customer:", selectedCustomer?.customerId, data)
    // Mock implementation
    if (selectedCustomer) {
      setCustomers(customers.map(c => 
        c.customerId === selectedCustomer.customerId 
          ? { ...c, ...data }
          : c
      ))
    }
  }

  const handleDeleteCustomer = async (customerId: number) => {
    // TODO: Implement API call
    console.log("Deleting customer:", customerId)
    // Mock implementation
    setCustomers(customers.filter(c => c.customerId !== customerId))
  }

  const handleCreateAccount = async (data: AccountFormData) => {
    // TODO: Implement API call
    console.log("Creating account for customer:", selectedCustomer?.customerId, data)
    // Mock implementation
    if (selectedCustomer) {
      setCustomers(customers.map(c => 
        c.customerId === selectedCustomer.customerId 
          ? { ...c, hasAccount: true }
          : c
      ))
    }
  }

  const handleAddBalanceAmount = async (amount: number) => {
    // TODO: Implement API call
    console.log("Adding balance for customer:", selectedCustomer?.customerId, amount)
    // Mock implementation
    if (selectedCustomer) {
      setCustomers(customers.map(c => 
        c.customerId === selectedCustomer.customerId 
          ? { ...c, balance: c.balance + amount }
          : c
      ))
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

  // Calculate stats
  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.hasAccount).length
  const totalBalance = customers.reduce((sum, c) => sum + c.balance, 0)
  const newCustomersThisMonth = customers.filter(c => {
    const regDate = new Date(c.registrationDate)
    const now = new Date()
    return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý khách hàng</h1>
          <p className="text-muted-foreground">Danh sách và thông tin khách hàng, quản lý tài khoản</p>
        </div>
        <Button
          onClick={() => setAddSheetOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm khách hàng
        </Button>
      </div>

      <CustomerStats 
        totalCustomers={totalCustomers}
        activeCustomers={activeCustomers}
        totalBalance={totalBalance}
        newCustomersThisMonth={newCustomersThisMonth}
      />

      <CustomerTable 
        customers={customers}
        onEdit={handleEdit}
        onDelete={handleDeleteCustomer}
        onManageAccount={handleManageAccount}
        onAddBalance={handleAddBalance}
      />

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
          />

          <AddBalanceSheet
            open={addBalanceSheetOpen}
            onOpenChange={setAddBalanceSheetOpen}
            customer={selectedCustomer}
            onSubmit={handleAddBalanceAmount}
          />
        </>
      )}
    </div>
  )
}
