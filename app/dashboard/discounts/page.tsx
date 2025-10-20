"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Percent, BarChart3, Table } from "lucide-react"
import { Discount, discountsApi } from "@/lib/discounts"
import { useToast } from "@/hooks/use-toast"
import { DiscountTable } from "@/components/discount-management/discount-table"
import { DiscountStats } from "@/components/discount-management/discount-stats"
import { DiscountFormSheet } from "@/components/discount-management/discount-form-sheet"

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const { toast } = useToast()

  const fetchDiscounts = async () => {
    try {
      const data = await discountsApi.getAll()
      setDiscounts(data)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải danh sách giảm giá",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDiscounts()
  }

  const handleDiscountSuccess = () => {
    fetchDiscounts()
  }

  const handleCreateDiscount = async (data: any) => {
    try {
      await discountsApi.create(data)
      toast({
        title: "Thành công",
        description: "Đã thêm giảm giá thành công",
      })
      handleDiscountSuccess()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể thêm giảm giá",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleUpdateDiscount = async (data: any) => {
    if (!selectedDiscount) return
    
    try {
      await discountsApi.update(selectedDiscount.discount_id, data)
      toast({
        title: "Thành công",
        description: "Đã cập nhật giảm giá thành công",
      })
      handleDiscountSuccess()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể cập nhật giảm giá",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDeleteDiscount = async (id: number) => {
    try {
      await discountsApi.delete(id)
      toast({
        title: "Thành công",
        description: "Đã xóa giảm giá thành công",
      })
      handleDiscountSuccess()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể xóa giảm giá",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleEdit = (discount: Discount) => {
    setSelectedDiscount(discount)
    setEditSheetOpen(true)
  }

  useEffect(() => {
    fetchDiscounts()
  }, [])

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý giảm giá</h1>
          <p className="text-muted-foreground">
            Quản lý các loại giảm giá trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <DiscountFormSheet 
            mode="add" 
            onSuccess={handleCreateDiscount}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Danh sách giảm giá
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Thống kê
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <DiscountTable 
            discounts={discounts} 
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteDiscount}
          />
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
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
            <DiscountStats discounts={discounts} />
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Sheet */}
      {selectedDiscount && (
        <DiscountFormSheet
          discount={selectedDiscount}
          mode="edit"
          onSuccess={handleUpdateDiscount}
          open={editSheetOpen}
          onOpenChange={setEditSheetOpen}
        />
      )}
    </div>
  )
}
