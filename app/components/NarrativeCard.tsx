'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, ChevronUp, Calendar } from 'lucide-react';
import { SquircleCard } from './SquircleCard';

/**
 * --- LABUBU 卡通可爱色彩系统 ---
 * 草莓奶昔粉 + 马卡龙色系
 */
const SYSTEM_THEMES = {
  1: { accent: '#FF69B4', glow: 'rgba(255, 105, 180, 0.15)' },    // 热粉 - 暖冬
  2: { accent: '#FF1493', glow: 'rgba(255, 20, 147, 0.15)' },     // 深粉 - 恋慕
  3: { accent: '#DDA0DD', glow: 'rgba(221, 160, 221, 0.15)' },    // 梅紫 - 初春
  4: { accent: '#98FF98', glow: 'rgba(152, 255, 152, 0.15)' },    // 薄荷绿 - 嫩绿
  5: { accent: '#DA70D6', glow: 'rgba(218, 112, 214, 0.15)' },    // 兰花紫 - 薰衣
  6: { accent: '#87CEEB', glow: 'rgba(135, 206, 235, 0.15)' },    // 天蓝 - 清夏
  7: { accent: '#B0E0E6', glow: 'rgba(176, 224, 230, 0.15)' },    // 粉蓝 - 海盐
  8: { accent: '#FFB347', glow: 'rgba(255, 179, 71, 0.15)' },     // 橙黄 - 仲夏
  9: { accent: '#FFFACD', glow: 'rgba(255, 250, 205, 0.15)' },    // 柠檬黄 - 金秋
  10: { accent: '#D8BFD8', glow: 'rgba(216, 191, 216, 0.15)' },   // 蓟紫 - 沉淀
  11: { accent: '#DEB887', glow: 'rgba(222, 184, 135, 0.15)' },   // 原木 - 焦糖
  12: { accent: '#FF6B9D', glow: 'rgba(255, 107, 157, 0.15)' },   // 樱粉 - 岁末
};

// 装饰元素池
const DECORATIONS = ['✨', '🌸', '💕', '💖', '⭐', '🌟', '💫', '🎀'];

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
  const [isLandscape, setIsLandscape] = useState(false);

  // 根据月份选择装饰元素
  const deco1 = DECORATIONS[(data.month || 0) % DECORATIONS.length];
  const deco2 = DECORATIONS[((data.month || 0) + 3) % DECORATIONS.length];
  const deco3 = DECORATIONS[((data.month || 0) + 5) % DECORATIONS.length];

  // 检测图片是否为横向
  useEffect(() => {
    if (data.img) {
      const img = new Image();
      img.onload = () => {
        setIsLandscape(img.width > img.height);
      };
      img.src = data.img;
    }
  }, [data.img]);

  return (
    <div className="relative w-full h-full flex flex-col items-center transition-colors duration-1000 select-none pt-8 pb-[25vh] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: isReducedMotion ? 0 : 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="w-full max-w-[430px] flex flex-col items-center z-10 px-8"
        style={{ gap: '20px' }}
      >
        {isTextPage ? (
          <div className="text-center space-y-6 py-40 relative">
            <motion.div
              animate={!isReducedMotion ? { scale: [0.95, 1.05, 0.95], rotate: [0, 5, -5, 0] } : {}}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <Heart size={48} fill={theme.accent} className="text-transparent drop-shadow-lg" />
            </motion.div>
            <motion.h1
              className="text-4xl font-extrabold tracking-tight leading-tight whitespace-pre-wrap title-glow"
              style={{ color: '#5C4033' }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {data.content}
            </motion.h1>
            {/* 装饰元素 - 漂浮动画 */}
            <div className="absolute top-10 right-10 text-3xl sticker-float">{deco1}</div>
            <div className="absolute bottom-10 left-10 text-3xl sticker-float" style={{ animationDelay: '1s' }}>{deco2}</div>
          </div>
        ) : (
          <>
            {/* 1. 标题区域 - 移到最上方 */}
            <motion.div
              className="relative z-20 w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
            >
              <div className="flex flex-col items-center gap-3 px-6 py-4 bg-[#FFF9F5] rounded-[28px] border-[3px] border-[#634343] hard-shadow relative">
                <div className="flex items-center gap-2.5">
                  <Calendar size={18} style={{ color: theme.accent }} strokeWidth={3} />
                  <span className="text-[16px] font-extrabold tracking-wide title-glow" style={{ color: '#5C4033' }}>
                    {data.month}月
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight title-glow text-center" style={{ color: '#5C4033' }}>
                  {data.top}
                </h2>
                {/* 装饰 - 溢出边框，像贴纸 */}
                <div className="absolute -top-3 -right-3 text-3xl sticker-float">{deco1}</div>
                <div className="absolute -bottom-3 -left-3 text-3xl sticker-float" style={{ animationDelay: '1s' }}>{deco2}</div>
              </div>
            </motion.div>

            {/* 2. 主图卡片 - Polaroid 风格 */}
            <motion.div
              className="relative w-full flex-shrink-0"
              initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
            >
              <SquircleCard className="w-full" isLandscape={isLandscape}>
                <motion.img
                  src={data.img}
                  alt={data.top}
                  className="w-full object-contain"
                  style={{ height: 'auto', maxHeight: '65vh' }}
                  animate={!isReducedMotion ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", type: "spring", stiffness: 100 }}
                />
              </SquircleCard>
            </motion.div>

            {/* 3. 文本区 - 对话框样式 */}
            <motion.div
              className="w-full relative"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
            >
              <div className="relative bg-[#FFF9F5] border-[3px] border-[#634343] rounded-[24px] p-6 hard-shadow">
                <p
                  className="text-[17px] leading-[1.75] font-semibold tracking-tight text-center"
                  style={{ color: '#5C4033' }}
                >
                  {data.bottom}
                </p>

                {/* 对话框指针 */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-[#634343]">
                  <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-[#FFF9F5]" />
                </div>

                {/* 装饰元素 - 溢出边框 */}
                <div className="absolute -top-3 -right-3 text-3xl sticker-float" style={{ animationDelay: '0.5s' }}>{deco3}</div>
                <div className="absolute -bottom-3 -left-3 text-3xl sticker-float" style={{ animationDelay: '1.5s' }}>{deco1}</div>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* 4. 页脚提示 */}
      {!isTextPage && (
        <div className="absolute bottom-[27vh] left-0 right-0 flex flex-col items-center pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <p className="text-[12px] tracking-[0.3em] font-extrabold uppercase title-glow" style={{ color: '#C71585' }}>
              Memories of 2025
            </p>
            <motion.div
              animate={!isReducedMotion ? { y: [0, 8, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", type: "spring", stiffness: 400, damping: 15 }}
            >
              <ChevronUp size={24} style={{ color: theme.accent }} strokeWidth={3} />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};
