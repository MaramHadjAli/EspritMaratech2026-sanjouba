/**
 * Landing Page
 * Public landing page with hero, features, about, contact sections
 * Smooth scroll navigation, CountUp stats, premium OMNIA theme
 * Works in both light and dark modes
 */

import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/Button'

// CountUp hook — animates a number from 0 to target with IntersectionObserver
const useCountUp = (target: number, duration = 2500, startOnView = true) => {
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
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(eased * target))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
  }, [target, duration, startOnView])

  return { count, ref }
}

// Smooth scroll helper
const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ---------- SVG Icon Components ----------
const VisitIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
)
const AidIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
)
const FamilyIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
)
const LandingChartIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
)
const LanguageIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
  </svg>
)
const AccessibilityIconSVG = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
)
const MailIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
)
const PhoneIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
)
const MapPinIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
)

const LandingPage: React.FC = () => {
  const { t } = useTranslation()

  // CountUp for stats
  const families = useCountUp(500, 2500)
  const visits = useCountUp(1200, 2500)
  const regions = useCountUp(24, 2000)
  const volunteers = useCountUp(150, 2200)

  // Feature cards data
  const features = [
    {
      icon: <VisitIcon />,
      title: t('landing.features.visitTracking'),
      desc: t('landing.features.visitTrackingDesc'),
      bg: 'bg-primary-100 dark:bg-primary-900/30',
      text: 'text-primary-600 dark:text-primary-400',
    },
    {
      icon: <AidIcon />,
      title: t('landing.features.aidDistribution'),
      desc: t('landing.features.aidDistributionDesc'),
      bg: 'bg-rose-100 dark:bg-rose-900/30',
      text: 'text-rose-600 dark:text-rose-400',
    },
    {
      icon: <FamilyIcon />,
      title: t('landing.features.familyManagement'),
      desc: t('landing.features.familyManagementDesc'),
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: <LandingChartIcon />,
      title: t('landing.features.analytics'),
      desc: t('landing.features.analyticsDesc'),
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: <LanguageIcon />,
      title: t('landing.features.multiLanguage'),
      desc: t('landing.features.multiLanguageDesc'),
      bg: 'bg-violet-100 dark:bg-violet-900/30',
      text: 'text-violet-600 dark:text-violet-400',
    },
    {
      icon: <AccessibilityIconSVG />,
      title: t('landing.features.accessibility'),
      desc: t('landing.features.accessibilityDesc'),
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400',
    },
  ]

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden scroll-smooth bg-gray-50 dark:bg-gray-950">
      
      {/* ============ HERO SECTION ============ */}
      <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
          <div className="absolute inset-0 opacity-20 dark:opacity-30" style={{ backgroundImage: 'url(/assets/Background.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none" style={{ backgroundImage: 'url(/assets/Design.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>

        {/* Hero Header */}
        <header className="relative z-10 w-full py-5 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/assets/images/logo.jpg"
                alt="OMNIA Logo"
                className="w-14 h-12 rounded-xl object-cover border-2 border-white/30 shadow-lg"
                onError={(e) => { (e.target as HTMLImageElement).src = '/assets/banner.jpg' }}
              />
              <span className="text-2xl font-bold text-white drop-shadow-lg tracking-tight">OMNIA</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('features')} className="text-white/85 hover:text-white transition-colors font-medium text-sm cursor-pointer bg-transparent border-none">
                {t('landing.features.title')}
              </button>
              <button onClick={() => scrollToSection('about')} className="text-white/85 hover:text-white transition-colors font-medium text-sm cursor-pointer bg-transparent border-none">
                {t('landing.about.title')}
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-white/85 hover:text-white transition-colors font-medium text-sm cursor-pointer bg-transparent border-none">
                {t('landing.contact.title')}
              </button>
            </nav>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="!text-white !border-white/30 hover:!bg-white/10 text-sm">
                  {t('landing.hero.signIn') || t('auth.login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button className="!bg-white !text-primary-700 hover:!bg-white/90 shadow-lg text-sm font-semibold">
                  {t('landing.hero.cta')}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white/95 text-sm font-medium mb-8 border border-white/20">
                <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {t('landing.hero.badge')}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                {t('landing.hero.titlePart1')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                  OMNIA
                </span>
              </h1>

              <p className="text-base sm:text-lg text-white/75 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t('landing.hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button size="lg" className="!bg-gradient-to-r !from-secondary-500 !to-secondary-600 hover:!from-secondary-600 hover:!to-secondary-700 !text-white shadow-xl !px-8 !font-semibold w-full sm:w-auto">
                    {t('landing.hero.cta')}
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="ghost" className="!text-white !border-2 !border-white/40 hover:!bg-white/10 backdrop-blur-sm !px-8 w-full sm:w-auto">
                    {t('landing.hero.signIn') || t('auth.login')}
                  </Button>
                </Link>
              </div>

              {/* Stats with CountUp — Flexbox row */}
              <div ref={families.ref} className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20 justify-center lg:justify-start">
                <div className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">{families.count.toLocaleString()}+</div>
                  <div className="text-white/60 text-sm mt-1">{t('landing.impact.families')}</div>
                </div>
                <div ref={visits.ref} className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">{visits.count.toLocaleString()}+</div>
                  <div className="text-white/60 text-sm mt-1">{t('landing.impact.visits')}</div>
                </div>
                <div ref={regions.ref} className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">{regions.count}</div>
                  <div className="text-white/60 text-sm mt-1">{t('landing.impact.regions')}</div>
                </div>
                <div ref={volunteers.ref} className="text-center lg:text-left">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">{volunteers.count}+</div>
                  <div className="text-white/60 text-sm mt-1">{t('landing.impact.volunteers')}</div>
                </div>
              </div>
            </div>

            {/* Right Content - Circular Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 -m-4 rounded-full border-2 border-white/20 animate-pulse" />
                <div className="absolute inset-0 -m-8 rounded-full border border-white/10" />
                <div className="absolute inset-0 -m-12 rounded-full border border-white/5" />
                
                <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/25 shadow-2xl">
                  <img src="/assets/banner.jpg" alt="OMNIA" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/logo.jpg' }} />
                </div>

                {/* Floating icons */}
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

        {/* Scroll indicator */}
        <div className="relative z-10 flex justify-center pb-8">
          <button onClick={() => scrollToSection('features')} className="animate-bounce text-white/50 hover:text-white transition-colors bg-transparent border-none cursor-pointer" aria-label="Scroll down">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </button>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section id="features" className="relative py-20 sm:py-28 px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4">
              {t('landing.features.title')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group relative p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.text} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ABOUT SECTION ============ */}
      <section id="about" className="relative py-20 sm:py-28 px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto lg:mx-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                <img src="/assets/omnia.jpg" alt="OMNIA - About" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/logo.jpg' }} />
              </div>
              <div className="absolute -z-10 -top-4 -left-4 w-full h-full rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 opacity-20 dark:opacity-10" />
            </div>

            <div className="text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 rounded-full text-sm font-semibold mb-4">
                {t('landing.about.title')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">{t('landing.about.title')}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{t('landing.about.description')}</p>
              <p className="text-base text-gray-500 dark:text-gray-500 mb-8 leading-relaxed italic">{t('landing.about.mission')}</p>
              
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">500+</div>
                  <div className="text-sm text-gray-500">{t('landing.impact.families')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">24</div>
                  <div className="text-sm text-gray-500">{t('landing.impact.regions')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">150+</div>
                  <div className="text-sm text-gray-500">{t('landing.impact.volunteers')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONTACT SECTION ============ */}
      <section id="contact" className="relative py-20 sm:py-28 px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4">
              {t('landing.contact.title')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">{t('landing.contact.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('landing.contact.subtitle')}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0"><MailIcon /></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h4>
                  <p className="text-gray-600 dark:text-gray-400">{t('landing.contact.email')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0"><PhoneIcon /></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t('common.phone') || 'Phone'}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{t('landing.contact.phone')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 flex items-center justify-center flex-shrink-0"><MapPinIcon /></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t('common.address') || 'Address'}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{t('landing.contact.address')}</p>
                </div>
              </div>
              {/* Donation Section */}
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700 mt-6">
                <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💖</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Feel like donating?</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Support renovation of Ecole Sidi Selem Sejnan.</p>
                  <a href="https://www.cha9a9a.tn/fund/detail/renovation-ecole-sidi-selem-sejnan-562974" target="_blank" rel="noopener noreferrer">
                    <Button className="!bg-rose-600 !text-white !py-2 !px-6 !rounded-lg hover:!bg-rose-700 transition">Donate Now</Button>
                  </a>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault() }} className="space-y-5 p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('landing.contact.name')}</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" placeholder={t('landing.contact.name')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" placeholder={t('landing.contact.email')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('landing.contact.message')}</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none" placeholder={t('landing.contact.message')} />
              </div>
              <Button type="submit" className="w-full !py-3 !font-semibold text-base">{t('landing.contact.sendMessage')}</Button>
            </form>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative py-8 px-6 lg:px-8 bg-gray-900 dark:bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm gap-4">
          <div className="flex items-center gap-3">
            <img src="/assets/images/logo.jpg" alt="OMNIA" className="w-8 h-8 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/assets/banner.jpg' }} />
            <span className="font-semibold text-white">OMNIA</span>
          </div>
          <p>© {new Date().getFullYear()} OMNIA. All rights reserved.</p>
          <p>Made with <span className="text-rose-400">♥</span> for charitable organizations</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
