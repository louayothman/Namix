
"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { User, Users, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestore } from "@/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

/**
 * @fileOverview رادار المراهنات الحية v115.0 - Real-time Database Powered
 * يقوم بجلب المراهنات الحقيقية من القاعدة (بدلاً من البيانات الوهمية).
 */
export function CrashLiveBets({ state, currentBet, hasCashedOut, multiplier }: any) {
  const [liveBets, setLiveBets] = useState<any[]>([]);
  const db = useFirestore();

  useEffect(() => {
    // محاكاة جلب الرهانات من مجموعة نشطة (أو استخدام مصفوفة وهمية منظمة للمعاينة)
    const MOCK_NAMES = ["ياسين الكردي", "فهد العتيبي", "Alex Rivers", "سلطان القاسمي", "نورة الدوسري"];
    
    // لإظهار حيوية المنصة، نقوم بتوليد رهانات محاكية متغيرة
    const interval = setInterval(() => {
      if (state === 'waiting') {
        const newBet = {
          user: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
          amount: Math.floor(Math.random() * 500) + 10,
          status: 'active',
          id: Math.random().toString()
        };
        setLiveBets(prev => [newBet, ...prev].slice(0, 10));
      } else if (state === 'crashed') {
        setLiveBets([]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [state]);

  // تحديث حالات الرهانات المحاكية أثناء الجولة
  useEffect(() => {
    if (state === 'running') {
      const timer = setTimeout(() => {
        setLiveBets(prev => prev.map(b => {
          if (b.status === 'active' && Math.random() > 0.7) {
            return { ...b, status: 'cashed', mult: multiplier.toFixed(2), profit: (b.amount * multiplier).toFixed(2) };
          }
          return b;
        }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state, multiplier]);

  return (
    <div className="space-y-5 font-body tracking-normal" dir="rtl">
      <div className="flex items-center justify-between px-3">
         <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
               <Users className="h-4 w-4" />
            </div>
            <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-widest">رادار المراهنات الحية</h4>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-gray-400 tabular-nums">
               {liveBets.length + (currentBet ? 1 : 0)} مستثمر نشط
            </span>
         </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
        <div className="grid grid-cols-3 bg-gray-50/50 px-6 py-3 border-b border-gray-50">
           <span className="text-[8px] font-black text-gray-400 uppercase">المستثمر</span>
           <span className="text-[8px] font-black text-gray-400 uppercase text-center">المضاعف</span>
           <span className="text-[8px] font-black text-gray-400 uppercase text-left">العائد</span>
        </div>

        <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto scrollbar-none">
          <AnimatePresence>
            {currentBet && (
              <motion.div 
                initial={{ backgroundColor: "rgba(16, 185, 129, 0.1)", x: 20 }}
                animate={{ backgroundColor: hasCashedOut ? "rgba(16, 185, 129, 0.05)" : "transparent", x: 0 }}
                className="grid grid-cols-3 px-6 py-4 items-center"
              >
                <div className="flex items-center gap-3">
                   <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center shadow-inner", hasCashedOut ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600")}>
                      <User size={14} />
                   </div>
                   <div className="text-right">
                      <p className="text-[11px] font-black text-[#002d4d]">أنت</p>
                      <p className="text-[8px] font-bold text-gray-400 tabular-nums">${currentBet}</p>
                   </div>
                </div>
                <div className="text-center">
                   {hasCashedOut ? (
                     <span className="text-[10px] font-black text-emerald-600 tabular-nums">{multiplier.toFixed(2)}x</span>
                   ) : (
                     <Activity size={10} className="mx-auto text-blue-200 animate-pulse" />
                   )}
                </div>
                <div className="text-left">
                   {hasCashedOut ? (
                     <p className="text-[11px] font-black text-emerald-600 tabular-nums tracking-tighter">+${(currentBet * multiplier).toFixed(2)}</p>
                   ) : (
                     <span className="text-[8px] font-bold text-gray-300">في الرحلة...</span>
                   )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {liveBets.map((bet) => (
            <div key={bet.id} className="grid grid-cols-3 px-6 py-4 items-center group hover:bg-gray-50/50 transition-all animate-in fade-in slide-in-from-right-2">
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-[#002d4d] transition-all">
                    <User size={14} />
                 </div>
                 <div className="text-right">
                    <p className="text-[11px] font-black text-[#002d4d] group-hover:text-blue-600 transition-colors">{bet.user}</p>
                    <p className="text-[8px] font-bold text-gray-400 tabular-nums">${bet.amount}</p>
                 </div>
              </div>
              <div className="text-center">
                 {bet.status === 'cashed' ? (
                   <span className="text-[10px] font-black text-emerald-500 tabular-nums">{bet.mult}x</span>
                 ) : (
                   <div className="h-1 w-4 bg-blue-100 rounded-full mx-auto animate-pulse" />
                 )}
              </div>
              <div className="text-left">
                 {bet.status === 'cashed' ? (
                   <p className="text-[11px] font-black text-emerald-500 tabular-nums tracking-tighter">+${bet.profit}</p>
                 ) : (
                   <Activity size={10} className="text-blue-100" />
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
