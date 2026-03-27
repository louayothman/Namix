
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, Zap, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-40 px-6 relative overflow-hidden bg-[#002d4d]">
       <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="h-full w-full bg-[radial-gradient(circle,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
       </div>

       <div className="container mx-auto relative z-10 text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-6"
            dir="rtl"
          >
             <div className="flex items-center justify-center gap-3 text-[#f9a885] font-black text-[10px] uppercase">
                <Sparkles size={14} className="animate-pulse" />
                Your Success Starts Here
             </div>
             <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-tight">
                هل أنت مستعد <br/> <span className="text-[#f9a885]">لقيادة نموك؟</span>
             </h2>
             <p className="text-[13px] text-white/40 font-medium max-w-2xl mx-auto leading-relaxed">
                انضم لآلاف المستثمرين الذين اختاروا ناميكس كشريك استراتيجي في رحلتهم نحو السيادة المالية والابتكار الرقمي.
             </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center gap-8"
          >
             <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-20 md:h-24 px-16 rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-2xl shadow-2xl active:scale-95 transition-all group border-none">
                   ابدأ الآن مجاناً
                   <Zap size={24} className="mr-4 fill-current transition-transform group-hover:scale-125" />
                </Button>
             </Link>
             
             <div className="flex items-center gap-6 text-white/20">
                <div className="flex items-center gap-2">
                   <ShieldCheck size={16} className="text-emerald-500" />
                   <span className="text-[10px] font-black uppercase">End-to-End Secure</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black uppercase">Instant Setup</span>
                </div>
             </div>
          </motion.div>
       </div>
    </section>
  );
}
