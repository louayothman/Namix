
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  ChevronLeft,
  Sparkles,
  Zap,
  TrendingUp,
  Activity,
  Globe,
  Plus,
  ArrowRight,
  MousePointer2,
  Lock,
  Wallet,
  Coins,
  LineChart,
  Target
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview بوابة ناميكس العالمية v3.0 - Mobile Optimized & Market Sync
 * تم إصلاح التداخل في الموبايل وإضافة محرك الأسعار وأقسام تفاعلية جديدة.
 */

// مكون العناصر العائمة في الخلفية
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
    className={cn("absolute z-20 hidden lg:block", className)}
  >
    {children}
  </motion.div>
);

// محرك عرض الأسعار المحدث
function MarketMarquee() {
  const [prices, setPrices] = useState<any[]>([
    { id: 'BTC', name: 'Bitcoin', price: 0, change: 0 },
    { id: 'ETH', name: 'Ethereum', price: 0, change: 0 },
    { id: 'SOL', name: 'Solana', price: 0, change: 0 },
    { id: 'BNB', name: 'Binance Coin', price: 0, change: 0 },
  ]);

  const fetchPrices = async () => {
    try {
      const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT"]');
      const data = await res.json();
      const mapped = data.map((item: any) => ({
        id: item.symbol.replace('USDT', ''),
        price: parseFloat(item.lastPrice),
        change: parseFloat(item.priceChangePercent)
      }));
      setPrices(mapped);
    } catch (e) {
      console.error("Market Sync Error");
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 20000); // تحديث كل 20 ثانية
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white/5 border-y border-white/5 backdrop-blur-md py-4 overflow-hidden relative">
      <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
        {[...prices, ...prices].map((p, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{p.id}/USDT</span>
            <span className="text-sm font-black text-white tabular-nums">${p.price > 1000 ? Math.round(p.price).toLocaleString() : p.price.toLocaleString()}</span>
            <span className={cn("text-[9px] font-black tabular-nums", p.change >= 0 ? "text-emerald-400" : "text-red-400")}>
              {p.change >= 0 ? '+' : ''}{p.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("namix_user");
    if (user) {
      router.replace("/home");
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#001a2d] text-white font-body selection:bg-[#f9a885]/30 overflow-x-hidden relative" dir="rtl">
      
      {/* 1. الخلفية الدرامية (Dramatic Atmosphere) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[120%] bg-gradient-to-b from-[#f9a885]/20 via-[#f9a885]/5 to-transparent blur-[120px] rotate-[-5deg]" 
        />
        <div className="absolute bottom-[-10%] left-0 right-0 h-[40%] bg-gradient-to-t from-[#002d4d] to-transparent opacity-60" />
      </div>

      {/* 2. شريط التنقل (Navigation Bar) */}
      <nav className="fixed top-6 md:top-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-5xl px-4">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full h-14 md:h-16 px-6 md:px-8 flex items-center justify-between shadow-2xl">
          <Logo size="sm" className="brightness-200 scale-90 md:scale-100" />
          
          <div className="hidden lg:flex items-center gap-10">
            {['الخدمات', 'الأسعار', 'عن نامكس', 'المساعدة'].map((item) => (
              <button key={item} className="text-[10px] font-black text-white/40 hover:text-[#f9a885] transition-all tracking-wider">{item}</button>
            ))}
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/login">
              <span className="text-[10px] font-black text-white/60 hover:text-white cursor-pointer transition-all">دخول</span>
            </Link>
            <Link href="/login">
              <Button className="rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-[9px] md:text-[10px] h-9 md:h-10 px-5 md:px-6 shadow-xl active:scale-95 transition-all">
                ابدأ رحلتي
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 3. القسم الرئيسي (Hero Section) */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 md:pt-20">
        
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          
          {/* الكتلة اليمنى: النصوص */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-6 text-center lg:text-right"
          >
            <div className="flex items-center justify-center lg:justify-start gap-3 text-[#f9a885] font-black text-[9px] uppercase tracking-[0.3em]">
               <Sparkles size={12} />
               <span>مستقبل الاستثمار الرقمي</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
              استثمر بذكاء <br />
              <span className="text-[#f9a885]">في عالمك الخاص.</span>
            </h1>
            <p className="text-xs md:text-lg text-white/40 font-medium max-w-sm mx-auto lg:ml-auto lg:mr-0 leading-loose">
              اكتشف تجربة مالية متطورة وسهلة الاستخدام، مصممة خصيصاً لتناسب طموحاتك في بناء ثروة رقمية مستدامة.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
               <Link href="/login" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-14 md:h-16 px-10 rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-base shadow-2xl active:scale-95 transition-all group">
                    انطلق الآن
                    <ArrowRight size={18} className="mr-3 rotate-180 transition-transform group-hover:-translate-x-1" />
                  </Button>
               </Link>
               <div className="flex items-center gap-3 px-6 h-14 md:h-16 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span className="text-[10px] font-black text-white/60 tracking-widest uppercase">Safe & Secured</span>
               </div>
            </div>
          </motion.div>

          {/* الكتلة اليسرى: الهاتف العائم */}
          <div className="relative flex justify-center items-center h-[500px] md:h-[650px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[260px] h-[540px] md:w-[300px] md:h-[600px] bg-[#002d4d] rounded-[50px] border-[6px] border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* واجهة الهاتف (UI Mockup) */}
              <div className="p-6 md:p-8 space-y-8">
                 <div className="flex justify-between items-center opacity-40">
                    <div className="h-1 w-10 bg-white/20 rounded-full" />
                    <div className="h-3 w-3 rounded-full border border-white/20" />
                 </div>
                 
                 <div className="space-y-2 text-center pt-2">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Balance</p>
                    <h3 className="text-3xl md:text-4xl font-black tabular-nums tracking-tighter">$12,450.00</h3>
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                       <TrendingUp size={10} className="text-emerald-400" />
                       <span className="text-[9px] font-black text-emerald-400">+18.4%</span>
                    </div>
                 </div>

                 <div className="p-5 bg-white/[0.03] rounded-[28px] border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                       <p className="text-[8px] font-black text-white/40 uppercase">Assets</p>
                       <Zap size={10} className="text-[#f9a885]" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-xl font-black tabular-nums">$8,230.40</p>
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ width: ['20%', '70%', '20%'] }} transition={{ duration: 4, repeat: Infinity }} className="h-full bg-blue-500" />
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 rounded-2xl bg-[#f9a885] flex items-center justify-center text-[#002d4d] font-black text-[9px]">Trade</div>
                    <div className="h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 font-black text-[9px]">Wallet</div>
                 </div>

                 <div className="pt-6 flex justify-center gap-4 opacity-10">
                    {[1, 2, 3].map(i => <div key={i} className="h-8 w-8 rounded-full bg-white/10" />)}
                 </div>
              </div>
            </motion.div>

            {/* العناصر العائمة (Desktop Only) */}
            <FloatingCard delay={0.5} className="top-[15%] -right-20">
               <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-4 rounded-[24px] w-48 space-y-3">
                  <div className="flex items-center gap-3">
                     <div className="h-7 w-7 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400"><Activity size={14} /></div>
                     <p className="text-[9px] font-black">Live Pulse</p>
                  </div>
                  <p className="text-sm font-black tabular-nums">Syncing Nodes...</p>
               </div>
            </FloatingCard>

            <FloatingCard delay={0.8} className="bottom-[25%] -left-32">
               <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-4 rounded-[24px] w-44 space-y-2 text-center">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[7px] font-black px-2 py-0.5 rounded-full">OPTIMIZED</Badge>
                  <p className="text-[10px] font-black">AI Analysis Active</p>
               </div>
            </FloatingCard>
          </div>
        </div>

        {/* محرك الأسعار في أسفل الهيرو */}
        <div className="absolute bottom-0 left-0 right-0">
           <MarketMarquee />
        </div>
      </section>

      {/* 4. قسم المميزات (Smart Features) */}
      <section className="py-32 px-6 bg-white/[0.01] relative overflow-hidden">
         <div className="container mx-auto space-y-24">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
               <Badge className="bg-blue-500/10 text-blue-400 border-none px-4 py-1 rounded-full font-black text-[10px] tracking-widest uppercase">Smart Infrastructure</Badge>
               <h2 className="text-3xl md:text-5xl font-black text-white">لماذا يختار النخبة ناميكس؟</h2>
               <p className="text-sm md:text-lg text-white/30 font-medium leading-loose">نظام متكامل يجمع بين قوة التكنولوجيا وسهولة التجربة المالية.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: "أمان فائق الذكاء", desc: "تشفير بيانات من الدرجة العسكرية لحماية كافة أصولك الرقمية وتحركاتك المالية.", icon: Lock, color: "text-blue-500" },
                 { title: "تداول فوري متطور", desc: "محرك تداول عالمي يربطك بأهم الأسواق العالمية بسرعة البرق وبكل سهولة.", icon: Zap, color: "text-[#f9a885]" },
                 { title: "إدارة نمو ذكية", desc: "حلول استثمارية متنوعة تساعدك على تنمية محفظتك بأساليب مبتكرة وموثقة.", icon: TrendingUp, color: "text-emerald-500" }
               ].map((feat, i) => (
                 <motion.div 
                   key={i} 
                   whileHover={{ y: -10 }}
                   className="p-10 rounded-[48px] bg-white/[0.02] border border-white/5 hover:border-[#f9a885]/20 hover:bg-white/[0.04] transition-all duration-500 group"
                 >
                    <div className="h-16 w-16 rounded-[24px] bg-white/5 flex items-center justify-center mb-8 border border-white/5 shadow-inner transition-transform group-hover:rotate-12">
                       <feat.icon size={28} className={feat.color} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-4">{feat.title}</h3>
                    <p className="text-sm text-white/30 font-medium leading-loose">{feat.desc}</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. قسم الثقة (Reliability Section) */}
      <section className="py-32 px-6 relative">
         <div className="container mx-auto bg-gradient-to-br from-[#002d4d] to-[#001a2d] rounded-[64px] p-12 md:p-24 border border-white/5 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-20 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
               <Globe size={400} />
            </div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-8 text-center lg:text-right">
                  <div className="h-16 w-16 rounded-[24px] bg-[#f9a885] flex items-center justify-center shadow-2xl shadow-orange-900/40 mx-auto lg:mr-0">
                     <ShieldCheck size={32} className="text-[#002d4d]" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">شريكك الموثوق في <br/><span className="text-[#f9a885]">رحلة الثراء الرقمي.</span></h2>
                  <p className="text-sm md:text-lg text-white/40 font-medium leading-loose max-w-lg mx-auto lg:mr-0">
                    نحن نؤمن بأن الوصول للحرية المالية يجب أن يكون متاحاً للجميع. ناميكس توفر لك الأدوات والبيئة الآمنة لتحقيق ذلك بذكاء.
                  </p>
                  <Link href="/login" className="block">
                    <Button variant="outline" className="h-14 px-10 rounded-full border-white/10 text-white font-black hover:bg-white hover:text-[#002d4d] transition-all">
                       تعرف على ميثاق الأمان
                    </Button>
                  </Link>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "مستثمر نشط", val: "50K+", icon: Users, color: "text-blue-400" },
                    { label: "عمليات يومية", val: "$2.4M", icon: Activity, color: "text-emerald-400" },
                    { label: "أصول مدارة", val: "$150M+", icon: Wallet, color: "text-[#f9a885]" },
                    { label: "دولة مدعومة", val: "12+", icon: Globe, color: "text-purple-400" }
                  ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-[40px] bg-white/[0.03] border border-white/5 backdrop-blur-md text-center space-y-2">
                       <stat.icon size={20} className={cn("mx-auto opacity-40", stat.color)} />
                       <p className="text-2xl font-black text-white tabular-nums">{stat.val}</p>
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 6. التذييل (Advanced Footer) */}
      <footer className="bg-black/20 pt-20 pb-10 border-t border-white/5 px-6">
         <div className="container mx-auto space-y-16">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
               
               <div className="col-span-2 space-y-6">
                  <Logo size="md" className="brightness-200" />
                  <p className="text-xs text-white/30 font-medium leading-loose max-w-xs">
                    منصة عالمية متطورة لإدارة وتنمية الأصول الرقمية بذكاء وأمان. انضم لمستقبل المال اليوم.
                  </p>
                  <div className="flex gap-4">
                     {[1, 2, 3, 4].map(i => <div key={i} className="h-9 w-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-[#f9a885]/20 cursor-pointer transition-all" />)}
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest">المنصة</h4>
                  <ul className="space-y-4 text-[11px] font-bold text-white/20">
                     <li className="hover:text-[#f9a885] cursor-pointer transition-all">الاستثمارات (لاحقاً)</li>
                     <li className="hover:text-[#f9a885] cursor-pointer transition-all">الشركاء (لاحقاً)</li>
                     <li className="hover:text-[#f9a885] cursor-pointer transition-all">الأسواق الحية</li>
                  </ul>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest">المساعدة</h4>
                  <ul className="space-y-4 text-[11px] font-bold text-white/20">
                     <li className="hover:text-[#f9a885] cursor-pointer transition-all">التعليمات (لاحقاً)</li>
                     <li className="hover:text-[#f9a885] cursor-pointer transition-all">مركز الدعم</li>
                     <li className="hover:text-[#f9a885] cursor-pointer transition-all">الأسئلة الشائعة</li>
                  </ul>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest">قانوني</h4>
                  <ul className="space-y-4 text-[11px] font-bold text-white/20">
                     <li className="hover:text-[#f9a885] cursor-pointer transition-all">شروط الخدمة</li>
                     <li className="hover:text-[#f9a885] cursor-pointer transition-all">سياسة الخصوصية</li>
                     <li className="hover:text-[#f9a885] cursor-pointer transition-all">ميثاق الأمان</li>
                  </ul>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest">الشركة</h4>
                  <ul className="space-y-4 text-[11px] font-bold text-white/20">
                     <li className="hover:text-[#f9a885] cursor-pointer transition-all">عن نامكس (لاحقاً)</li>
                     <li className="hover:text-[#f9a885] cursor-pointer transition-all">تواصل معنا</li>
                     <li className="hover:text-[#f9a885] cursor-pointer transition-all">المسؤولية</li>
                  </ul>
               </div>

            </div>

            <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
               <p className="text-[9px] font-black tracking-[0.4em] uppercase text-white/60">NAMIX UNIVERSAL NETWORK</p>
               <p className="text-[9px] font-bold text-white/40">© 2024 جميع الحقوق محفوظة لمنصة ناميكس الذكية.</p>
            </div>
         </div>
      </footer>

    </div>
  );
}
