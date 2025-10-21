"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

export function BackgroundAnimations() {
  const containerRef = useRef<HTMLDivElement>(null)
  const circle1Ref = useRef<HTMLDivElement>(null)
  const circle2Ref = useRef<HTMLDivElement>(null)
  const circle3Ref = useRef<HTMLDivElement>(null)
  const square1Ref = useRef<HTMLDivElement>(null)
  const square2Ref = useRef<HTMLDivElement>(null)
  const triangle1Ref = useRef<HTMLDivElement>(null)
  const triangle2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create infinite rolling animations
    const tl = gsap.timeline({ repeat: -1 })

    // Circle 1 - Rolling left to right
    tl.to(circle1Ref.current, {
      x: "100vw",
      rotation: 360,
      duration: 8,
      ease: "none"
    })

    // Circle 2 - Rolling right to left
    tl.to(circle2Ref.current, {
      x: "-100vw",
      rotation: -360,
      duration: 10,
      ease: "none"
    }, 0)

    // Circle 3 - Rolling up and down
    tl.to(circle3Ref.current, {
      y: "-100vh",
      rotation: 180,
      duration: 12,
      ease: "none"
    }, 0)

    // Square 1 - Rolling diagonal
    tl.to(square1Ref.current, {
      x: "100vw",
      y: "100vh",
      rotation: 720,
      duration: 15,
      ease: "none"
    }, 0)

    // Square 2 - Rolling opposite diagonal
    tl.to(square2Ref.current, {
      x: "-100vw",
      y: "-100vh",
      rotation: -720,
      duration: 18,
      ease: "none"
    }, 0)

    // Triangle 1 - Rolling in figure 8
    tl.to(triangle1Ref.current, {
      motionPath: {
        path: "M0,0 Q50,50 100,0 Q150,-50 200,0 Q250,50 300,0 Q350,-50 400,0",
        autoRotate: true
      },
      duration: 20,
      ease: "none"
    }, 0)

    // Triangle 2 - Rolling in circle
    tl.to(triangle2Ref.current, {
      rotation: 360,
      transformOrigin: "center center",
      duration: 6,
      ease: "none"
    }, 0)

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Rolling Circles */}
      <div
        ref={circle1Ref}
        className="absolute w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm"
        style={{ top: "20%", left: "-100px" }}
      />
      <div
        ref={circle2Ref}
        className="absolute w-12 h-12 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-sm"
        style={{ top: "60%", left: "100vw" }}
      />
      <div
        ref={circle3Ref}
        className="absolute w-20 h-20 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-sm"
        style={{ top: "100vh", left: "30%" }}
      />

      {/* Rolling Squares */}
      <div
        ref={square1Ref}
        className="absolute w-14 h-14 bg-gradient-to-r from-yellow-500/20 to-red-500/20 blur-sm"
        style={{ top: "10%", left: "-100px" }}
      />
      <div
        ref={square2Ref}
        className="absolute w-18 h-18 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-sm"
        style={{ top: "80%", left: "100vw" }}
      />

      {/* Rolling Triangles */}
      <div
        ref={triangle1Ref}
        className="absolute w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-gradient-to-r border-b-blue-500/20 blur-sm"
        style={{ top: "40%", left: "10%" }}
      />
      <div
        ref={triangle2Ref}
        className="absolute w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-gradient-to-r border-b-purple-500/20 blur-sm"
        style={{ top: "70%", left: "80%" }}
      />
    </div>
  )
}

export function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !isClient) return

    const particles = containerRef.current.children
    const tl = gsap.timeline({ repeat: -1 })

    Array.from(particles).forEach((particle, index) => {
      // Fixed floating motion to avoid hydration mismatch
      const baseX = (index * 13) % 200 - 100
      const baseY = (index * 17) % 200 - 100
      const baseRotation = (index * 23) % 360
      const baseDuration = 3 + (index * 0.3)
      
      tl.to(particle, {
        x: baseX,
        y: baseY,
        rotation: baseRotation,
        duration: baseDuration,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true
      }, index * 0.2)
    })

    return () => {
      tl.kill()
    }
  }, [isClient])

  if (!isClient) {
    return null
  }

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 15 }, (_, i) => {
        const top = (i * 7) % 100
        const left = (i * 11) % 100
        return (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-sm"
            style={{
              top: `${top}%`,
              left: `${left}%`,
            }}
          />
        )
      })}
    </div>
  )
}

export function RotatingElements() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gear1Ref = useRef<HTMLDivElement>(null)
  const gear2Ref = useRef<HTMLDivElement>(null)
  const gear3Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({ repeat: -1 })

    // Gear 1 - Clockwise rotation
    tl.to(gear1Ref.current, {
      rotation: 360,
      duration: 4,
      ease: "none"
    })

    // Gear 2 - Counter-clockwise rotation
    tl.to(gear2Ref.current, {
      rotation: -360,
      duration: 6,
      ease: "none"
    }, 0)

    // Gear 3 - Fast rotation
    tl.to(gear3Ref.current, {
      rotation: 720,
      duration: 3,
      ease: "none"
    }, 0)

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        ref={gear1Ref}
        className="absolute w-24 h-24 border-4 border-blue-500/20 rounded-full"
        style={{ top: "15%", left: "10%" }}
      >
        <div className="absolute inset-2 border-2 border-blue-500/20 rounded-full" />
        <div className="absolute inset-4 border border-blue-500/20 rounded-full" />
      </div>
      
      <div
        ref={gear2Ref}
        className="absolute w-20 h-20 border-4 border-purple-500/20 rounded-full"
        style={{ top: "70%", left: "80%" }}
      >
        <div className="absolute inset-2 border-2 border-purple-500/20 rounded-full" />
        <div className="absolute inset-4 border border-purple-500/20 rounded-full" />
      </div>
      
      <div
        ref={gear3Ref}
        className="absolute w-16 h-16 border-4 border-pink-500/20 rounded-full"
        style={{ top: "40%", left: "70%" }}
      >
        <div className="absolute inset-2 border-2 border-pink-500/20 rounded-full" />
        <div className="absolute inset-4 border border-pink-500/20 rounded-full" />
      </div>
    </div>
  )
}
