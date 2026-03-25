
"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  ShieldX, 
  ShieldAlert, 
  ArrowUpRight, 
  Loader2, 
  Coins, 
  Sparkles,
  ChevronLeft,
  Plus,
  Minus,
  TrendingUp,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { addMinutes, addHours, addDays } from "date-fns";
import { collection, doc, updateDoc, addDoc, increment } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";

interface ActivationDialogProps {
  plan: any | null;
  onClose: () => void;
  dbUser: any;
  onOpenDeposit: () => void;
}

/**
 * @fileOverview نافذة تفعيل العقود الذكية v7.5 - Precision Yield Edition
 * تم إضافة متحكمات المبالغ الجانبية وعرض الأرباح اللحظي مع زر الشحن التكيفي.
 */
export function ActivationDialog({ plan, onClose, dbUser, onOpenDeposit }: ActivationDialogProps) {
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<"INSUFFICIENT_BALANCE" | "OUT_OF_RANGE" | null>(null);
  const db = useFirestore();
  const router = useRouter();

  // تعيين الحد الأدنى تلقائياً عند فتح النافذة
  useEffect(() => {
    if (plan && !amount) {
      setAmount(plan.min.toString());
    }
  }, [plan]);

  useEffect(() => {
    if (!plan || !amount) {
      setError(null);
      return;
    }
    const amt = Number(amount);
    const balance = dbUser?.totalBalance || 0;

    if (amt < plan.min || (plan.max < 9999999 && amt > plan.max)) {
      setError("OUT_OF_RANGE");
    } else if (amt > balance) {
      setError("INSUFFICIENT_BALANCE");
    } else {
      setError(null);
    }
  }, [amount, plan, dbUser]);

  const estimatedProfit = useMemo(() => {
    if (!plan || !amount) return 0;
    return (Number(amount) * plan.profitPercent) / 100;
  }, [amount, plan]);

  const adjustAmount = (val: number) => {
    setAmount(prev => {
      const current = Number(prev) || 0;
      const next = Math.max(0, current + val);
      return next.toString();
    });
  };

  const handleInvest = async () => {
    if (error || !dbUser?.id || !plan || !amount) return;
    
    setProcessing(true);
    try {
      const calculateEndDate = (value: number, unit: string) => {
        const startDate = new Date();
        switch(unit) {
          case 'minutes': return addMinutes(startDate, value).toISOString();
          case 'hours': return addHours(startDate, value).toISOString();
          default: return addDays(startDate, value).toISOString();
        }
      };

      const endTime = plan.isScheduled && plan.closeTime 
        ? plan.closeTime 
        : calculateEndDate(plan.durationValue, plan.durationUnit);

      const amt = Number(amount);
      const profitAmount = (amt * plan.profitPercent) / 100;
      
      await addDoc(collection(db, "investments"), {
        userId: dbUser.id,
        userName: dbUser.displayName,
        planId: plan.id,
        planTitle: plan.title,
        amount: amt,
        profitPercent: plan.profitPercent,
        expectedProfit: profitAmount,
        status: "active",
        isProcessed: false,
        startTime: new Date().toISOString(),
        endTime: endTime,
        createdAt: new Date().toISOString()
      });
      
      await updateDoc(doc(db, "users", dbUser.id), {
        totalBalance: increment(-amt),
        activeInvestmentsTotal: increment(amt)
      });
      
      setAmount("");
      onClose();
      router.push('/my-investments');
    } catch (e) {
      console.error("Investment Error:", e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={!!plan} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-[40px] md:rounded-[56px] border-none shadow-2xl p-0 w-[94vw] max-w-[360px] overflow-hidden font-body text-right outline-none z-[1100]" dir="rtl">
        
        {/* Header - Fixed Height & Sovereign Brand */}
        <div className="bg-[#002d4d] p-5 text-white relative shrink-0 text-center border-b border-white/5">
           <div className="absolute top-0 right-0 p-4 opacity-[0.04] -rotate-12 pointer-events-none">
              <ShieldCheck className="h-32 w-32" />
           </div>
           <div className="relative z-10 space-y-1">
              <DialogTitle className="text-base font-black tracking-normal leading-none">{plan?.title}</DialogTitle>
              <p className="text-[7px] font-black text-blue-200/40 uppercase tracking-[0.2em] mt-1">Sovereign Activation Node</p>
           </div>
        </div>
        
        <div className="p-5 space-y-5 bg-white flex flex-col">
          
          {/* Liquidity Overview Node */}
          <div className="p-4 bg-gray-50 rounded-[28px] border border-gray-100 shadow-inner space-y-3">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-1.5">
                 <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Liquidity Balance</p>
              </div>
              <span className="text-sm font-black text-[#002d4d] tabular-nums">${dbUser?.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            
            {/* Amount Controller with Side Buttons */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => adjustAmount(-10)}
                  className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all active:scale-90 shadow-sm"
                >
                  <Minus size={16} />
                </button>
                
                <div className="flex-1 relative">
                  <Input 
                    type="number" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className={cn(
                      "h-12 rounded-2xl bg-white border-none font-black text-center text-2xl tabular-nums shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-blue-500",
                      error && "text-red-500 ring-2 ring-red-100"
                    )}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 pointer-events-none">
                    <Coins size={14} />
                  </div>
                </div>

                <button 
                  onClick={() => adjustAmount(10)}
                  className="h-12 w-12 rounded-2xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center transition-all active:scale-90 shadow-xl"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Estimated Yield Preview */}
              <div className="flex flex-col items-center gap-1">
                 <p className="text-[7px] font-bold text-gray-300 uppercase tracking-widest">الربح المتوقع عند الاستحقاق</p>
                 <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm animate-in fade-in zoom-in duration-500">
                    <TrendingUp size={10} className="text-emerald-600" />
                    <span className="text-[11px] font-black text-emerald-600 tabular-nums">
                      +${estimatedProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                 </div>
              </div>
            </div>
          </div>

          {/* Precision Feedback Module */}
          <AnimatePresence mode="wait">
            {error === "OUT_OF_RANGE" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }} 
                className="p-3 bg-red-50 rounded-[20px] border border-red-100 flex items-start gap-2.5"
              >
                <ShieldX className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-red-800/70 leading-relaxed text-right">
                  خارج النطاق المسموح: <span className="font-black">${plan?.min} - ${plan?.max >= 999999 ? '∞' : plan?.max}</span>
                </p>
              </motion.div>
            )}

            {error === "INSUFFICIENT_BALANCE" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }} 
                className="p-3 bg-orange-50 rounded-[20px] border border-orange-100 flex items-start gap-2.5"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-orange-800/70 leading-relaxed text-right">عجز في السيولة. يرجى تعزيز المحفظة لمتابعة البروتوكول.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Smart Action Engine: Activate or Recharge */}
          <div className="space-y-3">
            {error === "INSUFFICIENT_BALANCE" ? (
              <Button 
                onClick={onOpenDeposit}
                className="w-full h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                <span className="relative z-10">شحن الرصيد الفوري</span>
                <ArrowUpRight className="h-5 w-5 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            ) : (
              <Button 
                onClick={handleInvest} 
                disabled={processing || !amount || !!error} 
                className={cn(
                  "w-full h-16 rounded-full font-black text-base shadow-xl transition-all active:scale-95 group relative overflow-hidden",
                  !!error ? "bg-gray-100 text-gray-300" : "bg-[#002d4d] hover:bg-[#001d33] text-white"
                )}
              >
                {processing ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <div className="flex items-center gap-3 relative z-10">
                    <span>تفعيل العقد الاستراتيجي</span>
                    <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  </div>
                )}
              </Button>
            )}
            
            <button 
              onClick={onClose}
              className="w-full text-[8px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] transition-colors"
            >
              إلغاء العملية والعودة للمختبر
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 opacity-20 select-none pt-1">
             <ShieldCheck size={10} className="text-[#002d4d]" />
             <p className="text-[6px] font-black uppercase tracking-widest text-[#002d4d]">Namix Asset Protection Secured</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
