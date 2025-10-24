"use client"

import { Spinner } from "@/components/ui/spinner"

interface MinimalLoadingIndicatorProps {
  isLoading: boolean
  message?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
}

export function MinimalLoadingIndicator({ 
  isLoading, 
  message = "Đang tải...", 
  position = 'top-right' 
}: MinimalLoadingIndicatorProps) {
  if (!isLoading) return null

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'fixed top-4 right-4'
      case 'top-left':
        return 'fixed top-4 left-4'
      case 'bottom-right':
        return 'fixed bottom-4 right-4'
      case 'bottom-left':
        return 'fixed bottom-4 left-4'
      case 'center':
        return 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      default:
        return 'fixed top-4 right-4'
    }
  }

  return (
    <div className={`${getPositionClasses()} z-50`}>
      <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2">
        <Spinner className="h-4 w-4" />
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    </div>
  )
}
