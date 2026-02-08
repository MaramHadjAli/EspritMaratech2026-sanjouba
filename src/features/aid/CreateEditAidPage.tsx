/**
 * Create/Edit Aid Page
 * Simple form for creating/editing aid with proper fields
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useNotification'
import { aidService } from '@services/aid.service'
import axiosInstance from '@core/api/axiosInstance'
import { Aid } from '@core/types'

const CreateEditAidPage: React.FC = () => {
    // Deposit recommendation state
    const [recommendedDeposits, setRecommendedDeposits] = useState<any[]>([])
    const [recommendLoading, setRecommendLoading] = useState(false)
    const [selectedDepositId, setSelectedDepositId] = useState('')
    const [recommendError, setRecommendError] = useState('')
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const { user } = useAuth()
  const { success, error: showError } = useToast()

  const lang = i18n.language
  const isEditing = !!id

  // Form fields
  const [name, setName] = useState('')
  const [aidType, setAidType] = useState('FOOD')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [requiresRefrigeration, setRequiresRefrigeration] = useState(false)
  const [requiredHumidityLevel, setRequiredHumidityLevel] = useState<string>('')
  const [requiredMinTemperatureC, setRequiredMinTemperatureC] = useState<string>('')
  const [requiredMaxTemperatureC, setRequiredMaxTemperatureC] = useState<string>('')
  const [familyId, setFamilyId] = useState('')

  // State
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(isEditing)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [deposits, setDeposits] = useState<any[]>([])
  const [depositsLoading, setDepositsLoading] = useState(true)

  // Load deposits on mount
  useEffect(() => {
    const loadDeposits = async () => {
      try {
        setDepositsLoading(true)
        const response = await aidService.getAllDeposits()
        const depositsList = response?.data ?? response
        setDeposits(Array.isArray(depositsList) ? depositsList : [])
        if (Array.isArray(depositsList) && depositsList.length > 0) {
          setSelectedDepositId(depositsList[0].id)
        }
      } catch (err) {
        console.error('Error loading deposits:', err)
        setDeposits([])
      } finally {
        setDepositsLoading(false)
      }
    }
    loadDeposits()
  }, [])

  // Load aid data if editing
  useEffect(() => {
    if (isEditing && id) {
      const loadAid = async () => {
        try {
          setLoading(true)
          const response = await aidService.getAidById(id)
          const rawAid = response && response.data ? response.data : response
          if (rawAid && typeof rawAid === 'object' && 'name' in rawAid) {
            setName(rawAid.name || '')
            setAidType(rawAid.type || 'FOOD')
            setDescription(rawAid.description ?? '' )
            setQuantity(String(rawAid.quantity || 1))
            setRequiresRefrigeration(rawAid.requiresRefrigeration || false)
            setRequiredHumidityLevel(rawAid.requiredHumidityLevel || '')
            setRequiredMinTemperatureC(rawAid.requiredMinTemperatureC !== undefined ? String(rawAid.requiredMinTemperatureC) : '')
            setRequiredMaxTemperatureC(rawAid.requiredMaxTemperatureC !== undefined ? String(rawAid.requiredMaxTemperatureC) : '')
            setFamilyId(rawAid.familyId || '')
          }
        } catch (err) {
          console.error('Error loading aid:', err)
          showError(lang === 'fr' ? 'Erreur de chargement' : lang === 'ar' ? 'خطأ في التحميل' : 'Error loading aid')
        } finally {
          setLoading(false)
        }
      }
      loadAid()
    }
  }, [id, isEditing])

  if (!user) {
    navigate('/login')
    return null
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = lang === 'fr' ? 'Le nom est requis' : lang === 'ar' ? 'الاسم مطلوب' : 'Name is required'
    }
    if (!aidType) {
      newErrors.type = lang === 'fr' ? 'Type requis' : lang === 'ar' ? 'النوع مطلوب' : 'Type is required'
    }
    if (!quantity || Number(quantity) < 1) {
      newErrors.quantity = lang === 'fr' ? 'Quantité min 1' : lang === 'ar' ? 'الكمية 1 على الأقل' : 'Min quantity is 1'
    }

    // Validate temperature range
    if (requiredMinTemperatureC && requiredMaxTemperatureC) {
      const minTemp = Number(requiredMinTemperatureC)
      const maxTemp = Number(requiredMaxTemperatureC)
      if (minTemp > maxTemp) {
        newErrors.temperature =
          lang === 'fr'
            ? 'Temp min > max'
            : lang === 'ar'
              ? 'درجة الحرارة الدنيا أعلى من العليا'
              : 'Min temp cannot be greater than max'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    if (!recommendedDeposits.length) {
      // Recommend deposits first
      setRecommendLoading(true)
      setRecommendError('')
      try {
        const dto = {
          quantity: Number(quantity),
          requiredHumidityLevel: requiredHumidityLevel || undefined,
          requiredMinTemperatureC: requiredMinTemperatureC ? Number(requiredMinTemperatureC) : undefined,
          requiredMaxTemperatureC: requiredMaxTemperatureC ? Number(requiredMaxTemperatureC) : undefined,
          requiredCapabilities: requiresRefrigeration ? ['refrigeration'] : undefined,
        }
        const response = await axiosInstance.post('/deposits/recommend', dto)
        setRecommendedDeposits(response.data)
      } catch (err) {
        setRecommendError('Failed to recommend deposits')
      } finally {
        setRecommendLoading(false)
      }
      return
    }
    if (!selectedDepositId) {
      setRecommendError('Please select a deposit')
      return
    }
    try {
      setSubmitting(true)
      const payload = {
        name,
        type: aidType,
        description: description || undefined,
        quantity: Number(quantity),
        depositId: selectedDepositId,
        requiresRefrigeration: requiresRefrigeration ? true : undefined,
        requiredHumidityLevel: requiredHumidityLevel || undefined,
        requiredMinTemperatureC: requiredMinTemperatureC ? Number(requiredMinTemperatureC) : undefined,
        requiredMaxTemperatureC: requiredMaxTemperatureC ? Number(requiredMaxTemperatureC) : undefined,
        familyId,
        unit: aidType,
      }
      if (isEditing) {
        const response = await aidService.updateAid(id!, payload)
        if (response) {
          success(lang === 'fr' ? 'Aide mise à jour' : lang === 'ar' ? 'تم تحديث المساعدة' : 'Aid updated successfully')
          navigate(`/aid/${id}`)
        }
      } else {
        const response = await aidService.createAid(payload)
        if (response) {
          success(
            lang === 'fr'
              ? 'Aide créée avec succès'
              : lang === 'ar'
                ? 'تم إنشاء المساعدة بنجاح'
                : 'Aid created successfully'
          )
          navigate('/aid')
        }
      }
    } catch (err) {
      console.error(err)
      showError(lang === 'fr' ? 'Une erreur est survenue' : lang === 'ar' ? 'حدث خطأ' : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {lang === 'fr' ? 'Chargement...' : lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(isEditing ? `/aid/${id}` : '/aid')}
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium mb-4"
          >
            ← {lang === 'fr' ? 'Retour' : lang === 'ar' ? 'رجوع' : 'Back'}
          </button>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isEditing
              ? lang === 'fr'
                ? 'Modifier l\'aide'
                : lang === 'ar'
                  ? 'تعديل المساعدة'
                  : 'Edit Aid'
              : lang === 'fr'
                ? 'Créer une aide'
                : lang === 'ar'
                  ? 'إنشاء مساعدة'
                  : 'Create Aid'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {lang === 'fr'
              ? 'Remplissez les informations ci-dessous'
              : lang === 'ar'
                ? 'املأ المعلومات أدناه'
                : 'Fill in the information below'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {lang === 'fr' ? 'Nom de l\'aide' : lang === 'ar' ? 'اسم المساعدة' : 'Aid Name'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors({ ...errors, name: '' })
                }}
                placeholder={lang === 'fr' ? 'Ex: Riz' : lang === 'ar' ? 'مثال: الأرز' : 'Ex: Rice'}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
                  }
                `}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {lang === 'fr' ? 'Type d\'aide' : lang === 'ar' ? 'نوع المساعدة' : 'Aid Type'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <select
                value={aidType}
                onChange={(e) => {
                  setAidType(e.target.value)
                  if (errors.type) setErrors({ ...errors, type: '' })
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  ${
                    errors.type
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
                  }
                `}
              >
                <option value="FOOD">🍞 {lang === 'fr' ? 'Alimentaire' : lang === 'ar' ? 'غذائية' : 'Food'}</option>
                <option value="MEDICAL">💊 {lang === 'fr' ? 'Médicale' : lang === 'ar' ? 'طبية' : 'Medical'}</option>
                <option value="EDUCATIONAL">📚 {lang === 'fr' ? 'Éducative' : lang === 'ar' ? 'تعليمية' : 'Educational'}</option>
                <option value="CLOTHING">👔 {lang === 'fr' ? 'Vestimentaire' : lang === 'ar' ? 'ملابس' : 'Clothing'}</option>
                <option value="SHELTER">🏠 {lang === 'fr' ? 'Logement' : lang === 'ar' ? 'إيواء' : 'Shelter'}</option>
                <option value="OTHER">📦 {lang === 'fr' ? 'Autre' : lang === 'ar' ? 'أخرى' : 'Other'}</option>
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {lang === 'fr' ? 'Description' : lang === 'ar' ? 'الوصف' : 'Description'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={lang === 'fr' ? 'Détails supplémentaires...' : lang === 'ar' ? 'التفاصيل الإضافية...' : 'Additional details...'}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {lang === 'fr' ? 'Quantité' : lang === 'ar' ? 'الكمية' : 'Quantity'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value)
                  if (errors.quantity) setErrors({ ...errors, quantity: '' })
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  ${
                    errors.quantity
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
                  }
                `}
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
            </div>

            {/* Refrigeration */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresRefrigeration}
                  onChange={(e) => setRequiresRefrigeration(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-primary-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {lang === 'fr'
                    ? 'Requiert de la réfrigération'
                    : lang === 'ar'
                      ? 'يتطلب الثلاجة'
                      : 'Requires Refrigeration'}
                </span>
              </label>
            </div>

            {/* Humidity Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {lang === 'fr' ? 'Niveau d\'humidité requis' : lang === 'ar' ? 'مستوى الرطوبة المطلوب' : 'Required Humidity Level'}
              </label>
              <select
                value={requiredHumidityLevel}
                onChange={(e) => setRequiredHumidityLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">
                  {lang === 'fr' ? 'Aucun' : lang === 'ar' ? 'لا شيء' : 'None'}
                </option>
                <option value="LOW">
                  {lang === 'fr' ? 'Basse' : lang === 'ar' ? 'منخفضة' : 'Low'}
                </option>
                <option value="MEDIUM">
                  {lang === 'fr' ? 'Moyenne' : lang === 'ar' ? 'متوسطة' : 'Medium'}
                </option>
                <option value="HIGH">
                  {lang === 'fr' ? 'Haute' : lang === 'ar' ? 'عالية' : 'High'}
                </option>
              </select>
            </div>

            {/* Temperature Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {lang === 'fr'
                    ? 'Temp min (C°)'
                    : lang === 'ar'
                      ? 'درجة الحرارة الدنيا'
                      : 'Min Temp (°C)'}
                </label>
                <input
                  type="number"
                  min="-50"
                  max="80"
                  value={requiredMinTemperatureC}
                  onChange={(e) => {
                    setRequiredMinTemperatureC(e.target.value)
                    if (errors.temperature) setErrors({ ...errors, temperature: '' })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {lang === 'fr'
                    ? 'Temp max (C°)'
                    : lang === 'ar'
                      ? 'درجة الحرارة العليا'
                      : 'Max Temp (°C)'}
                </label>
                <input
                  type="number"
                  min="-50"
                  max="80"
                  value={requiredMaxTemperatureC}
                  onChange={(e) => {
                    setRequiredMaxTemperatureC(e.target.value)
                    if (errors.temperature) setErrors({ ...errors, temperature: '' })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            {errors.temperature && <p className="text-sm text-red-500">{errors.temperature}</p>}

            {/* Family selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {lang === 'fr' ? 'Famille' : lang === 'ar' ? 'العائلة' : 'Family'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={familyId}
                onChange={e => setFamilyId(e.target.value)}
                placeholder={lang === 'fr' ? 'ID de la famille' : lang === 'ar' ? 'معرف العائلة' : 'Family ID'}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate(isEditing ? `/aid/${id}` : '/aid')}
                className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {lang === 'fr' ? 'Annuler' : lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={submitting || recommendLoading}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {recommendLoading
                  ? 'Recommending deposits...'
                  : submitting
                    ? lang === 'fr'
                      ? 'Envoi...'
                      : lang === 'ar'
                        ? 'إرسال...'
                        : 'Submitting...'
                    : isEditing
                      ? lang === 'fr'
                        ? 'Mettre à jour'
                        : lang === 'ar'
                          ? 'تحديث'
                          : 'Update'
                      : lang === 'fr'
                        ? 'Créer'
                        : lang === 'ar'
                          ? 'إنشاء'
                          : 'Create'}
              </button>
            </div>
            {recommendError && <p className="mt-4 text-sm text-red-500">{recommendError}</p>}
            {recommendedDeposits.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {lang === 'fr' ? 'Sélectionner un dépôt recommandé' : lang === 'ar' ? 'اختر مستودعاً موصى به' : 'Select a recommended deposit'}
                </label>
                <select
                  value={selectedDepositId}
                  onChange={e => setSelectedDepositId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{lang === 'fr' ? 'Sélectionner' : lang === 'ar' ? 'اختر' : 'Select'}</option>
                  {recommendedDeposits.map(deposit => (
                    <option key={deposit.id} value={deposit.id}>
                      {deposit.name} ({deposit.city || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateEditAidPage
