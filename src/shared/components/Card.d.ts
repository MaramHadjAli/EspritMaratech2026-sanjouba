/**
 * Card Component
 * Generic container for content with styling
 */
import React from 'react';
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    bordered?: boolean;
    hoverable?: boolean;
    children: React.ReactNode;
}
export declare const Card: React.FC<CardProps>;
export default Card;
//# sourceMappingURL=Card.d.ts.map