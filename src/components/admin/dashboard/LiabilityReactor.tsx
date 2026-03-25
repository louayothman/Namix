
"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldHalf, Coins, FileWarning, TrendingDown, ShieldCheck, Layers, Award, Target, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiabilityReactorProps {
  totalLiabilities: number;
  solvencyRatio: number;
  totalLiveAccruedProfits: number;
  totalUserBalances: number;
  next7DaysOutflow: number;
  pendingWithdrawalsCount: number;
  totalApprovedDeposits: number;
}

export function LiabilityReactor({
  totalLiabilities = 0,
  solvencyRatio = 0,
  totalLiveAccruedProfits = 0,
  totalUserBalances = 0,
  next7DaysOutflow = 0,
  pendingWithdrawalsCount = 0,
  totalApprovedDeposits = 0
}: LiabilityReactorProps) {
  const stats = [
    { label: "أرباح تراكمية", val: `$${(totalLiveAccruedProfits || 0).toFixed(2)}`, icon: Coins, color: "text-amber-500" },
    { label: "التزامات فورية", val: `$${(totalUserBalances || 0).toLocaleString()}`, icon: FileWarning, color: "text-red-400" },
    { label: "خروج متوقع (7د)", val: `$${(next7DaysOutflow || 0).toLocaleString()}`, icon: TrendingDown, color: "text-orange-500" },
    { label: "نسبة الملاءة", val: `${(solvencyRatio || 0).toFixed(1)}%`, icon: ShieldCheck, color: "text-emerald-500" },
    { label: "سحوبات معلقة", val: `${pendingWithdrawalsCount}`, icon: Layers, color: "text-orange-600" },
    { label: "صافي الملاءة", val: solvencyRatio > 100 ? "Excellent" : "Stable", icon: Award, color: "text-indigo-500" },
    { label: "المخاطرة", val: "Low", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "تغطية الالتزام", val: `${(totalApprovedDeposits / (totalLiabilities || 1)).toFixed(2)}x`, icon: Target, color: "text-blue-600" },
    { label: "فترة الانتظار", val: "2.4 Days", icon: Clock, color: "text-blue-400" },
    { label: "تنبيهات أمنية", val: "Safe", icon: ShieldCheck, color: "text-emerald-600" }
  ];

  return (
    <Card className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden border-r-[8px] border-r-[#f9a885] transition-all hover:shadow-xl group">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 shadow-inner group-hover:scale-110 transition-transform">
                <ShieldHalf className="h-5 w-5 text-[#f9a885]" />
              </div>
              <div>
                <CardTitle className="text-lg font-black text-[#002d4d]">الملاءة والالتزامات الكلية</CardTitle>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Global Risk Matrix</p>
              </div>
            </div>
            
            <div className="p-7 bg-orange-50/20 rounded-[36px] border border-orange-100/50 relative overflow-hidden">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Liabilities (Live)</p>
              <h3 className="text-4xl font-black text-red-600 leading-none">${(totalLiabilities || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <div className="mt-4 flex items-center gap-2">
                <Badge className="bg-red-500 text-white font-black text-[8px] px-3 py-1 rounded-full border-none shadow-lg">التزامات واجبة</Badge>
                <span className="text-[9px] font-bold text-gray-400">معدل الملاءة: {Math.round(solvencyRatio)}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[9px] font-black uppercase text-gray-400">
                <span>مؤشر السيولة التنبؤي (7 أيام)</span>
                <span className="text-[#002d4d]">{totalApprovedDeposits > next7DaysOutflow ? "Safe" : "Monitor"}</span>
              </div>
              <Progress value={Math.min((totalApprovedDeposits / (next7DaysOutflow || 1)) * 100, 100)} className="h-2 bg-gray-100 rounded-full [&>div]:bg-[#f9a885] shadow-inner" />
            </div>
          </div>

          <div className="w-full lg:w-[260px] grid grid-cols-2 lg:grid-cols-1 gap-2.5">
            {stats.map((item, i) => (
              <div key={i} className="p-3 bg-gray-50/30 rounded-2xl border border-gray-100 flex items-center justify-between group/item hover:bg-white hover:shadow-sm transition-all duration-300">
                <div className="flex items-center gap-2">
                  <item.icon className={cn("h-3 w-3 transition-transform group-hover/item:scale-125", item.color)} />
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{item.label}</span>
                </div>
                <span className="text-[10px] font-black text-[#002d4d]">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
