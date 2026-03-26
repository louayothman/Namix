
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Activity, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FloatingNode = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ 
      opacity: 1, 
      y: [0, -15, 0],
    }}
    transition={{ 
      opacity: { duration: 1.2, delay },
      y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay }
    }}
    className={cn("absolute z-20 hidden lg:block", className)}
  >
    {children}
  </motion.div>
);

export function HeroSection1() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 md:pt-40 bg-white">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* Right Block: Global Messaging */}
        <motion.div 
          initial={{ opacity: 0, x: 60, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 text-center lg:text-right"
          dir="rtl"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
             <Sparkles size={14} className="text-blue-600 animate-pulse" />
             <span className="text-[#002d4d] font-black text-[10px] uppercase tracking-widest">المستقبل الذكي للنمو <span className="opacity-30 mx-1">•</span> Smart Growth Hub</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#002d4d] leading-[1.1] tracking-tighter">
            استثمار بلا <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#002d4d] via-blue-600 to-[#f9a885] animate-text-shimmer">حدود عالمية.</span>
          </h1>
          
          <p className="text-sm md:text-xl text-gray-400 font-medium max-w-lg mx-auto lg:ml-auto lg:mr-0 leading-loose tracking-normal">
            اكتشف تجربة مالية عالمية تدمج بين الذكاء الاصطناعي وسهولة الاستخدام، مصممة لرحلة نمو مستدامة.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-6">
             <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-16 md:h-20 px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-2xl shadow-blue-900/20 active:scale-95 transition-all group">
                  ابدأ رحلتي الذكية
                  <ArrowRight size={20} className="mr-3 rotate-180 transition-transform group-hover:-translate-x-2" />
                </Button>
             </Link>
             <div className="flex items-center gap-4 px-8 h-16 md:h-20 rounded-full border border-gray-100 bg-gray-50/50 backdrop-blur-md">
                <ShieldCheck size={20} className="text-emerald-500" />
                <div className="flex flex-col items-start leading-none">
                   <span className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest">Safe & Secure</span>
                   <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase">بيئة تشغيل موثقة</span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Left Block: The Floating Reactor */}
        <div className="relative flex justify-center items-center h-[450px] md:h-[700px] mt-12 lg:mt-0">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute h-[500px] w-[500px] bg-gradient-to-tr from-blue-100/20 via-transparent to-[#f9a885]/10 rounded-full blur-[80px] opacity-60"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 80, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[260px] h-[540px] md:w-[320px] md:h-[640px] bg-white rounded-[60px] border-[8px] border-[#002d4d]/5 shadow-[0_60px_120px_-20px_rgba(0,45,77,0.1)] overflow-hidden"
          >
            <div className="p-8 md:p-10 space-y-10">
               <div className="flex justify-between items-center opacity-20">
                  <div className="h-1.5 w-12 bg-[#002d4d] rounded-full" />
                  <div className="h-4 w-4 rounded-full border-2 border-[#002d4d]" />
               </div>
               
               <div className="space-y-3 text-center pt-4" dir="rtl">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Total Balance</p>
                  <h3 className="text-3xl md:text-5xl font-black text-[#002d4d] tabular-nums tracking-tighter">$14,250.00</h3>
                  <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                     <TrendingUp size={12} className="text-emerald-500" />
                     <span className="text-[10px] font-black text-emerald-600">+22.4%</span>
                  </div>
               </div>

               <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 space-y-5 shadow-inner" dir="rtl">
                  <div className="flex justify-between items-center">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Growth</p>
                     <Zap size={12} className="text-[#f9a885] fill-current" />
                  </div>
                  <div className="space-y-2">
                     <p className="text-2xl font-black text-[#002d4d] tabular-nums tracking-tighter">$9,140.20</p>
                     <div className="h-1.5 w-full bg-white rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          animate={{ width: ['30%', '80%', '30%'] }} 
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
                          className="h-full bg-blue-600 rounded-full" 
                        />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 rounded-2xl bg-[#002d4d] flex items-center justify-center text-[#f9a885] font-black text-[10px] shadow-lg">TRADE</div>
                  <div className="h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 font-black text-[10px]">WALLET</div>
               </div>
            </div>
          </motion.div>

          <FloatingNode delay={0.2} className="top-[15%] -right-24">
             <div className="bg-white/80 backdrop-blur-xl border border-gray-100 p-5 rounded-[32px] w-56 space-y-4 shadow-2xl" dir="rtl">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner"><Activity size={18} /></div>
                   <div className="text-right">
                      <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Real-time Node</p>
                      <p className="text-xs font-black text-[#002d4d]">Syncing Markets...</p>
                   </div>
                </div>
                <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                   <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} className="h-full w-1/2 bg-blue-500 rounded-full" />
                </div>
             </div>
          </FloatingNode>

          <FloatingNode delay={0.6} className="bottom-[20%] -left-36">
             <div className="bg-[#002d4d] p-6 rounded-[36px] w-48 space-y-3 shadow-2xl border border-white/5" dir="rtl">
                <div className="flex justify-between items-center">
                   <span className="bg-emerald-50 text-[#002d4d] border-none text-[8px] font-black px-2 py-0.5 rounded-lg">OPTIMIZED</span>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-white/40 uppercase">Intelligence</p>
                   <p className="text-base font-black text-[#f9a885]">Deep Analysis Active</p>
                </div>
             </div>
          </FloatingNode>
        </div>
      </div>
    </section>
  );
}
