/**
 * SplitText Component - Premium GSAP Text Animation
 * Creates a character-by-character reveal animation
 * 
 * IMPORTANT: Requires GSAP installation:
 * npm install gsap @gsap/react
 */

import React, { useRef, useEffect, ElementType } from 'react'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  stagger?: number
  as?: ElementType
  onComplete?: () => void
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 0.6,
  stagger = 0.08,
  as: Tag = 'span',
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current || !containerRef.current) return
    hasAnimated.current = true

    const chars = containerRef.current.querySelectorAll('.split-char')
    
    // Check if GSAP is available
    const gsapAvailable = typeof window !== 'undefined' && (window as any).gsap
    
    if (gsapAvailable) {
      const gsap = (window as any).gsap
      
      gsap.set(chars, { 
        opacity: 0, 
        y: 30,
        rotateX: -90 
      })

      gsap.to(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration,
        stagger,
        delay,
        ease: 'back.out(1.7)',
        onComplete,
      })
    } else {
      // CSS fallback animation - smooth and slow
      chars.forEach((char, index) => {
        const el = char as HTMLElement
        el.style.opacity = '0'
        el.style.transform = 'translateY(30px)'
        el.style.transition = `opacity ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`
        el.style.transitionDelay = `${delay + index * stagger}s`
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
          })
        })
      })
      
      // Call onComplete after all animations finish
      if (onComplete) {
        const totalDuration = (delay + text.length * stagger + duration) * 1000
        setTimeout(onComplete, totalDuration)
      }
    }
  }, [text, delay, duration, stagger, onComplete])

  // Split text into characters, preserving spaces
  const characters = text.split('').map((char, index) => {
    const isSpace = char === ' '
    return (
      <span
        key={`${char}-${index}`}
        className={`split-char inline-block ${isSpace ? 'w-[0.25em]' : ''}`}
        style={{ 
          display: 'inline-block',
          willChange: 'transform, opacity',
        }}
        aria-hidden={isSpace ? 'true' : undefined}
      >
        {isSpace ? '\u00A0' : char}
      </span>
    )
  })

  return (
    <Tag className={className}>
      <span 
        ref={containerRef}
        style={{ perspective: '1000px' }}
        aria-label={text}
      >
        {characters}
      </span>
    </Tag>
  )
}

/**
 * WelcomeText Component - Specialized for "Hello, {name}!" animation
 */
interface WelcomeTextProps {
  greeting: string
  name: string
  className?: string
}

export const WelcomeText: React.FC<WelcomeTextProps> = ({ 
  greeting, 
  name, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-wrap items-baseline gap-3 ${className}`}>
      <SplitText 
        text={greeting}
        className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white"
        delay={0.3}
        duration={0.7}
        stagger={0.1}
      />
      <SplitText 
        text={name}
        className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"
        delay={1.2}
        duration={0.7}
        stagger={0.1}
      />
      <SplitText 
        text="!"
        className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-500"
        delay={2.2}
        duration={0.5}
      />
    </div>
  )
}

export default SplitText
