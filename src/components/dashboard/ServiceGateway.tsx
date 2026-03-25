
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Zap, ArrowUpRight, Rocket } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const eliteServices = [
  { 
    id: "market", 
    title: "أسواق التداول", 
    icon: Activity, 
    href: "/trade", 
    color: "text-blue-500", 
    bg: "bg-blue-500",
    desc: "استثمار احترافي قائم على تنمية الأصول"
  },
  { 
    id: "arena", 
    title: "ساحة المغامرة", 
    icon: Rocket, 
    href: "/arena", 
    color: "text-[#f9a885]", 
    bg: "bg-[#f9a885]",
    desc: "فرص تفاعلية لتعظيم العوائد بذكاء"
  },
  { 
    id: "yield", 
    title: "مختبر الاستثمار", 
    icon: Zap, 
    href: "/invest", 
    color: "text-emerald-500", 
    bg: "bg-emerald-500",
    desc: "حلول استثمارية تحقق نمواً مستداماً"
  }
];

export function ServiceGateway() {
  return (
    <div className="flex gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-body items-stretch" dir="rtl">
      
      <div className="flex flex-col items-center justify-center gap-3 shrink-0 px-1 select-none relative group/rail">
         <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d] animate-pulse shadow-[0_0_8px_rgba(0,45,77,0.3)]" />
         <span className="text-[7px] md:text-[8px] font-black text-[#002d4d] opacity-20 uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180">
           NAMIX GATEWAYS
         </span>
         <div className="flex-1 w-[1px] bg-gray-100 relative overflow-hidden rounded-full">
            <motion.div 
              animate={{ y: ["-100%", "400%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-transparent via-[#f9a885]/40 to-transparent"
            />
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {eliteServices.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="h-full"
          >
            <Link href={service.href} className="block h-full">
              <Card className={cn(
                "border-none shadow-sm rounded-[32px] md:rounded-[44px] bg-white border border-gray-50/50 hover:shadow-2xl hover:border-blue-100 transition-all duration-700 group active:scale-[0.98] relative overflow-hidden flex flex-col h-32 md:h-44"
              )}>
                <motion.div 
                  animate={{ rotate: [0, 5, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className={cn(
                    "absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 opacity-[0.04] group-hover:opacity-[0.1] transition-all duration-700 pointer-events-none group-hover:scale-125 group-hover:rotate-12",
                    service.color
                  )}
                >
                   <service.icon size={120} strokeWidth={1.2} className="md:size-[160px]" />
                </motion.div>

                <CardContent className="p-4 md:p-8 space-y-2 md:space-y-5 relative z-10 flex-1 flex flex-col justify-start pt-6 md:pt-10">
                  <div className="flex justify-between items-start w-full">
                    <div />
                    <div className="h-7 w-7 md:h-9 md:w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500 shadow-inner group-hover:rotate-12">
                      <ArrowUpRight className="h-3 md:h-4 w-3 md:h-4" />
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1 md:space-y-2">
                    <p className="font-black text-sm md:text-lg text-[#002d4d] tracking-tight group-hover:text-blue-600 transition-colors duration-500 leading-none">{service.title}</p>
                    <div className="relative h-[1px] w-full max-w-[60px] hidden md:block">
                       <div className={cn(
                         "h-full rounded-full transition-all duration-700 ease-out",
                         service.color.replace('text-', 'bg-'),
                         "w-2 group-hover:w-full"
                       )} />
                    </div>
                    <p className="text-[8px] md:text-[11px] text-gray-400 font-bold group-hover:text-gray-600 transition-colors duration-500 leading-relaxed line-clamp-1 md:line-clamp-2">
                      {service.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
