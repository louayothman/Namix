
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview بوابة الخدمات النخبوية v25.0 - Liquid Mercury Edition
 * محرك فيزيائي يحاكي اندماج الزئبق المغناطيسي بين الخدمات الثلاث.
 */

const eliteServices = [
  { 
    id: "market", 
    title: "أسواق التداول", 
    icon: Activity, 
    href: "/trade", 
    desc: "نبض الأصول"
  },
  { 
    id: "arena", 
    title: "ساحة المغامرة", 
    icon: Rocket, 
    href: "/arena", 
    desc: "تفاعل ذكي"
  },
  { 
    id: "yield", 
    title: "مختبر الاستثمار", 
    icon: Zap, 
    href: "/invest", 
    desc: "نمو مستدام"
  }
];

export function ServiceGateway() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative py-10 font-body" dir="rtl">
      {/* 1. استخبارات الهوية الجانبية */}
      <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 opacity-10 select-none">
         <span className="text-[7px] font-black text-[#002d4d] uppercase tracking-[0.6em] [writing-mode:vertical-lr] rotate-180">
           MERCURY LINK
         </span>
         <div className="w-[1px] h-20 bg-[#002d4d] rounded-full" />
      </div>

      {/* 2. مفاعل الزئبق (The Gooey Container) */}
      <div 
        className="relative flex items-center justify-center gap-4 md:gap-12 py-8"
        style={{ filter: "url(#liquid-mercury-goo)" }}
      >
        {eliteServices.map((service) => (
          <Link 
            key={service.id} 
            href={service.href}
            onMouseEnter={() => setHovered(service.id)}
            onMouseLeave={() => setHovered(null)}
            className="relative group outline-none"
          >
            <motion.div
              animate={{
                scale: hovered === service.id ? 1.15 : 1,
                rotate: hovered === service.id ? [0, -5, 5, 0] : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={cn(
                "h-20 w-20 md:h-28 md:w-28 rounded-full bg-[#8899AA] flex items-center justify-center shadow-xl relative transition-colors duration-500",
                hovered === service.id ? "bg-[#002d4d]" : "bg-[#8899AA]"
              )}
            >
              {/* أيقونة منكسرة ضوئياً */}
              <motion.div
                animate={{
                  y: hovered === service.id ? -5 : 0,
                  opacity: hovered === service.id ? 1 : 0.8
                }}
                className="text-white relative z-20"
              >
                <service.icon size={window?.innerWidth < 768 ? 28 : 36} strokeWidth={1.5} />
              </motion.div>

              {/* النبض الداخلي للزئبق */}
              {hovered === service.id && (
                <motion.div
                  layoutId="mercury-pulse"
                  className="absolute inset-0 rounded-full bg-white/10 blur-xl animate-pulse"
                />
              )}
            </motion.div>
          </Link>
        ))}
      </div>

      {/* 3. تسميات الخدمات (تظهر خارج الفلتر لضمان الوضوح) */}
      <div className="grid grid-cols-3 gap-4 mt-6 px-4">
        {eliteServices.map((service) => (
          <div key={service.id} className="text-center space-y-1">
            <motion.p 
              animate={{ 
                color: hovered === service.id ? "#002d4d" : "#94a3b8",
                scale: hovered === service.id ? 1.05 : 1
              }}
              className="font-black text-[11px] md:text-sm tracking-tight transition-colors"
            >
              {service.title}
            </motion.p>
            <p className="text-[7px] md:text-[9px] font-bold text-gray-300 uppercase tracking-widest">{service.desc}</p>
          </div>
        ))}
      </div>

      {/* 4. تذييل البروتوكول */}
      <div className="mt-12 flex flex-col items-center gap-3 opacity-20 select-none">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <ShieldCheck size={10} className="text-[#002d4d]" />
               <span className="text-[7px] font-black uppercase tracking-widest">Liquid Security</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2">
               <Sparkles size={10} className="text-[#f9a885]" />
               <span className="text-[7px] font-black uppercase tracking-widest">Nexus Fluidity</span>
            </div>
         </div>
      </div>

      {/* 5. مصفوفة فلتر الزئبق (Gooey Matrix) */}
      <svg className="absolute h-0 w-0 pointer-events-none">
        <defs>
          <filter id="liquid-mercury-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
