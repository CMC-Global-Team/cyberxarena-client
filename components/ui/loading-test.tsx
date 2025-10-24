"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { OptimizedPageLayout } from "./optimized-page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LoadingTest() {
  const [isLoading, setIsLoading] = useState(false)

  const handleTestLoading = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <OptimizedPageLayout isLoading={isLoading} pageType="customers">
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Loading Optimization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Click the button below to test the minimal loading indicator.
              The layout should remain visible with only a small loading indicator in the top-right corner.
            </p>
            <Button onClick={handleTestLoading} disabled={isLoading}>
              {isLoading ? "Loading..." : "Test Loading (3 seconds)"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </OptimizedPageLayout>
  )
}
