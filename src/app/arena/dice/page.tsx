
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
  Activity
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DepositSheet } from "@/components/deposit/DepositSheet";

/**
 * 1. شريط التحكم العلوي النخبوي
 */
function DiceHeader({ balance, onOpenDeposit }: { balance: number, onOpenDeposit: () => void }) {
  return (
    <header className="px-8 py-6 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-xl z-50 shrink-0 shadow-sm sticky top-0">
      <div className="flex items-center gap-4">
         <Link href="/arena">
           <Button variant="ghost" size="icon" className="h-12 w-12 rounded-[20px] bg-gray-50 text-[#002d4d] active:scale-90 transition-all hover:bg-[#002d4d] hover:text-white">
             <ChevronRight className="h-6 w-6" />
           </Button>
         </Link>
         <div className="space-y-0.5 text-right">
            <h1 className="text-xl font-black text-[#002d4d] leading-none tracking-tight">نكسوس للاحتمالات</h1>
            <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Nexus Logic Engine</p>
         </div>
      </div>
      
      <div className="flex items-center gap-3 bg-gray-50/80 p-1.5 pr-5 rounded-full border border-gray-100 shadow-inner">
         <div className="text-right">
            <p className="text-[7px] font-black text-gray-400 uppercase leading-none tracking-widest">المحفظة الجارية</p>
            <p className="text-sm font-black text-[#002d4d] tabular-nums mt-1">${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
         </div>
         <button onClick={onOpenDeposit} className="h-9 w-9 rounded-full bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-xl active:scale-90 transition-all">
            <Plus size={18} />
         </button>
      </div>
    </header>
  );
}

/**
 * 2. مفاعل النبض الرقمي (The Reactor) - تم ترقية التصميم وإضافة السهم الطائر
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
    <section className="relative w-full bg-white rounded-[40px] p-12 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,45,77,0.1)] border border-gray-50 overflow-hidden min-h-[380px] flex flex-col justify-center group">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-[5s]">
         <Activity size={400} className="text-[#002d4d] absolute -top-20 -right-20" />
      </div>

      <AnimatePresence>
        {lastResult !== null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: -50 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            className="absolute top-12 left-1/2 -translate-x-1/2 z-30"
          >
            <div className={cn(
              "px-12 py-5 rounded-[28px] font-black text-5xl shadow-2xl tabular-nums border-4 border-white transition-all duration-500", 
              gameState === 'won' ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-red-500 text-white shadow-red-500/20"
            )}>
              {lastResult.toFixed(2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-20 pt-8 relative z-10">
        <div className="relative pt-16">
          {/* شريط الاحتمالات الملون - هندسة عكسية فخمة */}
          <div className="h-5 w-full bg-gray-100 rounded-full relative overflow-hidden shadow-inner border-[3px] border-white">
            <motion.div 
              animate={{ 
                left: isRollOver ? '0%' : `${targetValue}%`, 
                right: isRollOver ? `${100 - targetValue}%` : '0%' 
              }} 
              className="absolute top-0 bottom-0 bg-red-500/90 transition-all duration-700" 
            />
            <motion.div 
              animate={{ 
                left: isRollOver ? `${targetValue}%` : '0%', 
                right: isRollOver ? '0%' : `${100 - targetValue}%` 
              }} 
              className="absolute top-0 bottom-0 bg-emerald-500/90 transition-all duration-700" 
            />
          </div>

          {/* السهم والمؤشر الرقمي الطائر - دقة نانوية */}
          <div className="relative mt-2">
             <Slider 
               value={[targetValue]} 
               onValueChange={([val]) => setTargetValue(val)} 
               max={98} min={2} step={0.01} 
               className="relative z-20 h-8" 
             />
             
             {/* السهم والقيمة فوق المنزلق */}
             <motion.div 
               className="absolute top-[-55px] flex flex-col items-center pointer-events-none"
               style={{ left: `${targetValue}%`, transform: 'translateX(-50%)' }}
               animate={{ left: `${targetValue}%` }}
               transition={{ type: "spring", stiffness: 600, damping: 25 }}
             >
                <div className="bg-[#002d4d] text-[#f9a885] px-4 py-1.5 rounded-xl text-[12px] font-black shadow-2xl border border-white/10 flex items-center gap-2">
                   <Sparkles size={10} className="animate-pulse" />
                   {targetValue.toFixed(2)}
                </div>
                <ChevronUp className="text-[#002d4d] h-5 w-5 mt-[-8px] drop-shadow-xl" fill="currentColor" />
             </motion.div>
          </div>

          <div className="flex justify-between items-center mt-8 font-black text-[10px] text-gray-300 uppercase tracking-[0.3em] px-2">
            <span>0.00</span><span className="opacity-30">25.00</span><span className="opacity-60">50.00</span><span className="opacity-30">75.00</span><span>100.00</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-[28px] shadow-inner border border-gray-100">
            <button 
              onClick={() => setIsRollOver(true)} 
              className={cn(
                "px-12 h-12 rounded-[22px] font-black text-[11px] transition-all duration-500 uppercase tracking-widest", 
                isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-xl scale-105" : "text-gray-400 hover:text-[#002d4d]"
              )}
            >
              توقع فوق (Over)
            </button>
            <button 
              onClick={() => setIsRollOver(false)} 
              className={cn(
                "px-12 h-12 rounded-[22px] font-black text-[11px] transition-all duration-500 uppercase tracking-widest", 
                !isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-xl scale-105" : "text-gray-400 hover:text-[#002d4d]"
              )}
            >
              توقع تحت (Under)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 3. لوحة الرهان النخبوية (Betting Panel)
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
      <Card className="border-none shadow-sm rounded-[40px] bg-white border border-gray-50 overflow-hidden transition-all hover:shadow-xl">
        <CardContent className="p-10 space-y-10">
          <div className="space-y-4">
            <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-[0.2em]">قيمة الرهان المعتمدة ($)</Label>
            <div className="relative group">
              <Input 
                type="number" 
                value={betAmount} 
                onChange={e => setBetAmount(e.target.value)} 
                className="h-20 rounded-[32px] bg-gray-50 border-none font-black text-center text-3xl text-[#002d4d] shadow-inner focus-visible:ring-4 focus-visible:ring-blue-500/5 transition-all" 
              />
              <Coins className="absolute left-8 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-200 group-focus-within:text-blue-200 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50/50 rounded-[32px] border border-gray-100 text-center space-y-2 shadow-inner group/stat">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">المضاعف السعري</p>
              <p className="text-2xl font-black text-[#002d4d] tabular-nums transition-transform group-hover/stat:scale-110">x{multiplier.toFixed(4)}</p>
            </div>
            <div className="p-6 bg-gray-50/50 rounded-[32px] border border-gray-100 text-center space-y-2 shadow-inner group/stat">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">فرصة النجاح</p>
              <p className="text-2xl font-black text-emerald-600 tabular-nums transition-transform group-hover/stat:scale-110">%{winChance.toFixed(2)}</p>
            </div>
          </div>

          <Button 
            onClick={handleRoll} 
            disabled={loading || !dbUser || Number(betAmount) > (dbUser?.totalBalance || 0)} 
            className="w-full h-24 rounded-[36px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-2xl shadow-2xl active:scale-[0.98] transition-all group relative overflow-hidden"
          >
            {loading ? <Loader2 className="animate-spin h-10 w-10" /> : (
              <div className="flex items-center gap-6">
                <span>بدء الجولة</span>
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner group-hover:rotate-12 transition-transform">
                   <Dices className="h-7 w-7 text-[#f9a885]" />
                </div>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

/**
 * 4. تفاصيل الميثاق (Details)
 */
function DiceDetails() {
  return (
    <section className="p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm flex items-center justify-between group">
      <div className="text-right space-y-1">
        <h4 className="font-black text-base text-[#002d4d]">نظام النزاهة الرقمية</h4>
        <p className="text-[11px] font-bold text-gray-400 leading-relaxed max-w-[300px]">تخضع الاحتمالات لمعايرة استراتيجية تضمن استدامة الملاءة المالية للمنصة بنسبة 25% فوز.</p>
      </div>
      <div className="h-16 w-16 rounded-[24px] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
        <ShieldCheck size={32} />
      </div>
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
    
    // شاشة الانترو السينمائية لمدة 2.5 ثانية
    setTimeout(async () => {
      setShowIntro(false);
      setGameState('idle');
      try {
        await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amt) });
        
        // حوكمة مالية: 75% فوز للمنصة (25% للمستخدم)
        const isUserAllowedToWin = Math.random() < 0.25;
        
        let result: number;
        if (isUserAllowedToWin) {
          // جولة فائزة: نولد رقماً داخل نطاق الفوز
          if (isRollOver) result = targetValue + (Math.random() * (100 - targetValue));
          else result = Math.random() * targetValue;
        } else {
          // جولة خاسرة: نولد رقماً خارج نطاق الفوز
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
    }, 2500);
  };

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col h-screen bg-[#fcfdfe] font-body text-right overflow-hidden" dir="rtl">
        
        <DiceHeader balance={dbUser?.totalBalance} onOpenDeposit={() => setDepositOpen(true)} />

        <div className="flex-1 overflow-y-auto pb-32">
          <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">
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

        {/* إنفوجرافيك الافتتاحية النخبوية */}
        <AnimatePresence>
          {showIntro && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[100] bg-[#002d4d] backdrop-blur-3xl flex flex-col items-center justify-center gap-12"
            >
               <motion.div 
                 animate={{ 
                   rotate: [0, 360], 
                   scale: [1, 1.3, 1],
                   filter: ["drop-shadow(0 0 0px #f9a885)", "drop-shadow(0 0 30px #f9a885)", "drop-shadow(0 0 0px #f9a885)"]
                 }}
                 transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                 className="h-40 w-40 rounded-[48px] bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl relative"
               >
                  <Dices size={80} className="text-[#f9a885]" />
                  <motion.div 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 rounded-[48px] border-2 border-[#f9a885]/30"
                  />
               </motion.div>
               <div className="text-center space-y-4">
                  <div className="flex flex-col items-center gap-2">
                     <h2 className="text-3xl font-black text-white tracking-tight">معايرة نكسوس...</h2>
                     <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#f9a885] to-transparent rounded-full" />
                  </div>
                  <div className="flex items-center gap-3 justify-center text-blue-300">
                     <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Probability Matrix</p>
                  </div>
               </div>
               
               {/* نصوص استخباراتية جانبية */}
               <div className="absolute bottom-12 left-12 opacity-20 text-left" dir="ltr">
                  <p className="text-[8px] font-mono text-blue-200">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  <p className="text-[8px] font-mono text-blue-200">CORE: ACTIVE</p>
                  <p className="text-[8px] font-mono text-blue-200">VAL: {targetValue.toFixed(2)}</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
      </div>
    </Shell>
  );
}
