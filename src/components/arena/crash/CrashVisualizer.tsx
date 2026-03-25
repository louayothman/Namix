
"use client";

import { motion } from "framer-motion";

export function CrashVisualizer({ multiplier, state }: { multiplier: number, state: string }) {
  // Simulate a growth path based on multiplier
  const pathHeight = Math.min(multiplier * 15, 300);
  const pathWidth = Math.min(multiplier * 20, 100);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 flex items-end justify-center pb-20">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#002d4d 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {state === 'running' && (
        <motion.div 
          className="relative"
          style={{ width: `${pathWidth}%`, height: `${pathHeight}px` }}
        >
          {/* Main Growth Curve */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              d="M 0 100 Q 50 100 100 0"
              fill="none"
              stroke="#f9a885"
              strokeWidth="2"
              strokeDasharray="100"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f9a885" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#f9a885" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0 100 Q 50 100 100 0 L 100 100 Z"
              fill="url(#curveGradient)"
            />
          </svg>

          {/* Leading Dot */}
          <motion.div 
            className="absolute top-0 right-0 h-4 w-4 bg-[#f9a885] rounded-full shadow-[0_0_20px_#f9a885] z-20"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </motion.div>
      )}
    </div>
  );
}
