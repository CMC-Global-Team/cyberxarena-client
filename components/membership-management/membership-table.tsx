"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, IdCard, ArrowUpDown, Users } from "lucide-react"
import type { MembershipCard } from "@/lib/memberships"
import { MembershipDeleteConfirmationModal } from "./membership-delete-confirmation-modal"

interface MembershipTableProps {
  memberships: MembershipCard[]
  loading?: boolean
  onEdit: (membership: MembershipCard) => void
  onDelete: (id: number) => Promise<void>
  onCheckEligibleCustomers?: (membership: MembershipCard) => void
}

export function MembershipTable({ memberships, loading, onEdit, onDelete, onCheckEligibleCustomers }: MembershipTableProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState<MembershipCard | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Sort memberships by recharge threshold (ascending)
  const sortedMemberships = useMemo(() => {
    return [...memberships].sort((a, b) => a.rechargeThreshold - b.rechargeThreshold)
  }, [memberships])

  const handleDeleteClick = (membership: MembershipCard) => {
    setSelectedMembership(membership)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedMembership) return
    
    setDeleting(true)
    try {
      await onDelete(selectedMembership.membershipCardId)
    } catch (error) {
      console.error("Error deleting membership:", error)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thẻ thành viên</CardTitle>
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách thẻ thành viên</CardTitle>
              <CardDescription>
                Quản lý các gói thẻ thành viên trong hệ thống (đã sắp xếp theo ngưỡng nạp tiền)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowUpDown className="h-4 w-4" />
              <span>Sắp xếp tự động</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {memberships.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <IdCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có thẻ thành viên nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên thẻ thành viên</TableHead>
                  <TableHead>Ngưỡng nạp tiền</TableHead>
                  <TableHead>Giảm giá</TableHead>
                  <TableHead>Loại giảm giá</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Mặc định</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMemberships.map((m) => (
                  <TableRow key={m.membershipCardId}>
                    <TableCell className="font-medium">#{m.membershipCardId}</TableCell>
                    <TableCell className="font-medium">{m.membershipCardName}</TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {new Intl.NumberFormat('vi-VN', { 
                          style: 'currency', 
                          currency: 'VND' 
                        }).format(m.rechargeThreshold)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {m.discountName ? (
                        <Badge variant="secondary">{m.discountName}</Badge>
                      ) : (
                        <Badge variant="outline">Không có</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {m.discountType ? (
                        <Badge variant={m.discountType === 'Percentage' ? 'default' : 'secondary'}>
                          {m.discountType === 'Percentage' ? 'Phần trăm' : 'Cố định'}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {m.discountValue !== null && m.discountValue !== undefined && !isNaN(m.discountValue) ? (
                        m.discountType === 'Percentage' ? (
                          <span className="font-medium">{m.discountValue}%</span>
                        ) : (
                          <span className="font-medium">
                            {new Intl.NumberFormat('vi-VN', { 
                              style: 'currency', 
                              currency: 'VND' 
                            }).format(m.discountValue)}
                          </span>
                        )
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {m.isDefault ? (
                        <Badge variant="default" className="bg-green-500/20 text-green-600">
                          Mặc định
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div data-tour="membership-actions">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(m)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          {onCheckEligibleCustomers && (
                            <DropdownMenuItem onClick={() => onCheckEligibleCustomers(m)}>
                              <Users className="h-4 w-4 mr-2" />
                              Khách hàng phù hợp
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDeleteClick(m)} className="text-destructive">
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
      <MembershipDeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        membership={selectedMembership}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </>
  )
}


