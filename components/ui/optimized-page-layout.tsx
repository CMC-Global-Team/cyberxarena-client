"use client"

import { ReactNode } from "react"
import { MinimalLoadingIndicator } from "./minimal-loading-indicator"

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
      <div className={`transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        {children}
      </div>
      
      {/* Minimal loading indicator */}
      <MinimalLoadingIndicator 
        isLoading={isLoading} 
        message={loadingMessage}
        position="center"
      />
    </div>
  )
}
