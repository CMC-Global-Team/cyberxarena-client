"use client"

import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TourTriggerProps {
  onClick: () => void
  className?: string
}

export function TourTrigger({ onClick, className = "" }: TourTriggerProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle 
            className={`h-6 w-6 text-muted-foreground cursor-pointer hover:text-primary transition-colors ${className}`}
            onClick={onClick}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Hướng dẫn sử dụng</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
