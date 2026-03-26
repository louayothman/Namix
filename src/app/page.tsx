
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  TrendingUp, 
  ArrowRight, 
  Activity, 
  Coins, 
  ChevronRight,
  Sparkles,
  Lock,
  Cpu
} from "lucide-react";
import Link from "next/link";
import { useMarketStore } from "@/store/use-market-store";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { useMarketSync } from "@/hooks/use-market-sync";

/**
 * @fileOverview بوابة ناميكس العالمية v1.0 - Landing Page
 * صفحة الهبوط الفاخرة للزوار غير المسجلين، تعكس القوة والسيادة المالية.
 */

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const db = useFirestore();

  // مزامنة الأسعار الحية لإبهار الزوار
  const symbolsQuery = useMemoFirebase(() => query(collection(db, "trading_symbols"), where("isActive", "==", true)), [db]);
  const { data: symbols } = useCollection(symbolsQuery);
  useMarketSync(symbols || []);
  const prices = useMarketStore(state => state.prices);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("namix_user");
    if (user) {
      router.replace("/dashboard");
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white font-body selection:bg-[#f9a885]/30 overflow-x-hidden" dir="rtl">
      
      {/* 1. Luxurious Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-gray-50 z-[100] flex items-center px-6 md:px-12 justify-between">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="rounded-full px-8 font-black text-xs text-[#002d4d] hover:bg-gray-50 transition-all">
              دخول المستثمرين
            </Button>
          </Link>
          <Link href="/login?step=signup">
            <Button className="rounded-full px-8 bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-xl transition-all active:scale-95">
              ابدأ رحلتك الآن
            </Button>
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section - The Liquid Power */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Background Fluid Reactor */}
        <div className="absolute top-0 right-0 w-[80%] h-[80%] opacity-[0.03] pointer-events-none -rotate-12 translate-x-1/4">
           <Activity size={800} strokeWidth={0.5} className="text-[#002d4d]" />
        </div>
        
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
               <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885] animate-pulse" />
               <span className="text-[9px] font-black text-[#002d4d] uppercase tracking-[0.5em] opacity-40">The Sovereign Investment Protocol</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-[#002d4d] leading-[1.1] tracking-tight">
              حيث تتحول السيولة <br />
              <span className="text-[#f9a885] drop-shadow-[0_10px_20px_rgba(249,168,133,0.2)]">إلى سيادة مطلقة.</span>
            </h1>
            <p className="text-base md:text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-loose">
              ناميكس هي الوجهة الرقمية للنخبة؛ محرك ذكاء اصطناعي يقتنص فجوات السيولة ليعظم عوائدك ببروتوكولات أمان فائقة.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link href="/login">
              <Button className="h-16 px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-2xl shadow-blue-900/20 active:scale-95 transition-all group">
                تفعيل حسابي السيادي
                <ChevronLeft className="mr-3 h-6 w-6 transition-transform group-hover:-translate-x-1" />
              </Button>
            </Link>
            <div className="flex items-center gap-4 text-[#8899AA] font-black text-[10px] uppercase tracking-widest px-6 h-16 rounded-full border border-gray-100 bg-white/50 backdrop-blur-sm">
               <ShieldCheck className="h-4 w-4 text-emerald-500" />
               Fully Encrypted & Verified
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Live Pulse Strip */}
      <section className="bg-gray-50/50 border-y border-gray-100 py-12">
        <div className="container mx-auto px-6 overflow-hidden">
           <div className="flex items-center justify-center gap-12 overflow-x-auto scrollbar-none pb-4 px-4">
              {symbols?.slice(0, 5).map(s => (
                <div key={s.id} className="flex flex-col items-center gap-2 group transition-all hover:scale-110">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{s.code}</span>
                   <p className="text-lg font-black text-[#002d4d] tabular-nums tracking-tighter">
                     ${prices[s.id]?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || s.currentPrice}
                   </p>
                   <div className="h-1 w-8 bg-blue-500 rounded-full opacity-20 group-hover:opacity-100 transition-all duration-700" />
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 4. Strategic Pillars */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
           {[
             { icon: Cpu, title: "الذكاء الوميضي", desc: "خوارزميات AI تراقب نبض الأسواق العالمية لتوفر لك إشارات تداول بدقة مجهرية." },
             { icon: Lock, title: "حوكمة الأمان", desc: "نظام تشفير AES-256 ورمز PIN للخزنة لضمان سيادتك الكاملة على كافة معاملاتك." },
             { icon: Zap, title: "السيولة الفورية", desc: "بروتوكولات سحب وإيداع ذكية تعمل عبر البلوكشين لتنفيذ طلباتك خلال دقائق." }
           ].map((item, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.2 }}
               className="p-10 rounded-[48px] bg-gray-50 hover:bg-white hover:shadow-2xl hover:-translate-y-2 border border-gray-100 transition-all duration-700 group"
             >
                <div className="h-16 w-16 rounded-[24px] bg-white flex items-center justify-center shadow-inner mb-8 group-hover:bg-[#002d4d] transition-all">
                   <item.icon className="h-8 w-8 text-[#002d4d] group-hover:text-[#f9a885]" />
                </div>
                <h3 className="text-xl font-black text-[#002d4d] mb-4">{item.title}</h3>
                <p className="text-gray-400 font-bold leading-loose text-sm">{item.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* 5. Trust Footer */}
      <footer className="bg-[#002d4d] pt-32 pb-12 px-6 text-white relative overflow-hidden">
         <div className="absolute bottom-0 right-0 p-20 opacity-[0.03] pointer-events-none">
            <Logo size="lg" className="brightness-200" />
         </div>
         
         <div className="max-w-6xl mx-auto space-y-24 relative z-10 text-right">
            <div className="grid md:grid-cols-2 gap-20">
               <div className="space-y-8">
                  <Logo size="md" className="brightness-200" />
                  <p className="text-blue-100/60 font-bold leading-[2.2] max-w-sm">
                    ناميكس هي مستقبل الاقتصاد الرقمي. نحن نبني الجسور بين السيولة التقليدية والنمو اللامركزي لتأمين حياة مالية أفضل.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <h4 className="font-black text-xs uppercase tracking-widest text-[#f9a885]">المستندات</h4>
                     <ul className="space-y-4 text-[11px] font-bold text-white/40">
                        <li className="hover:text-white cursor-pointer transition-colors">ميثاق الاستخدام</li>
                        <li className="hover:text-white cursor-pointer transition-colors">سياسة السيادة</li>
                        <li className="hover:text-white cursor-pointer transition-colors">الأكاديمية</li>
                     </ul>
                  </div>
                  <div className="space-y-6">
                     <h4 className="font-black text-xs uppercase tracking-widest text-blue-400">التواصل</h4>
                     <ul className="space-y-4 text-[11px] font-bold text-white/40">
                        <li className="hover:text-white cursor-pointer transition-colors">الدعم المباشر</li>
                        <li className="hover:text-white cursor-pointer transition-colors">المجتمع العالمي</li>
                        <li className="hover:text-white cursor-pointer transition-colors">الشركاء</li>
                     </ul>
                  </div>
               </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 text-center md:text-right">
               <p className="text-[10px] font-black uppercase tracking-[0.6em]">© 2024 Namix Universal Protocol</p>
               <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (<div key={i} className="h-1 w-1 rounded-full bg-white" />))}
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
