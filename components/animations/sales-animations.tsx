"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface SalesAnimationsProps {
  children: React.ReactNode
  className?: string
}

export function SalesAnimations({ children, className }: SalesAnimationsProps) {
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

      // Animate tabs
      gsap.fromTo(
        "[data-animate='tabs-container']",
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
            trigger: "[data-animate='tabs-container']",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate sale stats
      gsap.fromTo(
        "[data-animate='sale-stats']",
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
            trigger: "[data-animate='sale-stats']",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate sales table
      gsap.fromTo(
        "[data-animate='sales-table']",
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
            trigger: "[data-animate='sales-table']",
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
            trigger: "[data-animate='sales-table']",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate refund stats
      gsap.fromTo(
        "[data-animate='refund-stats']",
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
            trigger: "[data-animate='refund-stats']",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate refund table
      gsap.fromTo(
        "[data-animate='refund-table']",
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
            trigger: "[data-animate='refund-table']",
            start: "top 70%",
            end: "bottom 30%",
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
export function useSalesAnimation() {
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