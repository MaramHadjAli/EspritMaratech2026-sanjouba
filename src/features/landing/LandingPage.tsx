/**
 * Landing Page
 * Public landing page with hero section - OMNIA Style
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/Button'

const LandingPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/Background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Design Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/Design.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full py-6 px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/assets/omnia.jpg"
                alt="OMNIA Logo"
                className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-lg"
              />
              <span className="text-2xl font-bold text-white drop-shadow-lg">OMNIA</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="#features" className="text-white/90 hover:text-white transition-colors font-medium">
                Features
              </Link>
              <Link to="#about" className="text-white/90 hover:text-white transition-colors font-medium">
                About
              </Link>
              <Link to="#contact" className="text-white/90 hover:text-white transition-colors font-medium">
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-white border-white/30 hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-white text-primary-600 hover:bg-white/90 shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-8">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 border border-white/20">
                ✨ Charity Management Platform
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Make a Difference with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                  OMNIA
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                A comprehensive platform for managing charitable activities, tracking visits,
                distributing aid, and monitoring impact across your organization.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-xl px-8">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="ghost" className="text-white border-2 border-white/40 hover:bg-white/10 backdrop-blur-sm px-8">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-white/70 text-sm">Families Helped</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">1000+</div>
                  <div className="text-white/70 text-sm">Visits Completed</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">24</div>
                  <div className="text-white/70 text-sm">Active Regions</div>
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
                <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl backdrop-blur-sm">
                  <img
                    src="/assets/omnia.jpg"
                    alt="OMNIA"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">💝</span>
                </div>
                <div className="absolute -bottom-2 -left-2 w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl">🤝</span>
                </div>
                <div className="absolute top-1/2 -right-8 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-lg">🌍</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
            <p>© 2026 OMNIA. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Made with ❤️ for charitable organizations</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage
