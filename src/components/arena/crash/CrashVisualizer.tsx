
"use client";

import { motion } from "framer-motion";

/**
 * @fileOverview مفاعل الكراش البصري v10.0 - Full Diagonal Fluidity
 * تم ضبط المسار ليرسم منحنى قطرياً من الزاوية السفلية اليسرى إلى القمة اليمنى بانسجام تام.
 */
export function CrashVisualizer({ multiplier, state }: { multiplier: number, state: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* شبكة المصفوفة الخلفية الرقيقة - تملأ كامل الحاوية */}
      <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(#002d4d 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {state === 'running' && (
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="crashGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f9a885" stopOpacity="0" />
                <stop offset="100%" stopColor="#f9a885" stopOpacity="0.15" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* مسار النمو الملون - يبدأ من الزاوية السفلية اليسرى (0, 100) */}
            <motion.path
              d="M 0 100 Q 40 100, 100 0"
              fill="none"
              stroke="url(#crashGradient)"
              strokeWidth="15"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            
            {/* خيط الضوء الرقيق */}
            <motion.path
              d="M 0 100 Q 40 100, 100 0"
              fill="none"
              stroke="#f9a885"
              strokeWidth="0.6"
              filter="url(#glow)"
              strokeDasharray="300"
              initial={{ strokeDashoffset: 300 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* نواة الصعود (الصاروخ النانوي) - تتبع قمة المنحنى في الزاوية اليمنى */}
          <motion.div 
            className="absolute top-0 right-0 h-4 w-4 bg-white rounded-full shadow-[0_0_20px_#f9a885] z-20 border-[2px] border-[#f9a885] flex items-center justify-center"
            animate={{ 
              scale: [1, 1.15, 1],
              boxShadow: ["0 0 10px #f9a885", "0 0 25px #f9a885", "0 0 10px #f9a885"]
            }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
             <div className="h-1 w-1 bg-[#f9a885] rounded-full animate-ping" />
          </motion.div>

          {/* جسيمات المسار الضوئي تتدفق من الزاوية اليمنى العلوية */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[1px] w-[1px] bg-[#f9a885] rounded-full opacity-20"
              initial={{ x: 0, y: 0 }}
              animate={{ 
                x: -Math.random() * 60, 
                y: Math.random() * 60,
                opacity: 0,
                scale: 0
              }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
              style={{ top: 0, right: 0 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
