
'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Sparkles, 
  ChevronLeft, 
  Zap, 
  Activity, 
  ArrowUpRight,
  TrendingUp,
  Loader2,
  ShieldCheck,
  Wallet,
  Coins,
  Briefcase,
  Target
} from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// تحميل محرك الرسوم في جهة العميل فقط
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

/**
 * AnimatedDigit - محرك الخانات الرقمية المنزلقة
 */
function AnimatedDigit({ digit }: { digit: string }) {
  if (digit === "." || digit === "$") return <span className="px-0.5">{digit}</span>;
  const num = parseInt(digit);
  if (isNaN(num)) return <span className="px-0.5">{digit}</span>;
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
 * PortfolioSimulation - محاكاة المحفظة العائمة (Exploded UI)
 */
function PortfolioSimulation() {
  const [balance, setBalance] = useState(12450.75);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setBalance(prev => prev + (Math.random() * 0.05));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div 
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-full max-w-[360px] aspect-[4/3] flex items-center justify-center perspective-[1200px]"
    >
      {/* 3D Base Layer (Screen) */}
      <div className="absolute inset-0 bg-[#002d4d]/80 backdrop-blur-2xl rounded-[48px] border border-white/5 shadow-2xl tilt-card pointer-events-none" />

      {/* Layer 1: Atomic Balance (Middle height) */}
      <motion.div 
        style={{ translateZ: '40px' }}
        className="relative z-10 w-[85%] p-6 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-2xl space-y-6"
      >
        <div className="flex justify-between items-center">
          <Badge className="bg-blue-600/20 text-blue-400 border-none font-black text-[7px] tracking-[0.3em] px-2.5 py-1 uppercase">Sovereign Node</Badge>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
        </div>

        <div className="space-y-1">
          <p className="text-[8px] font-black text-white/30 uppercase tracking-widest pr-1">Current Liquidity</p>
          <div className="flex items-center text-3xl font-black text-white tabular-nums tracking-tighter" dir="ltr">
            <span className="text-[#f9a885] mr-1">$</span>
            {balance.toFixed(2).split("").map((char, i) => (
              <AnimatedDigit key={i} digit={char} />
            ))}
          </div>
        </div>

        {/* Vital Pulse Line (Moving energy) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Network Pulse</span>
            <Activity size={8} className="text-blue-500 animate-pulse" />
          </div>
          <div className="h-[1.5px] w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#f9a885] to-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Layer 2: Floating Stats (Higher height) */}
      <motion.div 
        style={{ translateZ: '80px', top: '15%', left: '-10%' }}
        className="absolute z-20 p-4 bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl flex items-center gap-3"
      >
        <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <TrendingUp size={14} className="text-emerald-400" />
        </div>
        <div className="text-right">
          <p className="text-[7px] font-black text-white/40 uppercase">Daily Yield</p>
          <p className="text-xs font-black text-emerald-400">+$420.50</p>
        </div>
      </motion.div>

      {/* Layer 3: Security Shield (Highest height) */}
      <motion.div 
        style={{ translateZ: '120px', bottom: '10%', right: '-5%' }}
        className="absolute z-30 p-3 bg-blue-600/20 backdrop-blur-md border border-white/20 rounded-full shadow-2xl flex items-center gap-2"
      >
        <ShieldCheck size={12} className="text-blue-400" />
        <span className="text-[8px] font-black text-white uppercase tracking-widest">Secured by iX</span>
      </motion.div>
    </motion.div>
  );
}

export function WelcomeHero() {
  const [mounted, setMounted] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    // جلب بيانات الرسوم من رابط خارجي آمن
    // ملاحظة: الرابط أدناه هو مثال لرسم تقني عالٍ؛ يمكنك استبداله برابط الـ JSON الخاص بك.
    const lottieUrl = "https://assets10.lottiefiles.com/packages/lf20_kz9pjcjt.json"; 
    
    fetch(lottieUrl)
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error("Lottie Load Error:", err));
  }, []);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5); // تبطئة الحركة بنسبة 50%
    }
  }, [animationData]);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen w-full flex items-center bg-[#020617] overflow-hidden selection:bg-blue-500/30">
      
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[180px]" />
      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 py-20">
        
        {/* Left Side: Strategic Content + Backdrop Lottie */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-right space-y-12 relative"
          dir="rtl"
        >
          {/* Lottie Backdrop behind text */}
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] pointer-events-none opacity-20 z-0">
            {animationData && (
              <Lottie 
                lottieRef={lottieRef}
                animationData={animationData} 
                loop={true} 
                className="w-full h-full grayscale"
              />
            )}
          </div>

          <div className="relative z-10 space-y-12">
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

            <div className="pt-8">
              <Link href="/login">
                <Button className="h-20 px-16 rounded-[28px] bg-white text-black hover:bg-[#2669E3] hover:text-white font-black text-xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all group relative overflow-hidden">
                  <span className="relative z-10">ابدأ الاستثمار الآن</span>
                  <ArrowUpRight className="mr-3 h-6 w-6 relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Floating Exploded UI */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="flex items-center justify-center relative"
        >
          <PortfolioSimulation />
        </motion.div>
      </div>
    </section>
  );
}
