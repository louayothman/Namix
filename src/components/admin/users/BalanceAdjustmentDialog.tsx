
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wallet, Coins, Zap, ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BalanceAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  action: "add" | "deduct";
  onActionChange: (action: "add" | "deduct") => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  onConfirm: () => void;
  processing: boolean;
}

export function BalanceAdjustmentDialog({ 
  open, 
  onOpenChange, 
  user, 
  action, 
  onActionChange, 
  amount, 
  onAmountChange, 
  onConfirm, 
  processing 
}: BalanceAdjustmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[56px] border-none shadow-2xl p-0 max-w-[420px] overflow-hidden text-right" dir="rtl">
        <div className="bg-orange-500 p-8 text-white relative">
           <div className="absolute top-0 right-0 p-6 opacity-[0.1] -rotate-12 pointer-events-none">
              <Coins className="h-32 w-32" />
           </div>
           <div className="flex items-center gap-4 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                 <Wallet className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-0.5">
                 <DialogTitle className="text-xl font-black">هندسة الرصيد اليدوية</DialogTitle>
                 <p className="text-[9px] font-black text-orange-100/60 uppercase tracking-[0.3em]">Capital Adjustment Protocol</p>
              </div>
           </div>
        </div>

        <div className="p-10 space-y-8 bg-white">
          <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl">
             <button 
               onClick={() => onActionChange("add")}
               className={cn(
                 "flex-1 h-11 rounded-xl font-black text-[11px] transition-all",
                 action === 'add' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400"
               )}
             >
               إضافة رصيد (+)
             </button>
             <button 
               onClick={() => onActionChange("deduct")}
               className={cn(
                 "flex-1 h-11 rounded-xl font-black text-[11px] transition-all",
                 action === 'deduct' ? "bg-white text-red-600 shadow-sm" : "text-gray-400"
               )}
             >
               خصم رصيد (-)
             </button>
          </div>

          <div className="space-y-3">
            <Label className="font-black text-[10px] text-gray-400 pr-4 uppercase text-center block">المبلغ المراد تعديله ($)</Label>
            <div className="relative">
              <Input 
                type="number"
                value={amount}
                onChange={e => onAmountChange(e.target.value)}
                className={cn(
                  "h-20 rounded-[32px] bg-gray-50 border-none font-black text-center text-4xl shadow-inner transition-all",
                  action === 'add' ? "text-emerald-600 focus-visible:ring-emerald-500" : "text-red-600 focus-visible:ring-red-500"
                )}
                placeholder="0.00"
              />
              <Zap className={cn("absolute left-8 top-1/2 -translate-y-1/2 h-8 w-8", action === 'add' ? "text-emerald-50" : "text-red-50")} />
            </div>
          </div>

          {user && (
            <div className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 flex items-center justify-between">
               <div className="space-y-0.5">
                  <p className="text-[8px] font-black text-gray-400 uppercase">الرصيد قبل التعديل</p>
                  <p className="font-black text-sm text-[#002d4d]">${user.totalBalance?.toLocaleString()}</p>
               </div>
               <ChevronLeft className="h-4 w-4 text-gray-200" />
               <div className="text-right space-y-0.5">
                  <p className="text-[8px] font-black text-gray-400 uppercase">الرصيد التقديري بعده</p>
                  <p className={cn("font-black text-sm", action === 'add' ? "text-emerald-600" : "text-red-600")}>
                    ${(user.totalBalance + (action === 'add' ? Number(amount) : -Number(amount))).toLocaleString()}
                  </p>
               </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100">
          <Button 
            onClick={onConfirm} 
            disabled={processing || !amount}
            className={cn(
              "w-full h-16 rounded-full text-white font-black text-lg shadow-xl active:scale-95 transition-all",
              action === 'add' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
            )}
          >
            {processing ? <Loader2 className="animate-spin h-6 w-6" /> : "تأكيد العملية المالية"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
