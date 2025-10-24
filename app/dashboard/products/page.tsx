"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Package, BarChart3, Table } from "lucide-react"
import { Product, productsApi, PageResponse } from "@/lib/products"
import { useToast } from "@/hooks/use-toast"
import { ProductTable } from "@/components/product-management/product-table"
import { ProductStats } from "@/components/product-management/product-stats"
import { ProductFormSheet } from "@/components/product-management/product-form-sheet"
import { ProductTour } from "@/components/product-management/product-tour"
import { DataPagination } from "@/components/ui/data-pagination"
import { TourTrigger } from "@/components/ui/tour-trigger"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const { toast } = useToast()
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchProducts = async (page: number = currentPage, size: number = pageSize) => {
    try {
      const data = await productsApi.getAll({ 
        page, 
        size, 
        sortBy: "itemId", 
        sortDir: "asc" 
      })
      
      if (data && typeof data === 'object' && 'content' in data) {
        // Handle paginated response
        const pageResponse = data as PageResponse<Product>
        setProducts(pageResponse.content)
        setTotalElements(pageResponse.totalElements)
        setTotalPages(pageResponse.totalPages)
        setCurrentPage(pageResponse.number)
      } else {
        // Handle non-paginated response (fallback)
        setProducts(data as Product[])
        setTotalElements((data as Product[]).length)
        setTotalPages(1)
        setCurrentPage(0)
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải danh sách sản phẩm",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchProducts(page, pageSize)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(0) // Reset to first page when changing page size
    fetchProducts(0, size)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchProducts()
  }

  const handleProductSuccess = () => {
    fetchProducts()
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight" data-tour="page-title">Quản lý sản phẩm</h1>
            <TourTrigger onClick={() => setShowTour(true)} />
          </div>
          <p className="text-muted-foreground">
            Quản lý danh mục sản phẩm, tồn kho và thông tin nhà cung cấp
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            data-tour="refresh-btn"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <div data-tour="add-product-btn">
            <ProductFormSheet onSuccess={handleProductSuccess} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList data-tour="tabs-navigation">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Danh sách sản phẩm
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Thống kê
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <div data-tour="product-table">
            <ProductTable 
              products={products} 
              loading={loading}
              onRefresh={handleProductSuccess}
            />
          </div>
          
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
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div data-tour="product-stats">
            {loading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                      </CardHeader>
                      <CardContent>
                        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <ProductStats products={products} />
            )}
          </div>
        </TabsContent>
      </Tabs>

      <ProductTour 
        isActive={showTour} 
        onComplete={() => setShowTour(false)} 
      />
    </div>
  )
}
