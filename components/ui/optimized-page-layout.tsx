"use client"

import { ReactNode } from "react"

interface OptimizedPageLayoutProps {
  children: ReactNode
  isLoading?: boolean
  loadingMessage?: string
  pageType?: 'customers' | 'products' | 'computers' | 'sessions' | 'memberships' | 'discounts' | 'sales' | 'revenue'
}

export function OptimizedPageLayout({ 
  children, 
  isLoading = false, 
  loadingMessage = "Đang tải dữ liệu...",
  pageType = 'customers'
}: OptimizedPageLayoutProps) {
  return (
    <div className="relative min-h-screen">
      {/* Main content - always visible */}
      {children}
    </div>
  )
}
