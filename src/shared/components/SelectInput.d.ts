/**
 * SelectInput Component
 * Dropdown select field with accessible options
 */
import React from 'react';
interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}
interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
}
export declare const SelectInput: React.ForwardRefExoticComponent<SelectInputProps & React.RefAttributes<HTMLSelectElement>>;
export default SelectInput;
//# sourceMappingURL=SelectInput.d.ts.map