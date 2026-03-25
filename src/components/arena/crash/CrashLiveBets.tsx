
"use client";

import { Badge } from "@/components/ui/badge";
import { User, Users, ShieldCheck, Zap, Activity } from "lucide-react";
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
    <div className="space-y-6 font-body tracking-normal">
      <div className="flex items-center justify-between px-3">
         <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
               <Users className="h-4 w-4" />
            </div>
            <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-widest">اللاعبون المتصلون</h4>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-gray-400 tabular-nums">
               {MOCK_BETS.length + (currentBet ? 1 : 0)} ACTIVE
            </span>
         </div>
      </div>

      <div className="space-y-2.5">
        {/* Your Bet Node - Modern Glass Style */}
        <AnimatePresence>
          {currentBet && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={cn(
                "p-5 rounded-[32px] border flex items-center justify-between transition-all duration-700 shadow-xl overflow-hidden relative",
                hasCashedOut ? "bg-emerald-50 border-emerald-200" : "bg-[#002d4d] border-white/10 text-white"
              )}
            >
              {/* Animated Background Shimmer for Active Bet */}
              {!hasCashedOut && (
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]"
                />
              )}

              <div className="flex items-center gap-4 relative z-10">
                 <div className={cn(
                   "h-11 w-11 rounded-[18px] flex items-center justify-center shadow-inner",
                   hasCashedOut ? "bg-white text-emerald-600" : "bg-white/10 text-[#f9a885]"
                 )}>
                    <User size={20} />
                 </div>
                 <div className="text-right">
                    <p className={cn("text-xs font-black", hasCashedOut ? "text-[#002d4d]" : "text-white")}>محفظتك السيادية</p>
                    <p className="text-[10px] font-bold opacity-60 tabular-nums">${currentBet.toLocaleString()}</p>
                 </div>
              </div>
              <div className="text-left relative z-10">
                 {hasCashedOut ? (
                   <div className="flex flex-col items-end">
                      <p className="text-lg font-black text-emerald-600 tabular-nums tracking-tighter">
                        +${(currentBet * multiplier).toFixed(2)}
                      </p>
                      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">SUCCESS</span>
                   </div>
                 ) : (
                   <Badge className="bg-blue-500 text-white border-none font-black text-[8px] px-3 py-1 rounded-full animate-pulse shadow-lg">IN FLIGHT</Badge>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Feed - Clean Minimalist */}
        <div className="divide-y divide-gray-50 bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
          {MOCK_BETS.map((bet, i) => (
            <div key={i} className="p-4 flex items-center justify-between group hover:bg-gray-50/50 transition-all">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 shadow-inner group-hover:bg-white group-hover:text-[#002d4d] transition-all">
                    <User size={18} />
                 </div>
                 <div className="text-right">
                    <p className="text-[12px] font-black text-[#002d4d]">{bet.user}</p>
                    <p className="text-[9px] font-bold text-gray-400 tabular-nums">${bet.amount}</p>
                 </div>
              </div>
              <div className="text-left">
                 {bet.status === 'cashed' ? (
                   <div className="text-right flex flex-col items-end">
                      <span className="text-sm font-black text-emerald-500 tabular-nums tracking-tighter">+${bet.profit}</span>
                      <span className="text-[8px] font-black text-gray-300 tabular-nums">{bet.mult}x</span>
                   </div>
                 ) : (
                   <Activity size={12} className="text-blue-200 animate-pulse" />
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
