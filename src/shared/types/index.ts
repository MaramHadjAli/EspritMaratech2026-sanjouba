/**
 * OMNIA - Comprehensive Type Definitions
 * All types used across the frontend application
 */

// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
}

export type UserRoleString = 'GUEST' | 'USER' | 'EMPLOYEE' | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole | UserRoleString
  phone?: string | null
  isEmailValidated: boolean
  currentVisit?: Pick<Visit, 'id'> | null
  createdAt: string
  deletedAt?: string | null
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isRestoring: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupFormData) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

export interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  name: string
  phoneNumber: string
  dateOfBirth: string
  location: string
}

export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface UpdateUserData {
  name: string
  email: string
  phoneNumber: string
  organization?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface PasswordResetData {
  contactMethod: 'email' | 'phone'
  value: string
  code?: string
  newPassword?: string
}


// ============================================
// FAMILY TYPES
// ============================================

export enum SocioeconomicStatus {
  VERY_VULNERABLE = 'very_vulnerable',
  VULNERABLE = 'vulnerable',
  STABLE = 'stable',
}

export enum FamilyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export interface Family {
  // Exposed fields
  id: string
  lastName: string
  phone?: string | null
  address?: string | null
  numberOfMembers: number
  containsDisabledMember: boolean
  containsElderlyMember: boolean
  containspupilMember: boolean
  notes?: string | null
  vulnerabilityScore: number
  createdAt: string
  deletedAt?: string | null
  // UI-only fields (not exposed by backend)
  headOfFamily?: string
  name?: string
  familySize?: number
  phoneNumber?: string
  secondaryPhone?: string
  latitude?: number
  longitude?: number
  socioeconomicStatus?: SocioeconomicStatus
  photoType?: 'STUDENT' | 'UNIVERSITY_STUDENT' | 'ELDERLY' | 'SICK'
  photos?: {
    type: 'STUDENT' | 'UNIVERSITY_STUDENT' | 'ELDERLY' | 'SICK'
    url: string
  }[]
  status?: FamilyStatus | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  updatedAt?: string
}

export interface AddFamilyData {
  name: string
  address: string
  phoneNumber: string
  secondaryPhone?: string
  familySize: number
  categoryPhotos: {
    schoolChildren: boolean
    student: boolean
    elderly: boolean
  }
  notes?: string
  latitude?: number
  longitude?: number
}

// ============================================
// CAMPAIGN & VISIT TYPES
// ============================================

export enum CampaignType {
  FOOD_DISTRIBUTION = 'food_distribution',
  MEDICAL_VISIT = 'medical_visit',
  SPECIALIZED_AID = 'specialized_aid',
  OTHER = 'other',
}

export interface Campaign {
  id: string
  name: string
  description: string
  location: {
    latitude: number
    longitude: number
  }
  address: string
  createdBy: string
  members: string[]
  createdAt: string
  updatedAt: string
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
}

export interface Visit {
  // Exposed fields
  id: string
  startDate: Date | string
  endDate?: Date | string | null
  latitude?: number | null
  longitude?: number | null
  city?: string | null
  region?: string | null
  isActive: boolean
  isCompleted: boolean
  statsComputed: boolean
  notes?: string | null
  users?: Array<Pick<User, 'id' | 'name' | 'email'>>
  // UI-only fields (not exposed by backend but used for display)
  campaignName?: string
  campaignId?: string
  campaignType?: CampaignType
  description?: string
  familiesCount?: number
  personCount?: number
  couldNotBeReachedCount?: number
  startTime?: string
  endTime?: string
  location?: {
    latitude: number
    longitude: number
  }
  status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  address?: string
  createdBy?: string
  members?: string[]
  familyId?: string
  employeeId?: string
  photos?: string[]
}

export interface CreateVisitData {
  startDate: string
  endDate?: string
  notes?: string
  userIds?: string[]
  latitude?: number
  longitude?: number
  // Legacy fields (for backward compatibility)
  campaignName?: string
  campaignType?: CampaignType
  description?: string
  date?: string
  time?: string
  location?: {
    latitude: number
    longitude: number
  }
  address?: string
  members?: string[]
}

export interface EditVisitData extends CreateVisitData {
  id: string
}



// ============================================
// AID TYPES
// ============================================

export enum AidType {
  FOOD_PACKAGE = 'food_package',
  FOOD = 'FOOD',
  MEDICINE = 'medicine',
  CLOTHING = 'clothing',
  MEDICAL_VISIT = 'medical_visit',
  FUEL = 'fuel',
  OTHER = 'other',
}

export interface Aid {
  // Exposed fields
  id: string
  name: string
  type: AidType | string
  description?: string | null
  quantity: number
  requiredMinTemperatureC?: number | null
  requiredMaxTemperatureC?: number | null
  requiredHumidityLevel?: string | null
  requiresRefrigeration: boolean
  deposit?: Pick<Deposit, 'id' | 'name' | 'city'> | null
  createdAt: string
  deletedAt?: string | null
  // UI-only fields (not exposed by backend)
  familyId?: string
  visitId?: string
  unit?: string
  weight?: number
  addedAt?: string
}

export interface Medicine {
  id: string
  familyId: string
  name: string
  dosage: string
  frequency?: string
  description?: string
  addedAt: string
}

export interface AddAidData {
  familyId?: string
  visitId?: string
  type: AidType | string
  items?: { name: string; quantity: number }[]
  quantity: number
  unit?: string
  description?: string
  weight?: number
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardStats {
  totalFamilies: number
  totalVisits: number
  totalAidsDistributed: number
  totalRegions?: number
  visitsEvolution?: { month: string; visits: number }[]
  aidDistribution?: { type: string; value: number }[]
  regionalStats?: { region: string; families: number; visits: number }[]
}

export interface RegionalStats {
  region: string
  familiesCount: number
  visitsCount: number
}

export interface CityBoundary {
  id: string
  city: string
  region: string | null
  countryCode: string | null
  geojson: Record<string, unknown>
  bbox: [number, number, number, number] | null
  source: string | null
  externalId: string | null
  externalType: string | null
  createdAt: string
  updatedAt: string
}

// ============================================
// NOTIFICATION TYPES
// ============================================


// Notification and Theme Types
export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
  action?: {
    label: string
    callback: () => void
  }
}

export type Toast = Notification

export interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export interface ThemeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
  fontScale: number
  increaseFontSize: () => void
  decreaseFontSize: () => void
  resetFontSize: () => void
}

export type Language = 'fr' | 'ar' | 'en'

export interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isRTL: boolean
}

export interface AccessibilityContextType {
  isTTSEnabled: boolean
  toggleTTS: () => void
  isKeyboardNavEnabled: boolean
  toggleKeyboardNav: () => void
  isHighContrastMode: boolean
  toggleHighContrast: () => void
  fontSize: number
  setFontSize: (size: number) => void
}

// Offline sync types
export interface OfflineQueueItem {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  resource: string
  data: Record<string, any>
  timestamp: number
  synced: boolean
}

export interface OfflineContextType {
  isOnline: boolean
  syncQueue: OfflineQueueItem[]
  isSyncing: boolean
  addToQueue: (item: OfflineQueueItem) => void
  sync: () => Promise<void>
  clearQueue: () => void
}

// ============================================
// DEPOSIT TYPES
// ============================================

export interface Deposit {
  id: string
  name: string
  description?: string | null
  address?: string | null
  city?: string | null
  region?: string | null
  latitude?: number | null
  longitude?: number | null
  capacity: number
  currentQuantity: number
  minTemperatureC?: number | null
  maxTemperatureC?: number | null
  humidityLevel: string
  isRefrigerated: boolean
  containerImageUrl?: string | null
  createdAt: string
  updatedAt: string
}

// ============================================
// LOCATION TYPES
// ============================================

export interface Location {
  id: string
  latitude: number
  longitude: number
  city?: string | null
  region?: string | null
  description?: string | null
  createdAt: string
  deletedAt?: string | null
}

// ============================================
// AID DISTRIBUTION TYPES
// ============================================

export interface AidDistribution {
  id: string
  quantity: number
  unit?: string | null
  notes?: string | null
  visit: Visit
  aid: Aid
  sourceDeposit?: Pick<Deposit, 'id' | 'name' | 'city' | 'region'> | null
  createdAt: string
  deletedAt?: string | null
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
    }
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

// ============================================
// FORM VALIDATION & UTILITIES
// ============================================

export interface FormError {
  field: string
  message: string
}

export interface PasswordStrength {
  score: number
  level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong'
}

export interface SelectOption<T = string> {
  label: string
  value: T
  icon?: React.ReactNode
  disabled?: boolean
}

// ...existing code...

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface ValidationError {
  field: string;
  message: string;
}

// Type aliases for easier imports in forms
export type CreateVisitDTO = CreateVisitData
export type EditVisitDTO = EditVisitData
export type CreateFamilyDTO = AddFamilyData
export type CreateAidDTO = AddAidData
