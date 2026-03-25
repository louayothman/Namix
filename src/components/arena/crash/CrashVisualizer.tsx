
"use client";

import { motion } from "framer-motion";

/**
 * @fileOverview مفاعل الكراش البصري v11.0 - Pure Diagonal Growth
 * يبدأ من (0, 100) وينتهي عند (100, 0) لملء الشاشة تماماً.
 */
export function CrashVisualizer({ multiplier, state }: { multiplier: number, state: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-[#fcfdfe]">
      {/* شبكة نانوية خلفية رقيقة جداً */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#002d4d 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
      
      {state === 'running' && (
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="crashGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {/* مسار النمو النقي - تمدد قطري كامل */}
            <motion.path
              d="M 0 100 Q 40 100, 100 0"
              fill="none"
              stroke="url(#crashGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* خيط النمو الأساسي */}
            <motion.path
              d="M 0 100 Q 40 100, 100 0"
              fill="none"
              stroke="#10b981"
              strokeWidth="0.8"
              opacity="0.4"
            />
          </svg>

          {/* نواة الصعود (الصاروخ النانوي) */}
          <motion.div 
            className="absolute top-0 right-0 h-3 w-3 bg-white rounded-full shadow-[0_0_15px_#10b981] z-20 border-[2px] border-emerald-500 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
             <div className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
          </motion.div>
        </div>
      )}
    </div>
  );
}
