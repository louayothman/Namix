'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Sparkles, 
  Zap, 
  Activity, 
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Wallet,
  Coins,
  Briefcase,
  Target,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

/**
 * AnimatedDigit - Atomic Sliding Digits Engine
 */
function AnimatedDigit({ digit }: { digit: string }) {
  if (digit === "." || digit === "$" || digit === ",") return <span className="px-0.5">{digit}</span>;
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
 * ExplodedPortfolio - محاكاة المحفظة المنبثقة v45.0
 */
function ExplodedPortfolio() {
  const [balance, setBalance] = useState(12450.75);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setBalance(prev => prev + (Math.random() * 0.05));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div 
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="tilt-scene relative"
    >
      <div className="tilt-card flex flex-col justify-between">
        
        {/* Layer 1: Identity & Security (Base level) */}
        <div style={{ transform: 'translateZ(20px)' }} className="flex justify-between items-start">
           <div className="space-y-1">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">Network Identity</p>
              <div className="flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="font-black text-xs text-white">SOVEREIGN NODE</span>
              </div>
           </div>
           <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
           </div>
        </div>

        {/* Layer 2: Main Balance (Exploded - Mid height) */}
        <motion.div 
          style={{ transform: 'translateZ(80px)' }}
          className="p-8 bg-white/5 backdrop-blur-3xl rounded-[36px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-4"
        >
           <p className="text-[9px] font-black text-[#f9a885] uppercase tracking-[0.2em] text-center">Liquidity Pool</p>
           <div className="flex items-center justify-center text-4xl font-black text-white tabular-nums tracking-tighter" dir="ltr">
              <span className="text-white/20 mr-2">$</span>
              {balance.toFixed(2).split("").map((char, i) => (
                <AnimatedDigit key={i} digit={char} />
              ))}
           </div>
           <div className="flex justify-center">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-black text-[7px] tracking-widest px-3 py-1 rounded-full uppercase">
                 Verified Assets
              </Badge>
           </div>
        </motion.div>

        {/* Layer 3: Dynamic Stats (High height) */}
        <div className="grid grid-cols-2 gap-4" style={{ transform: 'translateZ(120px)' }}>
           <div className="p-5 bg-slate-900/90 rounded-[28px] border border-white/5 shadow-2xl space-y-1">
              <div className="flex items-center gap-2">
                 <TrendingUp size={12} className="text-emerald-400" />
                 <span className="text-[7px] font-black text-white/30 uppercase">Yield</span>
              </div>
              <p className="text-sm font-black text-emerald-400">+$420.50</p>
           </div>
           <div className="p-5 bg-slate-900/90 rounded-[28px] border border-white/5 shadow-2xl space-y-1">
              <div className="flex items-center gap-2">
                 <Briefcase size={12} className="text-blue-400" />
                 <span className="text-[7px] font-black text-white/30 uppercase">Active</span>
              </div>
              <p className="text-sm font-black text-white">$2,500</p>
           </div>
        </div>

        {/* Layer 4: Vital Pulse (Deepest detail) */}
        <div style={{ transform: 'translateZ(150px)' }} className="space-y-2 px-2">
           <div className="flex justify-between items-center">
              <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em]">Network Pulse</span>
              <Activity size={10} className="text-blue-500 animate-pulse" />
           </div>
           <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ 
                  width: ["20%", "80%", "40%", "90%", "20%"] 
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-transparent via-[#f9a885] to-transparent"
              />
           </div>
        </div>

      </div>
    </motion.div>
  );
}

export function WelcomeHero() {
  const [lottieData, setLottieData] = useState<any>(null);
  const lottieRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("https://lottie.host/8b87b5e3-f1b1-43a6-8c1d-ce4be67429a3/o34l43Q3Tu.json")
      .then(res => res.json())
      .then(data => setLottieData(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5);
    }
  }, [lottieData]);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen w-full flex items-center bg-[#020617] overflow-hidden selection:bg-blue-500/30 py-20">
      
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#f9a885]/5 rounded-full blur-[180px]" />
      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Content Side - Integrated with Lottie Backdrop */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-right space-y-12 relative"
          dir="rtl"
        >
          {/* Cinematic Lottie Backdrop (Slower 50%) */}
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] pointer-events-none opacity-[0.15] z-0 mix-blend-screen">
            {lottieData && (
              <Lottie 
                lottieRef={lottieRef}
                animationData={lottieData} 
                loop={true} 
                className="w-full h-full grayscale brightness-150"
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

        {/* Portfolio Simulation Side - Free Floating 3D */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: -50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          className="flex items-center justify-center relative"
        >
          <ExplodedPortfolio />
        </motion.div>
      </div>
    </section>
  );
}
