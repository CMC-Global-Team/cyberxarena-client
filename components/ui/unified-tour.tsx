"use client"

import { useEffect, useRef } from "react"
// @ts-ignore
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

interface UnifiedTourProps {
  isActive: boolean
  onComplete?: () => void
  steps: Array<{
    element: string
    popover: {
      title: string
      description: string
      side?: "top" | "bottom" | "left" | "right"
      align?: "start" | "center" | "end"
    }
  }>
}

export function UnifiedTour({ isActive, onComplete, steps }: UnifiedTourProps) {
  const driverRef = useRef<any>(null)

  useEffect(() => {
    if (!isActive) return

    driverRef.current = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      progressText: 'Bước {{current}} của {{total}}',
      nextBtnText: 'Tiếp theo',
      prevBtnText: 'Trước đó',
      doneBtnText: 'Hoàn thành',
      closeBtnText: 'Đóng',
      steps: steps,
      onDestroyed: () => {
        onComplete?.()
      }
    })

    driverRef.current.drive()

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy()
      }
    }
  }, [isActive, onComplete, steps])

  return null
}
