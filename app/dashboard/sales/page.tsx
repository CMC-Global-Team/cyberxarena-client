"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, RefreshCw, ShoppingCart, RotateCcw } from "lucide-react"
import { Sale, SaleDTO, UpdateSaleRequestDTO, SaleStatus, PageResponse } from "@/lib/sales"
import { salesApi } from "@/lib/sales"
import { useToast } from "@/hooks/use-toast"
import { SaleTable } from "@/components/sales-management/sale-table"
import { SaleFormSheet } from "@/components/sales-management/sale-form-sheet"
import { SaleStats } from "@/components/sales-management/sale-stats"
import { SaleTour } from "@/components/sales-management/sale-tour"
import { TourTrigger } from "@/components/ui/tour-trigger"
import { RefundFormSheet } from "@/components/refund-management/refund-form-sheet"
import { RefundTable } from "@/components/refund-management/refund-table"
import { RefundStats } from "@/components/refund-management/refund-stats"
import { RefundDetailDialog } from "@/components/refund-management/refund-detail-dialog"
import { Refund, refundsApi } from "@/lib/refunds"
import { SaleDetailDialog } from "@/components/sales-management/sale-detail-dialog"
import { DataPagination } from "@/components/ui/data-pagination"

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
  const [viewingSale, setViewingSale] = useState<Sale | undefined>()
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [viewingRefund, setViewingRefund] = useState<Refund | undefined>()
  const [refundDetailDialogOpen, setRefundDetailDialogOpen] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const { toast } = useToast()
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Load sales data with pagination
  const loadSales = async (page: number = currentPage, size: number = pageSize) => {
    try {
      setLoading(true)
      const data = await salesApi.search({
        page,
        size,
        sortBy: "saleId",
        sortOrder: "desc"
      })
      
      if (data && typeof data === 'object' && 'content' in data) {
        // Handle paginated response
        const pageResponse = data as PageResponse<Sale>
        setSales(pageResponse.content)
        setTotalElements(pageResponse.totalElements)
        setTotalPages(pageResponse.totalPages)
        setCurrentPage(pageResponse.number)
      } else {
        // Handle non-paginated response (fallback)
        setSales(data as Sale[])
        setTotalElements((data as Sale[]).length)
        setTotalPages(1)
        setCurrentPage(0)
      }
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

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadSales(page, pageSize)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(0) // Reset to first page when changing page size
    loadSales(0, size)
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
    console.log('handleUpdateSaleStatus called:', { saleId: sale.saleId, status })
    try {
      console.log('Calling salesApi.updateStatus...')
      const result = await salesApi.updateStatus(sale.saleId, { status })
      console.log('API call successful:', result)
      toast({
        title: "Thành công",
        description: `Đã cập nhật trạng thái hóa đơn #${sale.saleId} thành ${status === 'Paid' ? 'Đã thanh toán' : 'Đã hủy'}`,
      })
      loadSales() // Reload sales data
    } catch (error) {
      console.error('API call failed:', error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái hóa đơn",
        variant: "destructive",
      })
    }
  }

  // Handle refund sale
  const handleRefundSale = (sale: Sale) => {
    setRefundSale(sale)
    setRefundFormOpen(true)
  }

  // Handle edit sale
  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale)
    setFormOpen(true)
  }

  // Handle view sale
  const handleViewSale = (sale: Sale) => {
    setViewingSale(sale)
    setDetailDialogOpen(true)
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
      // Reload both refunds and sales to update status display
      loadRefunds()
      loadSales()
    } catch (error) {
      throw error
    }
  }

  // Handle refund view
  const handleRefundView = (refund: Refund) => {
    setViewingRefund(refund)
    setRefundDetailDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight" data-tour="page-title">Quản lý bán hàng & Hoàn tiền</h1>
            <TourTrigger onClick={() => setShowTour(true)} />
          </div>
          <p className="text-muted-foreground">
            Quản lý hóa đơn bán hàng và xử lý yêu cầu hoàn tiền
          </p>
        </div>
        <div className="flex items-center space-x-2">
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
            <SaleStats sales={sales} loading={loading} refunds={refunds} />
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
              
              {/* Pagination */}
              <div className="mt-6">
                <DataPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  showPageSizeSelector={true}
                  pageSizeOptions={[10, 20, 50, 100]}
                />
              </div>
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

      {/* Sale Detail Dialog */}
      <SaleDetailDialog
        sale={viewingSale}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />

      {/* Refund Detail Dialog */}
      <RefundDetailDialog
        refund={viewingRefund}
        open={refundDetailDialogOpen}
        onOpenChange={setRefundDetailDialogOpen}
        sale={viewingRefund ? sales.find(s => s.saleId === viewingRefund.saleId) : undefined}
      />

      {/* Tour */}
      <SaleTour 
        isActive={showTour} 
        onComplete={() => setShowTour(false)} 
      />
    </div>
  )
}
