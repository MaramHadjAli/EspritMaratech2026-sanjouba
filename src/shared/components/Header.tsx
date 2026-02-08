import React, { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { useTheme } from '@hooks/useTheme'
import { useLanguage } from '@hooks/useLanguage'
import AccessibilityControls from './AccessibilityControls'

// Nav icons for sidebar (mobile only)
const NavIcons: Record<string, React.FC<{ className?: string }>> = {
  '/home': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  '/dashboard': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  '/visits': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  '/families': ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
}

const Header: React.FC = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { language, setLanguage } = useLanguage()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const sidebarRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const handleLogout = () => {
    closeSidebar()
    logout()
    navigate('/login', { replace: true })
  }

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

  // Close sidebar on route change
  useEffect(() => {
    closeSidebar()
  }, [location.pathname, closeSidebar])

  // Escape key closes sidebar
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar()
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isSidebarOpen, closeSidebar])

  // Lock body scroll when sidebar open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isSidebarOpen])

  // Focus trap inside sidebar
  useEffect(() => {
    if (!isSidebarOpen || !sidebarRef.current) return
    const sidebar = sidebarRef.current
    const focusables = sidebar.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    first.focus()

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', trapFocus)
    return () => document.removeEventListener('keydown', trapFocus)
  }, [isSidebarOpen])

  // Check if user can access dashboard (admin or employee only)
  const canAccessDashboard = user?.role === 'ADMIN' || user?.role === 'EMPLOYEE'

  // Navigation items
  const navItems = [
    { path: '/home', label: t('navigation.home'), show: true },
    { path: '/dashboard', label: t('navigation.dashboard'), show: canAccessDashboard },
    { path: '/visits', label: t('navigation.visits'), show: true },
    { path: '/families', label: t('navigation.families'), show: true },
  ]

  // Language options with flags
  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇹🇳' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ]

  const currentLang = languages.find(l => l.code === language) || languages[0]

  const visibleNavItems = navItems.filter(item => item.show)

  return (
    <>
      {/* ─── HEADER BAR ─── */}
      <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <nav className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            
            {/* ── Left: Hamburger (mobile) + Logo ── */}
            <div className="flex items-center gap-2">
              {/* Hamburger — visible < md (768px) */}
              <button
                ref={hamburgerRef}
                onClick={toggleSidebar}
                className="md:hidden relative p-2 -ml-1 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label={isSidebarOpen ? t('common.close') : t('navigation.menu')}
                aria-expanded={isSidebarOpen}
                aria-controls="mobile-sidebar"
                style={{ minWidth: 44, minHeight: 44 }}
              >
                <div className="relative w-5 h-5">
                  <MenuIcon className={`absolute inset-0 transition-all duration-300 ${isSidebarOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
                  <XIcon className={`absolute inset-0 transition-all duration-300 ${isSidebarOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
                </div>
              </button>

              {/* Logo */}
              <NavLink 
                to="/" 
                className="flex-shrink-0 flex items-center group"
                aria-label={t('common.appName')}
              >
                <img
                  src="/assets/images/logo.jpg"
                  alt={t('common.appName')}
                  className="h-9 w-14 md:h-10 md:w-16 rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 object-cover"
                />
              </NavLink>
            </div>

            {/* ── Center: Desktop/Tablet Nav Tabs (≥ md) ── */}
            <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1 ml-6 lg:ml-8" role="tablist">
              {visibleNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  role="tab"
                  aria-selected={location.pathname === item.path}
                  className={({ isActive }) =>
                    `relative px-2.5 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all duration-300 rounded-t-lg whitespace-nowrap
                    ${isActive 
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span 
                        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 transition-transform duration-300 origin-center
                          ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* ── Right Section ── */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              
              {/* Language Selector — hidden on mobile, shown in sidebar instead */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  onBlur={() => setTimeout(() => setIsLangOpen(false), 150)}
                  className="flex items-center gap-1 lg:gap-1.5 px-2 lg:px-2.5 py-1.5 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label={t('accessibility.selectLanguage')}
                  aria-expanded={isLangOpen}
                  aria-haspopup="listbox"
                  style={{ minHeight: 44 }}
                >
                  <span className="text-base">{currentLang.flag}</span>
                  <span className="hidden md:inline text-xs lg:text-sm">{language.toUpperCase()}</span>
                  <ChevronDownIcon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLangOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50"
                    role="listbox"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as 'fr' | 'ar' | 'en')
                          setIsLangOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                          ${language === lang.code 
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        role="option"
                        aria-selected={language === lang.code}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                        {language === lang.code && <CheckIcon className="w-4 h-4 ml-auto" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Accessibility Controls — hide on very small screens */}
              <div className="hidden sm:block">
                <AccessibilityControls />
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? t('accessibility.lightMode') : t('accessibility.darkMode')}
                className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 overflow-hidden"
                style={{ minWidth: 44, minHeight: 44 }}
              >
                <div className="relative w-5 h-5">
                  <SunIcon 
                    className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-500 
                      ${!isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} 
                  />
                  <MoonIcon 
                    className={`absolute inset-0 w-5 h-5 text-indigo-500 transition-all duration-500 
                      ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`} 
                  />
                </div>
              </button>

            {/* User Name + Logout combined */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
              <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                {user?.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-24 truncate">
                {user?.name || user?.name || 'User'}
              </span>
            </div>

              {/* Logout — icon-only on md, icon+text on lg */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs lg:text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={t('common.logout')}
                style={{ minHeight: 44 }}
              >
                <LogoutIcon className="w-4 h-4" />
                <span className="hidden lg:inline">{t('common.logout')}</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ─── MOBILE SIDEBAR OVERLAY (<768px) ─── */}
      {/* Overlay backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden
          ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden="true"
        onClick={closeSidebar}
      />

      {/* Sidebar panel */}
      <aside
        ref={sidebarRef}
        id="mobile-sidebar"
        role="dialog"
        aria-modal="true"
        aria-label={t('navigation.menu')}
        className={`fixed top-0 left-0 z-[70] h-full w-[280px] max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl
          transform transition-transform duration-300 ease-out md:hidden
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">

          {/* Sidebar Header: Logo + Close */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <NavLink
              to="/"
              onClick={closeSidebar}
              className="flex items-center gap-3 group"
            >
              <img
                src="/assets/images/logo.jpg"
                alt={t('common.appName')}
                className="h-9 w-14 rounded-lg shadow-md object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-lg font-bold text-gray-900 dark:text-white">OMNIA</span>
            </NavLink>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={t('common.close')}
              style={{ minWidth: 44, minHeight: 44 }}
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* User info card */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold uppercase shadow-lg shadow-primary-500/20">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name || user?.email?.split('@')[0] || ''}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role?.toLowerCase()}
                </p>
              </div>
            </div>
          </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
            {navItems.filter(item => item.show).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 text-base font-medium rounded-lg transition-colors
                  ${isActive 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            
            {/* Mobile User Info */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold uppercase">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              style={{ minHeight: 48 }}
            >
              <LogoutIcon className="w-4 h-4" />
              {t('common.logout')}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

// Icons
const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
)

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

export default Header
