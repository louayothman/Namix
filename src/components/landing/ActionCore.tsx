"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap, ShieldCheck, Sparkles } from "lucide-react";

export function ActionCore() {
  return (
    <section className="py-60 px-6 relative overflow-hidden flex items-center justify-center">
       {/* Central Soul Core */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl aspect-square pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="w-full h-full bg-blue-500 rounded-full blur-[150px]"
          />
       </div>

       <div className="container mx-auto text-center space-y-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="space-y-8"
            dir="rtl"
          >
             <div className="flex items-center justify-center gap-3 text-[#f9a885] font-black text-[10px] uppercase tracking-[0.5em]">
                <Sparkles size={14} className="animate-pulse" />
                The Future is Now
             </div>
             <h2 className="text-white leading-tight">جاهز للتحول <br /> <span className="text-white/20">الرقمي المطلق؟</span></h2>
             <p className="text-white/40 font-medium max-w-xl mx-auto text-lg leading-loose">لا تنتظر المستقبل؛ قم بصناعته الآن مع منصة ناميكس المتكاملة.</p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-10"
          >
             <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-24 md:h-28 px-20 rounded-[40px] bg-[#f9a885] text-[#002d4d] hover:bg-white font-black text-3xl shadow-[0_30px_100px_rgba(249,168,133,0.3)] active:scale-95 transition-all group border-none">
                   ابدأ مجاناً
                   <Zap size={28} className="mr-4 fill-current transition-transform group-hover:scale-125" />
                </Button>
             </Link>

             <div className="flex items-center gap-8 text-white/10 font-black text-[10px] uppercase tracking-widest">
                <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> Secure</span>
                <div className="h-4 w-[0.5px] bg-white/20" />
                <span>Instant Setup</span>
                <div className="h-4 w-[0.5px] bg-white/20" />
                <span>24/7 Node Support</span>
             </div>
          </motion.div>
       </div>
    </section>
  );
}