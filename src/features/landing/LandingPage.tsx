/**
 * Landing Page
 * Public landing page with hero section - OMNIA Style
 * Works in both light and dark modes
 */

import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/Button'

// CountUp hook — animates a number from 0 to target
const useCountUp = (target: number, duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (!startOnView) {
      animateCount()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          animateCount()
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()

    function animateCount() {
      const startTime = performance.now()
      const step = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(eased * target))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
  }, [target, duration, startOnView])

  return { count, ref }
}

const LandingPage: React.FC = () => {
  const { t } = useTranslation()

  // CountUp for stats
  const families = useCountUp(500, 2500)
  const visits = useCountUp(1000, 2500)
  const regions = useCountUp(24, 2000)

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gray-50 dark:bg-gray-950">
      
      {/* Background - works in both modes */}
      <div className="absolute inset-0">
        {/* Gradient for light mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
        {/* Optional background image overlay */}
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-30"
          style={{
            backgroundImage: 'url(/assets/Background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Design overlay */}
        <div 
          className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'url(/assets/Design.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full py-5 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/assets/images/logo.jpg"
                alt="OMNIA Logo"
                className="w-11 h-11 rounded-xl object-cover border-2 border-white/30 shadow-lg"
                onError={(e) => { (e.target as HTMLImageElement).src = '/assets/omnia.jpg' }}
              />
              <span className="text-2xl font-bold text-white drop-shadow-lg tracking-tight">OMNIA</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-white/85 hover:text-white transition-colors font-medium text-sm">
                Features
              </a>
              <a href="#about" className="text-white/85 hover:text-white transition-colors font-medium text-sm">
                About
              </a>
              <a href="#contact" className="text-white/85 hover:text-white transition-colors font-medium text-sm">
                Contact
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="!text-white !border-white/30 hover:!bg-white/10 text-sm">
                  {t('auth.login') || 'Sign In'}
                </Button>
              </Link>
              <Link to="/register">
                <Button className="!bg-white !text-primary-700 hover:!bg-white/90 shadow-lg text-sm font-semibold">
                  {t('auth.signup') || 'Get Started'}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white/95 text-sm font-medium mb-8 border border-white/20">
                <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {t('landing.hero.badge') || 'Charity Management Platform'}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                {t('landing.hero.titlePart1') || 'Make a Difference with'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                  OMNIA
                </span>
              </h1>

              <p className="text-base sm:text-lg text-white/75 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t('landing.hero.subtitle') || 'A comprehensive platform for managing charitable activities, tracking visits, distributing aid, and monitoring impact across your organization.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button size="lg" className="!bg-gradient-to-r !from-secondary-500 !to-secondary-600 hover:!from-secondary-600 hover:!to-secondary-700 !text-white shadow-xl !px-8 !font-semibold w-full sm:w-auto">
                    {t('landing.hero.cta') || 'Get Started Free'}
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="ghost" className="!text-white !border-2 !border-white/40 hover:!bg-white/10 backdrop-blur-sm !px-8 w-full sm:w-auto">
                    {t('auth.login') || 'Sign In'}
                  </Button>
                </Link>
              </div>

              {/* Stats with CountUp */}
              <div ref={families.ref} className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                <div className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                    {families.count.toLocaleString()}+
                  </div>
                  <div className="text-white/60 text-sm mt-1">{t('landing.impact.families') || 'Families Helped'}</div>
                </div>
                <div ref={visits.ref} className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                    {visits.count.toLocaleString()}+
                  </div>
                  <div className="text-white/60 text-sm mt-1">{t('landing.impact.visits') || 'Visits Completed'}</div>
                </div>
                <div ref={regions.ref} className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                    {regions.count}
                  </div>
                  <div className="text-white/60 text-sm mt-1">{t('landing.impact.regions') || 'Active Regions'}</div>
                </div>
              </div>
            </div>

            {/* Right Content - Circular Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative rings */}
                <div className="absolute inset-0 -m-4 rounded-full border-2 border-white/20 animate-pulse" />
                <div className="absolute inset-0 -m-8 rounded-full border border-white/10" />
                <div className="absolute inset-0 -m-12 rounded-full border border-white/5" />
                
                {/* Main circular image */}
                <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/25 shadow-2xl">
                  <img
                    src="/assets/omnia.jpg"
                    alt="OMNIA"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/logo.jpg' }}
                  />
                </div>

                {/* Floating elements with SVG icons */}
                <div className="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                </div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                </div>
                <div className="absolute top-1/2 -right-8 w-11 h-11 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-white/50 text-sm gap-2">
            <p>© 2026 OMNIA. All rights reserved.</p>
            <p>Made with <span className="text-rose-400">♥</span> for charitable organizations</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage
