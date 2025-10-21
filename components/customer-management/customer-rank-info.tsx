"use client"

// @ts-ignore
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
// @ts-ignore
import { Crown, TrendingUp, DollarSign, Target } from "lucide-react"
import { membershipRankApi, type MembershipRankInfoDTO } from "@/lib/memberships"
import { useNotice } from "@/components/notice-provider"

interface CustomerRankInfoProps {
  customerId: number
  customerName: string
  onRankUpdated?: () => void
}

export function CustomerRankInfo({ customerId, customerName, onRankUpdated }: CustomerRankInfoProps) {
  const { notify } = useNotice()
  const [rankInfo, setRankInfo] = useState<MembershipRankInfoDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)

  const loadRankInfo = async () => {
    try {
      setLoading(true)
      const info = await membershipRankApi.getRankInfo(customerId)
      setRankInfo(info)
    } catch (e: any) {
      notify({ type: "error", message: `Lỗi tải thông tin rank: ${e?.message || ''}` })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRank = async () => {
    try {
      setUpdating(true)
      await membershipRankApi.updateRank(customerId)
      notify({ type: "success", message: "Đã cập nhật rank thành công" })
      await loadRankInfo()
      onRankUpdated?.()
    } catch (e: any) {
      notify({ type: "error", message: `Lỗi cập nhật rank: ${e?.message || ''}` })
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    if (customerId) {
      loadRankInfo()
    }
  }, [customerId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Thông tin Rank
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!rankInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Thông tin Rank
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Không thể tải thông tin rank</p>
        </CardContent>
      </Card>
    )
  }

  const progressPercentage = rankInfo.nextMembershipCardThreshold 
    ? Math.min((rankInfo.currentTotalRecharge / rankInfo.nextMembershipCardThreshold) * 100, 100)
    : 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Thông tin Rank
        </CardTitle>
        <CardDescription>
          Thông tin rank và tiến độ nâng cấp cho {customerName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Rank */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Rank hiện tại</span>
            <Badge variant="default" className="bg-blue-500/20 text-blue-600">
              {rankInfo.currentMembershipCardName}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Tổng nạp: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rankInfo.currentTotalRecharge)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Số dư hiện tại: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rankInfo.currentBalance)}</span>
          </div>
        </div>

        {/* Next Rank Progress */}
        {rankInfo.nextMembershipCardName && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Rank tiếp theo</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-600">
                {rankInfo.nextMembershipCardName}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Tiến độ nâng cấp</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>
                  Cần thêm: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rankInfo.amountNeededForNextRank || 0)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Update Rank Button */}
        <div className="pt-4 border-t">
          <Button 
            onClick={handleUpdateRank} 
            disabled={updating}
            className="w-full"
            variant="outline"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {updating ? "Đang cập nhật..." : "Cập nhật Rank"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
