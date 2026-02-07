/**
 * Landing Page
 * Public landing page with hero section and features
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/Button'
import { Badge } from '@components/Badge'
import Header from '@components/Header'

const LandingPage: React.FC = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: '👥',
      title: 'Family Management',
      description: 'Track and manage family information efficiently',
    },
    {
      icon: '📍',
      title: 'Visit Tracking',
      description: 'Organize and track charitable visits with maps integration',
    },
    {
      icon: '💝',
      title: 'Aid Distribution',
      description: 'Distribute aid transparently and track impact',
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Get insights with comprehensive statistics and charts',
    },
    {
      icon: '🗺️',
      title: 'Regional Coverage',
      description: 'Monitor coverage across all regions',
    },
    {
      icon: '🌍',
      title: 'Multilingual',
      description: 'Support for Arabic, French, and English',
    },
  ]

  const stats = [
    { number: '500+', label: 'Families Helped' },
    { number: '1000+', label: 'Visits Completed' },
    { number: '24', label: 'Active Regions' },
    { number: '95%', label: 'Satisfaction Rate' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative px-6 py-20 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="info" className="mb-4 inline-block">
            ✨ Charity Management Platform
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
            Make a Difference with OMNIA
          </h1>

          <p className="text-lg leading-8 text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            A comprehensive platform for managing charitable activities, tracking visits,
            distributing aid, and monitoring impact across your organization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="ghost">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop"
              alt="Team collaboration"
              className="relative rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage charitable activities efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-blue-600">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to make an impact?</h2>
          <p className="text-lg text-primary-100 mb-8">
            Join thousands of organizations using OMNIA to improve their charitable work.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Start Your 30-Day Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li>
                  <Link to="#" className="hover:text-primary-500">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary-500">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary-500">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li>
                  <Link to="#" className="hover:text-primary-500">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary-500">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-primary-500">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li>
                  <Link to="/privacy" className="hover:text-primary-500">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary-500">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-primary-500">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2026 OMNIA. All rights reserved.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 md:mt-0">
              Made with ❤️ for charitable organizations
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
