
"use client";

import { useState, useEffect, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dices, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  Coins,
  Loader2,
  Plus,
  TrendingUp,
  Target,
  Sparkles,
  ChevronUp
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DepositSheet } from "@/components/deposit/DepositSheet";

/**
 * 1. الشريط العلوي الموحد
 */
function DiceHeader({ balance, onOpenDeposit }: { balance: number, onOpenDeposit: () => void }) {
  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-gray-50 bg-white z-50 shrink-0">
      <div className="flex items-center gap-3">
         <Link href="/arena">
           <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-gray-50 text-[#002d4d] active:scale-90 transition-all">
             <ChevronRight className="h-5 w-5" />
           </Button>
         </Link>
         <div className="space-y-0 text-right">
            <h1 className="text-lg font-black text-[#002d4d] leading-none">نكسوس للاحتمالات</h1>
            <p className="text-[7px] font-black text-blue-500 uppercase tracking-widest mt-1">Nexus Probability Engine</p>
         </div>
      </div>
      
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 shadow-inner">
         <div className="text-right">
            <p className="text-[6px] font-black text-gray-400 uppercase leading-none">الرصيد</p>
            <p className="text-[11px] font-black text-[#002d4d] tabular-nums mt-0.5">${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
         </div>
         <button onClick={onOpenDeposit} className="h-7 w-7 rounded-lg bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all ml-1">
            <Plus size={14} />
         </button>
      </div>
    </header>
  );
}

/**
 * 2. مفاعل اللعبة (The Reactor) - تم تعديل الاتجاه وإضافة السهم الرقمي
 */
function DiceReactor({ 
  lastResult, 
  gameState, 
  isRollOver, 
  targetValue, 
  setTargetValue, 
  setIsRollOver 
}: any) {
  return (
    <section className="relative w-full bg-gray-50/50 rounded-2xl p-10 md:p-14 shadow-inner border border-gray-100 overflow-hidden min-h-[320px] flex flex-col justify-center">
      
      {/* عرض النتيجة النهائية */}
      <AnimatePresence>
        {lastResult !== null && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-10 left-1/2 -translate-x-1/2 z-30">
            <div className={cn(
              "px-8 py-3 rounded-xl font-black text-4xl shadow-2xl tabular-nums border-4 border-white transition-all", 
              gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {lastResult.toFixed(2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-16 pt-6">
        <div className="relative pt-12">
          {/* شريط الاحتمالات الملون - تم عكس المنطق البصري */}
          <div className="h-4 w-full bg-gray-200 rounded-full relative overflow-hidden shadow-inner border-2 border-white">
            <motion.div 
              animate={{ 
                left: isRollOver ? '0%' : `${targetValue}%`, 
                right: isRollOver ? `${100 - targetValue}%` : '0%' 
              }} 
              className="absolute top-0 bottom-0 bg-red-500 transition-all duration-500" 
            />
            <motion.div 
              animate={{ 
                left: isRollOver ? `${targetValue}%` : '0%', 
                right: isRollOver ? '0%' : `${100 - targetValue}%` 
              }} 
              className="absolute top-0 bottom-0 bg-emerald-500 transition-all duration-500" 
            />
          </div>

          {/* السهم والمؤشر الرقمي الطائر */}
          <div className="relative mt-2">
             <Slider 
               value={[targetValue]} 
               onValueChange={([val]) => setTargetValue(val)} 
               max={98} min={2} step={0.01} 
               className="relative z-20" 
             />
             
             {/* السهم والقيمة فوق المنزلق */}
             <motion.div 
               className="absolute top-[-45px] flex flex-col items-center pointer-events-none"
               style={{ left: `${targetValue}%`, transform: 'translateX(-50%)' }}
               animate={{ left: `${targetValue}%` }}
               transition={{ type: "spring", stiffness: 500, damping: 30 }}
             >
                <div className="bg-[#002d4d] text-[#f9a885] px-3 py-1 rounded-lg text-[11px] font-black shadow-lg border border-white/10">
                   {targetValue.toFixed(2)}
                </div>
                <ChevronUp className="text-[#002d4d] h-4 w-4 mt-[-6px]" fill="currentColor" />
             </motion.div>
          </div>

          <div className="flex justify-between items-center mt-6 font-black text-[9px] text-gray-400 uppercase tracking-widest px-1">
            <span>0.00</span><span className="text-[#002d4d]/20">25.00</span><span className="text-[#002d4d]/40">50.00</span><span className="text-[#002d4d]/20">75.00</span><span>100.00</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-xl border border-gray-100">
            <button onClick={() => setIsRollOver(true)} className={cn("px-10 h-11 rounded-xl font-black text-[11px] transition-all", isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400")}>توقع فوق (Over)</button>
            <button onClick={() => setIsRollOver(false)} className={cn("px-10 h-11 rounded-xl font-black text-[11px] transition-all", !isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400")}>توقع تحت (Under)</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 3. لوحة الرهان (Betting Panel)
 */
function BettingPanel({ 
  betAmount, 
  setBetAmount, 
  loading, 
  dbUser, 
  handleRoll, 
  multiplier, 
  winChance 
}: any) {
  return (
    <section className="space-y-6">
      <Card className="border-none shadow-sm rounded-2xl bg-white border border-gray-50 overflow-hidden">
        <CardContent className="p-8 space-y-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-black text-gray-400 uppercase pr-2">قيمة الرهان ($)</Label>
            <div className="relative">
              <Input type="number" value={betAmount} onChange={e => setBetAmount(e.target.value)} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-xl shadow-inner focus-visible:ring-2 focus-visible:ring-blue-500" />
              <Coins className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 text-center space-y-1 shadow-inner">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">المضاعف</p>
              <p className="text-xl font-black text-[#002d4d] tabular-nums">x{multiplier.toFixed(4)}</p>
            </div>
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 text-center space-y-1 shadow-inner">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">فرصة الفوز</p>
              <p className="text-xl font-black text-emerald-600 tabular-nums">%{winChance.toFixed(2)}</p>
            </div>
          </div>

          <Button onClick={handleRoll} disabled={loading || !dbUser || Number(betAmount) > (dbUser?.totalBalance || 0)} className="w-full h-20 rounded-2xl bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl active:scale-95 transition-all group relative overflow-hidden">
            {loading ? <Loader2 className="animate-spin h-8 w-8" /> : (
              <div className="flex items-center gap-4"><span>إطلاق النرد</span><Dices className="h-8 w-8 text-[#f9a885]" /></div>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

/**
 * 4. تفاصيل الساحة (Details)
 */
function DiceDetails() {
  return (
    <section className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div className="text-right">
        <h4 className="font-black text-sm text-[#002d4d]">نظام السيولة الذكية</h4>
        <p className="text-[10px] font-bold text-gray-400">تخضع العمليات لمعايرة النزاهة الرقمية بنسبة 25% فوز.</p>
      </div>
      <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] px-4 py-1.5 rounded-xl shadow-inner flex items-center gap-2">
        <ShieldCheck size={12} /> VERIFIED
      </Badge>
    </section>
  );
}

export default function DicePage() {
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [betAmount, setBetAmount] = useState("10");
  const [targetValue, setTargetValue] = useState(50.5);
  const [isRollOver, setIsRollOver] = useState(true);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'won' | 'lost'>('idle');
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) {
      const parsed = JSON.parse(session);
      const unsub = onSnapshot(doc(db, "users", parsed.id), (snap) => {
        if (snap.exists()) setDbUser({ ...snap.data(), id: snap.id });
      });
      return () => unsub();
    }
  }, [db]);

  const winChance = useMemo(() => isRollOver ? 100 - targetValue : targetValue, [targetValue, isRollOver]);
  const multiplier = useMemo(() => winChance <= 0 ? 0 : (98 / winChance), [winChance]);

  const handleRoll = async () => {
    if (!dbUser || loading) return;
    const amt = Number(betAmount);
    if (amt > dbUser.totalBalance || amt < 1) return;

    setLoading(true);
    setShowIntro(true);
    
    // محاكاة "انترو" ترحيبي قبل النتيجة
    setTimeout(async () => {
      setShowIntro(false);
      setGameState('idle');
      try {
        await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amt) });
        
        // حوكمة مالية: 75% فوز للمنصة
        const isUserAllowedToWin = Math.random() < 0.25;
        
        let result: number;
        if (isUserAllowedToWin) {
          result = Math.floor(Math.random() * 10001) / 100;
        } else {
          if (isRollOver) result = Math.random() * targetValue;
          else result = targetValue + (Math.random() * (100 - targetValue));
        }

        setLastResult(result);
        const hasWon = isRollOver ? result > targetValue : result < targetValue;

        if (hasWon) {
          const winAmt = amt * multiplier;
          await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(winAmt), totalProfits: increment(winAmt - amt) });
          setGameState('won');
        } else {
          setGameState('lost');
        }

        await addDoc(collection(db, "game_history"), {
          userId: dbUser.id, game: "dice", betAmount: amt, multiplier: hasWon ? multiplier : 0,
          resultValue: result, targetValue, mode: isRollOver ? 'over' : 'under', createdAt: new Date().toISOString(),
          isHouseWin: !hasWon
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col h-screen bg-[#fcfdfe] font-body text-right overflow-hidden" dir="rtl">
        
        <DiceHeader balance={dbUser?.totalBalance} onOpenDeposit={() => setDepositOpen(true)} />

        <div className="flex-1 overflow-y-auto pb-32">
          <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
            <DiceReactor 
              lastResult={lastResult}
              gameState={gameState}
              isRollOver={isRollOver}
              targetValue={targetValue}
              setTargetValue={setTargetValue}
              setIsRollOver={setIsRollOver}
            />

            <BettingPanel 
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              loading={loading}
              dbUser={dbUser}
              handleRoll={handleRoll}
              multiplier={multiplier}
              winChance={winChance}
            />

            <DiceDetails />
          </div>
        </div>

        <AnimatePresence>
          {showIntro && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[100] bg-[#002d4d]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
            >
               <motion.div 
                 animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                 className="h-32 w-32 rounded-[40px] bg-white/10 flex items-center justify-center border border-white/20 shadow-2xl"
               >
                  <Dices size={64} className="text-[#f9a885]" />
               </motion.div>
               <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-white">جاري معايرة الاحتمالات...</h2>
                  <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.4em] animate-pulse">Analyzing Nexus Matrix</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
      </div>
    </Shell>
  );
}
