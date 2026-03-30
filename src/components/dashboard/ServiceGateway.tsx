
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Rocket, Zap, Sparkles, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview بوابة الخدمات التكتيكية v40.0 - The Floating Rail Edition
 * تصميم يعتمد على "الأناقة المصغرة" ونظام الرصيف العائم (The Dock System).
 * يتميز بالتوسع الهادئ عند التفاعل مع تأثيرات الزجاج الفاخرة وتوهج النيون.
 */

const eliteServices = [
  { 
    id: "market", 
    title: "الأسواق", 
    desc: "نبض الأصول",
    icon: Activity, 
    href: "/trade", 
    color: "text-blue-500",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.5)]"
  },
  { 
    id: "arena", 
    title: "الساحة", 
    desc: "مغامرة ذكية",
    icon: Rocket, 
    href: "/arena", 
    color: "text-[#f9a885]",
    glow: "shadow-[0_0_15px_rgba(249,168,133,0.5)]"
  },
  { 
    id: "yield", 
    title: "المختبر", 
    desc: "هندسة العائد",
    icon: Zap, 
    href: "/invest", 
    color: "text-emerald-500",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.5)]"
  }
];

export function ServiceGateway() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full py-2 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-body" dir="rtl">
      {/* Header Label - Minimalist */}
      <div className="flex flex-col items-center mb-8 space-y-1 opacity-40">
        <div className="flex items-center gap-2">
          <Sparkles size={10} className="text-[#8899AA]" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#002d4d]">Tactical Service Rail</span>
        </div>
        <div className="h-[0.5px] w-12 bg-gradient-to-r from-transparent via-[#002d4d] to-transparent" />
      </div>

      {/* Floating Tactical Rail */}
      <div className="max-w-md mx-auto relative px-4">
        <div className="bg-white/40 backdrop-blur-3xl rounded-[40px] border border-white/60 p-2 shadow-[0_30px_70px_-10px_rgba(0,45,77,0.15)] flex items-center justify-between gap-1 relative overflow-hidden">
          
          {/* Subtle Background Internal Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/10 to-transparent pointer-events-none" />

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
                    "relative flex items-center justify-center h-14 rounded-full transition-all duration-500 overflow-hidden",
                    isHovered ? "bg-[#002d4d] px-6 shadow-2xl scale-[1.02]" : "bg-transparent px-2"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* 3D-feel Icon Container */}
                    <div className={cn(
                      "h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                      isHovered ? "bg-white/10 shadow-inner" : "bg-white shadow-sm border border-gray-50"
                    )}>
                      <service.icon 
                        size={20} 
                        className={cn(
                          "transition-all duration-500",
                          isHovered ? "text-[#f9a885] scale-110" : service.color
                        )} 
                        strokeWidth={2.5}
                      />
                    </div>

                    {/* Tooltip-style Labels (Expands) */}
                    <AnimatePresence mode="wait">
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex flex-col items-start text-right min-w-[70px]"
                        >
                          <span className="text-[11px] font-black text-white leading-none tracking-tight">
                            {service.title}
                          </span>
                          <span className="text-[7px] font-bold text-blue-200/60 uppercase tracking-widest mt-1">
                            {service.desc}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Neon Connectivity Glow (Underline) */}
                  {isHovered && (
                    <motion.div 
                      layoutId="neon-glow"
                      className={cn(
                        "absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-4 bg-current rounded-full",
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

        {/* Floating Reflection Effect */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-blue-900/[0.03] blur-xl rounded-full pointer-events-none" />
      </div>

      {/* Authorized Protocol Footer */}
      <div className="mt-8 flex flex-col items-center gap-3 opacity-20 select-none">
         <div className="flex items-center gap-4">
            <div className="h-[0.5px] w-8 bg-gray-300" />
            <span className="text-[7px] font-black uppercase tracking-[0.6em] text-[#002d4d]">Tactical Rail Alpha</span>
            <div className="h-[0.5px] w-8 bg-gray-300" />
         </div>
      </div>
    </div>
  );
}
