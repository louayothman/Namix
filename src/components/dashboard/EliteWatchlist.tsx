
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CryptoIcon } from "@/lib/crypto-icons";
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  ChevronLeft, 
  Activity, 
  Info, 
  Zap, 
  BrainCircuit, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  MousePointerClick,
  Target,
  BarChart3,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketStore } from "@/store/use-market-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import Lottie from "lottie-react";

interface EliteWatchlistProps {
  favorites: any[];
}

/**
 * NebulaBackground - محرك سديم البيانات الخلفي
 */
const NebulaBackground = () => {
  const [particles, setParticles] = useState<{ x: number; y: number; s: number; d: number }[]>([]);

  useEffect(() => {
    const p = [...Array(25)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 0.5 + Math.random() * 1.5,
      d: 5 + Math.random() * 10
    }));
    setParticles(p);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#001a2d]">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] right-[-10%] w-[100%] h-[100%] bg-blue-600/10 rounded-full blur-[80px]" 
      />
      <motion.div 
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.3, 0.1], rotate: [360, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] left-[-10%] w-[100%] h-[100%] bg-[#f9a885]/10 rounded-full blur-[80px]" 
      />
      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -100, 0], opacity: [0, 0.4, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: p.d, repeat: Infinity, delay: i * 0.1 }}
          className="absolute rounded-full bg-white/60 shadow-[0_0_5px_rgba(255,255,255,0.3)]"
          style={{ top: `${p.y}%`, left: `${p.x}%`, width: p.s, height: p.s }}
        />
      ))}
    </div>
  );
};

const EliteAssetCard = React.memo(({ asset, price, change }: { asset: any, price: number, change: number }) => {
  const isUp = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="shrink-0"
    >
      <Link href={`/trade/${asset.id}`}>
        <div className="w-[180px] h-[145px] p-5 rounded-[36px] bg-white/90 backdrop-blur-xl border border-gray-100 shadow-[0_15px_40px_-12px_rgba(0,45,77,0.06)] hover:shadow-[0_30px_60px_-15px_rgba(0,45,77,0.12)] transition-all duration-700 group active:scale-95 relative overflow-hidden">
          <div className="absolute -bottom-4 -left-4 opacity-[0.02] group-hover:opacity-[0.06] transition-all duration-1000 pointer-events-none text-[#002d4d]">
             <CryptoIcon name={asset.icon} size={90} />
          </div>
          <div className="space-y-4 relative z-10 flex flex-col h-full font-body">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500 shrink-0">
                  <CryptoIcon name={asset.icon} size={20} />
               </div>
               <div className="text-right min-w-0">
                  <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-normal leading-none truncate">{asset.code.split('/')[0]}</h4>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-normal mt-1 truncate opacity-60">
                    {asset.name.split(' ')[0]}
                  </p>
               </div>
            </div>
            <div className="mt-auto space-y-1.5">
               <div className="flex items-center justify-between">
                  <p className={cn("text-[16px] font-black tabular-nums tracking-tighter leading-none transition-colors duration-500", isUp ? "text-emerald-600" : "text-red-600")}>
                    ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || asset.currentPrice}
                  </p>
                  <div className="relative flex h-1.5 w-1.5">
                    <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isUp ? "bg-emerald-400" : "bg-red-400")}></span>
                    <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", isUp ? "bg-emerald-500" : "bg-red-500")}></span>
                  </div>
               </div>
               <div className={cn("inline-flex items-center gap-1 font-black text-[8px] px-2 py-0.5 rounded-full shadow-sm", isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500")}>
                  {isUp ? <TrendingUp size={8}/> : <TrendingDown size={10}/>}
                  <span className="tabular-nums">%{Math.abs(change).toFixed(2)}</span>
               </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

EliteAssetCard.displayName = "EliteAssetCard";

export function EliteWatchlist({ favorites }: EliteWatchlistProps) {
  const prices = useMarketStore(state => state.prices);
  const changes = useMarketStore(state => state.dailyChanges);
  const [guideOpen, setGuideOpen] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (guideOpen) {
      fetch("https://lottie.host/cd21e4c4-bf4d-4e52-b6b1-a1a25e7863e5/fabb0ZLzCZ.json")
        .then(res => res.json())
        .then(data => setAnimationData(data))
        .catch(err => console.error("Lottie Load Error:", err));
    }
  }, [guideOpen]);

  const guideNodes = [
    { 
      title: "ما هو التداول الفوري؟", 
      desc: "هو تبادل الأصول الرقمية بملكيتها الحقيقية بسعر السوق اللحظي. هدفك هو شراء العملة بسعر منخفض وبيعها بسعر أعلى لجني الأرباح من فارق السعر.",
      icon: BarChart3,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    { 
      title: "استراتيجية الرصد الذكي", 
      desc: "قبل التنفيذ، راقب اتجاه السعر (Trend) ونبض السوق. ابحث عن مناطق 'التشبع' حيث تكون الأسعار مهيأة للانعكاس لصالحك.",
      icon: Target,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    { 
      title: "التنفيذ عبر ناميكس", 
      desc: "استخدم محرك NAMIX AI الذي يحلل المؤشرات الفنية ويعطيك إشارات دخول لحظية موثوقة. اختر المبلغ والمدة ثم اضغط شراء أو بيع بنقرة واحدة.",
      icon: Zap,
      color: "text-orange-500",
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="relative space-y-5 py-2 font-body" dir="rtl">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-[18px] bg-white shadow-lg flex items-center justify-center text-orange-400">
            <Star className="h-5 w-5 fill-orange-400 animate-pulse" />
          </div>
          <div className="text-right">
            <h3 className="text-sm md:text-base font-black text-[#002d4d] tracking-normal">رموز التداول النخبوية</h3>
            <p className="text-[7px] font-black text-gray-300 uppercase tracking-normal mt-0.5">Professional Assets Feed</p>
          </div>
        </div>
        
        {favorites.length > 0 && (
          <Link href="/trade">
            <Button variant="ghost" className="h-9 rounded-full bg-white border border-gray-100 shadow-sm px-5 text-[9px] font-black text-[#002d4d] hover:bg-[#002d4d] hover:text-[#f9a885] transition-all active:scale-95 group">
              استكشاف الأسواق 
              <ChevronLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        )}
      </div>

      {favorites.length > 0 ? (
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-6 px-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
          {favorites.map((asset) => (
            <EliteAssetCard 
              key={asset.id} 
              asset={asset} 
              price={prices[asset.id]} 
              change={changes[asset.id] || 0} 
            />
          ))}
        </div>
      ) : (
        <div className="px-4 pb-4">
           <motion.button
             whileTap={{ scale: 0.98 }}
             onClick={() => setGuideOpen(true)}
             className="w-full p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex items-center justify-between relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
                 <Zap size={80} className="text-[#002d4d]" />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                 <div className="h-12 w-12 rounded-[20px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500">
                    <Info size={22} />
                 </div>
                 <div className="text-right">
                    <h4 className="text-[13px] font-black text-[#002d4d] tracking-normal">كيف أبدأ التداول الفوري؟</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-normal mt-0.5">Quick Onboarding Protocol</p>
                 </div>
              </div>
              <div className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#f9a885] group-hover:text-[#002d4d] transition-all shadow-sm">
                 <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
              </div>
           </motion.button>
        </div>
      )}

      <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000]" />
          <DialogContent className="fixed left-[50%] top-[50%] z-[1001] translate-x-[-50%] translate-y-[-50%] rounded-[48px] border-none p-0 max-w-[850px] w-[95vw] overflow-hidden bg-white shadow-2xl outline-none font-body text-right" dir="rtl">
            
            <div className="flex flex-col md:flex-row min-h-[500px]">
               {/* Left Column: Visual Nebula */}
               <div className="md:w-5/12 bg-[#001a2d] relative overflow-hidden flex flex-col items-center justify-center p-8 border-l border-white/5">
                  <NebulaBackground />
                  <div className="relative z-10 w-full max-w-[220px] aspect-square flex items-center justify-center">
                     <div className="absolute inset-0 bg-white/5 rounded-full blur-[60px] animate-pulse" />
                     {animationData ? (
                       <Lottie animationData={animationData} loop={true} className="w-full h-full scale-125" />
                     ) : (
                       <Loader2 className="h-8 w-8 animate-spin text-[#f9a885] opacity-20" />
                     )}
                  </div>
                  <div className="mt-8 text-center space-y-1 relative z-10">
                     <div className="flex items-center justify-center gap-2 text-[#f9a885] font-black text-[8px] uppercase tracking-[0.3em]">
                        <Sparkles size={10} />
                        Next-Gen Intelligence
                     </div>
                     <p className="text-blue-100/30 text-[7px] font-bold uppercase tracking-widest">Global Asset Trading</p>
                  </div>
               </div>

               {/* Right Column: Tactical Briefcase Nodes */}
               <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-between bg-white relative">
                  <div className="space-y-8">
                     <div className="space-y-2 text-right">
                        <div className="flex items-center gap-3">
                           <div className="h-1 w-6 bg-blue-600 rounded-full" />
                           <DialogTitle className="text-xl md:text-3xl font-black text-[#002d4d] tracking-normal">دليل التداول الاحترافي</DialogTitle>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pr-9">Market Execution Briefing</p>
                     </div>

                     <div className="space-y-5">
                        {guideNodes.map((node, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                            className="group relative flex items-start gap-5 p-5 rounded-[28px] border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all"
                          >
                             <div className={cn(
                               "h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-all duration-500",
                               node.bg, node.color, "group-hover:bg-[#002d4d] group-hover:text-[#f9a885]"
                             )}>
                                <node.icon size={20} />
                             </div>
                             <div className="space-y-1">
                                <h5 className="font-black text-sm text-[#002d4d] tracking-normal">{node.title}</h5>
                                <p className="text-[11px] font-bold text-gray-500 leading-relaxed tracking-normal">{node.desc}</p>
                             </div>
                             {i < guideNodes.length - 1 && (
                               <div className="absolute right-[43px] top-[60px] w-[1px] h-6 bg-gradient-to-b from-gray-100 to-transparent pointer-events-none" />
                             )}
                          </motion.div>
                        ))}
                     </div>
                  </div>

                  <div className="pt-8 border-t border-gray-50 flex flex-col gap-4">
                     <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                           <ShieldCheck className="h-4 w-4 text-emerald-500" />
                           <span className="text-[9px] font-black text-[#002d4d] uppercase tracking-normal">Safe Execution Guaranteed</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                           <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                           <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Ready to launch</span>
                        </div>
                     </div>
                     <Link href="/trade" onClick={() => setGuideOpen(false)} className="block">
                        <Button className="w-full h-14 md:h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-sm md:text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 group/btn overflow-hidden relative">
                           <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover/btn:translate-x-[-200%] transition-transform duration-1000" />
                           <span>انطلق لغرفة التداول</span>
                           <MousePointerClick className="h-5 w-5 text-[#f9a885] transition-transform group-hover/btn:scale-125" />
                        </Button>
                     </Link>
                     <button onClick={() => setGuideOpen(false)} className="text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] transition-colors text-center">إغلاق المساعد</button>
                  </div>
               </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
