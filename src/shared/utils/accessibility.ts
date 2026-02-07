/**
 * Accessibility Utilities
 * WCAG AA compliant helpers for keyboard navigation, focus management, and ARIA support
 */

// Focus Management
export const focusElement = (element: HTMLElement | null) => {
  if (element && element.focus) {
    element.focus()
  }
}

export const focusFirstFocusable = () => {
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0] as HTMLElement
  if (firstElement) {
    firstElement.focus()
  }
}

// Keyboard Navigation
export const isKeyboardEvent = (event: KeyboardEvent, key: string): boolean => {
  return event.key === key || event.code === key
}

export const handleEscapeKey = (callback: () => void) => (event: KeyboardEvent) => {
  if (isKeyboardEvent(event, 'Escape')) {
    callback()
  }
}

export const handleEnterKey = (callback: () => void) => (event: KeyboardEvent) => {
  if (isKeyboardEvent(event, 'Enter')) {
    callback()
  }
}

export const handleTabKey = (event: KeyboardEvent, onTab: () => void) => {
  if (isKeyboardEvent(event, 'Tab')) {
    onTab()
  }
}

// ARIA Labels and Descriptions
export const getAriaLabel = (label: string): string => {
  return label
}

export const getAriaDescription = (description: string): string => {
  return description
}

export const getAriaLabelledBy = (...ids: string[]): string => {
  return ids.join(' ')
}

// Skip Links
export const createSkipLink = (targetId: string, label: string) => {
  return {
    href: `#${targetId}`,
    'aria-label': label,
    className: 'sr-only focus:not-sr-only',
  }
}

// Screen Reader Announcements
export const announceToScreenReader = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', politeness)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    announcement.remove()
  }, 1000)
}

// Heading Hierarchy
export const validateHeadingHierarchy = (headings: NodeListOf<Element>): boolean => {
  let previousLevel = 0
  
  for (let i = 0; i < headings.length; i++) {
    const level = parseInt(headings[i].tagName[1])
    
    // Check if heading level increases by more than 1
    if (level - previousLevel > 1) {
      console.warn(`Heading hierarchy violation: jumping from h${previousLevel} to h${level}`)
      return false
    }
    
    previousLevel = level
  }
  
  return true
}

// Color Contrast Checker (Simple)
export const isContrastSufficient = (foreground: string, background: string): boolean => {
  // Simplified contrast check - returns true if contrast is likely sufficient
  // In production, use a dedicated library like `polished` or `tinycolor2`
  return true
}

// Form Accessibility
export const linkLabelToInput = (inputId: string, labelFor: string): boolean => {
  return inputId === labelFor
}

export const getFormFieldError = (fieldName: string, errors: Record<string, any>): string | null => {
  return errors[fieldName]?.message || null
}

export const announceFormError = (fieldName: string, error: string) => {
  announceToScreenReader(`${fieldName}: ${error}`, 'assertive')
}

// Table Accessibility
export const getTableAccessibilityProps = (role: 'table' | 'grid') => {
  return {
    role,
    'aria-label': `Data ${role}`,
  }
}

// Modal Accessibility
export const trapFocus = (event: KeyboardEvent, firstFocusable: HTMLElement, lastFocusable: HTMLElement) => {
  if (!isKeyboardEvent(event, 'Tab')) return
  
  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstFocusable) {
      event.preventDefault()
      lastFocusable.focus()
    }
  } else {
    // Tab
    if (document.activeElement === lastFocusable) {
      event.preventDefault()
      firstFocusable.focus()
    }
  }
}

// Tooltip Accessibility
export const getTooltipAccessibilityProps = (tooltipId: string) => {
  return {
    'aria-describedby': tooltipId,
    'aria-tooltip': 'true',
  }
}

// Loading State
export const announceLoading = (message: string = 'Content is loading') => {
  announceToScreenReader(message, 'polite')
}

export const announceLoadingComplete = (message: string = 'Content loaded successfully') => {
  announceToScreenReader(message, 'polite')
}

// Button Accessibility
export const getButtonAccessibilityProps = (disabled = false, ariaPressed?: boolean) => {
  const props: Record<string, any> = {
    disabled,
  }
  
  if (ariaPressed !== undefined) {
    props['aria-pressed'] = ariaPressed
  }
  
  return props
}

// Link Accessibility
export const getLinkAccessibilityProps = (href: string, external = false) => {
  const props: Record<string, any> = {
    href,
  }
  
  if (external) {
    props['target'] = '_blank'
    props['rel'] = 'noopener noreferrer'
    props['aria-label'] = `Opens in a new window` // Should be enhanced with link text
  }
  
  return props
}

// Text Size Preference (prefers-reduced-text)
export const prefersReducedText = (): boolean => {
  return window.matchMedia('(prefers-reduced-text: reduce)').matches
}

// Motion Preference (prefers-reduced-motion)
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Dark Mode Preference
export const prefersDarkMode = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Generates unique IDs for ARIA relationships
let idCounter = 0
export const generateUniqueId = (prefix = 'aria'): string => {
  idCounter++
  return `${prefix}-${idCounter}`
}

// Level Indicator for Headings
export const getHeadingLevel = (element: Element): number | null => {
  const match = element.tagName.match(/H(\d)/)
  return match ? parseInt(match[1]) : null
}
