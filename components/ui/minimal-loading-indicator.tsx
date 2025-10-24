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
  position = 'center' 
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
        return 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    }
  }

  return (
    <div className={`${getPositionClasses()} z-50`}>
      <div className="flex flex-col items-center space-y-3">
        <Spinner className="h-8 w-8 text-primary" />
        {message && (
          <span className="text-sm text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
            {message}
          </span>
        )}
      </div>
    </div>
  )
}
