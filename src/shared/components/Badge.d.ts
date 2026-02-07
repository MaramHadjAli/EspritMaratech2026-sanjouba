/**
 * Badge Component
 * Displays status, labels, or counts
 */
import React from 'react';
type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
type BadgeSize = 'sm' | 'md' | 'lg';
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    size?: BadgeSize;
    icon?: React.ReactNode;
    children: React.ReactNode;
    dot?: boolean;
}
export declare const Badge: React.FC<BadgeProps>;
export default Badge;
//# sourceMappingURL=Badge.d.ts.map