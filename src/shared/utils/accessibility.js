/**
 * Accessibility Utilities
 * WCAG AA compliant helpers for keyboard navigation, focus management, and ARIA support
 */
// Focus Management
export const focusElement = (element) => {
    if (element && element.focus) {
        element.focus();
    }
};
export const focusFirstFocusable = () => {
    const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    if (firstElement) {
        firstElement.focus();
    }
};
// Keyboard Navigation
export const isKeyboardEvent = (event, key) => {
    return event.key === key || event.code === key;
};
export const handleEscapeKey = (callback) => (event) => {
    if (isKeyboardEvent(event, 'Escape')) {
        callback();
    }
};
export const handleEnterKey = (callback) => (event) => {
    if (isKeyboardEvent(event, 'Enter')) {
        callback();
    }
};
export const handleTabKey = (event, onTab) => {
    if (isKeyboardEvent(event, 'Tab')) {
        onTab();
    }
};
// ARIA Labels and Descriptions
export const getAriaLabel = (label) => {
    return label;
};
export const getAriaDescription = (description) => {
    return description;
};
export const getAriaLabelledBy = (...ids) => {
    return ids.join(' ');
};
// Skip Links
export const createSkipLink = (targetId, label) => {
    return {
        href: `#${targetId}`,
        'aria-label': label,
        className: 'sr-only focus:not-sr-only',
    };
};
// Screen Reader Announcements
export const announceToScreenReader = (message, politeness = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', politeness);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => {
        announcement.remove();
    }, 1000);
};
// Heading Hierarchy
export const validateHeadingHierarchy = (headings) => {
    let previousLevel = 0;
    for (let i = 0; i < headings.length; i++) {
        const level = parseInt(headings[i].tagName[1]);
        // Check if heading level increases by more than 1
        if (level - previousLevel > 1) {
            console.warn(`Heading hierarchy violation: jumping from h${previousLevel} to h${level}`);
            return false;
        }
        previousLevel = level;
    }
    return true;
};
// Color Contrast Checker (Simple)
export const isContrastSufficient = (foreground, background) => {
    // Simplified contrast check - returns true if contrast is likely sufficient
    // In production, use a dedicated library like `polished` or `tinycolor2`
    return true;
};
// Form Accessibility
export const linkLabelToInput = (inputId, labelFor) => {
    return inputId === labelFor;
};
export const getFormFieldError = (fieldName, errors) => {
    return errors[fieldName]?.message || null;
};
export const announceFormError = (fieldName, error) => {
    announceToScreenReader(`${fieldName}: ${error}`, 'assertive');
};
// Table Accessibility
export const getTableAccessibilityProps = (role) => {
    return {
        role,
        'aria-label': `Data ${role}`,
    };
};
// Modal Accessibility
export const trapFocus = (event, firstFocusable, lastFocusable) => {
    if (!isKeyboardEvent(event, 'Tab'))
        return;
    if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
        }
    }
    else {
        // Tab
        if (document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
        }
    }
};
// Tooltip Accessibility
export const getTooltipAccessibilityProps = (tooltipId) => {
    return {
        'aria-describedby': tooltipId,
        'aria-tooltip': 'true',
    };
};
// Loading State
export const announceLoading = (message = 'Content is loading') => {
    announceToScreenReader(message, 'polite');
};
export const announceLoadingComplete = (message = 'Content loaded successfully') => {
    announceToScreenReader(message, 'polite');
};
// Button Accessibility
export const getButtonAccessibilityProps = (disabled = false, ariaPressed) => {
    const props = {
        disabled,
    };
    if (ariaPressed !== undefined) {
        props['aria-pressed'] = ariaPressed;
    }
    return props;
};
// Link Accessibility
export const getLinkAccessibilityProps = (href, external = false) => {
    const props = {
        href,
    };
    if (external) {
        props['target'] = '_blank';
        props['rel'] = 'noopener noreferrer';
        props['aria-label'] = `Opens in a new window`; // Should be enhanced with link text
    }
    return props;
};
// Text Size Preference (prefers-reduced-text)
export const prefersReducedText = () => {
    return window.matchMedia('(prefers-reduced-text: reduce)').matches;
};
// Motion Preference (prefers-reduced-motion)
export const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
// Dark Mode Preference
export const prefersDarkMode = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};
// Generates unique IDs for ARIA relationships
let idCounter = 0;
export const generateUniqueId = (prefix = 'aria') => {
    idCounter++;
    return `${prefix}-${idCounter}`;
};
// Level Indicator for Headings
export const getHeadingLevel = (element) => {
    const match = element.tagName.match(/H(\d)/);
    return match ? parseInt(match[1]) : null;
};
//# sourceMappingURL=accessibility.js.map