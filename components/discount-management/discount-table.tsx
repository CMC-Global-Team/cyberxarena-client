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

interface DiscountTableProps {
  discounts: Discount[]
  loading?: boolean
  onEdit: (discount: Discount) => void
  onDelete: (id: number) => void
}

export function DiscountTable({ discounts, loading, onEdit, onDelete }: DiscountTableProps) {
  const { toast } = useToast()

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa discount này?")) {
      try {
        await onDelete(id)
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
      }
    }
  }

  const formatDiscountValue = (discount: Discount) => {
    if (discount.discount_type === 'Percentage') {
      return `${discount.discount_value}%`
    }
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(discount.discount_value)
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
                <TableHead>Loại giảm giá</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.discount_id}>
                  <TableCell className="font-medium">
                    #{discount.discount_id}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={discount.discount_type === 'Percentage' ? 'default' : 'secondary'}
                      className="flex items-center gap-1 w-fit"
                    >
                      {discount.discount_type === 'Percentage' ? (
                        <Percent className="h-3 w-3" />
                      ) : (
                        <DollarSign className="h-3 w-3" />
                      )}
                      {discount.discount_type === 'Percentage' ? 'Phần trăm' : 'Cố định'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatDiscountValue(discount)}
                  </TableCell>
                  <TableCell className="text-right">
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
                          onClick={() => handleDelete(discount.discount_id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
