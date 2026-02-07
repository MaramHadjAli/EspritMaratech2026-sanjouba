/**
 * Avatar Component
 * Displays user profile pictures or initials fallback
 */
import React from 'react';
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarShape = 'circle' | 'square';
interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    initials?: string;
    size?: AvatarSize;
    shape?: AvatarShape;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
    online?: boolean;
}
export declare const Avatar: React.FC<AvatarProps>;
export default Avatar;
//# sourceMappingURL=Avatar.d.ts.map