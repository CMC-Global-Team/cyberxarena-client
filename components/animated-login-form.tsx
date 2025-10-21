"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginTour } from "@/components/login-tour"

export function AnimatedLoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Refs for animation
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const usernameInputRef = useRef<HTMLDivElement>(null)
  const passwordInputRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Set initial states
    gsap.set(cardRef.current, { 
      scale: 0.8, 
      opacity: 0, 
      rotationY: -15,
      transformOrigin: "center center"
    })
    
    gsap.set([titleRef.current, descriptionRef.current], { 
      y: 30, 
      opacity: 0 
    })
    
    gsap.set(formRef.current, { 
      y: 50, 
      opacity: 0 
    })
    
    gsap.set([usernameInputRef.current, passwordInputRef.current], { 
      x: -50, 
      opacity: 0 
    })
    
    gsap.set(buttonRef.current, { 
      scale: 0.8, 
      opacity: 0 
    })

    // Create timeline
    const tl = gsap.timeline({ delay: 0.3 })

    // Card entrance animation with 3D effect
    tl.to(cardRef.current, {
      scale: 1,
      opacity: 1,
      rotationY: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    })

    // Title and description animation
    tl.to([titleRef.current, descriptionRef.current], {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.4")

    // Form animation
    tl.to(formRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")

    // Inputs staggered animation
    tl.to([usernameInputRef.current, passwordInputRef.current], {
      x: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.15,
      ease: "power2.out"
    }, "-=0.2")

    // Button animation
    tl.to(buttonRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, "-=0.1")

    // Add floating animation
    tl.to(cardRef.current, {
      y: -3,
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    }, "-=0.5")

    return () => {
      tl.kill()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Animate button click
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      })
    }

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (username === "admin" && password === "admin") {
      // Success animation
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          scale: 1.05,
          rotationY: 5,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(cardRef.current, {
              scale: 1,
              rotationY: 0,
              duration: 0.3,
              ease: "power2.out"
            })
          }
        })
      }
      
      // Store auth state
      localStorage.setItem("isAuthenticated", "true")
      router.push("/dashboard")
    } else {
      // Error animation
      if (errorRef.current) {
        gsap.fromTo(errorRef.current, 
          { scale: 0, opacity: 0, y: -20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
        )
      }
      
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          x: -10,
          duration: 0.1,
          yoyo: true,
          repeat: 3,
          ease: "power2.inOut"
        })
      }
      
      setError("Tên đăng nhập hoặc mật khẩu không đúng")
      setIsLoading(false)
    }
  }

  const handleInputFocus = (inputRef: React.RefObject<HTMLDivElement>) => {
    if (inputRef.current) {
      gsap.to(inputRef.current, {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleInputBlur = (inputRef: React.RefObject<HTMLDivElement>) => {
    if (inputRef.current) {
      gsap.to(inputRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  return (
    <>
      <div ref={containerRef} className="relative">
        <Card 
          ref={cardRef}
          className="border-border bg-card shadow-2xl"
        >
          <CardHeader>
            <CardTitle ref={titleRef} className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Đăng nhập
            </CardTitle>
            <CardDescription ref={descriptionRef} className="text-muted-foreground">
              Nhập thông tin đăng nhập để truy cập hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div 
                ref={usernameInputRef}
                className="space-y-2"
                onFocus={() => handleInputFocus(usernameInputRef)}
                onBlur={() => handleInputBlur(usernameInputRef)}
              >
                <Label htmlFor="username" className="text-sm font-medium">Tên đăng nhập</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-secondary border-border transition-all duration-200 hover:bg-secondary/80 focus:bg-secondary/80"
                />
              </div>
              <div 
                ref={passwordInputRef}
                className="space-y-2"
                onFocus={() => handleInputFocus(passwordInputRef)}
                onBlur={() => handleInputBlur(passwordInputRef)}
              >
                <Label htmlFor="password" className="text-sm font-medium">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-secondary border-border transition-all duration-200 hover:bg-secondary/80 focus:bg-secondary/80"
                />
              </div>
              {error && (
                <div 
                  ref={errorRef}
                  className="text-destructive text-sm bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-md"
                >
                  {error}
                </div>
              )}
              <Button
                ref={buttonRef}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <LoginTour />
    </>
  )
}
