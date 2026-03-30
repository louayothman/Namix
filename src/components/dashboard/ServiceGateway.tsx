
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Rocket, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview المفاعل التكتيكي المورفي v60.0 - Ultra Focus Edition
 * تم حصر المحرك المورفي داخل الشريط نفسه وتطهير النصوص العربية تماماً.
 */

const eliteServices = [
  { 
    id: "market", 
    title: "الأسواق", 
    desc: "نبض الأصول",
    icon: Activity, 
    href: "/trade", 
    color: "text-blue-400"
  },
  { 
    id: "arena", 
    title: "الساحة", 
    desc: "مغامرة ذكية",
    icon: Rocket, 
    href: "/arena", 
    color: "text-[#f9a885]"
  },
  { 
    id: "yield", 
    title: "المختبر", 
    desc: "هندسة العائد",
    icon: Zap, 
    href: "/invest", 
    color: "text-emerald-400"
  }
];

export function ServiceGateway() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full py-2 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-body" dir="rtl">
      
      <div className="max-w-md mx-auto relative px-4">
        {/* الشريط السيادي الموحد - الحاوية الوحيدة */}
        <div className="bg-[#8899AA] rounded-full border border-white/10 p-1.5 shadow-[0_30px_60px_-15px_rgba(0,45,77,0.3)] flex items-center justify-between gap-1 relative overflow-hidden group/rail h-16">
          
          {/* المحرك المورفي الهندسي - محبوس داخل الشريط */}
          <motion.div
            animate={{
              x: ["-20%", "120%", "-20%"],
              rotate: [0, 90, 180, 270, 360],
              clipPath: [
                "inset(0% round 15%)",   // مربع
                "polygon(50% 0%, 0% 100%, 100% 100%)", // مثلث
                "inset(25% 0% 25% 0% round 5%)", // مستطيل
                "inset(0% round 50%)"    // دائرة
              ],
              scale: [1, 1.4, 0.9, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 bottom-0 w-32 bg-white/30 blur-[30px] pointer-events-none z-0"
          />

          <motion.div
            animate={{
              x: ["120%", "-20%", "120%"],
              rotate: [360, 270, 180, 90, 0],
              clipPath: [
                "inset(0% round 50%)",   // دائرة
                "inset(0% round 15%)",   // مربع
                "polygon(50% 0%, 0% 100%, 100% 100%)", // مثلث
                "inset(25% 0% 25% 0% round 5%)"  // مستطيل
              ],
              scale: [1.2, 0.8, 1.3, 1],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 bottom-0 w-40 bg-blue-100/20 blur-[40px] pointer-events-none z-0"
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
                    "relative flex items-center justify-center h-12 rounded-full transition-all duration-500",
                    isHovered ? "bg-[#002d4d] px-5 shadow-2xl scale-[1.02]" : "bg-transparent px-2"
                  )}
                >
                  <div className="flex items-center gap-2.5 relative z-10">
                    {/* أيقونة الخدمة */}
                    <div className={cn(
                      "h-9 w-9 rounded-[14px] flex items-center justify-center transition-all duration-500",
                      isHovered ? "bg-white/10 shadow-inner" : "bg-white/5 border border-white/5"
                    )}>
                      <service.icon 
                        size={18} 
                        className={cn(
                          "transition-all duration-500",
                          isHovered ? "text-[#f9a885] scale-110" : "text-white/50"
                        )} 
                        strokeWidth={2.5}
                      />
                    </div>

                    {/* النصوص - تطهير التباعد */}
                    <AnimatePresence mode="wait">
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, x: 10, filter: "blur(10px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: 10, filter: "blur(10px)" }}
                          className="flex flex-col items-start text-right min-w-[70px]"
                        >
                          <span className="text-[11px] font-black text-white leading-none tracking-normal">
                            {service.title}
                          </span>
                          <span className="text-[7px] font-bold text-blue-200/50 uppercase mt-1 tracking-normal">
                            {service.desc}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
