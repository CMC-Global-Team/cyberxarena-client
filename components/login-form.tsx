"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginTour } from "@/components/login-tour"
import { HelpCircle } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showTour, setShowTour] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (username === "admin" && password === "admin") {
      // Store auth state
      localStorage.setItem("isAuthenticated", "true")
      router.push("/dashboard")
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng")
      setIsLoading(false)
    }
  }

  const handleStartTour = () => {
    setShowTour(true)
  }

  const handleTourComplete = () => {
    setShowTour(false)
  }

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Đăng nhập</CardTitle>
              <CardDescription>Nhập thông tin đăng nhập để truy cập hệ thống</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartTour}
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Hướng dẫn
            </Button>
          </div>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-secondary border-border"
            />
          </div>
          {error && (
            <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 px-3 py-2">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </CardContent>
    </Card>
    
    <LoginTour isVisible={showTour} onComplete={handleTourComplete} />
    </>
  )
}
