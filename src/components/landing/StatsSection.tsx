
"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Activity, 
  Wallet, 
  Globe, 
  ShieldCheck, 
  ChevronLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const stats = [
  { label: "مستثمر نشط", val: "50K+", icon: Users, color: "text-blue-400" },
  { label: "عمليات يومية", val: "$2.4M", icon: Activity, color: "text-emerald-400" },
  { label: "أصول مدارة", val: "$150M+", icon: Wallet, color: "text-[#f9a885]" },
  { label: "دولة مدعومة", val: "12+", icon: Globe, color: "text-purple-400" }
];

export function StatsSection() {
  return (
    <section className="py-32 px-6 relative">
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         whileInView={{ opacity: 1, scale: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 1.2 }}
         className="container mx-auto bg-[#002d4d] rounded-[64px] p-12 md:p-24 text-white overflow-hidden relative group"
       >
          <div className="absolute top-0 right-0 p-20 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-0">
             <Globe size={500} />
          </div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-10 text-center lg:text-right">
                <div className="h-20 w-20 rounded-[28px] bg-[#f9a885] flex items-center justify-center shadow-2xl shadow-orange-900/40 mx-auto lg:mr-0">
                   <ShieldCheck size={40} className="text-[#002d4d]" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                    شريكك الموثوق في <br/>
                    <span className="text-[#f9a885]">رحلة النمو الرقمي.</span>
                  </h2>
                  <p className="text-base md:text-lg text-white/40 font-medium leading-loose max-w-lg mx-auto lg:mr-0">
                    نحن نؤمن بأن الوصول للأدوات المالية المتطورة هو حق للجميع. ناميكس توفر لك البيئة الآمنة لتحقيق طموحاتك بذكاء.
                  </p>
                </div>
                <Link href="/login" className="block">
                  <Button variant="outline" className="h-16 px-12 rounded-full border-white/10 text-white font-black hover:bg-white hover:text-[#002d4d] transition-all group">
                     اكتشف ميثاق الأمان المعتمد
                     <ChevronLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
                  </Button>
                </Link>
             </div>

             <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-10 rounded-[48px] bg-white/5 border border-white/5 backdrop-blur-md text-center space-y-3 transition-all hover:bg-white/10"
                  >
                     <stat.icon size={24} className={cn("mx-auto opacity-30", stat.color)} />
                     <p className="text-3xl font-black text-white tabular-nums tracking-tighter">{stat.val}</p>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none">{stat.label}</p>
                  </motion.div>
                ))}
             </div>
          </div>
       </motion.div>
    </section>
  );
}
