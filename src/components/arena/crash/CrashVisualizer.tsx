
"use client";

import { motion } from "framer-motion";

/**
 * @fileOverview مفاعل الكراش البصري v4.0 - Sovereign Scale Edition
 * تم زيادة الارتفاع والمدى بنسبة 200% لتوسيع أفق الصعود وجعله أكثر إثارة.
 */
export function CrashVisualizer({ multiplier, state }: { multiplier: number, state: string }) {
  // زيادة الارتفاع والمدى بشكل كبير لمنح شعور بالعمق
  const pathHeight = Math.min(multiplier * 60, 1200); 
  const pathWidth = Math.min(multiplier * 25, 100);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 flex items-end justify-center pb-40">
      {/* Background Matrix Grid - Subtle & Techy */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#002d4d 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      
      {state === 'running' && (
        <motion.div 
          className="relative transition-all duration-1000 ease-out"
          style={{ width: `${pathWidth}%`, height: `${pathHeight}px` }}
        >
          {/* Advanced Fluid Growth Curve */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="crashGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f9a885" stopOpacity="0.4" />
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
              strokeWidth="2"
              filter="url(#glow)"
              strokeDasharray="300"
              initial={{ strokeDashoffset: 300 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* Dynamic Rocket Node - The Lead Particle */}
          <motion.div 
            className="absolute top-0 right-0 h-6 w-6 bg-white rounded-full shadow-[0_0_30px_#f9a885] z-20 border-[4px] border-[#f9a885] flex items-center justify-center"
            animate={{ 
              scale: [1, 1.3, 1],
              boxShadow: ["0 0 15px #f9a885", "0 0 35px #f9a885", "0 0 15px #f9a885"]
            }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
             <div className="h-1.5 w-1.5 bg-[#f9a885] rounded-full animate-ping" />
          </motion.div>

          {/* Enhanced Particle Trail */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1.5 w-1.5 bg-[#f9a885] rounded-full opacity-50"
              initial={{ x: 0, y: 0 }}
              animate={{ 
                x: -Math.random() * 80, 
                y: Math.random() * 80,
                opacity: 0,
                scale: 0
              }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15 }}
              style={{ top: 0, right: 0 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
