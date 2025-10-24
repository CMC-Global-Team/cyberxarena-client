"use client"

import { HelpCircle } from "lucide-react"

interface TourTriggerProps {
  onClick: () => void
  className?: string
}

export function TourTrigger({ onClick, className = "" }: TourTriggerProps) {
  return (
    <HelpCircle 
      className={`h-6 w-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors ${className}`}
      onClick={onClick}
      title="Hướng dẫn sử dụng"
    />
  )
}
