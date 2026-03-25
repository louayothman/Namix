"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Wallet, ArrowRightLeft, Activity } from "lucide-react";

interface LiquidityNodesProps {
  stats: any;
}

export function LiquidityNodes({ stats }: LiquidityNodesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right" dir="rtl">
       <Card className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between">
             <CardTitle className="text-sm font-black text-[#002d4d] flex items-center gap-3 justify-end w-full">
                بوابات الإيداع (Inflow Nodes)
                <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
             </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-gray-50">
                {Object.entries(stats.depositsByMethod).map(([name, val]: any, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-all">
                     <span className="text-sm font-black text-emerald-600 tabular-nums">${val.toLocaleString()}</span>
                     <div className="flex items-center gap-4">
                        <span className="text-[11px] font-black text-[#002d4d]">{name}</span>
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner"><Wallet size={18} /></div>
                     </div>
                  </div>
                ))}
                {Object.keys(stats.depositsByMethod).length === 0 && (
                  <div className="p-12 text-center opacity-20 flex flex-col items-center gap-3">
                     <Activity size={32} />
                     <p className="text-[10px] font-black uppercase">No active inflow nodes</p>
                  </div>
                )}
             </div>
          </CardContent>
       </Card>

       <Card className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between">
             <CardTitle className="text-sm font-black text-[#002d4d] flex items-center gap-3 justify-end w-full">
                بوابات السحب (Outflow Nodes)
                <ArrowDownCircle className="h-4 w-4 text-red-500" />
             </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-gray-50">
                {Object.entries(stats.withdrawalsByMethod).map(([name, val]: any, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-all">
                     <span className="text-sm font-black text-red-600 tabular-nums">${val.toLocaleString()}</span>
                     <div className="flex items-center gap-4">
                        <span className="text-[11px] font-black text-[#002d4d]">{name}</span>
                        <div className="h-10 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner"><ArrowRightLeft size={18} /></div>
                     </div>
                  </div>
                ))}
                {Object.keys(stats.withdrawalsByMethod).length === 0 && (
                  <div className="p-12 text-center opacity-20 flex flex-col items-center gap-3">
                     <Activity size={32} />
                     <p className="text-[10px] font-black uppercase">No active outflow nodes</p>
                  </div>
                )}
             </div>
          </CardContent>
       </Card>
    </div>
  );
}
