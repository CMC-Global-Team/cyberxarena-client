"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { DashboardTour } from "@/components/dashboard-tour"
import { MinimalLoadingIndicator } from "@/components/ui/minimal-loading-indicator"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      // Chỉ hiển thị tour khi vào trang dashboard chính
      if (pathname === "/dashboard") {
        setShowTour(true)
      }
    } else {
      router.push("/")
    }
    setIsLoading(false)
  }, [router, pathname])

  // Always show the layout, just show loading indicator when needed

  if (!isAuthenticated) {
    return null
  }

  const handleTourComplete = () => {
    setShowTour(false)
  }

  return (
    <>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      
      <MinimalLoadingIndicator 
        isLoading={isLoading} 
        message="Đang tải dữ liệu..."
        position="center"
      />
      
      {showTour && <DashboardTour onComplete={handleTourComplete} />}
    </>
  )
}
