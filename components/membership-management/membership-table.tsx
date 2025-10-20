"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, IdCard } from "lucide-react"
import type { MembershipCard } from "@/lib/memberships"

interface MembershipTableProps {
  memberships: MembershipCard[]
  loading?: boolean
  discountLabelById?: Record<number, string>
  onEdit: (membership: MembershipCard) => void
  onDelete: (id: number) => Promise<void>
}

export function MembershipTable({ memberships, loading, discountLabelById = {}, onEdit, onDelete }: MembershipTableProps) {
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this membership?")) {
      await onDelete(id)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Memberships</CardTitle>
          <CardDescription>Loading data...</CardDescription>
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
        <CardTitle>Memberships</CardTitle>
        <CardDescription>Manage membership card packages</CardDescription>
      </CardHeader>
      <CardContent>
        {memberships.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <IdCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No memberships yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships.map((m) => (
                <TableRow key={m.membership_card_id}>
                  <TableCell className="font-medium">#{m.membership_card_id}</TableCell>
                  <TableCell className="font-medium">{m.membership_card_name}</TableCell>
                  <TableCell>
                    {m.discount_id ? (
                      <Badge variant="secondary">{discountLabelById[m.discount_id] || `Discount #${m.discount_id}`}</Badge>
                    ) : (
                      <Badge variant="outline">None</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(m)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(m.membership_card_id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
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


