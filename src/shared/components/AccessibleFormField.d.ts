/**
 * AccessibleFormField Component
 * WCAG AA compliant form field with proper labeling and error handling
 */
import React from 'react';
interface AccessibleFormFieldProps {
    id?: string;
    label: string;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    children: React.ReactElement;
    className?: string;
}
export declare const AccessibleFormField: React.ForwardRefExoticComponent<AccessibleFormFieldProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=AccessibleFormField.d.ts.map