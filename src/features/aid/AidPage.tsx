/**
 * Aid Management Page
 * Manage aid distribution with tabbed interface
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { Button } from '@components/Button'
import { Card } from '@components/Card'
import { Badge } from '@components/Badge'
import { Spinner } from '@components/Spinner'
import { FormField } from '@components/FormField'
import { TextInput } from '@components/TextInput'
import { SelectInput } from '@components/SelectInput'
import { aidService } from '@core/services/aid.service'
import { familyService } from '@core/services/family.service'
import { Aid, Family } from '@types'

type TabType = 'list' | 'add' | 'statistics'

interface AidFormData {
  familyId: string
  aidType: string
  quantity: number
  amount: number
  description: string
}

const AidPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState<TabType>('list')
  const [loading, setLoading] = useState(true)
  const [aids, setAids] = useState<Aid[]>([])
  const [families, setFamilies] = useState<Family[]>([])
  const [formData, setFormData] = useState<AidFormData>({
    familyId: '',
    aidType: 'CASH',
    quantity: 1,
    amount: 0,
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch aids
        const aidsResponse = await aidService.getAllAids(1, 50)
        setAids(aidsResponse.data?.items || [])

        // Fetch families
        const familiesResponse = await familyService.getAllFamilies(1, 100)
        setFamilies(familiesResponse.data?.items || [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, navigate, toast])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'amount' ? parseFloat(value) : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.familyId) newErrors.familyId = 'Family is required'
    if (!formData.aidType) newErrors.aidType = 'Aid type is required'
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0'
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddAid = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await aidService.createAid({
        familyId: formData.familyId,
        type: formData.aidType,
        quantity: formData.quantity,
        unit: formData.aidType,
        description: formData.description,
      })
      toast.success('Aid added successfully!')
      setFormData({
        familyId: '',
        aidType: 'CASH',
        quantity: 1,
        amount: 0,
        description: '',
      })
      setActiveTab('list')
    } catch (error) {
      console.error('Failed to add aid:', error)
      toast.error('Failed to add aid')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" label={t('common.loading') || 'Loading...'} />
      </div>
    )
  }

  const tabs = [
    { id: 'list' as TabType, label: 'Aid Distribution' },
    { id: 'add' as TabType, label: 'Add Aid' },
    { id: 'statistics' as TabType, label: 'Statistics' },
  ]

  return (
    <>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Aid Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track aid distribution
            </p>
          </div>

          {/* Tabs */}
          <Card bordered className="mb-6">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Tab Content */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {aids.length === 0 ? (
                <Card bordered className="p-12 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No aid distribution records yet
                  </p>
                  <Button onClick={() => setActiveTab('add')}>
                    Add First Aid Distribution
                  </Button>
                </Card>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {aids.map((aid) => (
                        <tr
                          key={aid.id}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="px-6 py-3 text-gray-900 dark:text-white">
                            {aid.addedAt || 'N/A'}
                          </td>
                          <td className="px-6 py-3 text-gray-900 dark:text-white">
                            {aid.type}
                          </td>
                          <td className="px-6 py-3 text-gray-900 dark:text-white">
                            {aid.unit}
                          </td>
                          <td className="px-6 py-3 text-gray-900 dark:text-white">
                            {aid.quantity}
                          </td>
                          <td className="px-6 py-3">
                            <Badge variant="success">Distributed</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'add' && (
            <Card bordered className="p-8 max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Add New Aid Distribution
              </h2>

              {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-4 rounded-lg bg-danger-50 dark:bg-danger-900 border border-danger-200 dark:border-danger-800">
                  <p className="text-sm text-danger font-medium">
                    Please fix the errors below
                  </p>
                </div>
              )}

              <form onSubmit={handleAddAid} className="space-y-6">
                <FormField label="Family" error={errors.familyId} required>
                  <select
                    name="familyId"
                    value={formData.familyId}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a family</option>
                    {families.map((family) => (
                      <option key={family.id} value={family.id}>
                        {family.headOfFamily} - {family.familySize}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Aid Type" error={errors.aidType} required>
                  <select
                    name="aidType"
                    value={formData.aidType}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="CASH">Cash</option>
                    <option value="FOOD">Food</option>
                    <option value="CLOTHING">Clothing</option>
                    <option value="MEDICAL">Medical</option>
                    <option value="EDUCATION">Education</option>
                  </select>
                </FormField>

                <FormField label="Amount (TND)" error={errors.amount} required>
                  <TextInput
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleFormChange}
                    placeholder="0.00"
                  />
                </FormField>

                <FormField label="Quantity" error={errors.quantity} required>
                  <TextInput
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleFormChange}
                    placeholder="1"
                  />
                </FormField>

                <FormField label="Description" error={errors.description}>
                  <TextInput
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Additional notes..."
                  />
                </FormField>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" fullWidth>
                    Add Aid
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    onClick={() => setActiveTab('list')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'statistics' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card bordered className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Total Aids Distributed
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {aids.length}
                </p>
              </Card>

              <Card bordered className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Total Amount (TND)
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {aids.reduce((sum, aid) => sum + (aid.quantity || 0), 0).toLocaleString()}
                </p>
              </Card>

              <Card bordered className="p-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Families Helped
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {new Set(aids.map((a) => a.familyId)).size}
                </p>
              </Card>

              <Card bordered className="p-6 md:col-span-2 lg:col-span-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Top Aid Types
                </h3>
                <div className="space-y-2">
                  {['CASH', 'FOOD', 'CLOTHING', 'MEDICAL', 'EDUCATION'].map((type) => {
                    const count = aids.filter((a) => a.type === type).length
                    return (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">{type}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {count} ({Math.round((count / aids.length) * 100)}%)
                        </span>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AidPage
