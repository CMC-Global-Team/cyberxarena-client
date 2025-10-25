"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface DiscountAnimationsProps {
  children: React.ReactNode
  className?: string
}

export function DiscountAnimations({ children, className }: DiscountAnimationsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Page header animation
      gsap.fromTo(
        "[data-animate='page-header']",
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      )

      // Tabs navigation animation
      gsap.fromTo(
        "[data-animate='tabs-navigation']",
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5, 
          delay: 0.2, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-animate='tabs-navigation']",
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Discount table animation
      gsap.fromTo(
        "[data-animate='discount-table']",
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-animate='discount-table']",
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Table rows animation
      gsap.fromTo(
        "[data-animate='table-row']",
        { x: -50, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.05, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-animate='discount-table']",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Discount stats animation
      gsap.fromTo(
        "[data-animate='discount-stats']",
        { y: 50, opacity: 0, scale: 0.9 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: "[data-animate='discount-stats']",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Stats cards animation
      gsap.fromTo(
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
            trigger: "[data-animate='stats-card']",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Refresh button animation
      gsap.fromTo(
        "[data-animate='refresh-button']",
        { scale: 0.9, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.4, 
          delay: 0.3, 
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: "[data-animate='refresh-button']",
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Add button animation
      gsap.fromTo(
        "[data-animate='add-button']",
        { scale: 0.9, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.4, 
          delay: 0.4, 
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: "[data-animate='add-button']",
            start: "top 90%",
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