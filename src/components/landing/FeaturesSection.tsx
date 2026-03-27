
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Zap, 
  TrendingUp,
  Cpu,
  Globe,
  Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  { 
    title: "أمان يتجاوز التوقعات", 
    en: "Ultra Security", 
    desc: "تشفير بيانات عسكري وحماية متعددة المستويات تضمن سيادتك الكاملة على أصولك.", 
    icon: Lock, 
    color: "text-blue-500", 
    bg: "bg-blue-50" 
  },
  { 
    title: "محرك تداول وميضي", 
    en: "Flash Engine", 
    desc: "تنفيذ صفقات فوري يربطك بأهم البورصات العالمية في أجزاء من الثانية.", 
    icon: Zap, 
    color: "text-orange-500", 
    bg: "bg-orange-50" 
  },
  { 
    title: "ذكاء اصطناعي موجه", 
    en: "Neural Guidance", 
    desc: "استخدم بوصلة ناميكس الذكية لتحليل السوق واقتناص أفضل فرص النمو.", 
    icon: Cpu, 
    color: "text-purple-500", 
    bg: "bg-purple-50" 
  }
];

export function FeaturesSection() {
  return (
    <section className="py-40 px-6 relative bg-gray-50/30">
       <div className="container mx-auto space-y-24">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center space-y-6 max-w-3xl mx-auto"
            dir="rtl"
          >
             <Badge className="bg-[#002d4d] text-white border-none px-6 py-2 rounded-full font-black text-[10px] tracking-[0.4em] uppercase shadow-lg shadow-blue-900/20">The Intelligent Edge</Badge>
             <h2 className="text-5xl md:text-7xl font-black text-[#002d4d] tracking-tighter">ابتكار يُعيد تعريف <br/> <span className="text-gray-300">الاستثمار الرقمي.</span></h2>
             <p className="text-lg md:text-xl text-gray-400 font-medium leading-[2]">نحن لا نبني منصة فحسب، بل نصمم بيئة نمو عالمية تضع القوة بين يديك بكل سلاسة وفخامة.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
             {features.map((feat, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: i * 0.2 }}
                 whileHover={{ y: -15 }}
                 className="p-12 rounded-[64px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_100px_rgba(0,45,77,0.08)] transition-all duration-700 group relative overflow-hidden"
               >
                  <div className="absolute -top-10 -right-10 opacity-0 group-hover:opacity-[0.03] transition-all duration-1000 group-hover:rotate-12">
                     <feat.icon size={200} />
                  </div>

                  <div className={cn("h-16 w-16 rounded-[24px] flex items-center justify-center mb-10 shadow-inner transition-transform group-hover:scale-110 duration-500", feat.bg)}>
                     <feat.icon size={32} className={feat.color} />
                  </div>
                  
                  <div className="space-y-4 text-right relative z-10" dir="rtl">
                     <div className="flex flex-col">
                        <h3 className="text-2xl font-black text-[#002d4d] tracking-tight">{feat.title}</h3>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1.5">{feat.en}</span>
                     </div>
                     <p className="text-base text-gray-400 font-bold leading-[2]">{feat.desc}</p>
                  </div>
               </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
}
