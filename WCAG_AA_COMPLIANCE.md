# WCAG 2.1 AA Compliance Guide

## Overview
This document outlines OMNIA's approach to meeting WCAG 2.1 AA (Web Content Accessibility Guidelines Level AA) standards.

## Available Accessibility Tools

### Utilities (`src/shared/utils/accessibility.ts`)
- **Focus Management**: `focusElement()`, `focusFirstFocusable()`
- **Keyboard Navigation**: `isKeyboardEvent()`, `handleEscapeKey()`, `handleEnterKey()`, `trapFocus()`
- **ARIA Support**: `getAriaLabel()`, `getAriaDescription()`, `getAriaLabelledBy()`
- **Screen Reader**: `announceToScreenReader()`, `announceLoading()`, `announceLoadingComplete()`
- **Preference Detection**: `prefersReducedMotion()`, `prefersReducedText()`, `prefersDarkMode()`

### Hooks (`src/shared/hooks/useAccessibility.ts`)
- **useAccessibility**: Main hook for accessibility features
- **useAriaLabel**: Manage ARIA labels dynamically
- **useKeyboardNavigation**: Handle keyboard interactions
- **useFocusVisible**: Show focus only for keyboard users
- **useThemePreference**: Detect theme preferences
- **useMotionPreference**: Detect motion preferences

### Components
- **AccessibleButton**: WCAG AA compliant button with proper keyboard support
- **AccessibleFormField**: Proper labeling and error handling for forms
- **AccessibleModal**: Focus management and keyboard support for modals

## WCAG 2.1 AA Principles

### 1. Perceivable
- ✅ **Text Alternatives**: All images have alt text
- ✅ **Adaptable**: Content is adaptable without loss of information
- ✅ **Distinguishable**: Sufficient color contrast (4.5:1 for normal text)

### 2. Operable
- ✅ **Keyboard Accessible**: All functionality available via keyboard
- ✅ **No Keyboard Trap**: Users can navigate away from components
- ✅ **Focus Visible**: Clear focus indicators for keyboard users
- ✅ **Focus Order**: Logical tab order

### 3. Understandable
- ✅ **Readable**: Content is readable and understandable
- ✅ **Predictable**: Consistent navigation and behavior
- ✅ **Input Assistance**: Labels, error messages, and suggestions

### 4. Robust
- ✅ **Compatible**: Works with assistive technologies
- ✅ **ARIA Proper Use**: Correct ARIA roles and attributes
- ✅ **Semantic HTML**: Proper use of HTML elements

## Implementation Guide

### Keyboard Navigation
```tsx
import { useKeyboardNavigation } from '@hooks/useAccessibility'

export const MyComponent = () => {
  const { handleKeyDown } = useKeyboardNavigation({
    onEnter: () => handleSubmit(),
    onEscape: () => handleClose(),
  })

  return <div onKeyDown={handleKeyDown}>...</div>
}
```

### Form Fields
```tsx
import { AccessibleFormField } from '@components/AccessibleFormField'

export const MyForm = () => {
  return (
    <AccessibleFormField
      label="Email"
      error={errors.email?.message}
      hint="Enter a valid email address"
      required
    >
      <input type="email" />
    </AccessibleFormField>
  )
}
```

### Buttons
```tsx
import { AccessibleButton } from '@components/AccessibleButton'

export const MyButton = () => {
  return (
    <AccessibleButton
      ariaLabel="Delete item"
      ariaDescription="This action cannot be undone"
      variant="danger"
    >
      Delete
    </AccessibleButton>
  )
}
```

### Modals
```tsx
import { AccessibleModal } from '@components/AccessibleModal'

export const MyModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Confirm Action"
    >
      <p>Are you sure you want to proceed?</p>
    </AccessibleModal>
  )
}
```

### Screen Reader Announcements
```tsx
import { announceToScreenReader } from '@utils/accessibility'

const handleSuccess = () => {
  announceToScreenReader('Form submitted successfully', 'polite')
}

const handleError = (message: string) => {
  announceToScreenReader(`Error: ${message}`, 'assertive')
}
```

### Respecting User Preferences
```tsx
import { useMotionPreference } from '@hooks/useAccessibility'

export const MyAnimation = () => {
  const { allowMotion } = useMotionPreference()

  return (
    <div
      className={allowMotion ? 'animate-fade-in' : 'opacity-100'}
    >
      Content
    </div>
  )
}
```

## Testing Checklist

### Manual Testing
- [ ] Tab through entire page - is focus visible?
- [ ] Can all functionality be accessed via keyboard?
- [ ] Are form labels properly associated with inputs?
- [ ] Are error messages clearly presented?
- [ ] Is the focus order logical?
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)

### Automated Testing
- [ ] Run axe DevTools browser extension
- [ ] Use WAVE (WebAIM) browser extension
- [ ] Check color contrast with Contrast Checker

### Tools
- **axe DevTools**: Chrome/Firefox extension for accessibility testing
- **WAVE**: WebAIM browser extension
- **Lighthouse**: Chrome DevTools built-in audit
- **NVDA**: Free screen reader for Windows
- **VoiceOver**: Built-in screen reader for macOS/iOS

## Common Issues & Solutions

### Issue: No Focus Indicator
**Solution**: Use `useFocusVisible()` hook to show focus ring only for keyboard users
```tsx
const { isFocusVisible } = useFocusVisible()
className={isFocusVisible ? 'ring-2 ring-primary-500' : ''}
```

### Issue: Unclear Form Errors
**Solution**: Use `AccessibleFormField` with error prop
```tsx
<AccessibleFormField
  label="Email"
  error={errors.email?.message}
>
  <input />
</AccessibleFormField>
```

### Issue: Modal Focus Not Trapped
**Solution**: Use `AccessibleModal` component or `useAccessibility()` hook
```tsx
<AccessibleModal isOpen={isOpen} onClose={onClose} title="Title">
  Content
</AccessibleModal>
```

### Issue: Images Without Alt Text
**Solution**: Always include descriptive alt text
```tsx
<img src="chart.png" alt="Monthly revenue trends showing 15% growth" />
```

### Issue: Insufficient Color Contrast
**Solution**: Use dark mode complementary colors with minimum 4.5:1 ratio
```tsx
// Light text on dark background
className="text-white dark:text-gray-100"
```

## i18n Accessibility

The application supports French, English, and Arabic with full WCAG AA compliance:
- All translations accessible via `useTranslation('accessibility')` key
- RTL support for Arabic automatically handled
- Language change announced to screen readers

## Ongoing Maintenance

1. **Regular Audits**: Run accessibility tests monthly
2. **User Testing**: Test with real users using assistive technologies
3. **Team Training**: Ensure developers understand WCAG standards
4. **Documentation**: Keep component docs updated with accessibility features
5. **Bug Tracking**: Monitor and fix accessibility issues promptly

## Resources

- [WCAG 2.1 Official Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)
- [Inclusive Components](https://inclusive-components.design/)

## Support

For accessibility questions or issues:
1. Check this documentation
2. Test with accessibility tools
3. Review component examples in Storybook
4. Contact the accessibility team
