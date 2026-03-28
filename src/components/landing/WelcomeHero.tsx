
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft, 
  Zap, 
  Activity, 
  ArrowUpRight,
  TrendingUp,
  Loader2,
  Coins
} from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import welcomeLottie from '@/lib/welcome-lottie.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

/**
 * @fileOverview AnimatedDigit - محرك الخانات الرقمية المنزلقة
 */
function AnimatedDigit({ digit }: { digit: string }) {
  if (isNaN(parseInt(digit))) return <span className="px-0.5">{digit}</span>;
  const num = parseInt(digit);
  return (
    <div className="relative h-8 overflow-hidden inline-block leading-none w-[18px]">
      <motion.div
        animate={{ y: -num * 32 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex flex-col"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-8 flex items-center justify-center font-black text-white">
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * @fileOverview PortfolioSimulation - محاكاة المحفظة العائمة
 */
function PortfolioSimulation() {
  const [balance, setBalance] = useState(12450.75);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setBalance(prev => prev + (Math.random() * 0.05));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const balanceStr = balance.toFixed(2);

  return (
    <motion.div 
      animate={{ 
        y: [0, -20, 0],
        rotateX: [0, 3, 0],
        rotateY: [0, -3, 0]
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="w-full max-w-[340px] p-8 bg-slate-900/90 backdrop-blur-3xl rounded-[48px] border border-white/10 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)] relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-[48px]" />
      
      <div className="relative z-10 space-y-8">
        <div className="flex justify-between items-center">
          <Badge className="bg-blue-600/20 text-blue-400 border-none font-black text-[7px] tracking-[0.3em] px-3 py-1 uppercase">Sovereign Node</Badge>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
        </div>

        <div className="space-y-1">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest pr-1">Total Liquidity</p>
          <div className="flex items-center text-4xl font-black text-white tabular-nums tracking-tighter" dir="ltr">
            <span className="text-blue-500 mr-1">$</span>
            {balanceStr.split("").map((char, i) => (
              <AnimatedDigit key={i} digit={char} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={10} className="text-[#f9a885]" />
              <span className="text-[7px] font-black text-white/30 uppercase">Yield</span>
            </div>
            <p className="text-sm font-black text-[#f9a885]">+$420.50</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5">
              <Zap size={10} className="text-blue-400" />
              <span className="text-[7px] font-black text-white/30 uppercase">Active</span>
            </div>
            <p className="text-sm font-black text-white">$2,100</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Liquidity Flow</span>
            <Activity size={8} className="text-blue-500 animate-pulse" />
          </div>
          <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function WelcomeHero() {
  const [showIntro, setShowIntro] = useState(true);
  const [showFlash, setShowFlash] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("namix_user");
    setIsLoggedIn(!!user);

    const introTimer = setTimeout(() => {
      setShowFlash(true);
      setTimeout(() => {
        setShowIntro(false);
        setTimeout(() => setShowFlash(false), 800);
      }, 300);
    }, 3500);

    return () => clearTimeout(introTimer);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center overflow-hidden bg-[#020617] selection:bg-blue-500/30">
      
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#020617] flex flex-col items-center justify-center gap-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.1, 1], 
                opacity: [0, 1, 1],
                filter: ["blur(10px)", "blur(0px)", "blur(0px)"]
              }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="relative"
            >
              <Logo size="lg" className="brightness-200" />
              <motion.div 
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl"
              />
            </motion.div>
            <div className="flex flex-col items-center gap-2 opacity-20">
               <p className="text-[10px] font-black text-white uppercase tracking-[0.8em]">Initializing Protocol</p>
               <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} className="h-1 w-1 rounded-full bg-blue-500" />
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFlash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1001] bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between z-50 pt-8 relative">
         <Logo size="sm" className="brightness-200" />
         <Link href={isLoggedIn ? "/home" : "/login"}>
            <Button className="h-12 px-10 rounded-2xl bg-[#2669E3] hover:bg-blue-700 text-white font-black text-xs shadow-2xl active:scale-95 transition-all border border-white/10">
              {isLoggedIn ? "لوحة القيادة" : "انضم للنخبة"}
            </Button>
         </Link>
      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 flex-1 py-20">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={!showIntro ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-right space-y-12"
          dir="rtl"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-500/5 rounded-full border border-blue-500/10 backdrop-blur-md">
            <Sparkles size={14} className="text-blue-400 animate-pulse" />
            <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em]">السيادة المالية بذكاء التقنية</span>
          </div>

          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-black leading-[1.05] tracking-tighter text-white">
              قوة <span className="text-[#2669E3] drop-shadow-[0_0_30px_rgba(38,105,227,0.3)]">الأصول</span> <br />
              بنبض <span className="text-slate-700">البيانات.</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-xl font-medium leading-loose max-w-xl pr-4 border-r-4 border-blue-600/30">
              ناميكس هي الواجهة الأكثر تطوراً لإدارة الثروة الرقمية. نجمع بين عقود الاستثمار المستدامة ومحركات التداول الوميضية لتوفير بيئة نمو نخبويّة لأصولك حول العالم.
            </p>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center gap-8 justify-start">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-20 px-16 rounded-[28px] bg-white text-black hover:bg-[#2669E3] hover:text-white font-black text-xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all group relative overflow-hidden">
                <span className="relative z-10">ابدأ الاستثمار الآن</span>
                <ArrowUpRight className="mr-3 h-6 w-6 relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={!showIntro ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2 }}
          className="flex flex-col items-center justify-center gap-4 relative"
        >
          <PortfolioSimulation />
          
          <div className="w-full max-w-[420px] opacity-60 mix-blend-screen">
            {welcomeLottie?.layers && (
              <Lottie 
                animationData={welcomeLottie} 
                loop={true} 
                className="w-full h-full"
              />
            )}
          </div>
        </motion.div>
      </div>

      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[180px] pointer-events-none" />
    </section>
  );
}
