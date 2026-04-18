"use client";

import React, { useState, useEffect, useRef } from "react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview أوركسترا الأيقونات السيادية v12.0 - Fixed Positions Carousel
 */
const ASSETS = [
  "BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "AVAX", "DOT", 
  "LINK", "MATIC", "TRX", "LTC", "DOGE", "SHIB", "UNI"
];

const POSITIONS = [
  { x: -160, y: 0, scale: 0.6, opacity: 0 },    // P0 (خارج المسرح يسار)
  { x: -100, y: 0, scale: 0.8, opacity: 0.3 },  // P1 (يسار)
  { x: 0,    y: -20, scale: 1.2, opacity: 1 },  // P2 (الوسط - رفع تكتيكي)
  { x: 100,  y: 0, scale: 0.8, opacity: 0.4 },  // P3 (يمين)
  { x: 160,  y: 0, scale: 0.6, opacity: 0.2 }   // P4 (أقصى اليمين - دخول)
];

export function MarketPulseIconReactor() {
  const [activeIcons, setActiveIcons] = useState<any[]>([]);
  const nextIndex = useRef(0);

  useEffect(() => {
    // تهيئة العناصر الأربعة الأولى
    const initial = Array.from({ length: 4 }).map((_, i) => {
      const item = { id: Math.random(), symbol: ASSETS[nextIndex.current], pos: i + 1 };
      nextIndex.current = (nextIndex.current + 1) % ASSETS.length;
      return item;
    });
    setActiveIcons(initial);

    const interval = setInterval(() => {
      setActiveIcons(prev => {
        // 1. إزاحة الجميع لليسار
        const shifted = prev.map(item => ({ ...item, pos: item.pos - 1 }));
        
        // 2. فلترة الخارج من P1
        const remaining = shifted.filter(item => item.pos >= 1);
        
        // 3. حقن عنصر جديد في P4
        const newItem = { id: Math.random(), symbol: ASSETS[nextIndex.current], pos: 4 };
        nextIndex.current = (nextIndex.current + 1) % ASSETS.length;
        
        return [...remaining, newItem];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 w-full flex items-center justify-center overflow-visible">
      <div className="relative w-full max-w-[400px] flex items-center justify-center">
        <AnimatePresence initial={false}>
          {activeIcons.map((icon) => {
            const p = POSITIONS[icon.pos] || POSITIONS[4];
            return (
              <motion.div
                key={icon.id}
                layout
                initial={{ x: 200, opacity: 0, scale: 0.5 }}
                animate={{ 
                  x: p.x, 
                  y: p.y, 
                  scale: p.scale, 
                  opacity: p.opacity,
                  filter: icon.pos === 2 ? "blur(0px)" : "blur(1px)"
                }}
                exit={{ x: -200, opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="absolute"
              >
                <div className="relative group">
                   {icon.pos === 2 && (
                     <motion.div 
                        layoutId="glow"
                        className="absolute inset-0 bg-[#f9a885]/10 rounded-full blur-2xl -z-10"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                     />
                   )}
                   <CryptoIcon name={icon.symbol} size={80} className="md:size-[100px] drop-shadow-none" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
