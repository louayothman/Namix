
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { 
  ShieldCheck, 
  ChevronLeft,
  Sparkles,
  Zap,
  TrendingUp,
  Activity,
  Globe,
  Plus,
  MousePointer2,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useMarketStore } from "@/store/use-market-store";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { useMarketSync } from "@/hooks/use-market-sync";
import { cn } from "@/lib/utils";

/**
 * @fileOverview صفحة الهبوط العالمية v2.0 - المستوحاة من NextWare
 * تم تطهيرها من مصطلحات "سيادة" و "بروتوكول" مع دمج ألوان ناميكس (الكحلي والنحاسي).
 */

const FloatingCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 1, 
      y: [0, -10, 0],
    }}
    transition={{ 
      opacity: { duration: 1, delay },
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
    }}
    className={cn("absolute z-20", className)}
  >
    {children}
  </motion.div>
);

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const db = useFirestore();

  const symbolsQuery = useMemoFirebase(() => query(collection(db, "trading_symbols"), where("isActive", "==", true)), [db]);
  const { data: symbols } = useCollection(symbolsQuery);
  useMarketSync(symbols || []);
  const prices = useMarketStore(state => state.prices);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("namix_user");
    if (user) {
      router.replace("/home");
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#001a2d] text-white font-body selection:bg-[#f9a885]/30 overflow-hidden relative" dir="rtl">
      
      {/* 1. الخلفية الدرامية (Dramatic Atmosphere) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* الشعاع المركزي (Central Beam) */}
        <motion.div 
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[120%] bg-gradient-to-b from-[#f9a885]/20 via-[#f9a885]/5 to-transparent blur-[120px] rotate-[-5deg]" 
        />
        {/* توهج سفلي */}
        <div className="absolute bottom-[-10%] left-0 right-0 h-[40%] bg-gradient-to-t from-[#002d4d] to-transparent opacity-60" />
      </div>

      {/* 2. شريط التنقل (Navigation Bar) */}
      <nav className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-6">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full h-16 px-8 flex items-center justify-between shadow-2xl">
          <Logo size="sm" className="brightness-200" />
          
          <div className="hidden md:flex items-center gap-10">
            {['عن المنصة', 'الخدمات', 'الأسعار', 'الحلول'].map((item) => (
              <button key={item} className="text-[11px] font-black text-white/40 hover:text-[#f9a885] transition-all tracking-wider">{item}</button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <span className="text-[10px] font-black text-white/60 hover:text-white cursor-pointer transition-all">دخول</span>
            </Link>
            <Link href="/login?step=signup">
              <Button className="rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-[10px] h-10 px-6 shadow-xl active:scale-95 transition-all">
                ابدأ الآن
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 3. القسم الرئيسي (Hero Section) */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        
        {/* النصوص الجانبية (Split Headlines) */}
        <div className="container mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
          
          {/* الكتلة اليمنى: الأمان والاستثمار */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-6 text-center md:text-right"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
              استثمر بأمان <br />
              <span className="text-[#f9a885]">في مستقبلك.</span>
            </h1>
            <p className="text-sm md:text-lg text-white/40 font-medium max-w-sm ml-auto leading-loose">
              اكتشف تجربة استثمارية ذكية وسهلة الاستخدام، مصممة خصيصاً لتناسب طموحاتك المالية في عالم الاقتصاد الرقمي.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-4 grayscale opacity-20">
               <Globe size={20} /><Activity size={20} /><ShieldCheck size={20} /><Zap size={20} />
            </div>
          </motion.div>

          {/* الكتلة اليسرى: السرعة والمنصة */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-6 text-center md:text-left order-first md:order-last"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
              منصة سريعة <br />
              <span className="text-[#f9a885]">وآمنة تماماً.</span>
            </h1>
            <p className="text-sm md:text-lg text-white/40 font-medium max-w-sm mr-auto leading-loose">
              تداول واستثمر بثقة مطلقة عبر نظام تقني متطور، يفتح لك آفاقاً جديدة في الأسواق العالمية بنقرة واحدة.
            </p>
            <div className="flex justify-center md:justify-end pt-4">
               <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white/60 tracking-widest uppercase">Global Network Active</span>
               </div>
            </div>
          </motion.div>
        </div>

        {/* 4. المركز التفاعلي (Central Interactive Core) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          
          {/* الهاتف الذكي العائم */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[280px] h-[580px] md:w-[320px] md:h-[640px] bg-[#002d4d] rounded-[56px] border-[8px] border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* واجهة الهاتف (UI Mockup) */}
            <div className="p-8 space-y-10">
               <div className="flex justify-between items-center opacity-40">
                  <div className="h-1 w-12 bg-white/20 rounded-full" />
                  <div className="h-4 w-4 rounded-full border border-white/20" />
               </div>
               
               <div className="space-y-2 text-center pt-4">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Available Balance</p>
                  <h3 className="text-4xl font-black tabular-nums tracking-tighter">$5,537.00</h3>
                  <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                     <TrendingUp size={10} className="text-emerald-400" />
                     <span className="text-[10px] font-black text-emerald-400">+23%</span>
                  </div>
               </div>

               <div className="p-6 bg-white/[0.03] rounded-[32px] border border-white/5 space-y-6">
                  <div className="flex justify-between items-center">
                     <p className="text-[9px] font-black text-white/40 uppercase">My Wallet</p>
                     <Plus size={12} className="text-[#f9a885]" />
                  </div>
                  <div className="space-y-1">
                     <p className="text-2xl font-black tabular-nums tracking-tighter">$5,237.34</p>
                     <p className="text-[10px] text-white/20 font-bold">$55.35 Fee Included</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <div className="h-12 rounded-2xl bg-[#f9a885] flex items-center justify-center text-[#002d4d] font-black text-[10px]">Receive</div>
                  <div className="h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 font-black text-[10px]">Transfer</div>
               </div>

               <div className="pt-10 flex justify-center gap-4 opacity-20">
                  <div className="h-10 w-10 rounded-full bg-white/10" />
                  <div className="h-10 w-10 rounded-full bg-white/10" />
                  <div className="h-10 w-10 rounded-full bg-white/10" />
               </div>
            </div>
          </motion.div>

          {/* العناصر العائمة حول الهاتف */}
          <FloatingCard delay={0.5} className="top-[10%] -right-40 hidden lg:block">
             <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 rounded-[28px] w-56 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500"><TrendingUp size={16} /></div>
                   <p className="text-[10px] font-black">Trading Volume</p>
                </div>
                <p className="text-lg font-black tabular-nums">$1,065.82 <span className="text-[8px] text-gray-400 font-bold">/ 1 Day</span></p>
             </div>
          </FloatingCard>

          <FloatingCard delay={0.8} className="bottom-[20%] -left-48 hidden lg:block">
             <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 rounded-[28px] w-52 space-y-3">
                <div className="flex justify-between items-center">
                   <Badge className="bg-emerald-500 text-black border-none text-[8px] font-black">ACTIVE</Badge>
                   <Activity size={12} className="text-emerald-500 animate-pulse" />
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                   <motion.div animate={{ width: ['20%', '80%', '20%'] }} transition={{ duration: 5, repeat: Infinity }} className="h-full bg-emerald-500" />
                </div>
                <p className="text-[9px] font-bold text-white/40">Market Node: SA-992</p>
             </div>
          </FloatingCard>

          {/* زر البداية السفلي */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-12 flex flex-col items-center gap-6"
          >
            <Link href="/login">
              <Button className="h-16 px-12 rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-lg shadow-[0_20px_50px_rgba(249,168,133,0.3)] active:scale-95 transition-all group flex items-center gap-4">
                <span>ابدأ رحلتك مجاناً</span>
                <div className="h-8 w-8 rounded-full bg-[#002d4d] flex items-center justify-center text-white transition-transform group-hover:rotate-[-45deg]">
                   <ArrowRight size={16} className="rotate-180" />
                </div>
              </Button>
            </Link>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] tracking-none">Official Digital Asset Exchange</p>
          </motion.div>
        </div>

      </section>

      {/* 5. تذييل الصفحة (Footer Strip) */}
      <footer className="fixed bottom-10 left-0 right-0 z-[100] px-12">
         <div className="flex items-center justify-between opacity-30">
            <div className="flex items-center gap-8">
               <p className="text-[9px] font-black tracking-widest uppercase">Privacy</p>
               <p className="text-[9px] font-black tracking-widest uppercase">Terms</p>
               <p className="text-[9px] font-black tracking-widest uppercase">Support</p>
            </div>
            <div className="flex items-center gap-3">
               <ShieldCheck size={14} />
               <p className="text-[9px] font-black tracking-[0.4em] tracking-none">NAMIX UNIVERSAL NETWORK</p>
            </div>
         </div>
      </footer>

    </div>
  );
}
