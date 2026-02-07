/**
 * Spinner / Loader Component
 * Loading indicator with animation
 */
import React from 'react';
type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerColor = 'primary' | 'white' | 'gray';
interface SpinnerProps {
    size?: SpinnerSize;
    color?: SpinnerColor;
    label?: string;
}
export declare const Spinner: React.FC<SpinnerProps>;
export default Spinner;
//# sourceMappingURL=Spinner.d.ts.map