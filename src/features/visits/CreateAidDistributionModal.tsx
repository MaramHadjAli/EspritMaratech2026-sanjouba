/**
 * Create Aid Distribution Modal
 * 3-phase wizard for distributing aid during visits
 * Phase 1: Family selection (phone or lastname)
 * Phase 2: Aid selection (recommended + custom)
 * Phase 3: Family update (notes, family attributes)
 */

import React, { useState, useEffect } from 'react'
import { useToast } from '@hooks/useNotification'
import { useDebounce } from '@hooks/useDebounce'
import { useAuth } from '@hooks/useAuth'
import { visitService } from '@services/visit.service'
import { familyService } from '@services/family.service'
import { aidService } from '@services/aid.service'
import { Card } from '@components/Card'
import { Button } from '@components/Button'
import { TextInput } from '@components/TextInput'
import { SelectInput } from '@components/SelectInput'
import { AccessibleModal } from '@components/AccessibleModal'
import { CheckboxInput } from '@components/CheckboxInput'
import type { Family, Aid } from '@/shared/types'

interface CreateAidDistributionModalProps {
  isOpen: boolean
  visitId: string
  onClose: () => void
  onSuccess: () => void
}

interface SelectedAid {
  aidId: string
  aidName: string
  quantity: number
  isRecommended: boolean
}

const CreateAidDistributionModal: React.FC<CreateAidDistributionModalProps> = ({
  isOpen,
  visitId,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast()
  const { user } = useAuth()
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1)
  const [loading, setLoading] = useState(false)

  // Phase 1: Family selection
  const [familySearch, setFamilySearch] = useState('')
  const [searchResults, setSearchResults] = useState<Family[]>([])
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  
  // Debounce family search input
  const debouncedFamilySearch = useDebounce(familySearch, 1000)

  // Phase 2: Aid selection
  const [recommendedAids, setRecommendedAids] = useState<Aid[]>([])
  const [selectedAids, setSelectedAids] = useState<SelectedAid[]>([])
  const [aidSearch, setAidSearch] = useState('')
  const [allAids, setAllAids] = useState<Aid[]>([])
  const [aidSearchResults, setAidSearchResults] = useState<Aid[]>([])
  const [aidSearchLoading, setAidSearchLoading] = useState(false)
  
  // Debounce aid search input
  const debouncedAidSearch = useDebounce(aidSearch, 1000)

  // Phase 3: Family update
  const [familyNotes, setFamilyNotes] = useState('')
  const [containsDisabled, setContainsDisabled] = useState(false)
  const [containsElderly, setContainsElderly] = useState(false)
  const [containsPupil, setContainsPupil] = useState(false)
  const [needsCatalog, setNeedsCatalog] = useState<any[]>([])
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([])

  // Load recommended aids when family is selected and phase 2 is reached
  useEffect(() => {
    const loadRecommendedAids = async () => {
      if (!selectedFamily) return
      
      try {
        const response = await familyService.getAidRecommendations(selectedFamily.id)
        const aids = response?.data ?? response
        setRecommendedAids(Array.isArray(aids) ? aids : [])
      } catch (err) {
        console.error('Failed to load recommended aids:', err)
        setRecommendedAids([])
      }
    }

    if (isOpen && phase === 2 && selectedFamily) {
      loadRecommendedAids()
    }
  }, [isOpen, phase, selectedFamily])

  // Load family from selected family (phase 3)
  useEffect(() => {
    if (selectedFamily && phase === 3) {
      setContainsDisabled(selectedFamily.containsDisabledMember ?? false)
      setContainsElderly(selectedFamily.containsElderlyMember ?? false)
      setContainsPupil(selectedFamily.containspupilMember ?? false)
      setFamilyNotes(selectedFamily.notes ?? '')
    }
  }, [selectedFamily, phase])

  // Load needs catalog for phase 3
  useEffect(() => {
    const loadNeedsCatalog = async () => {
      try {
        const response = await familyService.getNeedCatalog()
        const needs = response?.data ?? response
        setNeedsCatalog(Array.isArray(needs) ? needs : [])
      } catch (err) {
        console.error('Failed to load needs catalog:', err)
        setNeedsCatalog([])
      }
    }

    if (isOpen && phase === 3) {
      loadNeedsCatalog()
    }
  }, [isOpen, phase])

  // Auto-detect search type (phone vs lastname)
  const detectSearchType = (query: string): 'phone' | 'lastname' => {
    return /^\d+$/.test(query) ? 'phone' : 'lastname'
  }

  // Phase 1: Debounced family search
  useEffect(() => {
    const searchFamilies = async () => {
      if (!debouncedFamilySearch.trim()) {
        setSearchResults([])
        setSearchLoading(false)
        return
      }

      setSearchLoading(true)
      try {
        const searchType = detectSearchType(debouncedFamilySearch)
        const response = searchType === 'phone'
          ? await familyService.searchByPhone(debouncedFamilySearch)
          : await familyService.searchByLastName(debouncedFamilySearch)
        
        const families = response?.data ?? response
        setSearchResults(Array.isArray(families) ? families : [])
      } catch (err) {
        console.error(err)
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }

    searchFamilies()
  }, [debouncedFamilySearch])

  // Phase 2: Debounced aid search
  useEffect(() => {
    const searchAids = async () => {
      if (!debouncedAidSearch.trim()) {
        setAidSearchResults([])
        setAidSearchLoading(false)
        return
      }

      setAidSearchLoading(true)
      try {
        const response = await aidService.findAll(debouncedAidSearch)
        const aids = response?.data ?? response
        setAidSearchResults(Array.isArray(aids) ? aids : [])
      } catch (err) {
        console.error('Failed to search aids:', err)
        setAidSearchResults([])
      } finally {
        setAidSearchLoading(false)
      }
    }

    searchAids()
  }, [debouncedAidSearch])

  // Phase 2: Toggle recommended aid
  const toggleRecommendedAid = (aid: Aid) => {
    const exists = selectedAids.find(a => a.aidId === aid.id && a.isRecommended)
    if (exists) {
      setSelectedAids(selectedAids.filter(a => !(a.aidId === aid.id && a.isRecommended)))
    } else {
      setSelectedAids([
        ...selectedAids,
        {
          aidId: aid.id,
          aidName: aid.name,
          quantity: 1,
          isRecommended: true,
        },
      ])
    }
  }

  // Phase 2: Update quantity
  const updateQuantity = (aidId: string, quantity: number) => {
    setSelectedAids(
      selectedAids.map(a => (a.aidId === aidId ? { ...a, quantity: Math.max(1, quantity) } : a))
    )
  }

  // Phase 2: Add custom aid
  const handleAddCustomAid = (aid: Aid) => {
    const exists = selectedAids.find(a => a.aidId === aid.id && !a.isRecommended)
    if (!exists) {
      setSelectedAids([
        ...selectedAids,
        {
          aidId: aid.id,
          aidName: aid.name,
          quantity: 1,
          isRecommended: false,
        },
      ])
    }
  }

  // Navigate to next phase
  const goNext = () => {
    if (phase === 1 && !selectedFamily) {
      error('Please select a family')
      return
    }
    if (phase < 3) setPhase((phase + 1) as any)
  }

  const goPrev = () => {
    if (phase > 1) setPhase((phase - 1) as any)
  }

  // Save aid distribution
  const handleSave = async () => {
    if (!selectedFamily) {
      error('No family selected')
      return
    }

    if (selectedAids.length === 0) {
      error('Please select at least one aid')
      return
    }

    setLoading(true)
    try {
      // Update family if changed
      const familyUpdateData: any = {
        containsDisabledMember: containsDisabled,
        containsElderlyMember: containsElderly,
        containspupilMember: containsPupil,
        notes: familyNotes,
      }

      // Add selected needs if any
      if (selectedNeeds.length > 0) {
        familyUpdateData.needs = selectedNeeds
      }

      await familyService.updateFamily(selectedFamily.id, familyUpdateData)

      // Create aid distributions
      const aidDistributions = selectedAids.map(aid => ({
        aidId: aid.aidId,
        quantity: aid.quantity,
      }))

      await visitService.createAidDistribution(visitId, {
        familyId: selectedFamily.id,
        aids: aidDistributions,
        notes: familyNotes,
      })

      success('Aide distribuée avec succès!')
      setPhase(4) // Go to success phase
    } catch (err) {
      error('Failed to distribute aid')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title={phase === 4 ? '🎉 Distribution réussie!' : `Distribution d'aide - Étape ${phase}/3`}
      size="lg"
    >
      <div className="space-y-6 py-4">
        {/* Phase 4: Success */}
        {phase === 4 && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-sky-400 flex items-center justify-center text-4xl shadow-lg">
              ✅
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Aide distribuée avec succès!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                La famille <strong>{selectedFamily?.lastName}</strong> a reçu {selectedAids.length} type(s) d'aide.
              </p>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <Button
                variant="ghost"
                onClick={() => {
                  onSuccess()
                  onClose()
                }}
              >
                Fermer
              </Button>
              <Button
                onClick={() => {
                  // Reset for new distribution
                  setPhase(1)
                  setSelectedFamily(null)
                  setSelectedAids([])
                  setFamilySearch('')
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Nouvelle distribution
              </Button>
            </div>
          </div>
        )}

        {/* Phase 1: Family Selection */}
        {phase === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Search by Phone or Last Name
              </label>
              <div className="mt-2">
                <TextInput
                  autoFocus
                  placeholder="Enter phone number or last name..."
                  value={familySearch}
                  onChange={e => setFamilySearch(e.target.value)}
                />
                {searchLoading && (
                  <p className="text-sm text-gray-500 mt-1">Searching...</p>
                )}
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">Results:</p>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {searchResults.map(family => (
                    <div
                      key={family.id}
                      className={`p-3 border rounded-lg cursor-pointer transition ${
                        selectedFamily?.id === family.id
                          ? 'bg-blue-50 border-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedFamily(family)}
                    >
                      <p className="font-semibold">{family.lastName}</p>
                      <p className="text-sm text-gray-600">{family.phone}</p>
                      <p className="text-sm text-gray-500">
                        {family.numberOfMembers} members
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedFamily && (
              <Card className="bg-blue-50 border-blue-200">
                <p className="text-sm">
                  <strong>Selected:</strong> {selectedFamily.lastName} ({selectedFamily.phone})
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Phase 2: Aid Selection */}
        {phase === 2 && selectedFamily && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-3">
                Recommended Aids for {selectedFamily.lastName}
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recommendedAids.length > 0 ? (
                  recommendedAids.map(aid => (
                    <div
                      key={aid.id}
                      className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleRecommendedAid(aid)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAids.some(
                          a => a.aidId === aid.id && a.isRecommended
                        )}
                        onChange={() => toggleRecommendedAid(aid)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{aid.name}</p>
                        <p className="text-xs text-gray-600">{aid.description}</p>
                      </div>
                      {selectedAids.find(a => a.aidId === aid.id && a.isRecommended) && (
                        <input
                          type="number"
                          min="1"
                          value={
                            selectedAids.find(a => a.aidId === aid.id && a.isRecommended)
                              ?.quantity || 1
                          }
                          onChange={e =>
                            updateQuantity(aid.id, parseInt(e.target.value) || 1)
                          }
                          className="w-16 px-2 py-1 border rounded"
                          onClick={e => e.stopPropagation()}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recommended aids</p>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-semibold mb-3">Add Other Aid</p>
              <div>
                <TextInput
                  placeholder="Search for aid by keyword..."
                  value={aidSearch}
                  onChange={e => setAidSearch(e.target.value)}
                />
                {aidSearchLoading && (
                  <p className="text-sm text-gray-500 mt-1">Searching aids...</p>
                )}
              </div>
              
              {aidSearchResults.length > 0 && (
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                  {aidSearchResults.map(aid => {
                    const isSelected = selectedAids.find(a => a.aidId === aid.id && !a.isRecommended)
                    return (
                      <div
                        key={aid.id}
                        className={`flex items-center gap-2 p-2 border rounded-lg ${
                          isSelected ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{aid.name}</p>
                          <p className="text-xs text-gray-600">{aid.description}</p>
                        </div>
                        {isSelected ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={isSelected.quantity}
                              onChange={e => updateQuantity(aid.id, parseInt(e.target.value) || 1)}
                              className="w-16 px-2 py-1 border rounded"
                              onClick={e => e.stopPropagation()}
                            />
                            <Button
                              onClick={() => setSelectedAids(selectedAids.filter(a => a.aidId !== aid.id))}
                              variant="ghost"
                              size="sm"
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleAddCustomAid(aid)}
                            variant="ghost"
                            size="sm"
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {selectedAids.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-3">Selected Aids Summary</p>
                <div className="space-y-2">
                  {selectedAids.map((aid, idx) => (
                    <div key={`${aid.aidId}-${idx}`} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{aid.aidName}</p>
                        <p className="text-xs text-gray-600">
                          {aid.isRecommended ? 'Recommended' : 'Custom'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Qty: {aid.quantity}</span>
                        <Button
                          onClick={() => setSelectedAids(selectedAids.filter((_, i) => i !== idx))}
                          variant="ghost"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Phase 3: Family Update */}
        {phase === 3 && selectedFamily && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <p className="text-sm font-semibold">Last Name</p>
                <p className="text-sm text-gray-700">{selectedFamily.lastName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Phone</p>
                <p className="text-sm text-gray-700">{selectedFamily.phone}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-3">Family Attributes</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={containsDisabled}
                    onChange={e => setContainsDisabled(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Contains Disabled</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={containsElderly}
                    onChange={e => setContainsElderly(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Contains Elderly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={containsPupil}
                    onChange={e => setContainsPupil(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Contains Pupil</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Notes</label>
              <textarea
                value={familyNotes}
                onChange={e => setFamilyNotes(e.target.value)}
                placeholder="Add any additional notes..."
                className="w-full mt-2 p-2 border rounded-lg text-sm"
                rows={4}
              />
            </div>

            <div>
              <p className="text-sm font-semibold mb-3">Family Needs/Recommendations</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {needsCatalog.length > 0 ? (
                  needsCatalog.map((need: string) => (
                    <label key={need} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedNeeds.includes(need)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedNeeds([...selectedNeeds, need])
                          } else {
                            setSelectedNeeds(selectedNeeds.filter(n => n !== need))
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-sm capitalize">{need.toLowerCase().replace('_', ' ')}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Loading needs catalog...</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons - Hidden in success phase */}
      {phase !== 4 && (
        <div className="flex justify-between gap-2 pt-4 border-t">
          <Button variant="ghost" onClick={goPrev} disabled={phase === 1}>
            Précédent
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          {phase < 3 ? (
            <Button onClick={goNext}>Suivant</Button>
          ) : (
            <Button onClick={handleSave} isLoading={loading} className="bg-green-600 hover:bg-green-700">
              Distribuer
            </Button>
          )}
        </div>
      )}
    </AccessibleModal>
  )
}

export default CreateAidDistributionModal
