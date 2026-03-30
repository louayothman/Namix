
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Rocket, Zap, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مُفاعل القُمرة التكتيكي v70.0 - Merged Pro Edition
 * دمج المقترح الأول (القمرة المنقسمة) والثالث (السكّة التكتيكية).
 * يتميز بوضوح صريح (أيقونة + نص) ومحرك انزلاق مغناطيسي بلون المحفظة.
 */

const services = [
  { 
    id: "market", 
    title: "الأسواق الحية", 
    en: "MARKET",
    icon: Activity, 
    href: "/trade",
    desc: "نبض الأصول"
  },
  { 
    id: "arena", 
    title: "ساحة المغامرة", 
    en: "ARENA",
    icon: Rocket, 
    href: "/arena",
    desc: "تحديات النمو"
  },
  { 
    id: "yield", 
    title: "مختبر العقود", 
    en: "YIELD",
    icon: Zap, 
    href: "/invest",
    desc: "هندسة العائد"
  }
];

export function ServiceGateway() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full py-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-body" dir="rtl">
      <div className="max-w-xl mx-auto px-4">
        
        {/* هيكل القمرة الرئيسي - Segmented Cockpit Chassis */}
        <div className="bg-gray-100/50 rounded-[32px] p-1.5 flex items-center justify-between gap-1 relative overflow-hidden border border-gray-100 shadow-inner">
          
          {services.map((service) => {
            const isActive = hoveredId === service.id;
            
            return (
              <Link 
                key={service.id} 
                href={service.href}
                className="relative flex-1 group outline-none"
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                onTouchStart={() => setHoveredId(service.id)}
              >
                <div className="relative flex flex-col items-center justify-center h-20 md:h-24 rounded-[24px] transition-all duration-500 z-10">
                  
                  {/* السكّة التكتيكية المنزلقة - The Tactical Sliding Rail */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="active-rail"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute inset-0 bg-[#8899AA] rounded-[24px] shadow-xl z-0"
                      />
                    )}
                  </AnimatePresence>

                  {/* المحتوى الصريح: أيقونة + نص */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <motion.div
                      animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                      className={cn(
                        "transition-colors duration-500",
                        isActive ? "text-white" : "text-[#002d4d]/40"
                      )}
                    >
                      <service.icon size={isActive ? 22 : 20} strokeWidth={2.5} />
                    </motion.div>
                    
                    <div className="text-center space-y-0.5">
                      <p className={cn(
                        "text-[11px] md:text-[13px] font-black tracking-normal transition-colors duration-500",
                        isActive ? "text-white" : "text-[#002d4d]"
                      )}>
                        {service.title}
                      </p>
                      
                      <div className="flex items-center justify-center gap-1.5">
                        <AnimatePresence mode="wait">
                          {isActive ? (
                            <motion.span 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-[7px] font-black text-[#f9a885] uppercase tracking-widest"
                            >
                              OPERATIONAL
                            </motion.span>
                          ) : (
                            <span className="text-[7px] font-bold text-gray-300 uppercase tracking-tighter">
                              {service.en}
                            </span>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* خيط ضوئي سفلي عند النشاط */}
                  {isActive && (
                    <motion.div 
                      layoutId="rail-glow"
                      className="absolute bottom-2 h-0.5 w-6 bg-white/40 rounded-full blur-[1px]"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* تذييل البوابة المدمج */}
        <div className="mt-4 flex items-center justify-center gap-4 opacity-[0.15] select-none">
           <div className="h-[0.5px] flex-1 bg-gradient-to-r from-transparent to-[#002d4d]" />
           <p className="text-[8px] font-black uppercase tracking-[0.6em] text-[#002d4d] mr-[-0.6em]">Namix Gateway</p>
           <div className="h-[0.5px] flex-1 bg-gradient-to-l from-transparent to-[#002d4d]" />
        </div>

      </div>
    </div>
  );
}
