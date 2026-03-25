
"use client";

import { motion } from "framer-motion";

/**
 * @fileOverview مفاعل الكراش البصري v7.0 - Dynamic Adaptive Height
 * تم ضبط المنحنى ليملأ الحاوية الرأسية بالكامل بأسلوب انسيابي ناعم.
 */
export function CrashVisualizer({ multiplier, state }: { multiplier: number, state: string }) {
  // استخدام ارتفاع الحاوية بالكامل لضمان التمدد الرأسي
  const pathHeight = Math.min(multiplier * 180, 1800); 
  const pathWidth = Math.min(multiplier * 35, 95);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 flex items-end justify-center pb-24">
      {/* شبكة المصفوفة الخلفية الرقيقة */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#002d4d 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      
      {state === 'running' && (
        <motion.div 
          className="relative transition-all duration-1000 ease-out"
          style={{ width: `${pathWidth}%`, height: `${pathHeight}px` }}
        >
          {/* منحنى النمو السائل المطور */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="crashGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f9a885" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f9a885" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <motion.path
              d="M 0 100 C 20 100, 80 90, 100 0"
              fill="url(#crashGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            
            <motion.path
              d="M 0 100 C 20 100, 80 90, 100 0"
              fill="none"
              stroke="#f9a885"
              strokeWidth="1.5"
              filter="url(#glow)"
              strokeDasharray="300"
              initial={{ strokeDashoffset: 300 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* نواة الصعود (الصاروخ النخبوي) */}
          <motion.div 
            className="absolute top-0 right-0 h-5 w-5 bg-white rounded-full shadow-[0_0_25px_#f9a885] z-20 border-[3px] border-[#f9a885] flex items-center justify-center"
            animate={{ 
              scale: [1, 1.15, 1],
              boxShadow: ["0 0 10px #f9a885", "0 0 30px #f9a885", "0 0 10px #f9a885"]
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
             <div className="h-1 w-1 bg-[#f9a885] rounded-full animate-ping" />
          </motion.div>

          {/* جسيمات المسار الضوئي */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 bg-[#f9a885] rounded-full opacity-30"
              initial={{ x: 0, y: 0 }}
              animate={{ 
                x: -Math.random() * 80, 
                y: Math.random() * 80,
                opacity: 0,
                scale: 0
              }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
              style={{ top: 0, right: 0 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
