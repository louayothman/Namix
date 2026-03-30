
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Zap, Rocket, ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview بوابة الخدمات النخبوية v30.0 - The Tactical Deck Edition
 * تصميم يعتمد على الفخامة الهادئة والأزرار التكتيكية التي تعكس قوة وموثوقية ناميكس.
 */

const eliteServices = [
  { 
    id: "market", 
    title: "أسواق التداول", 
    desc: "نبض الأصول الحية",
    icon: Activity, 
    href: "/trade", 
    color: "text-blue-500",
    bg: "bg-blue-50/50"
  },
  { 
    id: "arena", 
    title: "ساحة المغامرة", 
    desc: "تفاعل ذكي ومرح",
    icon: Rocket, 
    href: "/arena", 
    color: "text-[#f9a885]",
    bg: "bg-orange-50/50"
  },
  { 
    id: "yield", 
    title: "مختبر الاستثمار", 
    desc: "هندسة العوائد القصوى",
    icon: Zap, 
    href: "/invest", 
    color: "text-emerald-500",
    bg: "bg-emerald-50/50"
  }
];

export function ServiceGateway() {
  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-body" dir="rtl">
      {/* Header Label */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-gray-400 font-black text-[9px] uppercase tracking-[0.3em]">
          <Sparkles size={10} className="text-[#f9a885]" />
          Elite Service Gateway
        </div>
        <div className="h-[1px] flex-1 mx-4 bg-gray-100" />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {eliteServices.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={service.href} className="block group outline-none">
              <div className="relative p-6 rounded-[40px] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 active:scale-[0.98] overflow-hidden">
                
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none text-[#002d4d]">
                   <service.icon size={120} strokeWidth={1} />
                </div>

                <div className="flex items-center gap-5 relative z-10">
                  {/* Icon Container */}
                  <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner transition-all duration-700 group-hover:scale-110",
                    service.bg
                  )}>
                    <service.icon size={24} className={cn("transition-colors duration-500", service.color)} strokeWidth={2.5} />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 text-right space-y-0.5">
                    <h4 className="font-black text-base text-[#002d4d] group-hover:text-blue-600 transition-colors duration-500">
                      {service.title}
                    </h4>
                    <p className="text-[10px] font-bold text-gray-400 tracking-tight">
                      {service.desc}
                    </p>
                  </div>

                  {/* Action Hint */}
                  <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500 shadow-sm">
                    <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                  </div>
                </div>

                {/* Bottom Glow Line */}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right",
                  service.id === 'market' ? "bg-blue-500" : service.id === 'arena' ? "bg-[#f9a885]" : "bg-emerald-500"
                )} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* System Footer Protocol */}
      <div className="flex flex-col items-center gap-3 pt-4 opacity-20 select-none">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
               <span className="text-[7px] font-black uppercase tracking-widest text-[#002d4d]">Tactical Link Active</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2">
               <span className="text-[7px] font-black uppercase tracking-widest text-[#002d4d]">End-to-End Secure</span>
            </div>
         </div>
      </div>
    </div>
  );
}
