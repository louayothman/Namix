
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ShieldCheck, Globe, ChevronLeft, Zap, TrendingUp, Activity } from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

/**
 * @fileOverview هيرو الترحيب v23.0 - Liquid Intelligence Edition
 * يتميز بحركات سائلة، إنفوجرافيك تفاعلي، وتحكم كامل بالنصوص من المشرف.
 */
export function WelcomeHero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const db = useFirestore();
  
  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: landingData, isLoading } = useDoc(landingRef);

  useEffect(() => {
    const user = localStorage.getItem("namix_user");
    setIsLoggedIn(!!user);
  }, []);

  // نصوص افتراضية في حالة عدم وجود بيانات في القاعدة
  const title = landingData?.welcomeTitle || "ناميكس: حيث تلتقي التقنية بالثروة.";
  const subtitle = landingData?.welcomeSubtitle || "مرحباً بك في مستقبل الاستثمار الذكي";
  const description = landingData?.welcomeDescription || "نحن نوفر البيئة الاستثمارية الأكثر تطوراً للنخبة، حيث تندمج القوة التقنية مع الأمان المطلق لتوليد فرص نمو لا محدودة.";

  const luxuryEasing = [0.16, 1, 0.3, 1];

  return (
    <section id="welcome" className="relative min-h-screen w-full flex items-center justify-center pt-20 px-6 md:px-24 bg-white overflow-hidden font-body" dir="rtl">
      
      {/* 1. DIGITAL LIQUID BACKDROP - المفاعل السائل */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* المفاعل الأزرق */}
        <motion.div
          animate={{
            borderRadius: [
              "40% 60% 70% 30% / 40% 40% 60% 60%",
              "60% 40% 30% 70% / 60% 30% 70% 40%",
              "30% 70% 70% 30% / 50% 60% 40% 50%",
              "40% 60% 70% 30% / 40% 40% 60% 60%"
            ],
            x: [0, 50, -30, 0],
            y: [0, -20, 40, 0],
            scale: [1, 1.1, 0.9, 1],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] opacity-60"
        />
        
        {/* المفاعل النحاسي */}
        <motion.div
          animate={{
            borderRadius: [
              "60% 40% 30% 70% / 60% 30% 70% 40%",
              "30% 70% 70% 30% / 50% 60% 40% 50%",
              "40% 60% 70% 30% / 40% 40% 60% 60%",
              "60% 40% 30% 70% / 60% 30% 70% 40%"
            ],
            x: [0, -60, 40, 0],
            y: [0, 30, -50, 0],
            scale: [1, 0.9, 1.1, 1],
            rotate: [360, 270, 180, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#f9a885]/5 blur-[120px] opacity-40"
        />
      </div>

      {/* 2. CORE CONTENT & INFOGRAPHIC */}
      <div className="container mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Textual Identity Side */}
        <div className="text-right space-y-10 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: luxuryEasing }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-gray-50 rounded-full border border-gray-100 shadow-sm"
          >
            <Sparkles size={14} className="text-[#f9a885] animate-pulse" />
            <span className="text-[#002d4d] font-black text-[11px] uppercase tracking-normal">
              {isLoading ? "Synchronizing..." : subtitle}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: luxuryEasing }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#002d4d] leading-[1.1] tracking-tight">
              {title.split(' ').slice(0, -1).join(' ')} <br />
              <span className="text-gray-200">{title.split(' ').slice(-1)}</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg lg:text-xl font-medium leading-loose max-w-xl pr-1">
              {description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: luxuryEasing }}
            className="flex flex-col items-start gap-10 pt-4"
          >
            <Link href={isLoggedIn ? "/home" : "/login"}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 30px 60px -12px rgba(0, 45, 77, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="relative h-20 md:h-24 px-12 md:px-16 rounded-[44px] bg-[#002d4d] text-white flex flex-col items-center justify-center shadow-2xl overflow-hidden group"
              >
                <motion.div 
                  animate={{ opacity: [0.5, 0.8, 0.5], background: ["radial-gradient(circle at 0% 0%, #002d4d 0%, #003d6d 100%)", "radial-gradient(circle at 100% 100%, #003d6d 0%, #002d4d 100%)", "radial-gradient(circle at 0% 0%, #002d4d 0%, #003d6d 100%)"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 z-0"
                />
                <motion.div 
                  initial={{ x: "-150%" }}
                  animate={{ x: "250%" }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#f9a885]/15 to-transparent skew-x-[-25deg] z-10"
                />
                <div className="relative z-20 flex items-center gap-6">
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-xl md:text-2xl font-black group-hover:text-[#f9a885] transition-colors duration-300">
                      {isLoggedIn ? "متابعة الاستخدام" : "انضم الآن"}
                    </span>
                    <span className="text-[10px] font-bold text-[#f9a885]/60 uppercase mt-2 group-hover:text-white transition-colors duration-300">
                      {isLoggedIn ? "Continue" : "Join Now"}
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-[#f9a885] group-hover:text-[#002d4d] transition-all duration-500">
                    <ChevronLeft size={24} className="transition-transform duration-500 group-hover:-translate-x-1" />
                  </div>
                </div>
              </motion.button>
            </Link>

            <div className="flex items-center gap-8 text-gray-300 font-black text-[10px] uppercase opacity-50 px-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>نظام موثق</span>
              </div>
              <div className="h-4 w-px bg-gray-100" />
              <Globe size={14} />
              <div className="h-4 w-px bg-gray-100" />
              <span>سيولة عالمية</span>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Infographic Side */}
        <div className="hidden lg:flex relative justify-center items-center order-1 lg:order-2 h-[600px]">
           {/* المركز اللوجيستي للداتا */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
             className="absolute h-[450px] w-[450px] rounded-full border border-dashed border-gray-100 opacity-40"
           />
           
           {/* أيقونة النمو المتصاعد */}
           <motion.div
             animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-10 right-10 p-8 bg-white rounded-[40px] shadow-2xl border border-gray-50 flex flex-col items-center gap-3 z-20 group"
           >
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
                 <TrendingUp size={28} />
              </div>
              <span className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest">Growth Node</span>
           </motion.div>

           {/* أيقونة الأمان السيادي */}
           <motion.div
             animate={{ y: [0, 20, 0], scale: [1, 0.95, 1] }}
             transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-10 left-10 p-8 bg-[#002d4d] rounded-[40px] shadow-2xl flex flex-col items-center gap-3 z-20 group"
           >
              <div className="h-14 w-14 rounded-2xl bg-white/10 text-[#f9a885] flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                 <ShieldCheck size={28} />
              </div>
              <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Vault Protected</span>
           </motion.div>

           {/* محرك الذكاء المركزي */}
           <div className="relative z-10 flex flex-col items-center">
              <div className="h-40 w-40 rounded-[56px] bg-white shadow-[0_40px_80px_-15px_rgba(0,45,77,0.2)] border border-gray-50 flex items-center justify-center relative overflow-hidden group">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-[#f9a885]/10" 
                 />
                 <Zap size={64} className="text-[#002d4d] group-hover:scale-110 group-hover:text-blue-600 transition-all duration-700" />
              </div>
              <div className="mt-6 flex flex-col items-center gap-1 opacity-20">
                 <div className="flex gap-1.5">
                    {[1, 2, 3].map(i => <div key={i} className="h-1 w-1 rounded-full bg-[#002d4d]" />)}
                 </div>
                 <p className="text-[8px] font-black uppercase tracking-[0.6em] text-[#002d4d] mr-[-0.6em]">Core Intelligence</p>
              </div>
           </div>

           {/* نبضات البيانات الطائرة */}
           {[...Array(4)].map((_, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, scale: 0 }}
               animate={{ 
                 opacity: [0, 0.4, 0], 
                 scale: [0.5, 1.5, 0.5],
                 x: Math.random() * 400 - 200,
                 y: Math.random() * 400 - 200
               }}
               transition={{ duration: 4 + i, repeat: Infinity, delay: i }}
               className="absolute h-1 w-1 bg-[#f9a885] rounded-full shadow-[0_0_10px_#f9a885]"
             />
           ))}
        </div>

      </div>
    </section>
  );
}
