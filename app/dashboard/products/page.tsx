"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Package, BarChart3, Table } from "lucide-react"
import { Product, productsApi } from "@/lib/products"
import { useToast } from "@/hooks/use-toast"
import { ProductTable } from "@/components/product-management/product-table"
import { ProductStats } from "@/components/product-management/product-stats"
import { ProductFormSheet } from "@/components/product-management/product-form-sheet"
import { ProductTour } from "@/components/product-management/product-tour"
import { HelpCircle } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const { toast } = useToast()

  const fetchProducts = async () => {
    try {
      const data = await productsApi.getAll()
      setProducts(data)
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
            <HelpCircle 
              className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-600 transition-colors" 
              onClick={() => setShowTour(true)}
              title="Hướng dẫn sử dụng"
            />
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
