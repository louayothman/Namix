
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Rocket, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview المفاعل التكتيكي المورفي v50.0 - Geometric Morph Edition
 * تصميم يدمج بين "الأناقة المصغرة" ومحرك تحويل الأشكال الهندسي (المربع، المثلث، الدائرة).
 */

const eliteServices = [
  { 
    id: "market", 
    title: "الأسواق", 
    desc: "نبض الأصول",
    icon: Activity, 
    href: "/trade", 
    color: "text-blue-400",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]"
  },
  { 
    id: "arena", 
    title: "الساحة", 
    desc: "مغامرة ذكية",
    icon: Rocket, 
    href: "/arena", 
    color: "text-[#f9a885]",
    glow: "shadow-[0_0_15px_rgba(249,168,133,0.3)]"
  },
  { 
    id: "yield", 
    title: "المختبر", 
    desc: "هندسة العائد",
    icon: Zap, 
    href: "/invest", 
    color: "text-emerald-400",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]"
  }
];

export function ServiceGateway() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full py-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-body" dir="rtl">
      
      {/* Label Concept - Minimalist Alpha */}
      <div className="flex flex-col items-center mb-10 space-y-1 opacity-30">
        <div className="flex items-center gap-2">
          <Sparkles size={10} className="text-[#002d4d]" />
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[#002d4d] ml-2">Tactical Morphic Rail</span>
        </div>
      </div>

      <div className="max-w-md mx-auto relative px-4">
        {/* Main Sovereign Container - Wallet Color Matching */}
        <div className="bg-[#8899AA] rounded-[40px] border border-white/10 p-2 shadow-[0_40px_80px_-15px_rgba(0,45,77,0.25)] flex items-center justify-between gap-1 relative overflow-hidden group/rail">
          
          {/* THE MORPHING GEOMETRIC CORE - المحرك المورفي الهندسي */}
          <motion.div
            animate={{
              x: ["-20%", "120%", "-20%"],
              rotate: [0, 90, 180, 270, 360],
              borderRadius: ["20%", "50%", "0%", "40%", "20%"],
              scale: [1, 1.5, 0.8, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 bottom-0 w-32 bg-white/20 blur-[40px] pointer-events-none z-0"
          />

          {/* Morphing Object - Visible Physics */}
          <motion.div
            animate={{
              borderRadius: ["0%", "50%", "20% 80%", "0%"], // Square -> Circle -> Rectangle-ish -> Square
              rotate: [0, 45, 135, 360],
              scale: [1, 1.2, 0.9, 1],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute left-1/4 top-1/2 -translate-y-1/2 w-40 h-40 bg-blue-100 blur-[60px] pointer-events-none z-0"
          />

          {eliteServices.map((service) => {
            const isHovered = hoveredId === service.id;
            
            return (
              <Link 
                key={service.id} 
                href={service.href}
                className="relative flex-1 group"
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                onTouchStart={() => setHoveredId(service.id)}
              >
                <motion.div
                  layout
                  className={cn(
                    "relative flex items-center justify-center h-14 rounded-full transition-all duration-500",
                    isHovered ? "bg-[#002d4d] px-6 shadow-2xl scale-[1.02]" : "bg-transparent px-2"
                  )}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    {/* Unique Icon Node */}
                    <div className={cn(
                      "h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                      isHovered ? "bg-white/10 shadow-inner" : "bg-white/5 border border-white/10 shadow-sm"
                    )}>
                      <service.icon 
                        size={20} 
                        className={cn(
                          "transition-all duration-500",
                          isHovered ? "text-[#f9a885] scale-110" : "text-white/60"
                        )} 
                        strokeWidth={2.5}
                      />
                    </div>

                    {/* Adaptive Label Stream */}
                    <AnimatePresence mode="wait">
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, x: 10, filter: "blur(10px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: 10, filter: "blur(10px)" }}
                          className="flex flex-col items-start text-right min-w-[75px]"
                        >
                          <span className="text-[11px] font-black text-white leading-none tracking-tight">
                            {service.title}
                          </span>
                          <span className="text-[7px] font-bold text-blue-200/50 uppercase tracking-[0.2em] mt-1">
                            {service.desc}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Connectivity Indicator (Bottom Rail) */}
                  {isHovered && (
                    <motion.div 
                      layoutId="neon-rail"
                      className={cn(
                        "absolute bottom-1 left-1/2 -translate-x-1/2 h-[1.5px] w-4 rounded-full bg-current",
                        service.id === 'market' ? "text-blue-400" : service.id === 'arena' ? "text-[#f9a885]" : "text-emerald-400",
                        service.glow
                      )}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Tactical Shadow Layer */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-6 bg-blue-900/[0.05] blur-2xl rounded-full pointer-events-none" />
      </div>

      {/* Signature Protocol Branding */}
      <div className="mt-10 flex flex-col items-center gap-3 opacity-10 select-none">
         <div className="flex items-center gap-6">
            <div className="h-[0.5px] w-12 bg-gradient-to-r from-transparent to-[#002d4d]" />
            <span className="text-[7px] font-black uppercase tracking-[0.8em] text-[#002d4d] ml-[0.8em]">MORPHIC ENGINE ALPHA</span>
            <div className="h-[0.5px] w-12 bg-gradient-to-l from-transparent to-[#002d4d]" />
         </div>
      </div>
    </div>
  );
}
