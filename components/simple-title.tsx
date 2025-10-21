"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function SimpleTitle() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyberRef = useRef<HTMLSpanElement>(null)
  const arenaRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current || !cyberRef.current || !arenaRef.current) return

    const tl = gsap.timeline({ delay: 0.5 })

    // Initial setup
    gsap.set([cyberRef.current, arenaRef.current], { 
      opacity: 0, 
      y: 20
    })

    // Staggered entrance
    tl.to(cyberRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    })

    tl.to(arenaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.4")

    // Continuous floating
    tl.to([cyberRef.current, arenaRef.current], {
      y: -2,
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    }, "-=0.5")

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className="text-center mb-8">
      <h1 className="text-4xl font-bold font-mono">
        <span 
          ref={cyberRef}
          className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent inline-block"
        >
          CyberX
        </span>
        <span className="mx-2" />
        <span 
          ref={arenaRef}
          className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent inline-block"
        >
          Arena
        </span>
      </h1>
    </div>
  )
}
