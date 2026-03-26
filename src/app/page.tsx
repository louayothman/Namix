
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
  ArrowRight,
  Lock,
  Wallet,
  Users,
  BarChart3,
  MousePointer2,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview بوابة ناميكس العالمية v4.0 - الإصدار النوراني (Light Mode Elite)
 * تصميم نخبوي بخلفية بيضاء، مزيج لغوي عالمي، وحركات سائلة فائقة النعومة.
 * تم تطهير المصطلحات بالكامل من "سيادة" و "بروتوكول".
 */

// محرك عرض الأسعار اللحظي المتطور
function MarketTicker() {
  const [prices, setPrices] = useState<any[]>([
    { id: 'BTC', price: 0, change: 0 },
    { id: 'ETH', price: 0, change: 0 },
    { id: 'SOL', price: 0, change: 0 },
    { id: 'BNB', price: 0, change: 0 },
  ]);

  useEffect(() => {
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
      } catch (e) { console.error("Sync Error"); }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gray-50/50 border-y border-gray-100 backdrop-blur-md py-4 overflow-hidden relative">
      <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
        {[...prices, ...prices].map((p, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[10px] font-black text-[#002d4d]/40 uppercase tracking-widest">{p.id}/USDT</span>
            <span className="text-sm font-black text-[#002d4d] tabular-nums">${p.price > 1000 ? Math.round(p.price).toLocaleString() : p.price.toLocaleString()}</span>
            <span className={cn("text-[9px] font-black tabular-nums", p.change >= 0 ? "text-emerald-500" : "text-red-500")}>
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
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </div>
  );
}

// مكون العناصر العائمة المتفاعل مع الحركة
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

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("namix_user");
    if (user) router.replace("/home");
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-[#002d4d] font-body selection:bg-[#f9a885]/20 overflow-x-hidden relative" dir="rtl">
      
      {/* 1. السديم النوراني (Soft Atmosphere) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-50/40 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#f9a885]/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* 2. شريط الملاحة النخبوي (Modern Navbar) */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-6xl px-6">
        <div className="bg-white/70 backdrop-blur-2xl border border-gray-100 rounded-[32px] h-16 md:h-20 px-6 md:px-10 flex items-center justify-between shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
          <Logo size="md" className="scale-90 md:scale-100" />
          
          <div className="hidden lg:flex items-center gap-12">
            {['الخدمات', 'الأسعار', 'عن نامكس', 'المساعدة'].map((item) => (
              <button key={item} className="text-[11px] font-black text-[#002d4d]/40 hover:text-[#002d4d] transition-all tracking-normal">{item}</button>
            ))}
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/login">
              <span className="text-[11px] font-black text-[#002d4d]/60 hover:text-[#002d4d] cursor-pointer transition-all">دخول</span>
            </Link>
            <Link href="/login">
              <Button className="rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[10px] md:text-[11px] h-10 md:h-12 px-6 md:px-8 shadow-xl shadow-blue-900/10 active:scale-95 transition-all">
                ابدأ رحلتي الآن
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 3. الهيرو السينمائي (Elite Hero Section) */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 md:pt-40">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
          
          {/* الكتلة اليمنى: الرسالة العالمية */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 text-center lg:text-right"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
               <Sparkles size={14} className="text-blue-600 animate-pulse" />
               <span className="text-[#002d4d] font-black text-[10px] uppercase tracking-widest">مستقبل النمو الذكي <span className="opacity-30 mx-1">•</span> Smart Growth Future</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#002d4d] leading-[1.1] tracking-tighter">
              استثمار بلا <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#002d4d] via-blue-600 to-[#f9a885] animate-text-shimmer">حدود عالمية.</span>
            </h1>
            
            <p className="text-sm md:text-xl text-gray-400 font-medium max-w-lg mx-auto lg:ml-auto lg:mr-0 leading-loose tracking-normal">
              اكتشف تجربة مالية متطورة تدمج بين الذكاء الاصطناعي وسهولة الاستخدام، مصممة خصيصاً لتناسب طموحاتك في بناء محفظة رقمية مستدامة.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-6">
               <Link href="/login" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-16 md:h-20 px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-2xl shadow-blue-900/20 active:scale-95 transition-all group">
                    تفعيل حسابي الآن
                    <ArrowRight size={20} className="mr-3 rotate-180 transition-transform group-hover:-translate-x-2" />
                  </Button>
               </Link>
               <div className="flex items-center gap-4 px-8 h-16 md:h-20 rounded-full border border-gray-100 bg-gray-50/50 backdrop-blur-md">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <div className="flex flex-col items-start leading-none">
                     <span className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest">Safe & Secure</span>
                     <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase">Verified Environment</span>
                  </div>
               </div>
            </div>
          </motion.div>

          {/* الكتلة اليسرى: المفاعل النوراني العائم */}
          <div className="relative flex justify-center items-center h-[450px] md:h-[700px] mt-12 lg:mt-0">
            {/* الخلفية المضيئة للهاتف */}
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute h-[500px] w-[500px] bg-gradient-to-tr from-blue-100/30 via-transparent to-[#f9a885]/20 rounded-full blur-[80px] opacity-60"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[260px] h-[540px] md:w-[320px] md:h-[640px] bg-white rounded-[60px] border-[8px] border-[#002d4d]/5 shadow-[0_60px_120px_-20px_rgba(0,45,77,0.15)] overflow-hidden"
            >
              <div className="p-8 md:p-10 space-y-10">
                 <div className="flex justify-between items-center opacity-20">
                    <div className="h-1.5 w-12 bg-[#002d4d] rounded-full" />
                    <div className="h-4 w-4 rounded-full border-2 border-[#002d4d]" />
                 </div>
                 
                 <div className="space-y-3 text-center pt-4">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Total Balance</p>
                    <h3 className="text-3xl md:text-5xl font-black text-[#002d4d] tabular-nums tracking-tighter">$14,250.00</h3>
                    <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                       <TrendingUp size={12} className="text-emerald-500" />
                       <span className="text-[10px] font-black text-emerald-600">+22.4%</span>
                    </div>
                 </div>

                 <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 space-y-5 shadow-inner">
                    <div className="flex justify-between items-center">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Assets</p>
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

            {/* Nodes عائمة لتعزيز المظهر التقني */}
            <FloatingNode delay={0.2} className="top-[15%] -right-24">
               <div className="bg-white/80 backdrop-blur-xl border border-gray-100 p-5 rounded-[32px] w-56 space-y-4 shadow-2xl">
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
               <div className="bg-[#002d4d] p-6 rounded-[36px] w-48 space-y-3 shadow-2xl border border-white/5">
                  <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black px-2.5 py-0.5 rounded-lg shadow-lg">OPTIMIZED</Badge>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-white/40 uppercase">Intelligence</p>
                     <p className="text-base font-black text-[#f9a885]">Deep Analysis Active</p>
                  </div>
               </div>
            </FloatingNode>
          </div>
        </div>

        {/* شريط الأسعار السفلي */}
        <div className="absolute bottom-0 left-0 right-0">
           <MarketTicker />
        </div>
      </section>

      {/* 4. المميزات الذكية (Smart Features Section) */}
      <section className="py-32 px-6 relative bg-gray-50/30">
         <div className="container mx-auto space-y-24">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
               <Badge className="bg-[#002d4d]/5 text-[#002d4d] border-none px-5 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase">The Intelligent Edge</Badge>
               <h2 className="text-4xl md:text-6xl font-black text-[#002d4d] tracking-tight">لماذا يختار النخبة ناميكس؟</h2>
               <p className="text-base md:text-xl text-gray-400 font-medium leading-loose">نظام متكامل يجمع بين قوة التكنولوجيا المتطورة وسهولة التجربة المالية العصرية.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {[
                 { title: "أمان فائق الذكاء", en: "Smart Security", desc: "تشفير بيانات متقدم من الدرجة العسكرية لحماية كافة أصولك الرقمية وتحركاتك المالية.", icon: Lock, color: "text-blue-600", bg: "bg-blue-50" },
                 { title: "تداول فوري متطور", en: "Instant Engine", desc: "محرك تداول عالمي يربطك بأهم الأسواق الحية بسرعة البرق وبكل سهولة مذهلة.", icon: Zap, color: "text-[#f9a885]", bg: "bg-orange-50" },
                 { title: "إدارة نمو ذكية", en: "Growth Matrix", desc: "حلول استثمارية مبتكرة تساعدك على تنمية محفظتك بأساليب موثقة وعائد مستدام.", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" }
               ].map((feat, i) => (
                 <motion.div 
                   key={i} 
                   whileHover={{ y: -12 }}
                   className="p-12 rounded-[56px] bg-white border border-gray-100 hover:border-blue-100 hover:shadow-[0_40px_80px_-20px_rgba(0,45,77,0.08)] transition-all duration-700 group"
                 >
                    <div className={cn("h-16 w-16 rounded-[24px] flex items-center justify-center mb-10 shadow-inner transition-transform group-hover:rotate-12 duration-500", feat.bg)}>
                       <feat.icon size={32} className={feat.color} />
                    </div>
                    <div className="space-y-4 text-right">
                       <div className="flex flex-col">
                          <h3 className="text-2xl font-black text-[#002d4d] tracking-tight">{feat.title}</h3>
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">{feat.en}</span>
                       </div>
                       <p className="text-sm text-gray-400 font-medium leading-[2.2]">{feat.desc}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. قسم صندوق الثقة (Reliability & Trust) */}
      <section className="py-32 px-6 relative">
         <div className="container mx-auto bg-[#002d4d] rounded-[64px] p-12 md:p-24 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-20 opacity-[0.03] -rotate-12 pointer-events-none transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-0">
               <Globe size={500} />
            </div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-10 text-center lg:text-right">
                  <div className="h-20 w-20 rounded-[28px] bg-[#f9a885] flex items-center justify-center shadow-2xl shadow-orange-900/40 mx-auto lg:mr-0">
                     <ShieldCheck size={40} className="text-[#002d4d]" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                      شريكك الموثوق في <br/>
                      <span className="text-[#f9a885]">رحلة الثراء الرقمي.</span>
                    </h2>
                    <p className="text-base md:text-lg text-white/40 font-medium leading-loose max-w-lg mx-auto lg:mr-0">
                      نحن نؤمن بأن الوصول للحرية المالية هو حق للجميع. ناميكس توفر لك الأدوات والبيئة الآمنة لتحقيق طموحاتك بذكاء.
                    </p>
                  </div>
                  <Link href="/login" className="block">
                    <Button variant="outline" className="h-16 px-12 rounded-full border-white/10 text-white font-black hover:bg-white hover:text-[#002d4d] transition-all group">
                       اكتشف ميثاق الأمان المعتمد
                       <ChevronLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
                    </Button>
                  </Link>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "مستثمر نشط", val: "50K+", icon: Users, color: "text-blue-400" },
                    { label: "عمليات يومية", val: "$2.4M", icon: Activity, color: "text-emerald-400" },
                    { label: "أصول مدارة", val: "$150M+", icon: Wallet, color: "text-[#f9a885]" },
                    { label: "دولة مدعومة", val: "12+", icon: Globe, color: "text-purple-400" }
                  ].map((stat, i) => (
                    <div key={i} className="p-10 rounded-[48px] bg-white/5 border border-white/5 backdrop-blur-md text-center space-y-3 transition-all hover:bg-white/10">
                       <stat.icon size={24} className={cn("mx-auto opacity-30", stat.color)} />
                       <p className="text-3xl font-black text-white tabular-nums tracking-tighter">{stat.val}</p>
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none">{stat.label}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 6. التذييل العالمي (Global Elite Footer) */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-50 px-6">
         <div className="container mx-auto space-y-20">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
               
               <div className="col-span-2 space-y-8">
                  <Logo size="md" />
                  <p className="text-sm text-gray-400 font-medium leading-loose max-w-xs">
                    منصة عالمية متطورة لإدارة وتنمية الأصول الرقمية بذكاء وأمان. انضم لمستقبل المال اليوم بكل ثقة.
                  </p>
                  <div className="flex gap-4">
                     {[1, 2, 3, 4].map(i => (
                       <div key={i} className="h-10 w-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-[#002d4d] hover:text-white cursor-pointer transition-all">
                          <Globe size={16} className="opacity-40" />
                       </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-widest">المنصة <span className="opacity-20 ml-1">Platform</span></h4>
                  <ul className="space-y-4 text-[13px] font-bold text-gray-400">
                     <li className="hover:text-blue-600 cursor-pointer transition-all">الاستثمارات (لاحقاً)</li>
                     <li className="hover:text-blue-600 cursor-pointer transition-all">الشركاء (لاحقاً)</li>
                     <li className="hover:text-blue-600 cursor-pointer transition-all">الأسواق الحية</li>
                  </ul>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-widest">المساعدة <span className="opacity-20 ml-1">Support</span></h4>
                  <ul className="space-y-4 text-[13px] font-bold text-gray-400">
                     <li className="hover:text-blue-600 cursor-pointer transition-all">التعليمات (لاحقاً)</li>
                     <li className="hover:text-blue-600 cursor-pointer transition-all">مركز الدعم</li>
                     <li className="hover:text-blue-600 cursor-pointer transition-all">الأسئلة الشائعة</li>
                  </ul>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-widest">قانوني <span className="opacity-20 ml-1">Legal</span></h4>
                  <ul className="space-y-4 text-[13px] font-bold text-gray-400">
                     <li className="hover:text-blue-600 cursor-pointer transition-all">شروط الخدمة</li>
                     <li className="hover:text-blue-600 cursor-pointer transition-all">سياسة الخصوصية</li>
                     <li className="hover:text-blue-600 cursor-pointer transition-all">ميثاق الأمان</li>
                  </ul>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-widest">الشركة <span className="opacity-20 ml-1">About</span></h4>
                  <ul className="space-y-4 text-[13px] font-bold text-gray-400">
                     <li className="hover:text-blue-600 cursor-pointer transition-all">عن نامكس (لاحقاً)</li>
                     <li className="hover:text-blue-600 cursor-pointer transition-all">تواصل معنا</li>
                     <li className="hover:text-blue-600 cursor-pointer transition-all">الشركاء</li>
                  </ul>
               </div>

            </div>

            <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
               <p className="text-[10px] font-black tracking-[0.5em] uppercase text-[#002d4d]/20">NAMIX UNIVERSAL NETWORK</p>
               <p className="text-[10px] font-bold text-gray-300">© 2024 كافة الحقوق محفوظة لمنصة ناميكس الذكية.</p>
            </div>
         </div>
      </footer>

    </div>
  );
}
