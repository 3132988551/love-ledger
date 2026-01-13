import React from 'react';

interface SquircleCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * iOS Continuous Corner (Squircle) 容器
 * 模拟 iOS 17+ 的卡片边缘物理逻辑
 */
export const SquircleCard: React.FC<SquircleCardProps> = ({ children, className = "" }) => (
  <div
    className={`relative overflow-hidden transition-shadow duration-700 ${className}`}
    style={{
      borderRadius: '44px', // iOS 标准大卡片圆角
      WebkitMaskImage: '-webkit-radial-gradient(white, black)', // 强制抗锯齿
      boxShadow: '0 12px 34px -10px rgba(0, 0, 0, 0.12), 0 4px 12px -4px rgba(0, 0, 0, 0.05)',
      border: '0.5px solid rgba(0, 0, 0, 0.04)' // 极细描边
    }}
  >
    {children}
  </div>
);
