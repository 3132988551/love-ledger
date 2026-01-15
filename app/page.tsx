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
  const [savingPages, setSavingPages] = useState<Record<string, boolean>>({});
  const [savedPages, setSavedPages] = useState<Record<string, boolean>>({});
  const isScrolling = useRef(false);
  const touchYRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  // 检查是否在滚动边界
  const isAtScrollBoundary = (direction: 'up' | 'down') => {
    const container = scrollContainerRef.current;
    if (!container) return true; // 如果没有容器，允许翻页

    const { scrollTop, scrollHeight, clientHeight } = container;
    const threshold = 5; // 5px 容差

    if (direction === 'up') {
      return scrollTop <= threshold; // 在顶部
    } else {
      return scrollTop + clientHeight >= scrollHeight - threshold; // 在底部
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchYRef.current - e.changedTouches[0].clientY;
    const swipeThreshold = 50;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // 向上滑动 - 尝试下一页
        if (isAtScrollBoundary('down')) {
          goToNextPage();
        }
      } else {
        // 向下滑动 - 尝试上一页
        if (isAtScrollBoundary('up')) {
          goToPrevPage();
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isScrolling.current) return;

    const scrollThreshold = 30;
    if (Math.abs(e.deltaY) > scrollThreshold) {
      if (e.deltaY > 0) {
        // 向下滚动 - 尝试下一页
        if (isAtScrollBoundary('down')) {
          e.preventDefault();
          isScrolling.current = true;
          goToNextPage();
          setTimeout(() => { isScrolling.current = false; }, 1200);
        }
      } else {
        // 向上滚动 - 尝试上一页
        if (isAtScrollBoundary('up')) {
          e.preventDefault();
          isScrolling.current = true;
          goToPrevPage();
          setTimeout(() => { isScrolling.current = false; }, 1200);
        }
      }
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
        <div className="bg-white/80 backdrop-blur-xl p-4 sticky top-0 z-50 border-b-[0.5px] border-black/10">
          <h1 className="text-lg font-semibold tracking-tight">叙事设置</h1>
        </div>

        <div className="max-w-xl mx-auto p-4 space-y-8 mt-4">
          {Array.from({ length: 14 }, (_, i) => `p${i + 1}`).map(key => {
            const pageNumber = parseInt(key.substring(1));
            const pageData = reportData[key] || { top: '', img: '', bottom: '', content: '' };
            const isTextOnlyPage = pageNumber === 1 || pageNumber === 14;

            return (
              <div key={key} className="space-y-2">
                <div className="px-4 text-[13px] text-gray-500 uppercase tracking-tight flex items-center justify-between">
                  <span>Page {key.substring(1)} {isTextOnlyPage ? '(纯文本页)' : '(图文页)'}</span>
                  <button
                    onClick={async () => {
                      setSavingPages(prev => ({ ...prev, [key]: true }));
                      setSavedPages(prev => ({ ...prev, [key]: false }));

                      try {
                        // 添加最小延迟确保用户能看到"保存中..."状态
                        const [response] = await Promise.all([
                          fetch('/api/data', {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              'x-admin-password': password,
                            },
                            body: JSON.stringify({ [key]: pageData }),
                          }),
                          new Promise(resolve => setTimeout(resolve, 600))
                        ]);

                        if (response.ok) {
                          setSavedPages(prev => ({ ...prev, [key]: true }));
                          // 2秒后隐藏成功提示
                          setTimeout(() => {
                            setSavedPages(prev => ({ ...prev, [key]: false }));
                          }, 2000);
                        }
                      } catch (err) {
                        console.error('Failed to save:', err);
                      } finally {
                        setSavingPages(prev => ({ ...prev, [key]: false }));
                      }
                    }}
                    disabled={savingPages[key]}
                    className={`px-3 py-1 text-white text-[11px] rounded-lg transition-colors disabled:opacity-50 ${savedPages[key] ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                  >
                    {savingPages[key] ? '保存中...' : savedPages[key] ? '已保存 ✓' : '保存'}
                  </button>
                </div>
                <div className="bg-white rounded-xl overflow-hidden border-[0.5px] border-black/5">
                  {isTextOnlyPage ? (
                    <textarea
                      className="w-full p-4 outline-none text-[16px] bg-transparent"
                      rows={5}
                      placeholder="输入文本内容..."
                      value={pageData.content || ''}
                      onChange={e => setReportData(prev => ({ ...prev!, [key]: { ...pageData, content: e.target.value } }))}
                    />
                  ) : (
                    <div className="divide-y divide-black/5">
                      <div className="flex p-4 items-center">
                        <span className="w-20 text-[14px] text-gray-400">标题</span>
                        <input
                          className="flex-1 outline-none bg-transparent"
                          placeholder="输入标题..."
                          value={pageData.top || ''}
                          onChange={e => setReportData(prev => ({ ...prev!, [key]: { ...pageData, top: e.target.value } }))}
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[14px] text-gray-400">图片</span>
                          <label className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                            上传图片
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('pageId', key);

                                try {
                                  const response = await fetch('/api/upload', {
                                    method: 'POST',
                                    headers: {
                                      'x-admin-password': password,
                                    },
                                    body: formData,
                                  });

                                  const result = await response.json();
                                  if (result.url) {
                                    // 添加时间戳参数强制刷新图片缓存
                                    const urlWithTimestamp = `${result.url}?t=${Date.now()}`;
                                    setReportData(prev => ({ ...prev!, [key]: { ...pageData, img: urlWithTimestamp } }));
                                  }
                                } catch (err) {
                                  console.error('Upload failed:', err);
                                }
                              }}
                            />
                          </label>
                        </div>
                        {pageData.img && (
                          <div className="mt-2 relative">
                            <img
                              src={pageData.img}
                              alt="预览"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col">
                        <span className="text-[14px] text-gray-400 mb-2">叙述</span>
                        <textarea
                          className="w-full outline-none text-[16px] bg-transparent"
                          rows={3}
                          placeholder="输入叙述文字..."
                          value={pageData.bottom || ''}
                          onChange={e => setReportData(prev => ({ ...prev!, [key]: { ...pageData, bottom: e.target.value } }))}
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
              const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '2025';
              if (password === adminPassword) setView('admin');
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
      ref={scrollContainerRef}
      className="h-screen w-full relative overflow-y-auto select-none font-sans flex justify-center"
      style={{
        backgroundColor: '#ffeded'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* 背景图片容器 - 固定在视口底部 */}
      <div
        className="fixed inset-x-0 bottom-0 h-screen max-w-[430px] mx-auto pointer-events-none"
        style={{
          backgroundImage: 'url(/labubu.jpg)',
          backgroundSize: '100% auto',
          backgroundPosition: 'bottom center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="w-full min-h-full"
        >
          <NarrativeCard
            data={{
              ...(reportData[`p${currentPage + 1}`] || {}),
              month: currentPage // p2=1月, p3=2月, ..., p13=12月
            }}
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
