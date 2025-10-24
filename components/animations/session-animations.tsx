"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface SessionAnimationsProps {
  children: React.ReactNode
  className?: string
}

export function SessionAnimations({ children, className }: SessionAnimationsProps) {
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

      // Animate stats cards
      gsap.fromTo(
        "[data-animate='stats-card']",
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
            trigger: "[data-animate='stats-card']",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate session table
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
            trigger: "[data-animate='table-container']",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate search and filter controls
      gsap.fromTo(
        "[data-animate='search-controls']",
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.2,
          ease: "power2.out"
        }
      )

      // Animate action buttons
      gsap.fromTo(
        "[data-animate='action-buttons']",
        {
          scale: 0.95,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          delay: 0.3,
          ease: "back.out(1.7)"
        }
      )

      // Animate session cards
      gsap.fromTo(
        "[data-animate='session-card']",
        {
          y: 30,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-animate='session-card']",
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate duration indicators
      gsap.fromTo(
        "[data-animate='duration-indicator']",
        {
          scale: 0.8,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: "[data-animate='duration-indicator']",
            start: "top 90%",
            end: "bottom 10%",
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
export function useSessionAnimation() {
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
