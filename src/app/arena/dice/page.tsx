
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
 * 1. محرك الرسم الضوئي (Light-Streak Intro)
 */
function LightStreakIntro({ onComplete, gameName, Icon }: { onComplete: () => void, gameName: string, Icon: any }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.div
        initial={{ y: "100vh", height: 0, opacity: 0 }}
        animate={{ 
          y: ["100vh", "45vh", "45vh", "55vh", "100vh"],
          height: [0, 40, 40, 40, 0],
          opacity: [0, 1, 1, 1, 0]
        }}
        transition={{ duration: 4.5, times: [0, 0.3, 0.7, 0.8, 1], ease: "easeInOut" }}
        className="w-[1px] bg-[#002d4d] absolute left-1/2 -translate-x-1/2 z-50 shadow-[0_0_15px_#002d4d]"
      />

      <div className="relative flex flex-col items-center gap-8">
        <div className="relative h-20 w-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0, 1, 1], scale: [0.8, 0.8, 1.1, 1] }}
            transition={{ duration: 4.5, times: [0, 0.35, 0.45, 0.55] }}
            className="text-[#002d4d] relative z-10"
          >
            <Icon size={32} strokeWidth={1.5} />
          </motion.div>

          <svg className="absolute inset-0 h-20 w-20 rotate-[-90deg]">
            <motion.circle
              cx="40"
              cy="40"
              r="38"
              stroke="#002d4d"
              strokeWidth="0.5"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 0, 1, 1] }}
              transition={{ duration: 4.5, times: [0, 0.4, 0.6, 1], ease: "easeInOut" }}
            />
          </svg>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0, 0.2, 0], scale: [0.5, 0.5, 2, 2.5] }}
            transition={{ duration: 4.5, times: [0, 0.6, 0.65, 0.8] }}
            className="absolute inset-0 bg-[#002d4d] rounded-full blur-xl"
          />
        </div>

        <div className="relative h-6 overflow-hidden">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 0, 1, 1], y: [10, 10, 0, 0] }}
            transition={{ duration: 4.5, times: [0, 0.7, 0.8, 1] }}
            className="text-[11px] font-black text-[#002d4d] tracking-[0.4em] uppercase"
          >
            {gameName}
          </motion.h2>
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: ["-100%", "-100%", "100%", "100%"] }}
            transition={{ duration: 4.5, times: [0, 0.8, 0.95, 1] }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-20deg]"
          />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 2. شريط التحكم العلوي الرشيق
 */
function DiceHeader({ balance, onOpenDeposit }: { balance: number, onOpenDeposit: () => void }) {
  return (
    <header className="px-6 py-3 flex items-center justify-between border-b border-gray-50 bg-white/80 backdrop-blur-md z-50 shrink-0 sticky top-0">
      <div className="flex items-center gap-3">
         <Link href="/arena">
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-gray-50 text-[#002d4d] active:scale-90 transition-all hover:bg-[#002d4d] hover:text-white">
             <ChevronRight className="h-4 w-4" />
           </Button>
         </Link>
         <div className="space-y-0 text-right">
            <h1 className="text-[11px] font-black text-[#002d4d] leading-none">نكسوس الاحتمالات</h1>
            <p className="text-[6px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">Nexus Logic Engine</p>
         </div>
      </div>
      <div className="flex items-center gap-2 bg-gray-50/50 px-2 py-0.5 rounded-full border border-gray-100">
         <div className="text-right">
            <p className="text-[5px] font-black text-gray-400 uppercase leading-none">Balance</p>
            <p className="text-[10px] font-black text-[#002d4d] tabular-nums mt-0.5">${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
         </div>
         <button onClick={onOpenDeposit} className="h-6 w-6 rounded-md bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all mr-1">
            <Plus size={12} />
         </button>
      </div>
    </header>
  );
}

/**
 * 3. مفاعل النبض الرقمي (The Reactor) - نكسوس للاحتمالات
 */
function DiceReactor({ lastResult, gameState, isRollOver, targetValue, setTargetValue, setIsRollOver }: any) {
  return (
    <section className="relative w-full max-w-[300px] mx-auto bg-white rounded-2xl p-6 border border-gray-50 shadow-sm overflow-hidden group">
      <AnimatePresence>
        {lastResult !== null && (
          <motion.div initial={{ scale: 0.5, y: -10 }} animate={{ scale: 1, y: 0 }} className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
            <div className={cn("px-6 py-2 rounded-xl font-black text-xl shadow-xl border-2 border-white", gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white")}>
              {lastResult.toFixed(2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8 pt-6">
        <div className="relative pt-6">
          <div className="h-2 w-full bg-gray-100 rounded-full relative overflow-hidden shadow-inner">
            <motion.div animate={{ left: isRollOver ? '0%' : `${targetValue}%`, right: isRollOver ? `${100 - targetValue}%` : '0%' }} className="absolute top-0 bottom-0 bg-red-500/80 transition-all duration-700" />
            <motion.div animate={{ left: isRollOver ? `${targetValue}%` : '0%', right: isRollOver ? '0%' : `${100 - targetValue}%` }} className="absolute top-0 bottom-0 bg-emerald-500/80 transition-all duration-700" />
          </div>

          <div className="relative mt-1">
             <Slider value={[targetValue]} onValueChange={([val]) => setTargetValue(val)} max={98} min={2} step={0.01} className="relative z-20 h-4" />
             
             {/* السهم الرقمي الطائر */}
             <motion.div 
               className="absolute top-[-35px] flex flex-col items-center pointer-events-none" 
               style={{ left: `${targetValue}%`, transform: 'translateX(-50%)' }}
               animate={{ left: `${targetValue}%` }}
             >
                <div className="bg-[#002d4d] text-[#f9a885] px-2 py-0.5 rounded-lg text-[8px] font-black shadow-lg flex items-center gap-1 border border-white/10">
                   <Sparkles size={6} /> {targetValue.toFixed(2)}
                </div>
                <ChevronDown className="text-[#002d4d] h-3 w-3 mt-[-4px]" fill="currentColor" />
             </motion.div>
          </div>

          <div className="flex justify-between items-center mt-4 font-black text-[6px] text-gray-300 uppercase tracking-widest">
            <span>0.00</span><span className="opacity-30">50.00</span><span>100.00</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
            <button onClick={() => setIsRollOver(true)} className={cn("px-4 h-7 rounded-lg font-black text-[8px] transition-all", isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400")}>توقع فوق (Over)</button>
            <button onClick={() => setIsRollOver(false)} className={cn("px-4 h-7 rounded-lg font-black text-[8px] transition-all", !isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400")}>توقع تحت (Under)</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 4. لوحة الرهان الرشيقة
 */
function BettingPanel({ betAmount, setBetAmount, loading, dbUser, handleRoll, multiplier, winChance, gameState, setGameState }: any) {
  return (
    <section className="space-y-3 max-w-[300px] mx-auto">
      <Card className="border-none shadow-sm rounded-2xl bg-white border border-gray-50">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[7px] font-black text-gray-400 uppercase pr-2 tracking-widest">قيمة المحاولة ($)</Label>
            <div className="relative">
              <Input type="number" value={betAmount} onChange={e => setBetAmount(e.target.value)} className="h-10 rounded-lg bg-gray-50 border-none font-black text-center text-lg text-[#002d4d] shadow-inner" />
              <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-gray-50 rounded-xl text-center space-y-0.5">
              <p className="text-[6px] font-black text-gray-400 uppercase">المضاعف</p>
              <p className="text-sm font-black text-[#002d4d]">x{multiplier.toFixed(4)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl text-center space-y-0.5">
              <p className="text-[6px] font-black text-gray-400 uppercase">فرصة النجاح</p>
              <p className="text-sm font-black text-emerald-600">%{winChance.toFixed(2)}</p>
            </div>
          </div>

          <Button onClick={handleRoll} disabled={loading || !dbUser || Number(betAmount) > (dbUser?.totalBalance || 0)} className="w-full h-12 rounded-xl bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-xl active:scale-[0.98] transition-all group">
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : (
              <div className="flex items-center gap-2">
                <span>بدء الجولة</span>
                <Dices className="h-4 w-4 text-[#f9a885]" />
              </div>
            )}
          </Button>
          {(gameState === 'won' || gameState === 'lost') && (
            <button onClick={() => setGameState('idle')} className="w-full text-[7px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] flex items-center justify-center gap-2 transition-all">
              <RotateCcw className="h-2.5 w-2.5" /> محاولة جديدة
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
    <section className="p-4 max-w-[300px] mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div className="text-right space-y-0.5">
        <h4 className="font-black text-[9px] text-[#002d4d]">نظام النزاهة الرقمية</h4>
        <p className="text-[7px] font-bold text-gray-400 leading-relaxed">تخضع الاحتمالات لمعايرة تضمن استدامة السيولة بنسبة 25% فوز.</p>
      </div>
      <ShieldCheck size={16} className="text-emerald-500 opacity-40" />
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
      const forceLose = Math.random() < 0.75;
      let result: number;
      if (!forceLose) {
        if (isRollOver) result = targetValue + (Math.random() * (100 - targetValue));
        else result = Math.random() * targetValue;
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
      } else setGameState('lost');
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
        {showIntro && <LightStreakIntro onComplete={() => setShowIntro(false)} gameName="Nexus Dice" Icon={Dices} />}
      </AnimatePresence>
      {!showIntro && (
        <div className="flex flex-col h-screen bg-[#fcfdfe] font-body text-right overflow-hidden" dir="rtl">
          <DiceHeader balance={dbUser?.totalBalance} onOpenDeposit={() => setDepositOpen(true)} />
          <div className="flex-1 overflow-y-auto pb-32">
            <div className="max-w-xl mx-auto px-6 py-6 space-y-6">
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
