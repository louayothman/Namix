
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, LucideIcon } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

interface ArenaIntroProps {
  icon: LucideIcon;
  title: string;
  onComplete: () => void;
}

export function ArenaIntro({ icon: Icon, title, onComplete }: ArenaIntroProps) {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#002d4d] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative flex flex-col items-center gap-8">
        <svg width="120" height="120" viewBox="0 0 100 100" className="relative z-10">
          {/* رسم الأيقونة هندسياً */}
          <motion.path
            d="M30 30 L70 30 L70 70 L30 70 Z M50 30 L50 70 M30 50 L70 50"
            fill="none"
            stroke="#f9a885"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {/* رسم الإطار الدائري */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="2 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ delay: 1.5, duration: 1 }}
          />
          
          {/* تفاعل الأيقونة بعد اكتمال الرسم */}
          <motion.g
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.15, 1.1],
              filter: ["brightness(1)", "brightness(1.5)", "brightness(1.2)"]
            }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
             <Icon className="text-[#f9a885]" style={{ x: 30, y: 30, width: 40, height: 40 }} />
          </motion.g>

          {/* نجمة اللمعان الفضائية */}
          <motion.path
            d="M50 15 L52 22 L58 24 L52 26 L50 33 L48 26 L42 24 L48 22 Z"
            fill="#f9a885"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
            transition={{ delay: 3, duration: 0.5 }}
          />
        </svg>

        {/* رسم اسم اللعبة */}
        <div className="relative h-8 flex items-center justify-center">
           <motion.span
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 3.5, duration: 0.8 }}
             className="text-white font-black text-[12px] tracking-[0.3em] uppercase"
           >
             {title}
           </motion.span>
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: "100%" }}
             transition={{ delay: 3.5, duration: 1 }}
             className="absolute bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#f9a885] to-transparent"
           />
        </div>
      </div>

      {/* ختم ناميكس في الأسفل */}
      <div className="absolute bottom-12 flex items-center gap-3 opacity-20">
         <Logo size="sm" className="brightness-200" />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5 }}
        onAnimationComplete={() => setTimeout(onComplete, 500)}
      />
    </motion.div>
  );
}
