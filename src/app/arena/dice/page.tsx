
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
  ChevronUp,
  Activity,
  Minus,
  RotateCcw,
  ChevronDown
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DepositSheet } from "@/components/deposit/DepositSheet";

/**
 * 1. الافتتاحية السينمائية (Sovereign Intro)
 */
function SovereignIntro({ onComplete, Icon, title }: { onComplete: () => void, Icon: any, title: string }) {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#002d4d] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: 180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="relative z-10 h-24 w-24 rounded-[32px] bg-white/10 flex items-center justify-center backdrop-blur-3xl border border-white/20 shadow-2xl"
        >
          <Icon size={40} className="text-[#f9a885]" />
        </motion.div>
        
        {/* رادار نيون دوار */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-20px] border border-[#f9a885]/20 border-dashed rounded-full"
        />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-8 text-center space-y-2"
      >
        <h2 className="text-sm font-black text-white tracking-[0.4em] uppercase">{title}</h2>
        <p className="text-[7px] font-black text-blue-200/40 uppercase tracking-widest">Predicting Nexus Matrix</p>
      </motion.div>

      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "120px" }}
        transition={{ delay: 1, duration: 1.5 }}
        onAnimationComplete={() => setTimeout(onComplete, 500)}
        className="mt-10 h-[1.5px] bg-gradient-to-r from-transparent via-[#f9a885] to-transparent"
      />
    </motion.div>
  );
}

/**
 * 2. شريط التحكم العلوي
 */
function DiceHeader({ balance, onOpenDeposit }: { balance: number, onOpenDeposit: () => void }) {
  return (
    <header className="px-6 py-3 flex items-center justify-between border-b border-gray-50 bg-white/80 backdrop-blur-md z-50 shrink-0 sticky top-0 font-body">
      <div className="flex items-center gap-3">
         <Link href="/arena">
           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-gray-50 text-[#002d4d] active:scale-90 transition-all hover:bg-[#002d4d] hover:text-white">
             <ChevronRight className="h-5 w-5" />
           </Button>
         </Link>
         <div className="text-right">
            <h1 className="text-xs font-black text-[#002d4d] leading-none">نكسوس الاحتمالات</h1>
            <p className="text-[7px] font-bold text-blue-500 uppercase tracking-widest mt-1">Logic Hub</p>
         </div>
      </div>
      <div className="flex items-center gap-2 bg-gray-50/80 px-2.5 py-1 rounded-full border border-gray-100 shadow-inner">
         <div className="text-right">
            <p className="text-[6px] font-black text-gray-400 uppercase leading-none">Balance</p>
            <p className="text-[11px] font-black text-[#002d4d] tabular-nums mt-0.5">${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
         </div>
         <button onClick={onOpenDeposit} className="h-7 w-7 rounded-lg bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all mr-1">
            <Plus size={14} />
         </button>
      </div>
    </header>
  );
}

/**
 * 3. مفاعل التنبؤ (The Reactor)
 */
function DiceReactor({ lastResult, gameState, isRollOver, targetValue, setTargetValue, setIsRollOver }: any) {
  return (
    <section className="relative w-full max-w-[300px] mx-auto bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm overflow-hidden group">
      <AnimatePresence>
        {lastResult !== null && (
          <motion.div initial={{ scale: 0.5, y: -20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
            <div className={cn(
              "px-8 py-3 rounded-2xl font-black text-2xl shadow-2xl border-2 border-white tabular-nums tracking-tighter", 
              gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {lastResult.toFixed(2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-10 pt-10">
        <div className="relative pt-10">
          {/* مسار الاحتمالات */}
          <div className="h-3 w-full bg-gray-100 rounded-full relative overflow-hidden shadow-inner">
            <motion.div animate={{ left: isRollOver ? '0%' : `${targetValue}%`, right: isRollOver ? `${100 - targetValue}%` : '0%' }} className="absolute top-0 bottom-0 bg-red-500/80 transition-all duration-700" />
            <motion.div animate={{ left: isRollOver ? `${targetValue}%` : '0%', right: isRollOver ? '0%' : `${100 - targetValue}%` }} className="absolute top-0 bottom-0 bg-emerald-500/80 transition-all duration-700" />
          </div>

          <div className="relative mt-2">
             <Slider value={[targetValue]} onValueChange={([val]) => setTargetValue(val)} max={98} min={2} step={0.01} className="relative z-20 h-6" />
             
             {/* المؤشر الرقمي الطائر */}
             <motion.div 
               className="absolute top-[-45px] flex flex-col items-center pointer-events-none" 
               style={{ left: `${targetValue}%`, transform: 'translateX(-50%)' }}
               animate={{ left: `${targetValue}%` }}
             >
                <div className="bg-[#002d4d] text-[#f9a885] px-3 py-1 rounded-xl text-[10px] font-black shadow-2xl flex items-center gap-1 border border-white/10 tabular-nums tracking-tighter">
                   {targetValue.toFixed(2)}
                </div>
                <ChevronDown className="text-[#002d4d] h-4 w-4 mt-[-6px]" fill="currentColor" />
             </motion.div>
          </div>

          <div className="flex justify-between items-center mt-6 font-black text-[8px] text-gray-300 uppercase tracking-[0.2em]">
            <span className="tabular-nums">0.00</span>
            <span className="opacity-30 tabular-nums">50.00</span>
            <span className="tabular-nums">100.00</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
            <button onClick={() => setIsRollOver(true)} className={cn("px-6 h-9 rounded-xl font-black text-[10px] transition-all", isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-xl" : "text-gray-400")}>فوق (Over)</button>
            <button onClick={() => setIsRollOver(false)} className={cn("px-6 h-9 rounded-xl font-black text-[10px] transition-all", !isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-xl" : "text-gray-400")}>تحت (Under)</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 4. لوحة الرهان
 */
function BettingPanel({ betAmount, setBetAmount, loading, dbUser, handleRoll, multiplier, winChance, gameState, setGameState }: any) {
  return (
    <section className="space-y-3 max-w-[300px] mx-auto font-body">
      <Card className="border-none shadow-sm rounded-[32px] bg-white border border-gray-50">
        <CardContent className="p-5 space-y-5">
          <div className="space-y-2 text-right">
            <Label className="text-[8px] font-black text-gray-400 uppercase pr-2 tracking-widest">قيمة المحاولة ($)</Label>
            <div className="relative">
              <Input type="number" value={betAmount} onChange={e => setBetAmount(e.target.value)} className="h-11 rounded-xl bg-gray-50 border-none font-black text-center text-lg text-[#002d4d] shadow-inner" />
              <Coins className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-gray-50 rounded-2xl text-center space-y-1 shadow-inner border border-gray-100">
              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">المضاعف</p>
              <p className="text-sm font-black text-[#002d4d] tabular-nums tracking-tighter">x{multiplier.toFixed(4)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-center space-y-1 shadow-inner border border-gray-100">
              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">فرصة النجاح</p>
              <p className="text-sm font-black text-emerald-600 tabular-nums tracking-tighter">%{winChance.toFixed(2)}</p>
            </div>
          </div>

          <Button onClick={handleRoll} disabled={loading || !dbUser || Number(betAmount) > (dbUser?.totalBalance || 0)} className="w-full h-12 rounded-2xl bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-xl active:scale-[0.98] transition-all group">
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : (
              <div className="flex items-center gap-2">
                <span>بدء الجولة</span>
                <Dices className="h-4 w-4 text-[#f9a885]" />
              </div>
            )}
          </Button>
          {(gameState === 'won' || gameState === 'lost') && (
            <button onClick={() => setGameState('idle')} className="w-full text-[8px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] flex items-center justify-center gap-2 transition-all py-1">
              <RotateCcw className="h-3 w-3" /> محاولة جديدة
            </button>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

/**
 * 5. تفاصيل الساحة
 */
function DiceDetails() {
  return (
    <section className="p-5 max-w-[300px] mx-auto bg-white rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between font-body">
      <div className="text-right space-y-0.5">
        <h4 className="font-black text-[10px] text-[#002d4d]">نظام النزاهة الرقمية</h4>
        <p className="text-[8px] font-bold text-gray-400 leading-relaxed">تخضع الاحتمالات لمعايرة تضمن استدامة السيولة بنسبة فوز 25%.</p>
      </div>
      <ShieldCheck size={20} className="text-emerald-500 opacity-20" />
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
  const [showIntro, setShowIntro] = useState(true);
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
    setGameState('idle');
    try {
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amt) });
      
      // HOUSE EDGE: 75% Chance to force a loss
      const forceLose = Math.random() < 0.75;
      let result: number;
      
      if (!forceLose) {
        // Honest roll (25% chance)
        result = Math.random() * 100;
      } else {
        // Forced loss roll
        if (isRollOver) {
          result = Math.random() * targetValue; // Force Under
        } else {
          result = targetValue + (Math.random() * (100 - targetValue)); // Force Over
        }
      }
      
      setLastResult(result);
      const hasWon = isRollOver ? result > targetValue : result < targetValue;
      
      if (hasWon) {
        const winAmt = amt * multiplier;
        await updateDoc(doc(db, "users", dbUser.id), { 
          totalBalance: increment(winAmt), 
          totalProfits: increment(winAmt - amt) 
        });
        setGameState('won');
      } else {
        setGameState('lost');
      }
      
      await addDoc(collection(db, "game_history"), {
        userId: dbUser.id, game: "dice", betAmount: amt, resultValue: result, targetValue, mode: isRollOver ? 'over' : 'under', createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell hideMobileNav>
      <AnimatePresence>
        {showIntro && <SovereignIntro onComplete={() => setShowIntro(false)} title="Nexus Dice" Icon={Dices} />}
      </AnimatePresence>
      {!showIntro && (
        <div className="flex flex-col h-screen bg-[#fcfdfe] font-body text-right overflow-hidden" dir="rtl">
          <DiceHeader balance={dbUser?.totalBalance} onOpenDeposit={() => setDepositOpen(true)} />
          <div className="flex-1 overflow-y-auto pb-32">
            <div className="max-w-xl mx-auto px-6 py-6 space-y-8">
              <DiceReactor lastResult={lastResult} gameState={gameState} isRollOver={isRollOver} targetValue={targetValue} setTargetValue={setTargetValue} setIsRollOver={setIsRollOver} />
              <BettingPanel betAmount={betAmount} setBetAmount={setBetAmount} loading={loading} dbUser={dbUser} handleRoll={handleRoll} multiplier={multiplier} winChance={winChance} gameState={gameState} setGameState={setGameState} />
              <DiceDetails />
            </div>
          </div>
          <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
        </div>
      )}
    </Shell>
  );
}
