"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Table, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usePageLoading } from "@/hooks/use-page-loading"
import { PageLoadingOverlay } from "@/components/ui/page-loading-overlay"
import { membershipsApi, type MembershipCard, type MembershipCardDTO } from "@/lib/memberships"
import { discountsApi, type Discount } from "@/lib/discounts"
import { MembershipTable } from "@/components/membership-management/membership-table"
import { MembershipStats } from "@/components/membership-management/membership-stats"
import { MembershipFormSheet } from "@/components/membership-management/membership-form-sheet"
import { MembershipTour } from "@/components/membership-management/membership-tour"
import { EligibleCustomersModal } from "@/components/membership-management/eligible-customers-modal"
import { HelpCircle } from "lucide-react"

export default function MembershipsPage() {
  const { toast } = useToast()
  const { withPageLoading, isLoading } = usePageLoading()
  const [memberships, setMemberships] = useState<MembershipCard[]>([])
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selected, setSelected] = useState<MembershipCard | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const [eligibleCustomersOpen, setEligibleCustomersOpen] = useState(false)
  const [selectedMembershipForEligible, setSelectedMembershipForEligible] = useState<MembershipCard | null>(null)
  const [updatingCustomers, setUpdatingCustomers] = useState(false)


  const loadData = async () => {
    try {
      const [m, d] = await withPageLoading(() => Promise.all([
        membershipsApi.getAll(),
        discountsApi.getAll().catch(() => [] as Discount[]),
      ]))
      setMemberships(m)
      setDiscounts(d)
    } catch (e: any) {
      toast({ title: "Lỗi", description: e?.message || "Không thể tải dữ liệu thẻ thành viên", variant: "destructive" })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
  }

  const handleCreate = async (data: MembershipCardDTO) => {
    try {
      await withPageLoading(() => membershipsApi.create(data))
      toast({ title: "Thành công", description: "Đã tạo thẻ thành viên thành công" })
      await loadData()
    } catch (e: any) {
      toast({ title: "Lỗi", description: e?.message || "Không thể tạo thẻ thành viên", variant: "destructive" })
      throw e
    }
  }

  const handleUpdate = async (data: MembershipCardDTO) => {
    if (!selected) return
    try {
      await withPageLoading(() => membershipsApi.update(selected.membershipCardId, {
        membershipCardName: data.membershipCardName,
        discountId: data.discountId,
        rechargeThreshold: data.rechargeThreshold,
        isDefault: data.isDefault
      }))
      toast({ title: "Thành công", description: "Đã cập nhật thẻ thành viên thành công" })
      await loadData()
    } catch (e: any) {
      toast({ title: "Lỗi", description: e?.message || "Không thể cập nhật thẻ thành viên", variant: "destructive" })
      throw e
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await withPageLoading(() => membershipsApi.delete(id))
      toast({ title: "Thành công", description: "Đã xóa thẻ thành viên thành công" })
      await loadData()
    } catch (e: any) {
      toast({ title: "Lỗi", description: e?.message || "Không thể xóa thẻ thành viên", variant: "destructive" })
      throw e
    }
  }

  const handleEdit = (m: MembershipCard) => {
    setSelected(m)
    setEditOpen(true)
  }

  const handleCheckEligibleCustomers = (membership: MembershipCard) => {
    setSelectedMembershipForEligible(membership)
    setEligibleCustomersOpen(true)
  }

  const handleUpdateEligibleCustomers = async (selectedCustomerIds: number[]) => {
    if (!selectedMembershipForEligible) return

    setUpdatingCustomers(true)
    try {
      await membershipsApi.updateEligibleCustomers(selectedMembershipForEligible.membershipCardId, selectedCustomerIds)
      toast({ 
        title: "Thành công", 
        description: `Đã cập nhật ${selectedCustomerIds.length} khách hàng lên gói "${selectedMembershipForEligible.membershipCardName}"` 
      })
      await loadData()
    } catch (e: any) {
      toast({ 
        title: "Lỗi", 
        description: e?.message || "Không thể cập nhật khách hàng", 
        variant: "destructive" 
      })
    } finally {
      setUpdatingCustomers(false)
    }
  }

  return (
    <div className="space-y-6 p-6 relative">
      <PageLoadingOverlay isLoading={isLoading} pageType="memberships" />
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight" data-tour="page-title">Quản lý thẻ thành viên</h1>
            <HelpCircle 
              className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-600 transition-colors" 
              onClick={() => setShowTour(true)}
              title="Hướng dẫn sử dụng"
            />
          </div>
          <p className="text-muted-foreground">Quản lý các gói thẻ thành viên và giảm giá liên quan</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} data-tour="refresh-btn">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <div data-tour="add-membership-btn">
            <MembershipFormSheet mode="add" onSubmit={handleCreate} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="table" className="space-y-4">
        <TabsList data-tour="tabs-navigation">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Danh sách
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Thống kê
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <div data-tour="membership-table">
            <MembershipTable 
              memberships={memberships}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCheckEligibleCustomers={handleCheckEligibleCustomers}
            />
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div data-tour="membership-stats">
            {loading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
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
              <MembershipStats memberships={memberships} />
            )}
          </div>
        </TabsContent>
      </Tabs>

      {selected && (
        <MembershipFormSheet membership={selected} mode="edit" onSubmit={handleUpdate} open={editOpen} onOpenChange={setEditOpen} />
      )}

      <MembershipTour 
        isActive={showTour} 
        onComplete={() => setShowTour(false)} 
      />

      {selectedMembershipForEligible && (
        <EligibleCustomersModal
          open={eligibleCustomersOpen}
          onOpenChange={setEligibleCustomersOpen}
          membershipCardId={selectedMembershipForEligible.membershipCardId}
          membershipCardName={selectedMembershipForEligible.membershipCardName}
          onConfirm={handleUpdateEligibleCustomers}
          loading={updatingCustomers}
        />
      )}
    </div>
  )
}


