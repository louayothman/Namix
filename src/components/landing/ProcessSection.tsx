
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Wallet, TrendingUp, ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  { title: "إنشاء الهوية", en: "Identity Forge", desc: "سجل حسابك في ثوانٍ واحصل على بيئة تداول مخصصة لك بالكامل.", icon: UserPlus },
  { title: "تعزيز المحفظة", en: "Liquidity Inflow", desc: "اشحن رصيدك عبر بواباتنا العالمية الموثوقة والمدعومة لحظياً.", icon: Wallet },
  { title: "تفعيل النمو", en: "Launch Yield", desc: "اختر خطتك المفضلة أو ابدأ التداول الفوري لتعظيم عوائدك بذكاء.", icon: TrendingUp }
];

export function ProcessSection() {
  return (
    <section className="py-40 px-6 relative bg-white overflow-hidden">
       <div className="container mx-auto space-y-24">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             
             <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="space-y-10 text-right"
               dir="rtl"
             >
                <Badge className="bg-orange-50 text-[#f9a885] border-none px-6 py-2 rounded-full font-black uppercase">The Roadmap</Badge>
                <h2 className="text-[#002d4d] font-black tracking-tight">رحلة الانطلاق <br/> <span className="text-gray-300">في ثلاث خطوات.</span></h2>
                
                <div className="space-y-12 pt-6">
                   {steps.map((step, i) => (
                     <div key={i} className="flex items-start gap-8 group">
                        <div className="h-16 w-16 rounded-[24px] bg-gray-50 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-[#002d4d] group-hover:text-white transition-all duration-500">
                           <step.icon size={28} />
                        </div>
                        <div className="space-y-2">
                           <div className="flex items-baseline gap-3">
                              <h4 className="text-2xl font-black text-[#002d4d]">{step.title}</h4>
                              <span className="font-black text-gray-300 uppercase">{step.en}</span>
                           </div>
                           <p className="text-gray-400 font-bold leading-relaxed max-w-sm">{step.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="relative will-change-transform"
             >
                <div className="relative z-10 bg-[#002d4d] rounded-[64px] p-12 md:p-20 text-white overflow-hidden shadow-2xl group border border-white/5">
                   <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none">
                      <Sparkles size={300} />
                   </div>
                   <div className="space-y-8 relative z-10 text-right" dir="rtl">
                      <div className="h-20 w-20 rounded-[28px] bg-[#f9a885] flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                         <TrendingUp size={40} className="text-[#002d4d]" />
                      </div>
                      <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">ابدأ اليوم وانضم <br/> لشبكة النخبة العالمية.</h3>
                      <p className="text-white/40 font-medium leading-[2]">لا تترك مستقبلك المالي للصدفة؛ اعتمد على الأنظمة الذكية التي تضعك في المقدمة دوماً.</p>
                      <Link href="/login" className="block pt-4">
                         <Button className="h-16 px-10 rounded-full bg-white text-[#002d4d] hover:bg-[#f9a885] font-black transition-all active:scale-95 group">
                            إنشاء الحساب الآن
                            <ChevronLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                         </Button>
                      </Link>
                   </div>
                </div>
             </motion.div>

          </div>
       </div>
    </section>
  );
}
