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
  pageType = 'customers'
}: OptimizedPageLayoutProps) {
  return (
    <div className="relative min-h-screen">
      {/* Main content */}
      <div className={`transition-opacity duration-200 ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
        {children}
      </div>
    </div>
  )
}
