"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, RefreshCw } from "lucide-react"
import { Sale, SaleDTO, UpdateSaleRequestDTO } from "@/lib/sales"
import { salesApi } from "@/lib/sales"
import { useToast } from "@/hooks/use-toast"
import { SaleTable } from "@/components/sales-management/sale-table"
import { SaleFormSheet } from "@/components/sales-management/sale-form-sheet"
import { SaleStats } from "@/components/sales-management/sale-stats"
import { SaleTour } from "@/components/sales-management/sale-tour"

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingSale, setEditingSale] = useState<Sale | undefined>()
  const [formOpen, setFormOpen] = useState(false)
  const { toast } = useToast()

  // Load sales data
  const loadSales = async () => {
    try {
      setLoading(true)
      const data = await salesApi.search({})
      setSales(data)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách hóa đơn",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSales()
  }, [])

  // Filter sales based on search term
  const filteredSales = sales.filter(sale => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      sale.saleId.toString().includes(searchLower) ||
      sale.customerId.toString().includes(searchLower) ||
      sale.paymentMethod.toLowerCase().includes(searchLower)
    )
  })

  // Handle create sale
  const handleCreateSale = async (data: SaleDTO) => {
    try {
      await salesApi.create(data, data.customerId)
      toast({
        title: "Thành công",
        description: "Đã tạo hóa đơn thành công",
      })
      loadSales()
    } catch (error) {
      throw error
    }
  }

  // Handle update sale
  const handleUpdateSale = async (data: SaleDTO) => {
    if (!editingSale) return
    
    try {
      const updateData: UpdateSaleRequestDTO = {
        customerId: data.customerId,
        paymentMethod: data.paymentMethod,
        discountId: data.discountId,
        note: data.note
      }
      
      await salesApi.update(editingSale.saleId, updateData)
      toast({
        title: "Thành công",
        description: "Đã cập nhật hóa đơn thành công",
      })
      loadSales()
    } catch (error) {
      throw error
    }
  }

  // Handle delete sale
  const handleDeleteSale = async (id: number) => {
    try {
      await salesApi.delete(id)
      loadSales()
    } catch (error) {
      throw error
    }
  }

  // Handle edit sale
  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale)
    setFormOpen(true)
  }

  // Handle view sale
  const handleViewSale = (sale: Sale) => {
    // TODO: Implement view sale details
    toast({
      title: "Thông tin",
      description: `Xem chi tiết hóa đơn #${sale.saleId}`,
    })
  }

  // Handle form close
  const handleFormClose = () => {
    setFormOpen(false)
    setEditingSale(undefined)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý bán hàng</h1>
          <p className="text-muted-foreground">
            Quản lý hóa đơn bán hàng và theo dõi doanh thu
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <SaleTour />
          <Button
            onClick={loadSales}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div data-tour="sale-stats">
        <SaleStats sales={sales} loading={loading} />
      </div>

      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách hóa đơn</CardTitle>
              <CardDescription>
                Quản lý và theo dõi tất cả hóa đơn bán hàng
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative" data-tour="sale-search">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm hóa đơn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <SaleFormSheet
                mode="add"
                onSuccess={handleCreateSale}
                open={formOpen && !editingSale}
                onOpenChange={setFormOpen}
              >
                <Button data-tour="add-sale-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo hóa đơn mới
                </Button>
              </SaleFormSheet>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SaleTable
            sales={filteredSales}
            loading={loading}
            onEdit={handleEditSale}
            onDelete={handleDeleteSale}
            onView={handleViewSale}
          />
        </CardContent>
      </Card>

      {/* Edit Form */}
      {editingSale && (
        <SaleFormSheet
          sale={editingSale}
          mode="edit"
          onSuccess={handleUpdateSale}
          open={formOpen && !!editingSale}
          onOpenChange={handleFormClose}
        />
      )}
    </div>
  )
}
