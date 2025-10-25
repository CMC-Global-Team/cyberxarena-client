"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface CustomerAnimationsProps {
  children: React.ReactNode
  className?: string
}

export function CustomerAnimations({ children, className }: CustomerAnimationsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Animate page header
      gsap.fromTo(
        "[data-animate='page-header']",
        {
          y: -30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        }
      )

      // Animate customer stats
      gsap.fromTo(
        "[data-animate='customer-stats']",
        {
          y: 50,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: "[data-animate='customer-stats']",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate balance warning
      gsap.fromTo(
        "[data-animate='balance-warning']",
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-animate='balance-warning']",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate customer table
      gsap.fromTo(
        "[data-animate='customer-table']",
        {
          y: 100,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-animate='customer-table']",
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate table rows
      gsap.fromTo(
        "[data-animate='table-row']",
        {
          x: -50,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-animate='customer-table']",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate pagination
      gsap.fromTo(
        "[data-animate='pagination']",
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-animate='pagination']",
            start: "top 80%",
            end: "bottom 20%",
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

// Hook for individual element animations
export function useCustomerAnimation() {
  const animateElement = (element: HTMLElement, animation: string) => {
    switch (animation) {
      case 'fadeInUp':
        gsap.fromTo(element, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        )
        break
      case 'fadeInLeft':
        gsap.fromTo(element,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        )
        break
      case 'fadeInRight':
        gsap.fromTo(element,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        )
        break
      case 'scaleIn':
        gsap.fromTo(element,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        )
        break
      case 'slideInDown':
        gsap.fromTo(element,
          { y: -50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }
        )
        break
    }
  }

  return { animateElement }
}