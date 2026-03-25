
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Loader2, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface ManagedInvestmentListProps {
  investments: any[];
  isLoading: boolean;
  getProgressData: (startTime: string, endTime: string, expectedProfit: number) => { percent: number, accrued: number };
}

export function ManagedInvestmentList({ 
  investments, 
  isLoading, 
  getProgressData 
}: ManagedInvestmentListProps) {
  return (
    <div className="container mx-auto px-6 space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black text-[#002d4d]">عقود المستثمر النشطة</h2>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="text-center py-12"><Loader2 className="animate-spin h-8 w-8 mx-auto text-gray-200" /></div>
        ) : investments && investments.length > 0 ? (
          investments.map((inv) => {
            const { percent, accrued } = getProgressData(inv.startTime, inv.endTime, inv.expectedProfit);
            return (
              <Card key={inv.id} className="overflow-hidden border-none shadow-sm bg-white rounded-[40px] group transition-all hover:shadow-xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 text-right">
                      <div className={cn(
                        "h-12 w-12 rounded-[18px] text-blue-600 flex items-center justify-center shadow-inner",
                        percent >= 100 ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                      )}>
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-[#002d4d]">{inv.planTitle}</h3>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Status: Operational</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-black text-[#002d4d]">${inv.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="p-5 bg-gray-50/50 rounded-[28px] space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase">
                      <span className="text-gray-400">Yield Accrued</span>
                      <span className="text-emerald-600">+$ {accrued.toFixed(4)}</span>
                    </div>
                    <Progress value={percent} className="h-2 bg-white rounded-full" />
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white/40 rounded-[48px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-4">
            <Coins className="h-10 w-10 text-gray-200" />
            <p className="text-gray-300 font-black text-sm uppercase tracking-widest">No Active Contracts</p>
          </div>
        )}
      </div>
    </div>
  );
}
