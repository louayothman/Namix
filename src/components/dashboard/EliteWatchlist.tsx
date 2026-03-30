"use client";

import React, { useMemo, useState } from "react";
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
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketStore } from "@/store/use-market-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from "@/components/ui/dialog";

interface EliteWatchlistProps {
  favorites: any[];
}

/**
 * @fileOverview رموز التداول النخبوية v16.0 - Compact Intelligence Edition
 * تم تحديث التصميم ليصبح أكثر رشاقة (أفقي) مع إضافة دليل البدء الذكي.
 */
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
          
          <div className="space-y-4 relative z-10 flex flex-col h-full">
            {/* Header: Horizontal Layout (Icon + Name/Code) */}
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500 shrink-0">
                  <CryptoIcon name={asset.icon} size={20} />
               </div>
               <div className="text-right min-w-0">
                  <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-tighter leading-none truncate">{asset.code.split('/')[0]}</h4>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 truncate opacity-60">
                    {asset.name.split(' ')[0]}
                  </p>
               </div>
            </div>

            {/* Content: Price & Change */}
            <div className="mt-auto space-y-1.5">
               <div className="flex items-center justify-between">
                  <p className={cn(
                    "text-[16px] font-black tabular-nums tracking-tighter leading-none transition-colors duration-500",
                    isUp ? "text-emerald-600" : "text-red-600"
                  )}>
                    ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || asset.currentPrice}
                  </p>
                  <div className="relative flex h-1.5 w-1.5">
                    <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isUp ? "bg-emerald-400" : "bg-red-400")}></span>
                    <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", isUp ? "bg-emerald-500" : "bg-red-500")}></span>
                  </div>
               </div>
               
               <div className={cn(
                 "inline-flex items-center gap-1 font-black text-[8px] px-2 py-0.5 rounded-full shadow-inner",
                 isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
               )}>
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

  return (
    <div className="relative space-y-5 py-2 font-body" dir="rtl">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-[18px] bg-white shadow-lg flex items-center justify-center text-orange-400 group">
            <Star className="h-5 w-5 fill-orange-400 animate-pulse" />
          </div>
          <div className="text-right">
            <h3 className="text-sm md:text-base font-black text-[#002d4d] tracking-normal">رموز التداول النخبوية</h3>
            <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mt-0.5">Premium Assets Feed</p>
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
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Quick Start Guide Protocol</p>
                 </div>
              </div>

              <div className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-[#f9a885] group-hover:text-[#002d4d] transition-all shadow-sm">
                 <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
              </div>
           </motion.button>
        </div>
      )}

      {/* Spot Trading Guide Dialog */}
      <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000]" />
          <DialogContent className="fixed left-[50%] top-[50%] z-[1001] translate-x-[-50%] translate-y-[-50%] rounded-[48px] border-none p-0 max-w-[420px] w-[92vw] overflow-hidden bg-white shadow-2xl outline-none font-body text-right" dir="rtl">
            
            <div className="bg-[#002d4d] p-8 text-white relative shrink-0 overflow-hidden text-center border-b border-white/5">
               <div className="absolute top-0 right-0 p-6 opacity-[0.05] -rotate-12 pointer-events-none"><BrainCircuit className="h-40 w-40" /></div>
               <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-inner mx-auto mb-4">
                  <Zap size={24} className="text-[#f9a885] fill-current" />
               </div>
               <DialogTitle className="text-xl font-black tracking-normal">بروتوكول التداول الفوري</DialogTitle>
               <div className="flex items-center justify-center gap-2 text-blue-200/40 font-black text-[8px] uppercase tracking-[0.3em] mt-2">
                  <Sparkles size={10} />
                  Intelligence Onboarding
               </div>
            </div>

            <div className="p-8 space-y-8 bg-white flex-1 overflow-y-auto scrollbar-none">
               <div className="space-y-6">
                  {[
                    { icon: Activity, title: "تحليل نبض الأسواق", desc: "ادخل إلى صفحة التداول لمراقبة حركة الأسعار اللحظية لأهم الأصول الرقمية." },
                    { icon: BrainCircuit, title: "إشارات NAMIX AI", desc: "استعن بمحرك الذكاء الاصطناعي الذي يحلل الاتجاهات ويقترح عليك توقيت الشراء والبيع." },
                    { icon: ShieldCheck, title: "التنفيذ والسيادة", desc: "قم بتنفيذ صفقاتك بلمسة واحدة؛ حيث تضاف الأرباح مباشرة لمحفظتك فور انتهاء مدة الصفقة." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-5 group">
                       <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-blue-50 transition-colors">
                          <item.icon size={18} className="text-[#002d4d] group-hover:text-blue-600" />
                       </div>
                       <div className="space-y-1">
                          <h5 className="font-black text-[13px] text-[#002d4d] tracking-normal">{item.title}</h5>
                          <p className="text-[11px] font-bold text-gray-400 leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="p-5 bg-blue-50/50 rounded-[28px] border border-blue-100 flex items-center gap-4">
                  <Info size={18} className="text-blue-600 shrink-0" />
                  <p className="text-[10px] font-bold text-blue-800/70 leading-relaxed">يمكنك تفعيل الرموز المفضلة عبر الضغط على أيقونة النجمة في صفحة أي أصل مالي لتظهر هنا دائماً.</p>
               </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 shrink-0">
               <Link href="/trade" onClick={() => setGuideOpen(false)}>
                  <Button className="w-full h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 group">
                     <span>التوجه لغرفة الأسواق</span>
                     <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </Button>
               </Link>
               <button onClick={() => setGuideOpen(false)} className="w-full mt-4 text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] transition-colors">إغلاق المساعد</button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
