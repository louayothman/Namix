"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowUpCircle, Users, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfitKPIsProps {
  stats: any;
}

export function ProfitKPIs({ stats }: ProfitKPIsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       <Card className="border-none shadow-sm rounded-[48px] bg-[#002d4d] text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000"><Zap size={120} /></div>
          <CardContent className="p-8 space-y-4 relative z-10 text-right">
             <p className="text-[9px] font-black text-blue-200/40 uppercase tracking-widest">Net Platform Profit</p>
             <h3 className={cn("text-4xl font-black tabular-nums tracking-tighter", stats.netPlatformProfit >= 0 ? "text-[#f9a885]" : "text-red-400")}>
                ${stats.netPlatformProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
             </h3>
             <div className="flex items-center gap-2 justify-end">
                <Badge className="bg-white/10 text-white border-none font-black text-[8px] px-3 py-1 rounded-full">صافي ربح المشرف</Badge>
                <span className="text-[10px] text-white/40 font-bold">بعد خصم الالتزامات</span>
             </div>
          </CardContent>
       </Card>

       <Card className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden group">
          <CardContent className="p-8 space-y-4 text-right">
             <div className="flex items-center justify-between">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Inflow Assets</p>
                <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
             </div>
             <h3 className="text-3xl font-black text-[#002d4d] tabular-nums tracking-tighter">${stats.totalDepositsValue.toLocaleString()}</h3>
             <div className="flex items-center gap-2 justify-end">
                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-3 py-1 rounded-full">إجمالي الإيداعات</Badge>
                <span className="text-[9px] text-gray-300 font-bold">{(stats.totalDepositsValue / (stats.totalWithdrawalsValue || 1)).toFixed(1)}x تغطية</span>
             </div>
          </CardContent>
       </Card>

       <Card className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden group">
          <CardContent className="p-8 space-y-4 text-right">
             <div className="flex items-center justify-between">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">User Equity & Yield</p>
                <Users className="h-5 w-5 text-blue-500" />
             </div>
             <h3 className="text-3xl font-black text-[#002d4d] tabular-nums tracking-tighter">${(stats.totalUserBalances + stats.futureDueProfits).toLocaleString()}</h3>
             <div className="flex items-center gap-2 justify-end">
                <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[8px] px-3 py-1 rounded-full">التزامات المستخدمين</Badge>
                <span className="text-[9px] text-gray-300 font-bold">شاملة الأرباح المستحقة</span>
             </div>
          </CardContent>
       </Card>

       <Card className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden group">
          <CardContent className="p-8 space-y-4 text-right">
             <div className="flex items-center justify-between">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Solvency Ratio</p>
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
             </div>
             <h3 className="text-3xl font-black text-emerald-600 tabular-nums tracking-tighter">%{stats.solvencyRatio.toFixed(1)}</h3>
             <div className="flex items-center gap-2 justify-end">
                <Badge className="bg-gray-50 text-gray-400 border-none font-black text-[8px] px-3 py-1 rounded-full">مؤشر الملاءة</Badge>
                <div className="h-1.5 flex-1 bg-gray-50 rounded-full overflow-hidden min-w-[60px]">
                   <div className="h-full bg-emerald-500" style={{ width: `${Math.min(stats.solvencyRatio, 100)}%` }} />
                </div>
             </div>
          </CardContent>
       </Card>
    </div>
  );
}
