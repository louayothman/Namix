"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Zap, 
  TrendingUp 
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  { title: "أمان فائق الذكاء", en: "Smart Security", desc: "تشفير بيانات متقدم وحماية متعددة الطبقات لكافة أصولك الرقمية وتحركاتك المالية.", icon: Lock, color: "text-blue-600", bg: "bg-blue-50" },
  { title: "تنفيذ فوري متطور", en: "Instant Execution", desc: "محرك تداول يربطك بأهم الأسواق العالمية بسرعة البرق وبكل سهولة مذهلة.", icon: Zap, color: "text-[#f9a885]", bg: "bg-orange-50" },
  { title: "هندسة نمو ذكية", en: "Growth Matrix", desc: "حلول تقنية مبتكرة تساعدك على تنمية محفظتك بأساليب موثقة وعائد مستدام.", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" }
];

export function FeaturesSection() {
  return (
    <section className="py-32 px-6 relative bg-white">
       <div className="container mx-auto space-y-24">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center space-y-4 max-w-3xl mx-auto"
            dir="rtl"
          >
             <Badge className="bg-[#002d4d]/5 text-[#002d4d] border-none px-5 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase">The Intelligent Edge</Badge>
             <h2 className="text-4xl md:text-6xl font-black text-[#002d4d] tracking-tight">لماذا يختار النخبة ناميكس؟</h2>
             <p className="text-base md:text-xl text-gray-400 font-medium leading-loose">نظام متكامل يجمع بين قوة التكنولوجيا المتطورة وسهولة التجربة المالية العصرية.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {features.map((feat, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: i * 0.2 }}
                 whileHover={{ y: -12 }}
                 className="p-12 rounded-[56px] bg-white border border-gray-100 hover:border-blue-100 hover:shadow-[0_40px_80px_-20px_rgba(0,45,77,0.08)] transition-all duration-700 group"
               >
                  <div className={cn("h-16 w-16 rounded-[24px] flex items-center justify-center mb-10 shadow-inner transition-transform group-hover:rotate-12 duration-500", feat.bg)}>
                     <feat.icon size={32} className={feat.color} />
                  </div>
                  <div className="space-y-4 text-right" dir="rtl">
                     <div className="flex flex-col">
                        <h3 className="text-2xl font-black text-[#002d4d] tracking-tight">{feat.title}</h3>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">{feat.en}</span>
                     </div>
                     <p className="text-sm text-gray-400 font-medium leading-[2.2]">{feat.desc}</p>
                  </div>
               </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
}
