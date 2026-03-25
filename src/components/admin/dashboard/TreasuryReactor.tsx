
"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, Zap, Clock, Target, ShieldCheck, TrendingUp, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreasuryReactorProps {
  totalUserBalances: number;
  activeVolume: number;
  liquidityEfficiency: number;
  confidenceIndex: number;
  totalApprovedDeposits: number;
  totalApprovedWithdrawals: number;
  userCount: number;
}

export function TreasuryReactor({
  totalUserBalances,
  activeVolume,
  liquidityEfficiency,
  confidenceIndex,
  totalApprovedDeposits,
  totalApprovedWithdrawals,
  userCount
}: TreasuryReactorProps) {
  return (
    <Card className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden border-r-[8px] border-r-[#002d4d] transition-all hover:shadow-xl group">
      <CardContent className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner group-hover:scale-110 transition-transform">
              <Wallet className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-black text-[#002d4d]">إدارة الخزينة والسيولة</CardTitle>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Treasury AUM Hub</p>
            </div>
          </div>
          <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-3 py-1 rounded-full shadow-inner flex items-center gap-1.5">
             <Cpu size={10} /> AUTO-AUDIT ACTIVE
          </Badge>
        </div>
        
        <div className="p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12 scale-[3.5] pointer-events-none transition-transform duration-1000 group-hover:rotate-45">
             <Zap className="h-20 w-20 text-[#002d4d]" />
          </div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Assets Under Management</p>
          <h3 className="text-5xl font-black text-[#002d4d] leading-none tabular-nums tracking-tighter">${totalUserBalances.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
               <p className="text-[8px] font-black text-gray-300 uppercase">Efficiency</p>
               <p className="text-xs font-black text-emerald-600">%{Math.round(liquidityEfficiency)}</p>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex flex-col items-center">
               <p className="text-[8px] font-black text-gray-300 uppercase">Whales</p>
               <p className="text-xs font-black text-blue-600">{(userCount * 0.05).toFixed(0)} Top</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-[9px] font-black uppercase text-gray-400">
            <span>مؤشر الثقة الاستراتيجي (24h Inflow Ratio)</span>
            <span className="text-emerald-600 tabular-nums">%{Math.round(confidenceIndex)} Verified</span>
          </div>
          <Progress value={confidenceIndex} className="h-2 bg-gray-100 rounded-full [&>div]:bg-emerald-500 shadow-inner" />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 bg-emerald-50/30 rounded-[28px] border border-emerald-100/50 text-right space-y-1">
              <p className="text-[8px] font-black text-emerald-600 uppercase">Confirmed Inflow</p>
              <p className="text-sm font-black text-[#002d4d] tabular-nums">${totalApprovedDeposits.toLocaleString()}</p>
           </div>
           <div className="p-4 bg-red-50/30 rounded-[28px] border border-red-100/50 text-right space-y-1">
              <p className="text-[8px] font-black text-red-600 uppercase">Confirmed Outflow</p>
              <p className="text-sm font-black text-[#002d4d] tabular-nums">${totalApprovedWithdrawals.toLocaleString()}</p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
