
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  ChevronLeft, 
  Zap, 
  TrendingUp, 
  Activity, 
  Cpu, 
  Radar, 
  Target,
  BarChart3,
  Waves
} from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مفاعل الترحيب v24.0 - إصدار الثلاثية النانوية
 * يتميز بهيكلية 3D للهواتف، محاكاة المفاعلات، حلفية سائلة، وإنفوجرافيك استراتيجي.
 */

// --- محاكاة المفاعلات الداخلية للهواتف ---

const ContractReactor = () => (
  <div className="w-full h-full bg-white flex flex-col items-center justify-center p-4 gap-3">
    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner">
      <Zap size={24} className="fill-current" />
    </motion.div>
    <div className="space-y-1 text-center w-full">
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="h-full w-1/2 bg-emerald-500" />
      </div>
      <p className="text-[8px] font-black text-[#002d4d] tabular-nums">Yield: +42.5%</p>
    </div>
  </div>
);

const TradingReactor = () => (
  <div className="w-full h-full bg-white flex flex-col items-center justify-center p-4 gap-3">
    <Activity size={24} className="text-blue-500 animate-pulse" />
    <div className="flex items-end gap-1 h-12">
      {[40, 70, 50, 90, 60].map((h, i) => (
        <motion.div key={i} animate={{ height: [`${h}%`, `${h+10}%`, `${h}%`] }} transition={{ duration: 2 + i*0.2, repeat: Infinity }} className="w-2 bg-blue-100 rounded-t-sm" />
      ))}
    </div>
    <p className="text-[8px] font-black text-[#002d4d] tabular-nums">Latency: 0.02ms</p>
  </div>
);

const ArenaReactor = () => (
  <div className="w-full h-full bg-white flex flex-col items-center justify-center p-4 gap-3">
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="relative h-14 w-14 rounded-full border-2 border-dashed border-[#f9a885] flex items-center justify-center">
       <Target size={20} className="text-[#f9a885]" />
    </motion.div>
    <p className="text-[8px] font-black text-[#002d4d] uppercase tracking-widest">Live Arena</p>
  </div>
);

// --- مكون الهاتف ثلاثي الأبعاد ---

const Smartphone3D = ({ tilt, children, label, isActive }: { tilt: number, children: React.ReactNode, label: string, isActive?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50, rotateY: tilt }}
    animate={{ opacity: 1, y: 0, rotateY: tilt }}
    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    style={{ perspective: "1000px" }}
    className="flex flex-col items-center gap-4"
  >
    <div className={cn(
      "relative w-32 h-64 md:w-40 md:h-80 bg-[#002d4d] rounded-[32px] p-2 shadow-2xl border-[1.5px] border-white/10 transition-transform duration-700",
      isActive ? "scale-110 -translate-y-4" : "scale-100"
    )}>
      {/* Phone Screen */}
      <div className="w-full h-full bg-white rounded-[24px] overflow-hidden relative shadow-inner">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#002d4d] rounded-b-xl z-20" />
         {children}
      </div>
      {/* Reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none rounded-[32px]" />
    </div>
    <div className="text-center">
       <p className={cn("text-[9px] font-black uppercase tracking-widest transition-colors", isActive ? "text-[#f9a885]" : "text-gray-300")}>{label}</p>
    </div>
  </motion.div>
);

export function WelcomeHero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const db = useFirestore();
  
  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: landingData, isLoading } = useDoc(landingRef);

  useEffect(() => {
    const user = localStorage.getItem("namix_user");
    setIsLoggedIn(!!user);
  }, []);

  const title = landingData?.welcomeTitle || "ناميكس: حيث تلتقي التقنية بالثروة.";
  const subtitle = landingData?.welcomeSubtitle || "مرحباً بك في مستقبل الاستثمار الذكي";
  const description = landingData?.welcomeDescription || "نحن نوفر البيئة الاستثمارية الأكثر تطوراً للنخبة، حيث تندمج القوة التقنية مع الأمان المطلق لتوليد فرص نمو لا محدودة.";

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center pt-32 pb-20 bg-white overflow-hidden font-body" dir="rtl">
      
      {/* 1. TEXTUAL HEADLINE - TOP CENTER */}
      <div className="container mx-auto px-6 text-center space-y-10 relative z-30 mb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-5 py-2 bg-gray-50 rounded-full border border-gray-100 shadow-sm"
        >
          <Sparkles size={14} className="text-[#f9a885] animate-pulse" />
          <span className="text-[#002d4d] font-black text-[11px] uppercase tracking-normal">
            {isLoading ? "Synchronizing..." : subtitle}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#002d4d] leading-[1.1] tracking-tight">
            {title.split(' ').slice(0, -1).join(' ')} <br />
            <span className="text-gray-200">{title.split(' ').slice(-1)}</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg font-medium leading-loose max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-center pt-4">
           <Link href={isLoggedIn ? "/home" : "/login"}>
              <button className="h-16 px-16 rounded-[28px] bg-[#002d4d] text-white font-black text-sm shadow-2xl active:scale-95 transition-all group relative overflow-hidden">
                 <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                 <span className="relative z-10">{isLoggedIn ? "متابعة الاستخدام" : "انضم الآن لنخبة المستثمرين"}</span>
              </button>
           </Link>
        </motion.div>
      </div>

      {/* 2. THE VISUAL CORE - 3D PHONES & LIQUID BACKDROP */}
      <div className="relative w-full max-w-6xl mx-auto mt-10">
        
        {/* Liquid Physical Backdrop */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
           <motion.div 
             animate={{ 
               scale: [1, 1.2, 0.9, 1.1, 1],
               rotate: [0, 90, 180, 270, 360],
               borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "30% 70% 70% 30%", "40% 60% 70% 30%"]
             }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/10 via-transparent to-[#f9a885]/10 blur-[80px]"
           />
        </div>

        {/* 3D Phone Matrix and Infographics */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 px-6">
           
           {/* Phones Trinity */}
           <div className="flex items-center gap-4 md:gap-8 order-2 md:order-1">
              <Smartphone3D tilt={25} label="Yield Forge">
                 <ContractReactor />
              </Smartphone3D>
              <Smartphone3D tilt={0} label="Nexus Node" isActive>
                 <TradingReactor />
              </Smartphone3D>
              <Smartphone3D tilt={-25} label="Adventure Arena">
                 <ArenaReactor />
              </Smartphone3D>
           </div>

           {/* Infographic Drawing Cluster - Vertical Alignment to the Right */}
           <div className="flex flex-col gap-8 order-1 md:order-2 text-right">
              {[
                { icon: ShieldCheck, title: "سيادة الأصول", desc: "تأمين كامل للمراكز المالية", color: "text-emerald-500", bg: "bg-emerald-50" },
                { icon: BarChart3, title: "ذكاء النبض", desc: "تحليل لحظي لتدفق السيولة", color: "text-blue-500", bg: "bg-blue-50" },
                { icon: Globe, title: "اتصال عالمي", desc: "ربط مباشر مع بورصات النخبة", color: "text-orange-500", bg: "bg-orange-50" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + i * 0.2 }}
                  className="flex items-center gap-5 group"
                >
                   <div className="space-y-0.5">
                      <h5 className="font-black text-[#002d4d] text-sm group-hover:text-blue-600 transition-colors">{item.title}</h5>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{item.desc}</p>
                   </div>
                   <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500", item.bg)}>
                      <item.icon className={cn("h-7 w-7", item.color)} />
                   </div>
                </motion.div>
              ))}
           </div>

        </div>
      </div>

      {/* 3. SUBTLE SOVEREIGN FOOTER STRIP */}
      <div className="mt-20 flex flex-col items-center gap-4 opacity-20 select-none">
         <div className="flex items-center gap-8">
            <div className="h-[0.5px] w-12 bg-gradient-to-r from-transparent to-[#002d4d]" />
            <p className="text-[8px] font-black uppercase tracking-[1em] text-[#002d4d] mr-[-1em]">NAMIX PROTOCOL</p>
            <div className="h-[0.5px] w-12 bg-gradient-to-l from-transparent to-[#002d4d]" />
         </div>
         <p className="text-[6px] font-bold text-gray-400 uppercase tracking-widest">Sovereign Execution Environment v24.0</p>
      </div>

    </section>
  );
}
