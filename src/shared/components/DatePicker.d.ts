/**
 * DatePicker Component
 * Accessible date input field
 */
import React from 'react';
interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    disabledDate?: (date: Date) => boolean;
}
export declare const DatePicker: React.ForwardRefExoticComponent<DatePickerProps & React.RefAttributes<HTMLInputElement>>;
export default DatePicker;
//# sourceMappingURL=DatePicker.d.ts.map