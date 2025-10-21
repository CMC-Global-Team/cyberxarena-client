"use client"

import { useState, useCallback } from "react"

interface UsePageLoadingReturn {
  isLoading: boolean
  showLoading: () => void
  hideLoading: () => void
  withPageLoading: <T>(fn: () => Promise<T>) => Promise<T>
}

export function usePageLoading(): UsePageLoadingReturn {
  const [isLoading, setIsLoading] = useState(false)

  const showLoading = useCallback(() => setIsLoading(true), [])
  const hideLoading = useCallback(() => setIsLoading(false), [])

  const withPageLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    showLoading()
    try {
      return await fn()
    } finally {
      hideLoading()
    }
  }, [showLoading, hideLoading])

  return {
    isLoading,
    showLoading,
    hideLoading,
    withPageLoading
  }
}
