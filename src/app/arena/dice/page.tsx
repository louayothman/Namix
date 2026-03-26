
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
  Plus,
  Loader2,
  RotateCcw,
  ChevronDown,
  Coins,
  Sparkles
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DepositSheet } from "@/components/deposit/DepositSheet";

/**
 * 1. الافتتاحية السينمائية (Sovereign Drawing Intro)
 */
function SovereignIntro({ onComplete, title }: { onComplete: () => void, title: string }) {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#002d4d] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative flex flex-col items-center gap-8">
        <svg width="120" height="120" viewBox="0 0 100 100" className="relative z-10">
          {/* رسم الأيقونة (نرد مبسط) */}
          <motion.path
            d="M30 30 L70 30 L70 70 L30 70 Z M50 30 L50 70 M30 50 L70 50"
            fill="none"
            stroke="#f9a885"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {/* رسم الإطار الدائري */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="2 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ delay: 1.5, duration: 1 }}
          />
          
          {/* تفاعل الأيقونة بعد الرسم */}
          <motion.g
            initial={{ scale: 1, filter: "brightness(1)" }}
            animate={{ 
              scale: [1, 1.15, 1.1],
              filter: ["brightness(1)", "brightness(1.5)", "brightness(1.2)"]
            }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
             <Dices className="text-[#f9a885] x-50 y-50" style={{ x: 25, y: 25, width: 50, height: 50 }} />
          </motion.g>

          {/* نجمة اللمعان */}
          <motion.path
            d="M50 15 L52 22 L58 24 L52 26 L50 33 L48 26 L42 24 L48 22 Z"
            fill="#f9a885"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
            transition={{ delay: 3, duration: 0.5 }}
          />
        </svg>

        {/* رسم اسم اللعبة */}
        <div className="relative h-8 flex items-center justify-center">
           <motion.span
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 3.5, duration: 0.8 }}
             className="text-white font-black text-sm tracking-[0.3em] uppercase"
           >
             {title}
           </motion.span>
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: "100%" }}
             transition={{ delay: 3.5, duration: 1 }}
             className="absolute bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#f9a885] to-transparent"
           />
        </div>
      </div>

      {/* شعار المنصة في الأسفل */}
      <div className="absolute bottom-12 flex items-center gap-3 opacity-20">
         <div className="grid grid-cols-2 gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
         </div>
         <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase">Namix</span>
      </div>

      {/* التوجيه النهائي */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5 }}
        onAnimationComplete={() => setTimeout(onComplete, 500)}
      />
    </motion.div>
  );
}

/**
 * 2. شريط التحكم العلوي (Sovereign Header)
 */
function DiceHeader({ balance, onOpenDeposit }: { balance: number, onOpenDeposit: () => void }) {
  return (
    <header className="px-6 py-3 flex items-center justify-between border-b border-gray-50 bg-white/80 backdrop-blur-md z-50 shrink-0 sticky top-0 font-body">
      <div className="flex items-center gap-3">
         <Link href="/arena">
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl bg-gray-50 text-[#002d4d] active:scale-90 transition-all">
             <ChevronRight className="h-4 w-4" />
           </Button>
         </Link>
         <div className="text-right">
            <h1 className="text-[11px] font-black text-[#002d4d] leading-none uppercase">نكسوس الاحتمالات</h1>
            <p className="text-[7px] font-bold text-blue-500 uppercase tracking-widest mt-1">Logic Center</p>
         </div>
      </div>
      <div className="flex items-center gap-2 bg-gray-50/80 px-2 py-1 rounded-full border border-gray-100 shadow-inner">
         <div className="text-right pr-1">
            <p className="text-[6px] font-black text-gray-400 uppercase leading-none">Liquidity</p>
            <p className="text-[10px] font-black text-[#002d4d] tabular-nums mt-0.5">${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
         </div>
         <button onClick={onOpenDeposit} className="h-6 w-6 rounded-lg bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all">
            <Plus size={12} />
         </button>
      </div>
    </header>
  );
}

/**
 * 3. مفاعل اللعبة (The Reactor)
 */
function DiceReactor({ lastResult, gameState, isRollOver, targetValue, setTargetValue, setIsRollOver }: any) {
  return (
    <section className="relative w-full max-w-[280px] mx-auto bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden group">
      <AnimatePresence>
        {lastResult !== null && (
          <motion.div initial={{ scale: 0.5, y: -10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
            <div className={cn(
              "px-6 py-2 rounded-xl font-black text-xl shadow-2xl border-2 border-white tabular-nums tracking-tighter", 
              gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {lastResult.toFixed(2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8 pt-8">
        <div className="relative pt-8">
          {/* مسار الاحتمالات المعكوس */}
          <div className="h-2 w-full bg-gray-100 rounded-full relative overflow-hidden shadow-inner">
            <motion.div animate={{ left: isRollOver ? `${targetValue}%` : '0%', right: isRollOver ? '0%' : `${100 - targetValue}%` }} className="absolute top-0 bottom-0 bg-emerald-500/80 transition-all duration-700" />
            <motion.div animate={{ left: isRollOver ? '0%' : `${targetValue}%`, right: isRollOver ? `${100 - targetValue}%` : '0%' }} className="absolute top-0 bottom-0 bg-red-500/80 transition-all duration-700" />
          </div>

          <div className="relative mt-2">
             <Slider value={[targetValue]} onValueChange={([val]) => setTargetValue(val)} max={98} min={2} step={0.01} className="relative z-20 h-4" />
             
             {/* المؤشر الرقمي الطائر */}
             <motion.div 
               className="absolute top-[-35px] flex flex-col items-center pointer-events-none" 
               style={{ left: `${targetValue}%`, transform: 'translateX(-50%)' }}
               animate={{ left: `${targetValue}%` }}
             >
                <div className="bg-[#002d4d] text-[#f9a885] px-2 py-0.5 rounded-lg text-[9px] font-black shadow-2xl flex items-center gap-1 border border-white/10 tabular-nums tracking-tighter">
                   {targetValue.toFixed(2)}
                </div>
                <ChevronDown className="text-[#002d4d] h-3 w-3 mt-[-4px]" fill="currentColor" />
             </motion.div>
          </div>

          <div className="flex justify-between items-center mt-4 font-black text-[7px] text-gray-300 uppercase tracking-widest">
            <span className="tabular-nums">0.00</span>
            <span className="opacity-30 tabular-nums">50.00</span>
            <span className="tabular-nums">100.00</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
            <button onClick={() => setIsRollOver(true)} className={cn("px-4 h-7 rounded-lg font-black text-[9px] transition-all", isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400")}>Over</button>
            <button onClick={() => setIsRollOver(false)} className={cn("px-4 h-7 rounded-lg font-black text-[9px] transition-all", !isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400")}>Under</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 4. لوحة الرهان (Betting Panel)
 */
function BettingPanel({ betAmount, setBetAmount, loading, dbUser, handleRoll, multiplier, winChance }: any) {
  return (
    <section className="space-y-3 max-w-[280px] mx-auto font-body">
      <Card className="border-none shadow-sm rounded-2xl bg-white border border-gray-50">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-1.5 text-right">
            <Label className="text-[8px] font-black text-gray-400 uppercase pr-2 tracking-widest">المبلغ ($)</Label>
            <div className="relative">
              <Input type="number" value={betAmount} onChange={e => setBetAmount(e.target.value)} className="h-9 rounded-xl bg-gray-50 border-none font-black text-center text-xs text-[#002d4d] shadow-inner" />
              <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 rounded-xl text-center space-y-0.5 shadow-inner">
              <p className="text-[6px] font-black text-gray-400 uppercase">المضاعف</p>
              <p className="text-xs font-black text-[#002d4d] tabular-nums">x{multiplier.toFixed(4)}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-xl text-center space-y-0.5 shadow-inner">
              <p className="text-[6px] font-black text-gray-400 uppercase">الاحتمال</p>
              <p className="text-xs font-black text-emerald-600 tabular-nums">%{winChance.toFixed(2)}</p>
            </div>
          </div>

          <Button onClick={handleRoll} disabled={loading || !dbUser || Number(betAmount) > (dbUser?.totalBalance || 0)} className="w-full h-10 rounded-xl bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[10px] shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : (
              <>
                <span>بدء المحاولة</span>
                <Zap size={12} className="text-[#f9a885] fill-current" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

/**
 * 5. تفاصيل الساحة (Arena Details)
 */
function DiceDetails() {
  return (
    <section className="p-4 max-w-[280px] mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between font-body">
      <div className="text-right space-y-0.5">
        <h4 className="font-black text-[9px] text-[#002d4d]">نظام المعايرة الرقمية</h4>
        <p className="text-[7px] font-bold text-gray-400 leading-relaxed">تخضع الاحتمالات لمراجعة آلية تضمن استقرار السيولة.</p>
      </div>
      <ShieldCheck size={16} className="text-emerald-500 opacity-30" />
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
        result = Math.random() * 100;
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
        {showIntro && <SovereignIntro onComplete={() => setShowIntro(false)} title="Nexus Dice" />}
      </AnimatePresence>
      {!showIntro && (
        <div className="flex flex-col h-screen bg-[#fcfdfe] font-body text-right overflow-hidden" dir="rtl">
          <DiceHeader balance={dbUser?.totalBalance} onOpenDeposit={() => setDepositOpen(true)} />
          <div className="flex-1 overflow-y-auto pb-24">
            <div className="max-w-xl mx-auto px-6 py-6 space-y-6">
              <DiceReactor lastResult={lastResult} gameState={gameState} isRollOver={isRollOver} targetValue={targetValue} setTargetValue={setTargetValue} setIsRollOver={setIsRollOver} />
              <BettingPanel betAmount={betAmount} setBetAmount={setBetAmount} loading={loading} dbUser={dbUser} handleRoll={handleRoll} multiplier={multiplier} winChance={winChance} />
              <DiceDetails />
            </div>
          </div>
          <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
        </div>
      )}
    </Shell>
  );
}
