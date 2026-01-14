import React from 'react';

interface SquircleCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * LABUBU 卡通可爱卡片容器
 * Polaroid 风格 + 漫画硬阴影
 */
export const SquircleCard: React.FC<SquircleCardProps> = ({ children, className = "" }) => (
  <div
    className={`relative overflow-hidden transition-all duration-500 hard-shadow ${className}`}
    style={{
      borderRadius: '28px',
      border: '3px solid #634343'
    }}
  >
    {children}
  </div>
);
