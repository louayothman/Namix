
"use client";

import { Badge } from "@/components/ui/badge";
import { User, Users, ShieldCheck, Zap, Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_BETS = [
  { user: "ياسين الكردي", amount: 150, mult: 1.45, profit: 217.5, status: 'cashed' },
  { user: "فهد العتيبي", amount: 50, status: 'active' },
  { user: "Alex Rivers", amount: 300, mult: 2.11, profit: 633, status: 'cashed' },
  { user: "سلطان القاسمي", amount: 100, status: 'active' },
];

export function CrashLiveBets({ state, currentBet, hasCashedOut, multiplier }: any) {
  return (
    <div className="space-y-5 font-body tracking-normal" dir="rtl">
      <div className="flex items-center justify-between px-3">
         <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
               <Users className="h-4 w-4" />
            </div>
            <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-widest">رادار المراهنات</h4>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-gray-400 tabular-nums">
               {MOCK_BETS.length + (currentBet ? 1 : 0)} لاعب
            </span>
         </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
        <div className="grid grid-cols-3 bg-gray-50/50 px-6 py-3 border-b border-gray-50">
           <span className="text-[8px] font-black text-gray-400 uppercase">المستثمر</span>
           <span className="text-[8px] font-black text-gray-400 uppercase text-center">المضاعف</span>
           <span className="text-[8px] font-black text-gray-400 uppercase text-left">العائد</span>
        </div>

        <div className="divide-y divide-gray-50">
          {/* User's Bet Row */}
          <AnimatePresence>
            {currentBet && (
              <motion.div 
                initial={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                animate={{ backgroundColor: hasCashedOut ? "rgba(16, 185, 129, 0.05)" : "transparent" }}
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
                     <span className="text-[8px] font-bold text-gray-300">في الرحلة</span>
                   )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mocks */}
          {MOCK_BETS.map((bet, i) => (
            <div key={i} className="grid grid-cols-3 px-6 py-4 items-center group hover:bg-gray-50/50 transition-all">
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
