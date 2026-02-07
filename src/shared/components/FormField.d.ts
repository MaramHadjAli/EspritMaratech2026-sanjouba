/**
 * FormField Component
 * Wrapper for labels, inputs, and error messages
 */
import React from 'react';
interface FormFieldProps {
    label: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}
export declare const FormField: React.FC<FormFieldProps>;
export default FormField;
//# sourceMappingURL=FormField.d.ts.map