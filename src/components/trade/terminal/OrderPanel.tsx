
"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Minus,
  Fingerprint,
  ShieldCheck,
  Loader2,
  Sparkles,
  Wallet,
  Zap,
  Activity,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface OrderPanelProps {
  asset: any;
  livePrice: number | null;
  globalConfig: any;
  riskConfig: any;
  onOpenDeposit?: () => void;
}

/**
 * @fileOverview لوحة التنفيذ السيادية المدمجة v101.0 - Dynamic Duration Stretch
 * تم تحديث حاوية المدد لتتمدد ديناميكياً على عرض الشاشة مع توزيع متساوٍ للأزرار.
 */
export function OrderPanel({ asset, livePrice, globalConfig, riskConfig, onOpenDeposit }: OrderPanelProps) {
  const [dbUser, setDbUser] = useState<any>(null);
  const [amount, setAmount] = useState("10");
  const [duration, setDuration] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [pendingTradeType, setPendingTradeType] = useState<'buy' | 'sell' | null>(null);
  const db = useFirestore();

  useEffect(() => {
    const userSession = localStorage.getItem("namix_user");
    if (userSession) {
      try {
        const parsed = JSON.parse(userSession);
        if (parsed.id) {
          setDbUser(parsed);
          const unsub = onSnapshot(doc(db, "users", parsed.id), (snap) => {
            if (snap.exists()) {
              setDbUser({ ...snap.data(), id: snap.id });
            }
          });
          return () => unsub();
        }
      } catch (e) {
        console.error("Session Sync Fail:", e);
      }
    }
  }, [db]);

  const durations = useMemo(() => {
    if (globalConfig?.tradeDurations && Array.isArray(globalConfig.tradeDurations)) {
      return globalConfig.tradeDurations.map((d: any) => {
        let mult = 1;
        let suffix = 's';
        if (d.unit === 'minutes') { mult = 60; suffix = 'm'; }
        else if (d.unit === 'hours') { mult = 3600; suffix = 'h'; }
        else if (d.unit === 'days') { mult = 86400; suffix = 'd'; }
        else if (d.unit === 'months') { mult = 2592000; suffix = 'mo'; }
        
        return {
          label: `${d.value}${suffix}`,
          seconds: d.value * mult
        };
      });
    }

    if (globalConfig?.globalDurations) {
      return globalConfig.globalDurations.split(',').map((d: string) => ({
        label: `${d.trim()}s`,
        seconds: Number(d.trim())
      })).filter((n: any) => !isNaN(n.seconds));
    }

    return [
      { label: '30s', seconds: 30 },
      { label: '60s', seconds: 60 },
      { label: '180s', seconds: 180 },
      { label: '300s', seconds: 300 }
    ];
  }, [globalConfig]);

  useEffect(() => {
    if (durations.length > 0 && duration === 0) setDuration(durations[0].seconds);
  }, [durations, duration]);

  const profitRate = globalConfig?.defaultProfitRate || 80;
  const minAmount = globalConfig?.minTradeAmount || 10;
  const estimatedProfit = useMemo(() => (Number(amount) || 0) * profitRate / 100, [amount, profitRate]);

  const isInsufficient = useMemo(() => {
    if (!dbUser) return false; 
    return (dbUser.totalBalance || 0) < (Number(amount) || 0);
  }, [dbUser, amount]);

  const initiateOrder = (type: 'buy' | 'sell') => {
    if (!dbUser?.id) return;
    
    const amt = Number(amount);
    if (!amt || amt < minAmount) return;
    if (isInsufficient) return;
    
    if (riskConfig?.requirePinToTrade) {
      setPendingTradeType(type);
      setPinDialogOpen(true);
    } else {
      executeOrder(type);
    }
  };

  const handlePinSubmit = () => {
    if (pinValue !== dbUser?.securityPin) return;
    setPinDialogOpen(false);
    if (pendingTradeType) executeOrder(pendingTradeType);
    setPinValue("");
    setPendingTradeType(null);
  };

  const executeOrder = async (type: 'buy' | 'sell') => {
    if (!dbUser?.id) return;
    
    setLoading(true);
    try {
      const amt = Number(amount);
      const entry = livePrice || asset.currentPrice;
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + duration * 1000);

      await addDoc(collection(db, "trades"), {
        userId: dbUser.id,
        userName: dbUser.displayName || "مستثمر ناميكس",
        symbolId: asset.id,
        symbolCode: asset.code,
        tradeType: type,
        amount: amt,
        entryPrice: entry,
        profitRate: profitRate,
        expectedProfit: estimatedProfit,
        status: "open",
        result: "pending",
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        createdAt: new Date().toISOString()
      });

      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amt) });
    } catch (e) {
      console.error("Execution Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const adjustAmount = (val: number) => {
    setAmount(prev => Math.max(minAmount, (Number(prev) || 0) + val).toString());
  };

  return (
    <div className="flex flex-col gap-3 lg:gap-4 justify-center max-w-[1200px] mx-auto w-full lg:h-full relative z-[110]" dir="rtl">
      
      <div className="px-4 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-[#002d4d] tracking-normal">الرصيد المتاح:</span>
            {!dbUser ? (
              <div className="h-4 w-12 bg-gray-100 animate-pulse rounded" />
            ) : (
              <span className={cn("text-sm font-black tabular-nums tracking-tighter", isInsufficient ? "text-red-500" : "text-[#002d4d]")}>
                ${dbUser.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
         </div>
         <div className="flex items-center gap-2 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/50">
            <Sparkles className="h-2.5 w-2.5 text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 tracking-normal">الربح المتوقع: +${estimatedProfit.toFixed(2)}</span>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
         <div className="h-12 bg-gray-50 rounded-2xl border border-gray-100 flex items-center p-1 shadow-inner group/input">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => adjustAmount(-10)} className="h-10 w-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
               <Minus size={12} />
            </motion.button>
            <div className="flex-1 flex flex-col items-center justify-center">
               <p className="text-[7px] font-black text-gray-300 uppercase tracking-normal mb-[-2px]">Amount / المبلغ</p>
               <input 
                 type="number" 
                 value={amount} 
                 onChange={e => setAmount(e.target.value)} 
                 className={cn(
                   "w-full bg-transparent border-none text-center font-black text-xl outline-none tabular-nums tracking-tighter",
                   isInsufficient ? "text-red-500" : "text-[#002d4d]"
                 )} 
               />
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => adjustAmount(10)} className="h-10 w-10 rounded-xl bg-[#002d4d] shadow-lg flex items-center justify-center text-[#f9a885] hover:bg-[#001d33] transition-all">
               <Plus size={12} />
            </motion.button>
         </div>

         <AnimatePresence>
           {isInsufficient && (
             <motion.div 
               initial={{ opacity: 0, y: -10, height: 0 }}
               animate={{ opacity: 1, y: 0, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="px-2 overflow-hidden"
             >
               <div className="flex items-center justify-between p-2 bg-red-50 rounded-xl border border-red-100/50 shadow-sm">
                  <div className="flex items-center gap-2">
                     <AlertTriangle className="h-3 w-3 text-red-500" />
                     <span className="text-[9px] font-black text-red-600">رصيد غير كافٍ لإتمام الصفقة</span>
                  </div>
                  <button 
                    onClick={onOpenDeposit}
                    className="h-6 w-6 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all"
                  >
                    <Plus size={14} />
                  </button>
               </div>
             </motion.div>
           )}
         </AnimatePresence>

         <div className="bg-gray-50 p-1 rounded-2xl border border-gray-100 shadow-inner overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 w-full min-w-max lg:min-w-0">
              {durations.map(d => (
                <motion.button 
                  key={d.label} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDuration(d.seconds)} 
                  className={cn(
                    "flex-1 h-9 rounded-xl font-black text-[10px] transition-all tabular-nums relative overflow-hidden flex items-center justify-center px-2 min-w-[54px]", 
                    duration === d.seconds 
                      ? "bg-white text-[#002d4d] shadow-sm border border-gray-100" 
                      : "bg-transparent border-transparent text-gray-400 hover:text-gray-600"
                  )}
                >
                  {duration === d.seconds && <motion.div layoutId="active-dur-min" className="absolute inset-0 bg-[#f9a885]/5" />}
                  <span className="relative z-10">{d.label}</span>
                </motion.button>
              ))}
            </div>
         </div>
      </div>

      <div className="flex flex-row lg:flex-col gap-2 lg:gap-3">
         <motion.button 
           whileTap={{ scale: 0.97 }}
           onClick={() => initiateOrder('buy')} 
           disabled={loading || !dbUser || isInsufficient} 
           className={cn(
             "flex-1 h-14 lg:h-16 rounded-[24px] text-white font-black shadow-lg active:scale-95 flex flex-col items-center justify-center transition-all group relative overflow-hidden outline-none",
             !dbUser || isInsufficient ? "bg-gray-100 text-gray-300 opacity-50" : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_8px_25px_rgba(16,185,129,0.2)]"
           )}
         >
            <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center pr-2 opacity-[0.15] group-hover:opacity-[0.25] transition-opacity">
               <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                  <ChevronUp size={56} strokeWidth={4} />
               </motion.div>
            </div>
            
            <div className="relative z-10 flex items-baseline gap-2">
               <span className="text-lg lg:text-xl font-black tracking-normal">شراء</span>
               <span className="text-[8px] font-bold opacity-40 uppercase">BUY</span>
            </div>
            <div className="relative z-10 flex items-center gap-1 opacity-60">
               <Zap size={8} className="fill-white" />
               <span className="text-[7px] font-black uppercase tracking-normal">Instant</span>
            </div>
         </motion.button>

         <motion.button 
           whileTap={{ scale: 0.97 }}
           onClick={() => initiateOrder('sell')} 
           disabled={loading || !dbUser || isInsufficient} 
           className={cn(
             "flex-1 h-14 lg:h-16 rounded-[24px] text-white font-black shadow-lg active:scale-95 flex flex-col items-center justify-center transition-all group relative overflow-hidden outline-none",
             !dbUser || isInsufficient ? "bg-gray-100 text-gray-300 opacity-50" : "bg-gradient-to-br from-red-500 to-rose-600 shadow-[0_8px_25px_rgba(239,68,68,0.2)]"
           )}
         >
            <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center pl-2 opacity-[0.15] group-hover:opacity-[0.25] transition-opacity">
               <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                  <ChevronDown size={56} strokeWidth={4} />
               </motion.div>
            </div>

            <div className="relative z-10 flex items-baseline gap-2">
               <span className="text-lg lg:text-xl font-black tracking-normal">بيع</span>
               <span className="text-[8px] font-bold opacity-40 uppercase">SELL</span>
            </div>
            <div className="relative z-10 flex items-center gap-1 opacity-60">
               <Zap size={8} className="fill-white" />
               <span className="text-[7px] font-black uppercase tracking-normal">Sovereign</span>
            </div>
         </motion.button>
      </div>

      <div className="flex items-center justify-center gap-4 py-1 opacity-[0.15] select-none">
         <div className="flex items-center gap-1.5">
            <ShieldCheck size={10} className="text-[#002d4d]" />
            <span className="text-[7px] font-black uppercase tracking-normal text-[#002d4d]">Encrypted</span>
         </div>
         <div className="h-1 w-1 rounded-full bg-gray-300" />
         <div className="flex items-center gap-1.5">
            <Sparkles size={10} className="text-[#f9a885]" />
            <span className="text-[7px] font-black uppercase tracking-normal text-[#002d4d]">Namix Core</span>
         </div>
      </div>

      <Dialog open={pinDialogOpen} onOpenChange={setPinDialogOpen}>
        <DialogContent className="rounded-[56px] border-none shadow-2xl p-0 max-w-[380px] overflow-hidden text-right font-body" dir="rtl">
          <div className="bg-[#002d4d] p-10 text-white relative shrink-0">
             <div className="absolute top-0 right-0 p-6 opacity-[0.05] -rotate-12 pointer-events-none"><Fingerprint size={120} /></div>
             <DialogTitle className="text-2xl font-black relative z-10 tracking-normal">تأكيد السيادة</DialogTitle>
             <p className="text-[10px] font-black text-blue-200/60 uppercase tracking-normal relative z-10">Vault PIN Required</p>
          </div>
          <div className="p-10 space-y-10 bg-white text-center">
             <div className="space-y-4">
                <Label className="text-[11px] font-black text-gray-400 uppercase tracking-normal">أدخل رمز PIN للخزنة</Label>
                <input 
                  type="password" 
                  maxLength={6} 
                  value={pinValue} 
                  onChange={e => setPinValue(e.target.value.replace(/\D/g, ''))} 
                  className="h-20 w-full rounded-[32px] bg-gray-50 border-none font-black text-center text-5xl tracking-[0.4em] shadow-inner focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all" 
                  placeholder="000000" 
                />
             </div>
             <Button 
               onClick={handlePinSubmit} 
               className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-2xl active:scale-95 transition-all"
             >
               تأكيد التنفيذ
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
