"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, RefreshCw, ShoppingCart, RotateCcw } from "lucide-react"
import { Sale, SaleDTO, UpdateSaleRequestDTO, SaleStatus } from "@/lib/sales"
import { salesApi } from "@/lib/sales"
import { useToast } from "@/hooks/use-toast"
import { SaleTable } from "@/components/sales-management/sale-table"
import { SaleFormSheet } from "@/components/sales-management/sale-form-sheet"
import { SaleStats } from "@/components/sales-management/sale-stats"
import { SaleTour } from "@/components/sales-management/sale-tour"
import { RefundFormSheet } from "@/components/refund-management/refund-form-sheet"
import { RefundTable } from "@/components/refund-management/refund-table"
import { RefundStats } from "@/components/refund-management/refund-stats"
import { Refund, refundsApi } from "@/lib/refunds"

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [loading, setLoading] = useState(true)
  const [refundsLoading, setRefundsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingSale, setEditingSale] = useState<Sale | undefined>()
  const [refundSale, setRefundSale] = useState<Sale | undefined>()
  const [formOpen, setFormOpen] = useState(false)
  const [refundFormOpen, setRefundFormOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"sales" | "refunds">("sales")
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

  // Load refunds data
  const loadRefunds = async () => {
    try {
      setRefundsLoading(true)
      const data = await refundsApi.getAll({ page: 0, size: 100 })
      setRefunds(data.content || [])
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách hoàn tiền",
        variant: "destructive",
      })
    } finally {
      setRefundsLoading(false)
    }
  }

  useEffect(() => {
    loadSales()
    loadRefunds()
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

  // Handle update sale status
  const handleUpdateSaleStatus = async (sale: Sale, status: SaleStatus) => {
    try {
      await salesApi.updateStatus(sale.saleId, { status })
      toast({
        title: "Thành công",
        description: `Đã cập nhật trạng thái hóa đơn #${sale.saleId} thành ${status === 'Paid' ? 'Đã thanh toán' : 'Đã hủy'}`,
      })
      loadSales() // Reload sales data
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái hóa đơn",
        variant: "destructive",
      })
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

  // Handle refund form close
  const handleRefundFormClose = () => {
    setRefundFormOpen(false)
    setRefundSale(undefined)
  }

  // Handle refund success
  const handleRefundSuccess = async (refund: Refund) => {
    toast({
      title: "Thành công",
      description: "Đã tạo yêu cầu hoàn tiền thành công",
    })
    loadRefunds()
    handleRefundFormClose()
  }

  // Handle refund status update
  const handleRefundStatusUpdate = async (id: number, status: 'Pending' | 'Approved' | 'Rejected' | 'Completed') => {
    try {
      await refundsApi.updateStatus(id, status)
      loadRefunds()
    } catch (error) {
      throw error
    }
  }

  // Handle refund view
  const handleRefundView = (refund: Refund) => {
    toast({
      title: "Thông tin",
      description: `Xem chi tiết hoàn tiền #${refund.refundId}`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý bán hàng & Hoàn tiền</h1>
          <p className="text-muted-foreground">
            Quản lý hóa đơn bán hàng và xử lý yêu cầu hoàn tiền
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <SaleTour />
          <Button
            onClick={() => {
              if (activeTab === "sales") {
                loadSales()
              } else {
                loadRefunds()
              }
            }}
            variant="outline"
            size="sm"
            disabled={loading || refundsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(loading || refundsLoading) ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "sales" | "refunds")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sales" className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Bán hàng</span>
          </TabsTrigger>
          <TabsTrigger value="refunds" className="flex items-center space-x-2">
            <RotateCcw className="h-4 w-4" />
            <span>Hoàn tiền</span>
          </TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          {/* Sales Stats */}
          <div data-tour="sale-stats">
            <SaleStats sales={sales} loading={loading} />
          </div>

          {/* Sales Table */}
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
                onView={handleViewSale}
                onRefund={handleRefundSale}
                onUpdateStatus={handleUpdateSaleStatus}
                refunds={refunds}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refunds Tab */}
        <TabsContent value="refunds" className="space-y-6">
          {/* Refunds Stats */}
          <RefundStats refunds={refunds} loading={refundsLoading} />

          {/* Refunds Table */}
          <RefundTable
            refunds={refunds}
            loading={refundsLoading}
            onView={handleRefundView}
            onUpdateStatus={handleRefundStatusUpdate}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Sale Form */}
      {editingSale && (
        <SaleFormSheet
          sale={editingSale}
          mode="edit"
          onSuccess={handleUpdateSale}
          open={formOpen && !!editingSale}
          onOpenChange={handleFormClose}
        />
      )}

      {/* Refund Form */}
      {refundSale && (
        <RefundFormSheet
          sale={refundSale}
          open={refundFormOpen}
          onOpenChange={handleRefundFormClose}
          onSuccess={handleRefundSuccess}
        />
      )}
    </div>
  )
}
