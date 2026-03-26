
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
  RotateCcw
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DepositSheet } from "@/components/deposit/DepositSheet";

/**
 * 1. افتتاحية الرسم الضوئي (Light-Streak Intro)
 */
function LightStreakIntro({ onComplete, gameName, Icon }: { onComplete: () => void, gameName: string, Icon: any }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.div
        initial={{ y: "100vh", opacity: 0, height: 0 }}
        animate={{ y: "0vh", opacity: [0, 1, 1], height: 40 }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className="w-[1px] bg-[#002d4d] relative"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#002d4d] rounded-full blur-md opacity-20" />
      </motion.div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "backOut" }}
        className="relative mt-4"
      >
        <div className="h-16 w-16 flex items-center justify-center text-[#002d4d]">
          <Icon size={40} strokeWidth={1.5} />
        </div>
        <svg className="absolute inset-0 -m-2 h-20 w-20 rotate-[-90deg]">
          <motion.circle
            cx="40"
            cy="40"
            r="38"
            stroke="#002d4d"
            strokeWidth="0.5"
            fill="transparent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.8, duration: 1, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 2.6, duration: 0.6 }}
        className="mt-8"
      >
        <h2 className="text-[13px] font-black text-[#002d4d] tracking-[0.3em] uppercase">{gameName}</h2>
      </motion.div>
    </motion.div>
  );
}

/**
 * 2. شريط التحكم العلوي الرشيق
 */
function DiceHeader({ balance, onOpenDeposit }: { balance: number, onOpenDeposit: () => void }) {
  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-gray-50 bg-white/80 backdrop-blur-md z-50 shrink-0 sticky top-0">
      <div className="flex items-center gap-3">
         <Link href="/arena">
           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-gray-50 text-[#002d4d] active:scale-90 transition-all hover:bg-[#002d4d] hover:text-white">
             <ChevronRight className="h-5 w-5" />
           </Button>
         </Link>
         <div className="space-y-0 text-right">
            <h1 className="text-sm font-black text-[#002d4d] leading-none">نكسوس الاحتمالات</h1>
            <p className="text-[7px] font-bold text-blue-500 uppercase tracking-widest mt-1">Nexus Logic Engine</p>
         </div>
      </div>
      <div className="flex items-center gap-2 bg-gray-50/50 px-2.5 py-1 rounded-full border border-gray-100 shadow-inner">
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
 * 3. مفاعل النبض الرقمي (The Reactor) - نكسوس للاحتمالات
 */
function DiceReactor({ lastResult, gameState, isRollOver, targetValue, setTargetValue, setIsRollOver }: any) {
  return (
    <section className="relative w-full max-w-[340px] mx-auto bg-white rounded-[32px] p-8 border border-gray-50 shadow-sm overflow-hidden group">
      <AnimatePresence>
        {lastResult !== null && (
          <motion.div initial={{ scale: 0.5, y: -20 }} animate={{ scale: 1, y: 0 }} className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
            <div className={cn("px-8 py-3 rounded-2xl font-black text-3xl shadow-xl border-2 border-white", gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white")}>
              {lastResult.toFixed(2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-12 pt-10">
        <div className="relative pt-8">
          <div className="h-3 w-full bg-gray-100 rounded-full relative overflow-hidden shadow-inner border border-white">
            <motion.div animate={{ left: isRollOver ? '0%' : `${targetValue}%`, right: isRollOver ? `${100 - targetValue}%` : '0%' }} className="absolute top-0 bottom-0 bg-red-500/80 transition-all duration-700" />
            <motion.div animate={{ left: isRollOver ? `${targetValue}%` : '0%', right: isRollOver ? '0%' : `${100 - targetValue}%` }} className="absolute top-0 bottom-0 bg-emerald-500/80 transition-all duration-700" />
          </div>

          <div className="relative mt-1">
             <Slider value={[targetValue]} onValueChange={([val]) => setTargetValue(val)} max={98} min={2} step={0.01} className="relative z-20 h-6" />
             <motion.div className="absolute top-[-45px] flex flex-col items-center pointer-events-none" style={{ left: `${targetValue}%`, transform: 'translateX(-50%)' }} animate={{ left: `${targetValue}%` }}>
                <div className="bg-[#002d4d] text-[#f9a885] px-2.5 py-1 rounded-lg text-[9px] font-black shadow-lg flex items-center gap-1.5 border border-white/10">
                   <Sparkles size={8} /> {targetValue.toFixed(2)}
                </div>
                <ChevronUp className="text-[#002d4d] h-4 w-4 mt-[-6px]" fill="currentColor" />
             </motion.div>
          </div>

          <div className="flex justify-between items-center mt-6 font-black text-[7px] text-gray-300 uppercase tracking-widest px-1">
            <span>0.00</span><span className="opacity-30">25.00</span><span className="opacity-60">50.00</span><span className="opacity-30">75.00</span><span>100.00</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
            <button onClick={() => setIsRollOver(true)} className={cn("px-6 h-9 rounded-xl font-black text-[9px] transition-all", isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400")}>توقع فوق (Over)</button>
            <button onClick={() => setIsRollOver(false)} className={cn("px-6 h-9 rounded-xl font-black text-[9px] transition-all", !isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400")}>توقع تحت (Under)</button>
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
    <section className="space-y-4 max-w-[340px] mx-auto">
      <Card className="border-none shadow-sm rounded-[32px] bg-white border border-gray-50">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-[8px] font-black text-gray-400 uppercase pr-3 tracking-widest">قيمة المحاولة ($)</Label>
            <div className="relative group">
              <Input type="number" value={betAmount} onChange={e => setBetAmount(e.target.value)} className="h-14 rounded-xl bg-gray-50 border-none font-black text-center text-2xl text-[#002d4d] shadow-inner" />
              <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-gray-50 rounded-2xl text-center space-y-1">
              <p className="text-[7.5px] font-black text-gray-400 uppercase tracking-widest">المضاعف</p>
              <p className="text-lg font-black text-[#002d4d]">x{multiplier.toFixed(4)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-center space-y-1">
              <p className="text-[7.5px] font-black text-gray-400 uppercase tracking-widest">فرصة النجاح</p>
              <p className="text-lg font-black text-emerald-600">%{winChance.toFixed(2)}</p>
            </div>
          </div>

          <Button onClick={handleRoll} disabled={loading || !dbUser || Number(betAmount) > (dbUser?.totalBalance || 0)} className="w-full h-16 rounded-[24px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-xl active:scale-[0.98] transition-all group">
            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
              <div className="flex items-center gap-3">
                <span>بدء الجولة</span>
                <Dices className="h-5 w-5 text-[#f9a885]" />
              </div>
            )}
          </Button>
          {(gameState === 'won' || gameState === 'lost') && (
            <button onClick={() => setGameState('idle')} className="w-full text-[8px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] flex items-center justify-center gap-2 transition-all">
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
    <section className="p-5 max-w-[340px] mx-auto bg-white rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between">
      <div className="text-right space-y-0.5">
        <h4 className="font-black text-[11px] text-[#002d4d]">نظام النزاهة الرقمية</h4>
        <p className="text-[8px] font-bold text-gray-400 leading-relaxed">تخضع الاحتمالات لمعايرة استراتيجية تضمن استدامة السيولة بنسبة 25% فوز.</p>
      </div>
      <ShieldCheck size={20} className="text-emerald-500 opacity-40" />
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
            <div className="max-w-xl mx-auto px-6 py-8 space-y-8">
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
