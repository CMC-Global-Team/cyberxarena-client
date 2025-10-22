"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Percent, DollarSign } from "lucide-react"
import { Discount } from "@/lib/discounts"
import { useToast } from "@/hooks/use-toast"
import { DiscountDeleteConfirmationModal } from "./discount-delete-confirmation-modal"

interface DiscountTableProps {
  discounts: Discount[]
  loading?: boolean
  onEdit: (discount: Discount) => void
  onDelete: (id: number) => void
}

export function DiscountTable({ discounts, loading, onEdit, onDelete }: DiscountTableProps) {
  const { toast } = useToast()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteClick = (discount: Discount) => {
    setSelectedDiscount(discount)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedDiscount) return
    
    setDeleting(true)
    try {
      await onDelete(selectedDiscount.discountId)
      toast({
        title: "Thành công",
        description: "Đã xóa discount thành công",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa discount",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const formatDiscountValue = (discount: Discount) => {
    if (discount.discountType === 'Percentage') {
      return `${discount.discountValue}%`
    }
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(discount.discountValue || 0)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danh sách giảm giá</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách giảm giá</CardTitle>
          <CardDescription>
            Quản lý các loại giảm giá trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {discounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Percent className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có discount nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên giảm giá</TableHead>
                  <TableHead>Loại giảm giá</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts.map((discount) => (
                  <TableRow key={discount.discountId}>
                    <TableCell className="font-medium">
                      #{discount.discountId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {discount.discountName}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={discount.discountType === 'Percentage' ? 'default' : 'secondary'}
                        className="flex items-center gap-1 w-fit"
                      >
                        {discount.discountType === 'Percentage' ? (
                          <Percent className="h-3 w-3" />
                        ) : (
                          <DollarSign className="h-3 w-3" />
                        )}
                        {discount.discountType === 'Percentage' ? 'Phần trăm' : 'Cố định'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDiscountValue(discount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div data-tour="discount-actions">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(discount)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(discount)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <DiscountDeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        discount={selectedDiscount}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </>
  )
}
