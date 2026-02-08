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
import { familyService } from '@services/family.service'
import { Button } from '@components/Button'
import { StepProgressBar, Step } from '@components/StepProgressBar'
import Header from '@components/Header'
import { useOffline } from '@hooks/useOffline'

// ---------- SVG Icons for visual polish ----------
const PhoneIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
)
const UserIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)
const MapIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
)
const HomeIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
)
const UsersIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
)
const CalendarIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)
const GiftIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
)
const HashIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
  </svg>
)
const NoteIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
)
const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
)
const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
)
const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

// ---------- Toggle Switch ----------
const ToggleSwitch: React.FC<{
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  icon?: React.ReactNode
}> = ({ checked, onChange, label, icon }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`flex items-center gap-3 w-full p-4 rounded-xl border-2 transition-all duration-300
      ${checked
        ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-500'
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
      }
    `}
  >
    {icon && <span className={`text-lg ${checked ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`}>{icon}</span>}
    <span className={`flex-1 text-left text-sm font-medium ${checked ? 'text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'}`}>
      {label}
    </span>
    <div
      className={`relative w-11 h-6 rounded-full transition-colors duration-300
        ${checked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}
      `}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300
          ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}
        `}
      />
    </div>
  </button>
)

// ---------- Input wrapper with icon ----------
const InputWithIcon: React.FC<{
  icon: React.ReactNode
  error?: string
  children: React.ReactNode
}> = ({ icon, error, children }) => (
  <div>
    <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800
      ${error
        ? 'border-red-400 dark:border-red-500 ring-2 ring-red-100 dark:ring-red-900/30'
        : 'border-gray-200 dark:border-gray-700 focus-within:border-primary-400 dark:focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/30'
      }
    `}>
      <span className="pl-4 flex-shrink-0">{icon}</span>
      {children}
    </div>
    {error && <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
      {error}
    </p>}
  </div>
)

// ---------- Aid categories ----------
const AID_CATEGORIES = [
  { value: 'FOOD', label: '🍞 Food', labelFr: '🍞 Alimentaire', labelAr: '🍞 غذائية' },
  { value: 'MEDICAL', label: '💊 Medical', labelFr: '💊 Médicale', labelAr: '💊 طبية' },
  { value: 'EDUCATIONAL', label: '📚 Educational', labelFr: '📚 Éducative', labelAr: '📚 تعليمية' },
  { value: 'CLOTHING', label: '👔 Clothing', labelFr: '👔 Vestimentaire', labelAr: '👔 ملابس' },
  { value: 'SHELTER', label: '🏠 Shelter', labelFr: '🏠 Logement', labelAr: '🏠 إيواء' },
  { value: 'OTHER', label: '📦 Other', labelFr: '📦 Autre', labelAr: '📦 أخرى' },
]

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
  const { isOffline, queueAction } = useOffline()

  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLDivElement>(null)

  // Step 1 fields (required)
  const [phone, setPhone] = useState('')
  const [lastName, setLastName] = useState('')
  const [location, setLocation] = useState('')

  // Step 2 fields (optional)
  const [address, setAddress] = useState('')
  const [numberOfMembers, setNumberOfMembers] = useState('')
  const [visitCount, setVisitCount] = useState('')
  const [hasElderly, setHasElderly] = useState(false)
  const [hasDisabled, setHasDisabled] = useState(false)
  const [hasStudent, setHasStudent] = useState(false)

  // Step 3 fields
  const [aidType, setAidType] = useState('FOOD')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [notes, setNotes] = useState('')

  const isEditing = !!id
  const lang = i18n.language

  const steps: Step[] = [
    { 
      label: lang === 'fr' ? 'Identification' : lang === 'ar' ? 'التعريف' : 'Identification',
      description: lang === 'fr' ? 'Infos de contact' : lang === 'ar' ? 'المعلومات الاتصال' : 'Contact info'
    },
    { 
      label: lang === 'fr' ? 'Détails' : lang === 'ar' ? 'التفاصيل' : 'Details',
      description: lang === 'fr' ? 'Infos famille' : lang === 'ar' ? 'المعلومات العائلة' : 'Family info'
    },
    { 
      label: lang === 'fr' ? 'Aide' : lang === 'ar' ? 'المساعدة' : 'Aid',
      description: lang === 'fr' ? 'Type & quantité' : lang === 'ar' ? 'النوع والكمية' : 'Type & quantity'
    },
  ]

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

      // 1. Create/update family
      const familyPayload = {
        name: lastName,
        phoneNumber: phone,
        address: address || location,
        familySize: numberOfMembers ? parseInt(numberOfMembers) : 1,
        categoryPhotos: {
          schoolChildren: hasStudent,
          student: hasStudent,
          elderly: hasElderly,
        },
        notes: notes || undefined,
      }

      // 2. Create aid
      const aidPayload = {
        familyId: '',
        type: aidType,
        description: description || undefined,
        quantity: Number(quantity),
        unit: 'unit',
        description: notes || undefined,
      }

      // ── OFFLINE MODE ──
      if (isOffline) {
        await queueAction({
          type: 'CREATE_FAMILY',
          endpoint: '/family',
          method: 'POST',
          payload: familyPayload,
          createdAt: new Date().toISOString(),
          retries: 0,
          status: 'pending',
          label: `${lang === 'fr' ? 'Famille' : 'Family'}: ${lastName}`,
        })
        await queueAction({
          type: 'CREATE_AID',
          endpoint: '/aids',
          method: 'POST',
          payload: aidPayload,
          createdAt: new Date().toISOString(),
          retries: 0,
          status: 'pending',
          label: `${lang === 'fr' ? 'Aide' : 'Aid'}: ${aidType} - ${lastName}`,
        })
        success(lang === 'fr' ? 'Sauvegardé hors ligne — sera envoyé au retour du réseau' : lang === 'ar' ? 'تم الحفظ بدون اتصال — سيتم الإرسال عند عودة الشبكة' : 'Saved offline — will sync when back online')
        navigate('/home')
        return
      }

      // ── ONLINE MODE ──
      let familyId = ''
      try {
        const familyRes = await familyService.createFamily(familyPayload)
        familyId = familyRes?.data?.id || (familyRes as any)?.id || ''
      } catch {
        // If family creation fails, still try to create aid without familyId
      }

      aidPayload.familyId = familyId

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
          navigate('/')
        }
      }
    } catch (err) {
      // If network fails mid-submit, queue it offline
      // Note: Deduplication in offlineStorage prevents double queuing
      if (!navigator.onLine) {
        const familyPayload = {
          name: lastName,
          phoneNumber: phone,
          address: address || location,
          familySize: numberOfMembers ? parseInt(numberOfMembers) : 1,
          categoryPhotos: {
            schoolChildren: hasStudent,
            student: hasStudent,
            elderly: hasElderly,
          },
          notes: notes || undefined,
        }
        const aidPayload = {
          familyId: '',
          type: aidType,
          quantity: Number(quantity),
          unit: 'unit',
          description: notes || undefined,
        }
        // Queue both family and aid (deduplication handles if already queued)
        await queueAction({
          type: 'CREATE_FAMILY',
          endpoint: '/family',
          method: 'POST',
          payload: familyPayload,
          createdAt: new Date().toISOString(),
          retries: 0,
          status: 'pending',
          label: `${lang === 'fr' ? 'Famille' : 'Family'}: ${lastName}`,
        })
        await queueAction({
          type: 'CREATE_AID',
          endpoint: '/aids',
          method: 'POST',
          payload: aidPayload,
          createdAt: new Date().toISOString(),
          retries: 0,
          status: 'pending',
          label: `${lang === 'fr' ? 'Aide' : 'Aid'}: ${aidType} - ${lastName}`,
        })
        success(lang === 'fr' ? 'Connexion perdue — sauvegardé hors ligne' : 'Connection lost — saved offline')
        navigate('/home')
      } else {
        showError(lang === 'fr' ? 'Une erreur est survenue' : lang === 'ar' ? 'حدث خطأ' : 'An error occurred')
      }
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

            {/* Step Progress Bar */}
            <div className="px-6 sm:px-10 pb-8">
              <StepProgressBar steps={steps} currentStep={currentStep} />
            </div>

            {/* Step Content */}
            <div className="px-6 sm:px-10 pb-10">

              {/* ===== STEP 1: Identification ===== */}
              {currentStep === 0 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <UserIcon />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                      {lang === 'fr' ? 'Informations de contact' : lang === 'ar' ? 'المعلومات الاتصال' : 'Contact Information'}
                    </h2>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {lang === 'fr' ? 'Numéro de téléphone' : lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} <span className="text-red-500">*</span>
                    </label>
                    <InputWithIcon icon={<PhoneIcon />} error={stepErrors.phone}>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); setStepErrors(prev => ({ ...prev, phone: '' })) }}
                        placeholder={lang === 'fr' ? 'Ex: +216 XX XXX XXX' : 'Ex: +216 XX XXX XXX'}
                        className="w-full px-3 py-3.5 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm"
                      />
                    </InputWithIcon>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {lang === 'fr' ? 'Nom de famille' : lang === 'ar' ? 'اسم العائلة' : 'Last Name'} <span className="text-red-500">*</span>
                    </label>
                    <InputWithIcon icon={<UserIcon />} error={stepErrors.lastName}>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => { setLastName(e.target.value); setStepErrors(prev => ({ ...prev, lastName: '' })) }}
                        placeholder={lang === 'fr' ? 'Nom de la famille' : lang === 'ar' ? 'اسم العائلة' : 'Family name'}
                        className="w-full px-3 py-3.5 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm"
                      />
                    </InputWithIcon>
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
            
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate(isEditing ? `/aid/${id}` : '/aid')}
                className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {lang === 'fr' ? 'Annuler' : lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={recommendLoading || recommendedDeposits.length > 0}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={async () => {
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
                }}
              >
                {recommendLoading ? (lang === 'fr' ? 'Recherche...' : lang === 'ar' ? 'جاري البحث...' : 'Getting deposits...') : (lang === 'fr' ? 'Obtenir dépôts' : lang === 'ar' ? 'الحصول على المستودعات' : 'Get Deposits')}
              </button>
              <button
                type="submit"
                disabled={submitting || recommendLoading || !recommendedDeposits.length}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
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
                <div className="mb-4 flex gap-4 overflow-x-auto">
                  {recommendedDeposits.map(deposit => {
                    const fillPercent = Math.round((deposit.currentQuantity / deposit.capacity) * 100)
                    return (
                      <div
                        key={deposit.id}
                        className={`relative flex flex-col items-center p-3 rounded-lg shadow border transition-all cursor-pointer ${selectedDepositId === deposit.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' : 'border-gray-200 bg-white dark:bg-gray-800'}`}
                        style={{ minWidth: 220, zIndex: 10 }}
                        onClick={() => setSelectedDepositId(deposit.id)}
                      >
                        <img src={deposit.containerImageUrl} alt={deposit.name} className="w-32 h-20 object-cover rounded mb-2" />
                        <div className="w-full h-2 bg-gray-200 rounded mb-2">
                          <div
                            className="h-2 rounded bg-primary-500"
                            style={{ width: `${fillPercent}%` }}
                          ></div>
                        </div>
                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">{deposit.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{deposit.city} ({deposit.region})</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{lang === 'fr' ? 'Remplissage' : lang === 'ar' ? 'مملوء' : 'Full'}: {fillPercent}%</div>
                      </div>
                    )
                  })}
                </div>
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
