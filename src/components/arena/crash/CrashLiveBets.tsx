
"use client";

import { Badge } from "@/components/ui/badge";
import { User, Users, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_BETS = [
  { user: "ياسين الكردي", amount: 150, mult: 1.45, profit: 217.5, status: 'cashed' },
  { user: "فهد العتيبي", amount: 50, status: 'active' },
  { user: "Alex Rivers", amount: 300, mult: 2.11, profit: 633, status: 'cashed' },
  { user: "سلطان القاسمي", amount: 100, status: 'active' },
];

export function CrashLiveBets({ state, currentBet, hasCashedOut, multiplier }: any) {
  return (
    <div className="space-y-5 font-body">
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-blue-500" />
            <h4 className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest">اللاعبون المتصلون</h4>
         </div>
         <Badge className="bg-blue-50 text-blue-600 border-none text-[8px] px-2 py-0.5 rounded-md">
            {MOCK_BETS.length + (currentBet ? 1 : 0)} ACTIVE
         </Badge>
      </div>

      <div className="space-y-2">
        {/* Your Bet Node */}
        {currentBet && (
          <div className={cn(
            "p-4 rounded-[24px] border flex items-center justify-between transition-all duration-500",
            hasCashedOut ? "bg-emerald-50 border-emerald-100 shadow-lg" : "bg-blue-50 border-blue-100 animate-pulse"
          )}>
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                  <User size={18} />
               </div>
               <div className="text-right">
                  <p className="text-[11px] font-black text-[#002d4d]">محفظتك السيادية</p>
                  <p className="text-[9px] font-bold text-gray-400 tabular-nums">${currentBet.toLocaleString()}</p>
               </div>
            </div>
            <div className="text-left">
               {hasCashedOut ? (
                 <p className="text-sm font-black text-emerald-600 tabular-nums tracking-tighter">
                   +${(currentBet * multiplier).toFixed(2)}
                 </p>
               ) : (
                 <Badge className="bg-blue-600 text-white font-black text-[7px] border-none px-2 py-0.5">IN FLIGHT</Badge>
               )}
            </div>
          </div>
        )}

        {/* Global Feed */}
        {MOCK_BETS.map((bet, i) => (
          <div key={i} className="p-4 rounded-[24px] bg-white border border-gray-50 flex items-center justify-between group hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-3">
               <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shadow-inner group-hover:bg-white transition-all">
                  <User size={16} />
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-[#002d4d]">{bet.user}</p>
                  <p className="text-[8px] font-bold text-gray-300 tabular-nums">${bet.amount}</p>
               </div>
            </div>
            <div className="text-left">
               {bet.status === 'cashed' ? (
                 <div className="text-right flex flex-col items-end gap-0.5">
                    <span className="text-[10px] font-black text-emerald-500 tabular-nums tracking-tighter">${bet.profit}</span>
                    <span className="text-[7px] font-black text-gray-300 tabular-nums">{bet.mult}x</span>
                 </div>
               ) : (
                 <div className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
