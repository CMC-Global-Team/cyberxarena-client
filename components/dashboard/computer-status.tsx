"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComputerStatus } from "@/lib/dashboard"

interface ComputerStatusProps {
  status: ComputerStatus
}

export function ComputerStatusCard({ status }: ComputerStatusProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Trạng thái máy</CardTitle>
        <CardDescription>Tình trạng hoạt động của các máy</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-primary" />
              <span className="text-sm text-foreground">Đang sử dụng</span>
            </div>
            <span className="text-sm font-medium text-foreground">{formatNumber(status.activeComputers)} máy</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-muted" />
              <span className="text-sm text-foreground">Trống</span>
            </div>
            <span className="text-sm font-medium text-foreground">{formatNumber(status.availableComputers)} máy</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-destructive" />
              <span className="text-sm text-foreground">Bảo trì</span>
            </div>
            <span className="text-sm font-medium text-foreground">{formatNumber(status.maintenanceComputers)} máy</span>
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Tỷ lệ sử dụng</span>
              <span className="text-sm font-medium text-foreground">{status.utilizationRate}</span>
            </div>
            <div className="h-2 bg-secondary overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: status.utilizationRate }} 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
