import React, { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { useTheme } from '@hooks/useTheme'
import { useLanguage } from '@hooks/useLanguage'
import AccessibilityControls from './AccessibilityControls'

const Header: React.FC = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { language, setLanguage } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

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

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Redirects to landing page */}
          <NavLink 
            to="/" 
            className="flex-shrink-0 flex items-center group"
            aria-label={t('common.appName')}
          >
            <img
              src="/assets/images/logo.jpg"
              alt={t('common.appName')}
              className="h-10 w-auto rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
            />
          </NavLink>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1 ml-8" role="tablist">
            {navItems.filter(item => item.show).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                role="tab"
                aria-selected={location.pathname === item.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-t-lg
                  ${isActive 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {/* Active Tab Indicator */}
                    <span 
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 transition-transform duration-300 origin-center
                        ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                onBlur={() => setTimeout(() => setIsLangOpen(false), 150)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label={t('accessibility.selectLanguage')}
                aria-expanded={isLangOpen}
                aria-haspopup="listbox"
              >
                <span className="text-base">{currentLang.flag}</span>
                <span className="hidden sm:inline">{language.toUpperCase()}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
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
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors
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

            {/* Accessibility Controls */}
            <AccessibilityControls />

            {/* Dark Mode Toggle with Premium Animation */}
            <button
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? t('accessibility.lightMode') : t('accessibility.darkMode')}
              className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 overflow-hidden"
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

            {/* User Name Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
              <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                {user?.name?.charAt(0) || user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-24 truncate">
                {user?.name || user?.fullName || 'User'}
              </span>
            </div>

            {/* Logout Tab */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={t('common.logout')}
            >
              <LogoutIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{t('common.logout')}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={isMenuOpen ? t('common.close') : t('navigation.menu')}
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-5 h-5">
                <MenuIcon className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <XIcon className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>
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
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || user?.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
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
