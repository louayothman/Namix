
"use client";

import React, { useState, useEffect, useRef } from "react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview أوركسترا الأيقونات السيادية v15.0 - 5 Icons Spaced Center Focus
 * تم توسيع مسافات التباعد لـ 120 بكسل لضمان "التنفس البصري" للأيقونة المركزية.
 */
const ASSETS = [
  "BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "AVAX", "DOT", 
  "LINK", "MATIC", "TRX", "LTC", "DOGE", "SHIB", "UNI"
];

const POSITIONS = [
  { x: -360, y: 0, scale: 0.5, opacity: 0 },    // P0 (خارج المسرح يسار)
  { x: -240, y: 0, scale: 0.7, opacity: 0.3 },  // P1 (بعيد يسار)
  { x: -120,  y: 0, scale: 0.9, opacity: 0.6 },  // P2 (يسار)
  { x: 0,    y: -20, scale: 1.2, opacity: 1 },  // P3 (المركز - بؤرة التركيز)
  { x: 120,   y: 0, scale: 0.9, opacity: 0.6 },  // P4 (يمين)
  { x: 240,  y: 0, scale: 0.7, opacity: 0.3 },  // P5 (بعيد يمين)
  { x: 360,  y: 0, scale: 0.5, opacity: 0 }     // P6 (خارج المسرح يمين)
];

export function MarketPulseIconReactor() {
  const [activeIcons, setActiveIcons] = useState<any[]>([]);
  const nextIndex = useRef(0);

  useEffect(() => {
    const initial = Array.from({ length: 5 }).map((_, i) => {
      const item = { id: Math.random(), symbol: ASSETS[nextIndex.current], pos: i + 1 };
      nextIndex.current = (nextIndex.current + 1) % ASSETS.length;
      return item;
    });
    setActiveIcons(initial);

    const interval = setInterval(() => {
      setActiveIcons(prev => {
        const shifted = prev.map(item => ({ ...item, pos: item.pos - 1 }));
        const remaining = shifted.filter(item => item.pos >= 1);
        const newItem = { id: Math.random(), symbol: ASSETS[nextIndex.current], pos: 5 };
        nextIndex.current = (nextIndex.current + 1) % ASSETS.length;
        return [...remaining, newItem];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 w-full flex items-center justify-center overflow-visible">
      <div className="relative w-full max-w-[700px] flex items-center justify-center">
        <AnimatePresence initial={false}>
          {activeIcons.map((icon) => {
            const p = POSITIONS[icon.pos] || POSITIONS[6];
            return (
              <motion.div
                key={icon.id}
                layout
                initial={{ x: 360, opacity: 0, scale: 0.5 }}
                animate={{ 
                  x: p.x, 
                  y: p.y, 
                  scale: p.scale, 
                  opacity: p.opacity,
                  filter: icon.pos === 3 ? "blur(0px)" : "blur(1.5px)"
                }}
                exit={{ x: -360, opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 100, damping: 22 }}
                className="absolute"
              >
                <div className="relative group">
                   {icon.pos === 3 && (
                     <motion.div 
                        layoutId="glow-reactor"
                        className="absolute inset-0 bg-[#f9a885]/15 rounded-full blur-2xl -z-10"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                     />
                   )}
                   <CryptoIcon name={icon.symbol} size={85} className="md:size-[110px]" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
