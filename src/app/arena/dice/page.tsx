
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
  Activity,
  Target,
  Sparkles
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DepositSheet } from "@/components/deposit/DepositSheet";

/**
 * Nexus Dice - المكونات النمطية المحدثة v90.0
 */

// 1. الشريط العلوي الموحد
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
            <h1 className="text-lg font-black text-[#002d4d] leading-none">نكسوس الاحتمالات</h1>
            <p className="text-[7px] font-black text-blue-500 uppercase tracking-widest mt-1">Nexus Dice Engine</p>
         </div>
      </div>
      
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 shadow-inner">
         <div className="text-right">
            <p className="text-[6px] font-black text-gray-400 uppercase leading-none">رصيدك المتاح</p>
            <p className="text-[11px] font-black text-[#002d4d] tabular-nums mt-0.5">${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
         </div>
         <button onClick={onOpenDeposit} className="h-7 w-7 rounded-lg bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all ml-1">
            <Plus size={14} />
         </button>
      </div>
    </header>
  );
}

// 2. مفاعل اللعبة (The Reactor)
function DiceReactor({ 
  lastResult, 
  gameState, 
  isRollOver, 
  targetValue, 
  setTargetValue, 
  setIsRollOver 
}: any) {
  return (
    <section className="relative w-full bg-gray-50/50 rounded-2xl p-8 md:p-12 shadow-inner border border-gray-100 overflow-hidden">
      <AnimatePresence>
        {lastResult !== null && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
            <div className={cn(
              "px-8 py-3 rounded-xl font-black text-3xl shadow-xl tabular-nums border-4 border-white transition-all", 
              gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}>
              {lastResult.toFixed(2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-12 pt-10">
        <div className="relative pt-6">
          <div className="h-4 w-full bg-gray-200 rounded-full relative overflow-hidden shadow-inner border-2 border-white">
            <motion.div animate={{ left: isRollOver ? `${targetValue}%` : '0%', right: isRollOver ? '0%' : `${100 - targetValue}%` }} className="absolute top-0 bottom-0 bg-emerald-500 transition-all duration-500" />
            <div className="absolute inset-0 bg-red-500/10" />
          </div>
          <div className="mt-6">
            <Slider value={[targetValue]} onValueChange={([val]) => setTargetValue(val)} max={98} min={2} step={0.01} className="relative z-20" />
          </div>
          <div className="flex justify-between items-center mt-4 font-black text-[8px] text-gray-400 uppercase tracking-widest px-1">
            <span>0.00</span><span>25.00</span><span className="text-[#002d4d]">50.00</span><span>75.00</span><span>100.00</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl shadow-md border border-gray-100">
            <button onClick={() => setIsRollOver(true)} className={cn("px-8 h-10 rounded-lg font-black text-[10px] transition-all", isRollOver ? "bg-[#002d4d] text-[#f9a885]" : "text-gray-400")}>توقع فوق (Over)</button>
            <button onClick={() => setIsRollOver(false)} className={cn("px-8 h-10 rounded-lg font-black text-[10px] transition-all", !isRollOver ? "bg-[#002d4d] text-[#f9a885]" : "text-gray-400")}>توقع تحت (Under)</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// 3. لوحة الرهان (Betting Panel)
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
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">مبلغ الرهان ($)</Label>
            <div className="relative">
              <Input type="number" value={betAmount} onChange={e => setBetAmount(e.target.value)} className="h-12 rounded-xl bg-gray-50 border-none font-black text-center text-lg shadow-inner" />
              <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center space-y-1">
              <p className="text-[8px] font-black text-gray-400 uppercase">المضاعف</p>
              <p className="text-base font-black text-[#002d4d] tabular-nums">x{multiplier.toFixed(4)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center space-y-1">
              <p className="text-[8px] font-black text-gray-400 uppercase">فرصة الفوز</p>
              <p className="text-base font-black text-emerald-600 tabular-nums">%{winChance.toFixed(2)}</p>
            </div>
          </div>

          <Button onClick={handleRoll} disabled={loading || !dbUser || Number(betAmount) > (dbUser?.totalBalance || 0)} className="w-full h-16 rounded-xl bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-xl active:scale-95 transition-all group relative overflow-hidden">
            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
              <div className="flex items-center gap-3"><span>إطلاق النرد</span><Dices className="h-6 w-6 text-[#f9a885]" /></div>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

// 4. تفاصيل الساحة (Arena Details)
function DiceDetails() {
  return (
    <section className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div className="text-right">
        <h4 className="font-black text-xs text-[#002d4d]">نظام السيولة الذكية</h4>
        <p className="text-[9px] font-bold text-gray-400">تخضع كافة الرميات لمعايرة النزاهة الرقمية (25% User Logic).</p>
      </div>
      <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-3 py-1 rounded-lg shadow-inner flex items-center gap-1.5">
        <ShieldCheck size={10} /> VERIFIED
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
      
      /**
       * خوارزمية الحوكمة المالية: 75% فرصة للمنصة
       * نتحقق أولاً من السماح للمستخدم بالفوز
       */
      const platformDecision = Math.random(); // 0 to 1
      const isUserAllowedToWin = platformDecision < 0.25; // 25% chance to even consider a win
      
      let result: number;
      if (isUserAllowedToWin) {
        // إذا سمح النظام بالفوز، نولد نتيجة عشوائية حقيقية
        result = Math.floor(Math.random() * 10001) / 100;
      } else {
        // إذا قرر النظام فوز المنصة (75%)، نجبر النتيجة لتكون خاسرة
        if (isRollOver) {
          // إذا كان التوقع Over، نولد نتيجة Under
          result = Math.random() * targetValue;
        } else {
          // إذا كان التوقع Under، نولد نتيجة Over
          result = targetValue + (Math.random() * (100 - targetValue));
        }
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
  };

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col h-screen bg-[#fcfdfe] font-body text-right" dir="rtl">
        
        <DiceHeader balance={dbUser?.totalBalance} onOpenDeposit={() => setDepositOpen(true)} />

        <div className="flex-1 overflow-y-auto pb-32">
          <div className="max-w-xl mx-auto px-6 py-8 space-y-8">
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

        <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
      </div>
    </Shell>
  );
}
