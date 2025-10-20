"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { MoreHorizontal, Edit, Trash2, Package } from "lucide-react"
import { Product, productsApi } from "@/lib/products"
import { useToast } from "@/hooks/use-toast"
import { ProductFormSheet } from "./product-form-sheet"

interface ProductActionsSheetProps {
  product: Product
  onSuccess?: () => void
}

export function ProductActionsSheet({ product, onSuccess }: ProductActionsSheetProps) {
  const [open, setOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await productsApi.delete(product.itemId)
      toast({
        title: "Thành công",
        description: "Xóa sản phẩm thành công",
      })
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa sản phẩm",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Chi tiết sản phẩm
          </SheetTitle>
          <SheetDescription>
            Thông tin chi tiết và các thao tác với sản phẩm
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Thông tin sản phẩm */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">ID</h4>
                <p className="text-sm">{product.itemId}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Tên sản phẩm</h4>
                <p className="text-sm font-medium">{product.itemName}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Danh mục</h4>
                <p className="text-sm">{product.itemCategory || "Chưa phân loại"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Giá</h4>
                <p className="text-sm font-medium text-green-600">{formatPrice(product.price)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Tồn kho</h4>
                <p className={`text-sm font-medium ${product.stock <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                  {product.stock} sản phẩm
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Nhà cung cấp</h4>
                <p className="text-sm">{product.supplierName || "Chưa có"}</p>
              </div>
            </div>
          </div>

          {/* Cảnh báo tồn kho thấp */}
          {product.stock <= 10 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                ⚠️ Sản phẩm sắp hết hàng! Cần nhập thêm.
              </p>
            </div>
          )}

          {/* Các thao tác */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Thao tác</h4>
            <div className="flex gap-2">
              <ProductFormSheet 
                product={product} 
                onSuccess={() => {
                  setOpen(false)
                  onSuccess?.()
                }}
                trigger={
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                }
              />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="flex-1">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa sản phẩm "{product.itemName}"? 
                      Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deleteLoading ? "Đang xóa..." : "Xóa"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
