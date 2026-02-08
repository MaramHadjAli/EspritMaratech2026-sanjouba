/**
 * Visit Detail Page
 * View comprehensive visit information
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { visitService } from '@services/visit.service'
import { Spinner } from '@components/Spinner'
import { Card } from '@components/Card'
import { Badge } from '@components/Badge'
import { Button } from '@components/Button'
import { DownloadDonationPDF, buildDonationPDFData, DEFAULT_ORGANIZATION } from '@components/DownloadPDF'
import CreateAidDistributionModal from './CreateAidDistributionModal'
import type { Visit } from '@/shared/types'

const VisitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isRestoring } = useAuth()
  const { success, error } = useToast()
  const [visit, setVisit] = useState<Visit | null>(null)
  const [loading, setLoading] = useState(true)
  const [aidModalOpen, setAidModalOpen] = useState(false)

  useEffect(() => {
    // Wait until auth is done restoring from localStorage
    if (isRestoring) {
      console.log('⏳ VisitDetailPage - Waiting for auth to restore...')
      return
    }

    if (!user) {
      console.log('❌ VisitDetailPage - No user, redirecting to login')
      navigate('/login')
      return
    }

    const fetchVisit = async () => {
      try {
        setLoading(true)
        const response = await visitService.getVisitById(id as string)
        const resolvedVisit = (response as any)?.data ?? response
        console.log('📍 VisitDetailPage - Fetched visit:', resolvedVisit)
        console.log('📍 VisitDetailPage - isActive:', resolvedVisit?.isActive)
        console.log('📍 VisitDetailPage - users:', resolvedVisit?.users)
        console.log('📍 VisitDetailPage - current user id:', user?.id)
        setVisit(resolvedVisit)
      } catch (err) {
        error('Error loading visit')
        navigate('/visits')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchVisit()
    }
  }, [id, user, navigate, isRestoring])

  const handleDelete = async () => {
    if (!visit || !confirm('Delete this visit?')) return

    try {
      const response = await visitService.deleteVisit(visit.id)
      if ((response as any)?.success || (response as any)?.data) {
        success('Visit deleted')
        navigate('/visits')
      } else {
        error('Error deleting visit')
      }
    } catch (err) {
      error('Error deleting visit')
    }
  }

  const handleJoinVisit = async () => {
    if (!visit) return
    try {
      await visitService.joinVisit(visit.id)
      success('Successfully joined the visit')
      // Refresh the visit data
      const response = await visitService.getVisitById(visit.id)
      const resolvedVisit = (response as any)?.data ?? response
      setVisit(resolvedVisit)
    } catch (err) {
      console.error('Failed to join visit:', err)
      error('Failed to join visit')
    }
  }

  if (loading) {
    return (
      <>
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Spinner />
          </div>
        </div>
      </>
    )
  }

  if (!visit) {
    console.log('❌ VisitDetailPage - Visit is null or undefined')
    return (
      <>
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Card bordered className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Visit not found
              </p>
              <Button onClick={() => navigate('/visits')}>
                Back to Visits
              </Button>
            </Card>
          </div>
        </div>
      </>
    )
  }

  return (
    <>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate('/visits')}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              ← Back to Visits
            </button>
            <div className="flex gap-3">
              {(() => {
                const isActive = visit.isActive
                const isUserInTeam = visit.users?.some(u => u.id === user?.id)
                console.log('🔘 Button render check:', { isActive, isUserInTeam })
                
                if (isActive && isUserInTeam) {
                  return <Button
                    onClick={() => setAidModalOpen(true)}
                    className="bg-success hover:bg-success-600"
                  >
                    Create Aid Distribution
                  </Button>
                } else if (isActive && !isUserInTeam) {
                  return <Button
                    onClick={handleJoinVisit}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Join Visit
                  </Button>
                }
                return null
              })()}
              <Button
                onClick={() => navigate(`/visits/${visit.id}/edit`)}
                variant="ghost"
              >
                Edit
              </Button>
              <Button onClick={handleDelete} className="bg-danger hover:bg-danger-600">
                Delete
              </Button>
            </div>
          </div>

          {/* PDF Download Section */}
          {visit.isCompleted && (
            <Card bordered className="p-4 mb-6 bg-gradient-to-r from-emerald-50 to-sky-50 dark:from-emerald-900/20 dark:to-sky-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Certificat de visite</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Téléchargez le certificat officiel de cette visite</p>
                </div>
                <DownloadDonationPDF
                  data={buildDonationPDFData({
                    donor: {
                      name: user?.name || 'Bénévole OMNIA',
                      email: user?.email,
                    },
                    visit: {
                      id: visit.id,
                      name: `Visite ${visit.city}`,
                      date: new Date(visit.startDate),
                      location: visit.city || 'Non spécifié',
                      region: visit.region || undefined,
                    },
                    family: {
                      id: 'FAM-001',
                      lastName: 'Famille bénéficiaire',
                      numberOfMembers: 4,
                      address: visit.city || undefined,
                    },
                    aids: [
                      { type: 'Aide alimentaire', name: 'Colis alimentaire', quantity: 1, unit: 'colis' },
                    ],
                    notes: visit.notes || undefined,
                    signedBy: user?.name,
                    organization: DEFAULT_ORGANIZATION,
                  })}
                  label="Télécharger PDF"
                />
              </div>
            </Card>
          )}

          {/* Header Section */}
          <Card bordered className="p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Visit to {visit.city}, {visit.region}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {visit.city}, {visit.region}
                  </p>
                </div>
                <Badge
                  variant={
                    visit.isActive
                      ? 'success'
                      : visit.isCompleted
                      ? 'info'
                      : 'warning'
                  }
                >
                  {visit.isActive ? 'ACTIVE' : visit.isCompleted ? 'COMPLETED' : 'PLANNED'}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Team Members
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {visit.users?.length || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Start Date
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {new Date(visit.startDate).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  End Date
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {visit.endDate ? new Date(visit.endDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Duration
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {visit.endDate ? `${Math.ceil((new Date(visit.endDate).getTime() - new Date(visit.startDate).getTime()) / (1000 * 60 * 60 * 24))} days` : 'N/A'}
                </p>
              </div>
            </div>
          </Card>

          {/* Details Section */}
          <Card bordered className="p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Details
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Location
                </p>
                <p className="text-gray-900 dark:text-white">
                  {visit.city}, {visit.region}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Coordinates
                </p>
                <p className="text-gray-900 dark:text-white">
                  {visit.latitude}, {visit.longitude}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Notes
                </p>
                <p className="text-gray-900 dark:text-white">
                  {visit.notes || 'No notes provided'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Team Members
                </p>
                <div className="space-y-2">
                  {visit.users && visit.users.length > 0 ? (
                    visit.users.map((user: any) => (
                      <div key={user.id} className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-gray-500 dark:text-gray-400">({user.email})</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-900 dark:text-white">No team members assigned</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card bordered className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Visit Information
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">
                  Active Status
                </p>
                <p className="text-3xl font-bold text-primary-900 dark:text-primary-100">
                  {visit.isActive ? 'Yes' : 'No'}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-success-50 dark:bg-success-900/20">
                <p className="text-sm text-success-600 dark:text-success-400 mb-1">
                  Completed
                </p>
                <p className="text-3xl font-bold text-success-900 dark:text-success-100">
                  {visit.isCompleted ? 'Yes' : 'No'}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-info-50 dark:bg-info-900/20">
                <p className="text-sm text-info-600 dark:text-info-400 mb-1">
                  Stats Computed
                </p>
                <p className="text-3xl font-bold text-info-900 dark:text-info-100">
                  {visit.statsComputed ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Aid Distribution Modal */}
      {visit && (
        <CreateAidDistributionModal
          isOpen={aidModalOpen}
          visitId={visit.id}
          onClose={() => setAidModalOpen(false)}
          onSuccess={() => {
            setAidModalOpen(false)
            success('Aid distributed successfully')
            // Optionally refresh visit data here
          }}
        />
      )}
    </>
  )
}

export default VisitDetailPage
