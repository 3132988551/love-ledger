import React from 'react';

interface SquircleCardProps {
  children: React.ReactNode;
  className?: string;
  isLandscape?: boolean;
}

/**
 * LABUBU 卡通可爱卡片容器
 * Polaroid 风格 + 漫画硬阴影 + 白色内边距
 */
export const SquircleCard: React.FC<SquircleCardProps> = ({ children, className = "", isLandscape = false }) => (
  <div
    className={`relative transition-all duration-500 hard-shadow ${className}`}
    style={{
      borderRadius: '28px',
      border: '3px solid #634343',
      backgroundColor: '#FFF9F5',
      padding: '20px'
    }}
  >
    {/* Washi Tape decoration for landscape images */}
    {isLandscape && (
      <div
        className="absolute -top-1 left-1/4 w-24 h-8 z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.7) 0%, rgba(255, 192, 203, 0.7) 100%)',
          transform: 'rotate(-3deg)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          borderLeft: '1px dashed rgba(255, 255, 255, 0.5)',
          borderRight: '1px dashed rgba(255, 255, 255, 0.5)'
        }}
      />
    )}
    <div className="relative overflow-hidden" style={{ borderRadius: '20px' }}>
      {children}
    </div>
  </div>
);
