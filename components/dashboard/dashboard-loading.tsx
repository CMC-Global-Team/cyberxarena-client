"use client"

import { Loader2 } from "lucide-react"

export function DashboardLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    </div>
  )
}
