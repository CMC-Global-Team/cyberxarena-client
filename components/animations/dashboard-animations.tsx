"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface DashboardAnimationsProps {
  children: React.ReactNode
  className?: string
}

export function DashboardAnimations({ children, className }: DashboardAnimationsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const animateIfPresent = (selector: string, from: gsap.TweenVars, to: gsap.TweenVars) => {
        if (!containerRef.current) return
        const els = containerRef.current.querySelectorAll(selector)
        if (!els || els.length === 0) return

        const toOptions = { ...to }
        if (toOptions.scrollTrigger && typeof toOptions.scrollTrigger === "object") {
          toOptions.scrollTrigger = {
            ...toOptions.scrollTrigger,
            trigger: els[0],
          }
        }
        gsap.fromTo(els, from, toOptions)
      }

      // Page header animation
      animateIfPresent(
        "[data-animate='page-header']",
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      )

      // Dashboard stats animation
      animateIfPresent(
        "[data-animate='dashboard-stats']",
        { y: 50, opacity: 0, scale: 0.9 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "back.out(1.7)",
          scrollTrigger: {
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Stats cards animation
      animateIfPresent(
        "[data-animate='stats-card']",
        { y: 50, opacity: 0, scale: 0.9 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "back.out(1.7)",
          scrollTrigger: {
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // 3D Viewer animation
      animateIfPresent(
        "[data-animate='computer-3d-viewer']",
        { x: -100, opacity: 0, rotationY: -15 },
        { 
          x: 0, 
          opacity: 1, 
          rotationY: 0, 
          duration: 0.8, 
          ease: "power2.out",
          scrollTrigger: {
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Computer status animation
      animateIfPresent(
        "[data-animate='computer-status']",
        { x: 100, opacity: 0, rotationY: 15 },
        { 
          x: 0, 
          opacity: 1, 
          rotationY: 0, 
          duration: 0.8, 
          ease: "power2.out",
          scrollTrigger: {
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Grid container animation
      animateIfPresent(
        "[data-animate='grid-container']",
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: "power2.out",
          scrollTrigger: {
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Error state animation
      animateIfPresent(
        "[data-animate='error-state']",
        { scale: 0.9, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.5, 
          ease: "back.out(1.7)",
          scrollTrigger: {
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Loading state animation
      animateIfPresent(
        "[data-animate='loading-state']",
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.4, 
          ease: "power2.out",
          scrollTrigger: {
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Recent activities animation
      animateIfPresent(
        "[data-animate='recent-activities']",
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: "power2.out",
          scrollTrigger: {
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
