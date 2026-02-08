/**
 * Families Page
 * Search and manage family records with CRUD operations
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { useDebounce } from '@hooks/useDebounce'
import { Button } from '@components/Button'
import { Card } from '@components/Card'
import { Badge } from '@components/Badge'
import { Spinner } from '@components/Spinner'
import { AccessibleModal } from '@components/AccessibleModal'
import { familyService } from '@core/services/family.service'
import { Family } from '@types'

const FamiliesPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  const [searchType, setSearchType] = useState<'phone' | 'lastname'>('phone')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Family[]>([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 1000)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
  }, [user, navigate])

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setSearchResults([])
      return
    }

    const performSearch = async () => {
      try {
        setLoading(true)
        let response: any

        if (searchType === 'phone') {
          response = await familyService.searchByPhone(debouncedSearchTerm)
        } else {
          response = await familyService.searchByLastName(debouncedSearchTerm)
        }

        console.log('Search response:', response)

        // Handle different response formats
        let results = []
        if (Array.isArray(response)) {
          // Response is directly an array
          results = response
        } else if (Array.isArray(response.data)) {
          // Response is ApiResponse<Array>
          results = response.data
        } else if (response.data?.items && Array.isArray(response.data.items)) {
          // Response is ApiResponse<{ items: Array }>
          results = response.data.items
        }

        console.log('Parsed results:', results)

        // Map response to Family type - handle different field names
        const mappedResults = results.map((item: any) => ({
          ...item,
          name: item.name || item.lastName,
          headOfFamily: item.headOfFamily || item.lastName,
          phoneNumber: item.phoneNumber || item.phone,
          familySize: item.familySize || item.numberOfMembers || 1,
        }))

        console.log('Mapped results:', mappedResults)
        setSearchResults(mappedResults)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [debouncedSearchTerm, searchType])

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirm({ id, name })
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return

    try {
      setDeleting(deleteConfirm.id)
      const response = await familyService.deleteFamily(deleteConfirm.id)

      if (response.success) {
        toast.success('Family deleted successfully')
        setSearchResults((prev) => prev.filter((f) => f.id !== deleteConfirm.id))
        setDeleteConfirm(null)
      } else {
        toast.error('Failed to delete family')
      }
    } catch (error) {
      console.error('Error deleting family:', error)
      toast.error('An error occurred while deleting the family')
    } finally {
      setDeleting(null)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Families
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search families to manage their information
          </p>
        </div>
        <Button onClick={() => navigate('/families/add')}>
          Create New Family
        </Button>
      </div>

      {/* Search Card */}
      <Card bordered className="p-6 mb-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSearchType('phone')
                setSearchTerm('')
                setSearchResults([])
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchType === 'phone'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              Search by Phone
            </button>
            <button
              onClick={() => {
                setSearchType('lastname')
                setSearchTerm('')
                setSearchResults([])
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchType === 'lastname'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              Search by Last Name
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder={
                searchType === 'phone'
                  ? 'Enter phone number (e.g., +216 99 999 999)'
                  : 'Enter last name...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {loading && (
              <div className="absolute right-4 top-2.5">
                <Spinner size="sm" />
              </div>
            )}
          </div>

          {searchTerm && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? 'Searching...' : `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`}
            </p>
          )}
        </div>
      </Card>

      {/* Search Results */}
      {searchTerm && (
        <div className="space-y-4">
          {searchResults.length === 0 && !loading ? (
            <Card bordered className="p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No families found matching your search
              </p>
              <Button onClick={() => navigate('/families/add')}>
                Create New Family
              </Button>
            </Card>
          ) : (
            searchResults.map((family) => (
              <Card
                key={family.id}
                bordered
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/families/${family.id}/edit`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {family.headOfFamily || family.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {family.familySize || family.numberOfMembers} members
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      📱 {family.phoneNumber}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      📍 {family.address}
                    </p>
                  </div>
                  <Badge variant="info" className="ml-4">
                    Size: {family.numberOfMembers}
                  </Badge>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/families/${family.id}/edit`)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-danger"
                    disabled={deleting === family.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(family.id, family.headOfFamily || family.name || 'Family')
                    }}
                  >
                    {deleting === family.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Welcome Message */}
      {!searchTerm && (
        <Card bordered className="p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Search for a family by phone number or last name to get started
          </p>
          <Button onClick={() => navigate('/families/add')}>
            Or Create a New Family
          </Button>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <AccessibleModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Family"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirm(null)}
              disabled={deleting !== null}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={deleting !== null}
            >
              {deleting ? 'Deleting...' : 'Delete Family'}
            </Button>
          </div>
        </div>
      </AccessibleModal>
    </div>
  )
}

export default FamiliesPage
