"use client"

import { useLottie } from "lottie-react"
import { useEffect, useState } from "react"

interface LottieLoadingProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  text?: string
}

const LOTTIE_URL = "https://lottie.host/4b14f34d-d4b7-4fe6-80a7-7ac9d2ced14c/W9Ot6YcChQ.lottie"

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12", 
  lg: "w-16 h-16",
  xl: "w-24 h-24"
}

export function LottieLoading({ 
  className = "", 
  size = "md", 
  text = "Đang tải..." 
}: LottieLoadingProps) {
  const [animationData, setAnimationData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchAnimation = async () => {
      try {
        const response = await fetch(LOTTIE_URL)
        if (!response.ok) throw new Error('Failed to fetch animation')
        const data = await response.json()
        setAnimationData(data)
      } catch (err) {
        console.error('Error loading Lottie animation:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchAnimation()
  }, [])

  const { View } = useLottie({
    animationData,
    loop: true,
    autoplay: true,
    style: {
      width: '100%',
      height: '100%'
    }
  })

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground mt-2">{text}</p>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        {View}
      </div>
      {text && (
        <p className="text-sm text-muted-foreground mt-2 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// Full screen loading component
export function LottieFullScreenLoading({ text = "Đang tải dữ liệu..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-8 shadow-lg border">
        <LottieLoading size="xl" text={text} />
      </div>
    </div>
  )
}

// Inline loading component for tables/cards
export function LottieInlineLoading({ text = "Đang tải..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <LottieLoading size="lg" text={text} />
    </div>
  )
}
