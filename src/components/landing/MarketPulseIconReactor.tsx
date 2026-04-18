
"use client";

import React, { useState, useEffect, useRef } from "react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview أوركسترا الأيقونات السينمائية v10.0 - Sovereign Carousel Edition
 * نظام تحريك رباعي المواقع (P1..P4) يعتمد على الإزاحة المستمرة من اليمين لليسار.
 * تمييز العنصر المركزي (P2) بالرفع العمودي (Lift Focus).
 */

const ASSET_LIST = [
  "BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "AVAX", "DOT", 
  "LINK", "MATIC", "TRX", "LTC", "DOGE", "SHIB", "UNI", 
  "BCH", "NEAR", "KAS", "ATOM", "ETC", "XLM", "KNC", "AAVE",
  "FIL", "ICP", "STX", "IMX", "GRT", "OP", "RNDR"
];

// إحداثيات المواقع الأربعة (P1 -> P4)
const POSITIONS = [
  { x: -180, y: 0, scale: 0.8, opacity: 0.3 }, // P1 (Left - Exiting)
  { x: -60,  y: -15, scale: 1.2, opacity: 1 },   // P2 (Mid Left - Focused/Lifted)
  { x: 60,   y: 0, scale: 0.9, opacity: 0.6 }, // P3 (Mid Right)
  { x: 180,  y: 0, scale: 0.7, opacity: 0.3 }  // P4 (Right - Entering)
];

export function MarketPulseIconReactor() {
  const [activeIcons, setActiveIcons] = useState<any[]>([]);
  const nextIconIndex = useRef(0);

  // بروتوكول البداية وبناء الحركة
  useEffect(() => {
    // تعبئة أولية بـ 4 أيقونات
    const initial = Array.from({ length: 4 }).map((_, i) => {
      const icon = {
        id: Math.random(),
        symbol: ASSET_LIST[nextIconIndex.current],
        pos: 3 - i // ترتيب تنازلي لتبدأ الحركة من P1
      };
      nextIconIndex.current = (nextIconIndex.current + 1) % ASSET_LIST.length;
      return icon;
    });
    setActiveIcons(initial);

    // محرك التدوير اللانهائي (Tick كل 2 ثانية)
    const interval = setInterval(() => {
      setActiveIcons(prev => {
        // 1. إزاحة المواقع الحالية لليسار
        const shifted = prev.map(item => ({
          ...item,
          pos: item.pos - 1
        }));

        // 2. فلترة العناصر التي خرجت عن P1
        const remaining = shifted.filter(item => item.pos >= 0);

        // 3. حقن عنصر جديد في P4 (أقصى اليمين)
        const newItem = {
          id: Math.random(),
          symbol: ASSET_LIST[nextIconIndex.current],
          pos: 3
        };
        nextIconIndex.current = (nextIconIndex.current + 1) % ASSET_LIST.length;

        return [...remaining, newItem];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 w-full flex items-center justify-center select-none overflow-visible">
      {/* هالة المركز الوميضية (ثابتة خلف المفاعل) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-96 h-96 bg-blue-500 rounded-full blur-[120px]"
        />
      </div>

      {/* ساحة العرض الحركية */}
      <div className="relative w-full max-w-[500px] flex items-center justify-center">
        <AnimatePresence initial={false}>
          {activeIcons.map((icon) => {
            const posData = POSITIONS[icon.pos] || { x: -300, y: 0, scale: 0, opacity: 0 };
            
            return (
              <motion.div
                key={icon.id}
                layout
                initial={{ 
                  x: 300, 
                  y: 0, 
                  scale: 0, 
                  opacity: 0,
                  filter: "blur(10px)"
                }}
                animate={{ 
                  x: posData.x, 
                  y: posData.y, 
                  scale: posData.scale, 
                  opacity: posData.opacity,
                  filter: "blur(0px)"
                }}
                exit={{ 
                  x: -300, 
                  opacity: 0, 
                  scale: 0.5,
                  filter: "blur(20px)"
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 80, 
                  damping: 20,
                  opacity: { duration: 0.8 }
                }}
                className="absolute"
              >
                <div className="relative group">
                   {/* تأثير التوهج الموضعي للأيقونة النشطة */}
                   {icon.pos === 1 && (
                     <motion.div 
                        layoutId="glow-core"
                        className="absolute inset-0 bg-[#f9a885]/20 rounded-full blur-xl -z-10"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                     />
                   )}
                   
                   <CryptoIcon 
                     name={icon.symbol} 
                     size={80} 
                     className="md:size-[110px] drop-shadow-sm transition-all duration-700" 
                   />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* الختم السفلي للمفاعل */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-10">
         <div className="h-[0.5px] w-32 bg-gradient-to-r from-transparent via-[#002d4d] to-transparent" />
         <span className="text-[6px] font-black uppercase tracking-[0.6em]">Nexus Liquidity Stream</span>
      </div>
    </div>
  );
}
