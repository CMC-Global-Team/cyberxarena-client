"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit } from "lucide-react"
import { Product, ProductDTO, UpdateProductRequestDTO, productsApi } from "@/lib/products"
import { useToast } from "@/hooks/use-toast"

interface ProductFormSheetProps {
  product?: Product
  onSuccess?: () => void
  trigger?: React.ReactNode
}

const categories = [
  "Đồ uống",
  "Đồ ăn nhanh", 
  "Đồ ăn vặt",
  "Thuốc lá",
  "Khác"
]

export function ProductFormSheet({ product, onSuccess, trigger }: ProductFormSheetProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProductDTO>({
    itemName: "",
    itemCategory: "",
    price: 0,
    stock: 0,
    supplierName: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    if (product) {
      setFormData({
        itemName: product.itemName,
        itemCategory: product.itemCategory || "",
        price: product.price,
        stock: product.stock,
        supplierName: product.supplierName || ""
      })
    } else {
      setFormData({
        itemName: "",
        itemCategory: "",
        price: 0,
        stock: 0,
        supplierName: ""
      })
    }
  }, [product, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (product) {
        // Cập nhật sản phẩm
        const updateData: UpdateProductRequestDTO = {
          itemName: formData.itemName,
          itemCategory: formData.itemCategory || undefined,
          price: formData.price,
          stock: formData.stock,
          supplierName: formData.supplierName || undefined
        }
        await productsApi.update(product.itemId, updateData)
        toast({
          title: "Thành công",
          description: "Cập nhật sản phẩm thành công",
        })
      } else {
        // Tạo sản phẩm mới
        await productsApi.create(formData)
        toast({
          title: "Thành công", 
          description: "Tạo sản phẩm mới thành công",
        })
      }
      
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = product ? (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Thêm sản phẩm
    </Button>
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </SheetTitle>
          <SheetDescription>
            {product 
              ? "Cập nhật thông tin sản phẩm" 
              : "Nhập thông tin sản phẩm mới"
            }
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="itemName">Tên sản phẩm *</Label>
            <Input
              id="itemName"
              value={formData.itemName}
              onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
              placeholder="Nhập tên sản phẩm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemCategory">Danh mục</Label>
            <Select 
              value={formData.itemCategory} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, itemCategory: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Giá (VNĐ) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="1000"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              placeholder="Nhập giá sản phẩm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Số lượng tồn kho *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
              placeholder="Nhập số lượng"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplierName">Nhà cung cấp</Label>
            <Input
              id="supplierName"
              value={formData.supplierName}
              onChange={(e) => setFormData(prev => ({ ...prev, supplierName: e.target.value }))}
              placeholder="Nhập tên nhà cung cấp"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Đang xử lý..." : (product ? "Cập nhật" : "Tạo mới")}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
