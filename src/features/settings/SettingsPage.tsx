/**
 * Settings Page
 * User preferences and configuration
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { useTheme } from '@hooks/useTheme'
import { useLanguage } from '@hooks/useLanguage'
import { useToast } from '@hooks/useNotification'
import { Button } from '@components/Button'
import { Card } from '@components/Card'

const SettingsPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { language, setLanguage } = useLanguage()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'account'>('general')

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your preferences and account settings
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <Card bordered className="p-4">
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'general'
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    General
                  </button>
                  <button
                    onClick={() => setActiveTab('appearance')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'appearance'
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Appearance
                  </button>
                  <button
                    onClick={() => setActiveTab('account')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'account'
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Account
                  </button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3 space-y-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <Card bordered className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    General Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Email Notifications
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive email updates about campaigns
                        </p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Desktop Notifications
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get notified about important updates
                        </p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Weekly Reports
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive weekly performance reports
                        </p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" />
                    </div>
                  </div>
                </Card>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <Card bordered className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Appearance
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Dark Mode
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Enable dark theme for comfortable viewing
                        </p>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                      >
                        {isDarkMode ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Language
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Choose your preferred language
                        </p>
                      </div>
                      <select
                        value={language}
                        onChange={(e) => {
                          setLanguage(e.target.value as any)
                          toast.success('Language changed')
                        }}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="ar">العربية</option>
                      </select>
                    </div>
                  </div>
                </Card>
              )}

              {/* Account Settings */}
              {activeTab === 'account' && (
                <Card bordered className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Account Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-900">
                      <p className="text-sm text-primary-900 dark:text-primary-100">
                        Logged in as: <strong>{user.email}</strong>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Account Information
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Name: {user.fullName || user.name || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Email: {user.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Role: {user.role || 'User'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={() => navigate('/profile/edit')}
                        className="mb-3"
                      >
                        Edit Profile
                      </Button>
                      <Button
                        onClick={() => navigate('/profile/change-password')}
                        variant="ghost"
                        className="block"
                      >
                        Change Password
                      </Button>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Danger zone
                      </p>
                      <Button
                        onClick={() => {
                          if (confirm('Are you sure you want to logout?')) {
                            logout()
                            navigate('/login')
                            toast.success('Logged out successfully')
                          }
                        }}
                        className="text-danger bg-danger hover:bg-danger-600"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
    </div>
  )
}

export default SettingsPage
