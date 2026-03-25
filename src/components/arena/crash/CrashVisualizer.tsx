
"use client";

import { motion } from "framer-motion";

/**
 * @fileOverview مفاعل الكراش البصري v8.0 - Elegant Curve Edition
 * تم تقليل عرض المنحنى وسماكة الخط ليكون أكثر دقة واحترافية ضمن الحاوية الكبيرة.
 */
export function CrashVisualizer({ multiplier, state }: { multiplier: number, state: string }) {
  // استخدام ارتفاع الحاوية بالكامل مع بقاء المنحنى رشيقاً
  const pathHeight = Math.min(multiplier * 140, 1400); 
  const pathWidth = Math.min(multiplier * 25, 85);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 flex items-end justify-center pb-20">
      {/* شبكة المصفوفة الخلفية الرقيقة */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#002d4d 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      
      {state === 'running' && (
        <motion.div 
          className="relative transition-all duration-1000 ease-out"
          style={{ width: `${pathWidth}%`, height: `${pathHeight}px` }}
        >
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="crashGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f9a885" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#f9a885" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <motion.path
              d="M 0 100 C 15 100, 85 95, 100 0"
              fill="url(#crashGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            
            <motion.path
              d="M 0 100 C 15 100, 85 95, 100 0"
              fill="none"
              stroke="#f9a885"
              strokeWidth="1"
              filter="url(#glow)"
              strokeDasharray="300"
              initial={{ strokeDashoffset: 300 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* نواة الصعود (الصاروخ النخبوي) - حجم مصغر */}
          <motion.div 
            className="absolute top-0 right-0 h-4 w-4 bg-white rounded-full shadow-[0_0_20px_#f9a885] z-20 border-2 border-[#f9a885] flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: ["0 0 8px #f9a885", "0 0 20px #f9a885", "0 0 8px #f9a885"]
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
             <div className="h-0.5 w-0.5 bg-[#f9a885] rounded-full animate-ping" />
          </motion.div>

          {/* جسيمات المسار الضوئي */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-0.5 w-0.5 bg-[#f9a885] rounded-full opacity-20"
              initial={{ x: 0, y: 0 }}
              animate={{ 
                x: -Math.random() * 60, 
                y: Math.random() * 60,
                opacity: 0,
                scale: 0
              }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
              style={{ top: 0, right: 0 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
