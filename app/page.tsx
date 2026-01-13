'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Lock, Edit3 } from 'lucide-react';
import { NarrativeCard } from './components/NarrativeCard';

export default function App() {
  const [view, setView] = useState('report');
  const [reportData, setReportData] = useState<Record<string, any> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const isScrolling = useRef(false);
  const touchYRef = useRef(0);
  const totalPages = 14;

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const data = await response.json();
        setReportData(data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const goToNextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages - 1));
  const goToPrevPage = () => setCurrentPage(p => Math.max(p - 1, 0));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchYRef.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) diff > 0 ? goToNextPage() : goToPrevPage();
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isScrolling.current) return;
    if (Math.abs(e.deltaY) > 30) {
      isScrolling.current = true;
      e.deltaY > 0 ? goToNextPage() : goToPrevPage();
      setTimeout(() => { isScrolling.current = false; }, 1200);
    }
  };

  if (isLoading || !reportData) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-200" size={32} />
      </div>
    );
  }

  // 管理后台 (iOS 系统设置风格)
  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-[#F2F2F7] pb-24 font-sans text-black">
        <div className="bg-white/80 backdrop-blur-xl p-4 sticky top-0 z-50 flex justify-between items-center border-b-[0.5px] border-black/10">
          <h1 className="text-lg font-semibold tracking-tight">叙事设置</h1>
          <div className="flex gap-4">
            <button onClick={() => setView('report')} className="text-blue-500 font-medium">预览</button>
            <button
              onClick={async () => {
                setIsSaving(true);
                try {
                  await fetch('/api/data', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-admin-password': password,
                    },
                    body: JSON.stringify(reportData),
                  });
                } catch (err) {
                  console.error('Failed to save:', err);
                } finally {
                  setIsSaving(false);
                }
              }}
              className="text-blue-500 font-bold disabled:opacity-30"
            >
              {isSaving ? "存储中..." : "保存"}
            </button>
          </div>
        </div>

        <div className="max-w-xl mx-auto p-4 space-y-8 mt-4">
          {Array.from({ length: 14 }, (_, i) => `p${i + 1}`).map(key => {
            const pageNumber = parseInt(key.substring(1));
            const pageData = reportData[key] || { month: pageNumber, top: '', img: '', bottom: '' };
            const isTextPage = pageData.type === 'text';

            return (
              <div key={key} className="space-y-2">
                <div className="px-4 text-[13px] text-gray-500 uppercase tracking-tight flex items-center justify-between">
                  <span>Page {key.substring(1)}</span>
                  <button
                    onClick={() => {
                      setReportData(prev => ({
                        ...prev!,
                        [key]: isTextPage ? { month: parseInt(key.substring(1)), top: '', img: '', bottom: '' } : { type: 'text', content: '' }
                      }));
                    }}
                    className="text-[11px] text-blue-500 hover:text-blue-600"
                  >
                    {isTextPage ? '切换为图片页' : '切换为文本页'}
                  </button>
                </div>
                <div className="bg-white rounded-xl overflow-hidden border-[0.5px] border-black/5">
                  {isTextPage ? (
                    <textarea
                      className="w-full p-4 outline-none text-[16px] bg-transparent"
                      rows={3}
                      placeholder="输入文本内容..."
                      value={pageData.content || ''}
                      onChange={e => setReportData(prev => ({...prev!, [key]: {...pageData, content: e.target.value}}))}
                    />
                  ) : (
                    <div className="divide-y divide-black/5">
                      <div className="flex p-4 items-center">
                        <span className="w-20 text-[14px] text-gray-400">月份</span>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          className="flex-1 outline-none bg-transparent"
                          value={pageData.month || ''}
                          onChange={e => setReportData(prev => ({...prev!, [key]: {...pageData, month: parseInt(e.target.value) || 1}}))}
                        />
                      </div>
                      <div className="flex p-4 items-center">
                        <span className="w-20 text-[14px] text-gray-400">标题</span>
                        <input
                          className="flex-1 outline-none bg-transparent"
                          placeholder="输入标题..."
                          value={pageData.top || ''}
                          onChange={e => setReportData(prev => ({...prev!, [key]: {...pageData, top: e.target.value}}))}
                        />
                      </div>
                      <div className="flex p-4 items-center">
                        <span className="w-20 text-[14px] text-gray-400">图片</span>
                        <input
                          className="flex-1 outline-none text-xs text-blue-400 bg-transparent"
                          placeholder="输入图片URL..."
                          value={pageData.img || ''}
                          onChange={e => setReportData(prev => ({...prev!, [key]: {...pageData, img: e.target.value}}))}
                        />
                      </div>
                      <div className="p-4 flex flex-col">
                        <span className="text-[14px] text-gray-400 mb-2">叙述</span>
                        <textarea
                          className="w-full outline-none text-[16px] bg-transparent"
                          rows={3}
                          placeholder="输入叙述文字..."
                          value={pageData.bottom || ''}
                          onChange={e => setReportData(prev => ({...prev!, [key]: {...pageData, bottom: e.target.value}}))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="h-screen bg-[#F2F2F7] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[40px] shadow-sm w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-blue-500" size={28} />
          </div>
          <h2 className="text-xl font-bold mb-8">管理员访问</h2>
          <input
            type="password"
            className="w-full p-4 bg-gray-50 rounded-2xl mb-6 text-center text-lg border-none focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            placeholder="Passcode"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => {
              const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '2024';
              if(password === adminPassword) setView('admin');
            }}
            className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
          >
            确认
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-full relative touch-none overflow-hidden select-none bg-white font-sans"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <NarrativeCard
            data={reportData[`p${currentPage + 1}`] || {}}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-10 left-6 z-30">
         <button onClick={() => setView('login')} className="p-4 opacity-0 hover:opacity-100 text-gray-300 transition-opacity">
            <Edit3 size={14} />
         </button>
      </div>
    </div>
  );
}
