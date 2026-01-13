'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, ChevronUp, Calendar } from 'lucide-react';
import { SquircleCard } from './SquircleCard';

/**
 * --- iOS 语义化色彩与情绪系统 ---
 * 颜色遵循：低饱和度背景光雾 + 同色相高饱和强调色
 */
const SYSTEM_THEMES = {
  1: { accent: '#FF3B30', glow: 'rgba(255, 59, 48, 0.08)' },    // 红色 - 暖冬
  2: { accent: '#FF2D55', glow: 'rgba(255, 45, 85, 0.08)' },    // 玫瑰 - 恋慕
  3: { accent: '#5856D6', glow: 'rgba(88, 86, 214, 0.08)' },    // 靛紫 - 初春
  4: { accent: '#34C759', glow: 'rgba(52, 199, 89, 0.08)' },    // 绿色 - 嫩绿
  5: { accent: '#AF52DE', glow: 'rgba(175, 82, 222, 0.08)' },   // 紫罗兰 - 薰衣
  6: { accent: '#007AFF', glow: 'rgba(0, 122, 255, 0.08)' },    // 蓝色 - 清夏
  7: { accent: '#5AC8FA', glow: 'rgba(90, 200, 250, 0.08)' },   // 天蓝 - 海盐
  8: { accent: '#FF9500', glow: 'rgba(255, 149, 0, 0.08)' },    // 橙色 - 仲夏
  9: { accent: '#FFCC00', glow: 'rgba(255, 204, 0, 0.08)' },    // 黄色 - 金秋
  10: { accent: '#8E8E93', glow: 'rgba(142, 142, 147, 0.08)' }, // 灰色 - 沉淀
  11: { accent: '#A2845E', glow: 'rgba(162, 132, 94, 0.08)' },  // 焦糖 - 焦糖
  12: { accent: '#FF453A', glow: 'rgba(255, 69, 58, 0.08)' },   // 亮红 - 岁末
};

interface PageData {
  type?: string;
  content?: string;
  month?: number;
  top?: string;
  img?: string;
  bottom?: string;
}

interface NarrativeCardProps {
  data: PageData;
}

export const NarrativeCard: React.FC<NarrativeCardProps> = ({ data }) => {
  const isReducedMotion = useReducedMotion();
  const theme = SYSTEM_THEMES[data.month as keyof typeof SYSTEM_THEMES] || SYSTEM_THEMES[1];
  const isTextPage = data.type === 'text';
  // 核心排版逻辑：根据文案字数决定对齐方式
  const isLongText = (data.bottom?.length || 0) > 42;

  return (
    <div className="relative w-full h-full flex flex-col items-center bg-white transition-colors duration-1000 select-none pt-12 md:pt-20 overflow-hidden">
      {/* 1. Ambient Glass Blob: 主图背后的氛围光雾 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-[15%] left-[10%] w-[80%] h-[50%] blur-[120px] rounded-full pointer-events-none transition-all duration-1000 z-0"
        style={{
          background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: isReducedMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[420px] flex flex-col items-center z-10 px-8"
      >
        {isTextPage ? (
          <div className="text-center space-y-6 py-40">
            <motion.div
              animate={!isReducedMotion ? { scale: [0.95, 1, 0.95], opacity: [0.6, 1, 0.6] } : {}}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="flex justify-center"
            >
              <Heart size={32} fill={theme.accent} className="text-transparent" />
            </motion.div>
            <h1 className="text-4xl font-semibold tracking-tight text-black leading-tight whitespace-pre-wrap">
              {data.content}
            </h1>
          </div>
        ) : (
          <>
            {/* 2. 顶部胶囊: iOS 17 灵动岛风格材质 */}
            <div className="relative z-20 -mb-4">
              <div className="flex items-center gap-2.5 px-5 py-2 bg-white/60 backdrop-blur-2xl rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-[0.5px] border-white/80">
                <Calendar size={13} style={{ color: theme.accent }} strokeWidth={2.5} />
                <span className="text-[12px] font-bold tracking-[0.05em] text-gray-500">
                  {data.month}月 · {data.top}
                </span>
              </div>
            </div>

            {/* 3. 主图卡片: 锁定物理中心 */}
            <div className="relative w-full flex-shrink-0">
              <SquircleCard className="w-full aspect-[4/5] bg-[#F9F9F9]">
                <motion.img
                  src={data.img}
                  alt={data.top}
                  className="w-full h-full object-cover"
                  animate={!isReducedMotion ? { scale: [1, 1.015, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                />
              </SquircleCard>
            </div>

            {/* 4. 文本区: Dynamic Type 响应式排版 */}
            <div className="w-full pt-10 pb-16">
              <div className={`flex flex-col ${isLongText ? 'items-start text-left' : 'items-center text-center'}`}>
                {/* 极细引导线 */}
                <div
                  className="w-6 h-[2.5px] rounded-full mb-4"
                  style={{ backgroundColor: theme.accent, opacity: 0.3 }}
                />
                <p className="text-[17px] leading-[1.65] text-black/90 font-medium tracking-tight">
                  {data.bottom}
                </p>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* 5. 页脚: 克制的信息展示 */}
      {!isTextPage && (
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center pointer-events-none">
          <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] tracking-[0.3em] text-black/20 font-heavy uppercase">
              Memories of 2024
            </p>
            <motion.div
              animate={!isReducedMotion ? { y: [0, 5, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
              <ChevronUp size={20} className="text-gray-200" strokeWidth={1.5} />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};
