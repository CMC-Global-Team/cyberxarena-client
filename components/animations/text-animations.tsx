"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

interface AnimatedTextProps {
  text: string
  className?: string
  animationType?: "typewriter" | "wave" | "glow" | "bounce" | "split"
}

export function AnimatedText({ 
  text, 
  className = "", 
  animationType = "wave" 
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return

    const chars = text.split("")
    const spans = chars.map((char, index) => {
      const span = document.createElement("span")
      span.textContent = char === " " ? "\u00A0" : char
      span.style.display = "inline-block"
      span.style.position = "relative"
      return span
    })

    // Clear and add spans
    textRef.current.innerHTML = ""
    spans.forEach(span => textRef.current?.appendChild(span))

    const tl = gsap.timeline({ delay: 0.5 })

    switch (animationType) {
      case "typewriter":
        // Typewriter effect
        gsap.set(spans, { opacity: 0 })
        spans.forEach((span, index) => {
          tl.to(span, {
            opacity: 1,
            duration: 0.1,
            ease: "power2.out"
          }, index * 0.1)
        })
        break

      case "wave":
        // Wave effect
        gsap.set(spans, { y: 20, opacity: 0, rotation: 10 })
        spans.forEach((span, index) => {
          tl.to(span, {
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
          }, index * 0.1)
        })
        break

      case "glow":
        // Glow effect
        gsap.set(spans, { opacity: 0, scale: 0.5 })
        spans.forEach((span, index) => {
          tl.to(span, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
          }, index * 0.05)
        })
        // Add continuous glow
        tl.to(spans, {
          textShadow: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
          duration: 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1
        }, "-=0.5")
        break

      case "bounce":
        // Bounce effect
        gsap.set(spans, { y: -50, opacity: 0 })
        spans.forEach((span, index) => {
          tl.to(span, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "bounce.out"
          }, index * 0.1)
        })
        break

      case "split":
        // Split effect
        gsap.set(spans, { x: -100, opacity: 0, rotation: -180 })
        spans.forEach((span, index) => {
          tl.to(span, {
            x: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.8,
            ease: "power2.out"
          }, index * 0.1)
        })
        break
    }

    // Add continuous floating animation
    tl.to(textRef.current, {
      y: -2,
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    }, "-=0.5")

    return () => {
      tl.kill()
    }
  }, [text, animationType])

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      <span ref={textRef} className="inline-block" />
    </div>
  )
}

export function CyberXTitle() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyberRef = useRef<HTMLSpanElement>(null)
  const arenaRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current || !cyberRef.current || !arenaRef.current) return

    // Split text into individual characters
    const cyberText = "CyberX"
    const arenaText = "Arena"
    
    const cyberChars = cyberText.split("")
    const arenaChars = arenaText.split("")
    
    // Create spans for each character
    const cyberSpans = cyberChars.map((char, index) => {
      const span = document.createElement("span")
      span.textContent = char
      span.style.display = "inline-block"
      span.style.position = "relative"
      span.style.marginRight = "2px"
      return span
    })
    
    const arenaSpans = arenaChars.map((char, index) => {
      const span = document.createElement("span")
      span.textContent = char
      span.style.display = "inline-block"
      span.style.position = "relative"
      span.style.marginRight = "2px"
      return span
    })

    // Clear and add character spans
    cyberRef.current.innerHTML = ""
    arenaRef.current.innerHTML = ""
    cyberSpans.forEach(span => cyberRef.current?.appendChild(span))
    arenaSpans.forEach(span => arenaRef.current?.appendChild(span))

    const tl = gsap.timeline({ delay: 0.3 })

    // Initial setup - all characters start below
    gsap.set([...cyberSpans, ...arenaSpans], { 
      opacity: 0, 
      y: 50,
      scale: 0.5,
      rotation: 10
    })

    // Cyber characters floating up with stagger
    cyberSpans.forEach((span, index) => {
      tl.to(span, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, index * 0.1)
    })

    // Arena characters floating up with stagger
    arenaSpans.forEach((span, index) => {
      tl.to(span, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, (cyberSpans.length * 0.1) + (index * 0.1))
    })

    // Continuous floating animation for each character
    cyberSpans.forEach((span, index) => {
      tl.to(span, {
        y: -8,
        duration: 2 + (index * 0.2),
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      }, "-=0.5")
    })

    arenaSpans.forEach((span, index) => {
      tl.to(span, {
        y: -6,
        duration: 2.5 + (index * 0.3),
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      }, "-=0.5")
    })

    // Continuous rotation for each character
    cyberSpans.forEach((span, index) => {
      tl.to(span, {
        rotation: 2,
        duration: 4 + (index * 0.5),
        ease: "none",
        repeat: -1,
        yoyo: true
      }, "-=0.5")
    })

    arenaSpans.forEach((span, index) => {
      tl.to(span, {
        rotation: -2,
        duration: 5 + (index * 0.3),
        ease: "none",
        repeat: -1,
        yoyo: true
      }, "-=0.5")
    })

    // Glow effect for all characters
    tl.to([...cyberSpans, ...arenaSpans], {
      textShadow: "0 0 15px currentColor, 0 0 30px currentColor",
      duration: 3,
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

export function TypewriterText({ 
  text, 
  speed = 100, 
  className = "" 
}: { 
  text: string
  speed?: number
  className?: string 
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  useEffect(() => {
    if (containerRef.current) {
      // Add cursor blinking effect
      const cursor = document.createElement("span")
      cursor.textContent = "|"
      cursor.className = "animate-pulse text-blue-400"
      containerRef.current.appendChild(cursor)
    }
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {displayText}
    </div>
  )
}

export function WaveText({ 
  text, 
  className = "" 
}: { 
  text: string
  className?: string 
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chars = text.split("")
    const spans = chars.map((char, index) => {
      const span = document.createElement("span")
      span.textContent = char === " " ? "\u00A0" : char
      span.style.display = "inline-block"
      span.style.position = "relative"
      return span
    })

    containerRef.current.innerHTML = ""
    spans.forEach(span => containerRef.current?.appendChild(span))

    const tl = gsap.timeline({ repeat: -1 })

    spans.forEach((span, index) => {
      tl.to(span, {
        y: -10,
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      }, index * 0.1)
    })

    return () => {
      tl.kill()
    }
  }, [text])

  return (
    <div ref={containerRef} className={className} />
  )
}

export function FloatingSubtitle({ 
  text, 
  className = "" 
}: { 
  text: string
  className?: string 
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chars = text.split("")
    const spans = chars.map((char, index) => {
      const span = document.createElement("span")
      span.textContent = char === " " ? "\u00A0" : char
      span.style.display = "inline-block"
      span.style.position = "relative"
      span.style.marginRight = "1px"
      return span
    })

    containerRef.current.innerHTML = ""
    spans.forEach(span => containerRef.current?.appendChild(span))

    const tl = gsap.timeline({ delay: 1.5 })

    // Initial setup
    gsap.set(spans, { 
      opacity: 0, 
      y: 30,
      scale: 0.8
    })

    // Staggered floating up animation
    spans.forEach((span, index) => {
      tl.to(span, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      }, index * 0.05)
    })

    // Continuous floating for each character
    spans.forEach((span, index) => {
      tl.to(span, {
        y: -3,
        duration: 2 + (index * 0.1),
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      }, "-=0.5")
    })

    // Continuous rotation for each character
    spans.forEach((span, index) => {
      tl.to(span, {
        rotation: 1,
        duration: 3 + (index * 0.2),
        ease: "none",
        repeat: -1,
        yoyo: true
      }, "-=0.5")
    })

    return () => {
      tl.kill()
    }
  }, [text])

  return (
    <div ref={containerRef} className={className} />
  )
}
