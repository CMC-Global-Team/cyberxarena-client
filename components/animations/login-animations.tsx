"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface LoginAnimationsProps {
  children: React.ReactNode
}

export function LoginAnimations({ children }: LoginAnimationsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const inputsRef = useRef<HTMLDivElement[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!containerRef.current || !cardRef.current) return

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
    
    gsap.set(inputsRef.current, { 
      x: -50, 
      opacity: 0 
    })
    
    gsap.set(buttonRef.current, { 
      scale: 0.8, 
      opacity: 0 
    })

    // Create timeline
    const tl = gsap.timeline({ delay: 0.2 })

    // Card entrance animation
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
    tl.to(inputsRef.current, {
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
      y: -5,
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
    <div ref={containerRef} className="relative">
      {children}
    </div>
  )
}

export function AnimatedCard({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={cardRef} {...props}>
      {children}
    </div>
  )
}

export function AnimatedTitle({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  return (
    <h2 ref={titleRef} {...props}>
      {children}
    </h2>
  )
}

export function AnimatedDescription({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  return (
    <p ref={descriptionRef} {...props}>
      {children}
    </p>
  )
}

export function AnimatedForm({ children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} {...props}>
      {children}
    </form>
  )
}

export function AnimatedInput({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const inputRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={inputRef} {...props}>
      {children}
    </div>
  )
}

export function AnimatedButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <button ref={buttonRef} {...props}>
      {children}
    </button>
  )
}
