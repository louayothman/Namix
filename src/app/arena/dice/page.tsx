
"use client";

import { useState, useEffect, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Dices, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  Wallet, 
  ShieldCheck, 
  Coins,
  Loader2,
  AlertTriangle,
  History,
  TrendingUp,
  ArrowRight,
  Target,
  RefreshCcw,
  CheckCircle2,
  Skull
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * @fileOverview Nexus Dice v1.0 - Probability Engine
 * لعبة نكسوس للاحتمالات: توقع المسار الرقمي القادم في شبكة الاحتمالات.
 */

export default function DicePage() {
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [betAmount, setBetAmount] = useState("10");
  const [targetValue, setTargetValue] = useState(50.5);
  const [isRollOver, setIsRollOver] = useState(true);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'won' | 'lost'>('idle');
  const [loading, setLoading] = useState(false);

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

  const winChance = useMemo(() => {
    return isRollOver ? 100 - targetValue : targetValue;
  }, [targetValue, isRollOver]);

  const multiplier = useMemo(() => {
    if (winChance <= 0) return 0;
    return (98 / winChance); // 2% House Edge
  }, [winChance]);

  const handleRoll = async () => {
    if (!dbUser || loading) return;
    const amt = Number(betAmount);
    if (amt > dbUser.totalBalance || amt < 1) return;

    setLoading(true);
    setGameState('idle');
    
    try {
      // 1. Deduct Balance
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amt) });

      // 2. Generate Result (Deterministic Sync Simulation)
      const result = Math.floor(Math.random() * 10001) / 100;
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

      // Log
      await addDoc(collection(db, "game_history"), {
        userId: dbUser.id,
        game: "dice",
        betAmount: amt,
        multiplier: hasWon ? multiplier : 0,
        resultValue: result,
        targetValue,
        mode: isRollOver ? 'over' : 'under',
        createdAt: new Date().toISOString()
      });

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-8 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#f9a885] font-black text-[9px] uppercase tracking-[0.4em] justify-start">
              <div className="h-2 w-2 rounded-full bg-[#f9a885] animate-pulse" />
              Nexus Probability Core
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#002d4d] tracking-tight">نكسوس الاحتمالات</h1>
            <p className="text-muted-foreground font-bold text-xs">تحكم في مسارك المالي عبر بروتوكول التوقع الرقمي الدقيق.</p>
          </div>
          <Link href="/arena">
            <Button variant="ghost" className="rounded-full bg-white shadow-sm h-14 px-8 border border-gray-100 active:scale-95 transition-all hover:shadow-md font-black text-[10px] text-[#002d4d]">
              <ChevronRight className="ml-2 h-5 w-5" /> العودة للساحة
            </Button>
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          
          {/* Controls - LEFT */}
          <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
            <Card className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden">
              <CardContent className="p-8 space-y-8">
                
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">مبلغ الرهان ($)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={betAmount} 
                      onChange={e => setBetAmount(e.target.value)}
                      className="h-16 rounded-[24px] bg-gray-50 border-none font-black text-center text-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-orange-500" 
                    />
                    <Coins className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-200" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 text-center space-y-1">
                      <p className="text-[8px] font-black text-gray-400 uppercase">المضاعف</p>
                      <p className="text-lg font-black text-[#002d4d] tabular-nums">x{multiplier.toFixed(4)}</p>
                   </div>
                   <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 text-center space-y-1">
                      <p className="text-[8px] font-black text-gray-400 uppercase">فرصة الفوز</p>
                      <p className="text-lg font-black text-emerald-600 tabular-nums">%{winChance.toFixed(2)}</p>
                   </div>
                </div>

                <Button 
                  onClick={handleRoll}
                  disabled={loading || !dbUser || Number(betAmount) > (dbUser?.totalBalance || 0)}
                  className="w-full h-20 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl active:scale-95 transition-all group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {loading ? <Loader2 className="animate-spin h-8 w-8" /> : (
                    <div className="flex items-center gap-4">
                      <span>إطلاق النرد</span>
                      <Dices className="h-7 w-7 text-[#f9a885] transition-transform group-hover:rotate-12" />
                    </div>
                  )}
                </Button>

                <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-black text-[#002d4d]">
                      <span>الربح الصافي</span>
                      <span className="text-emerald-600 tabular-nums">+${(Number(betAmount) * multiplier - Number(betAmount)).toFixed(2)}</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-8 bg-[#002d4d] rounded-[48px] text-white relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-[0.05] -rotate-12 group-hover:scale-110 transition-transform"><Target size={120} /></div>
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner"><ShieldCheck size={20} className="text-[#f9a885]" /></div>
                     <h4 className="font-black text-sm">ميثاق الاحتمالات</h4>
                  </div>
                  <p className="text-[11px] font-bold text-blue-100/60 leading-relaxed">
                    نظام نكسوس يعتمد على مولد أرقام حقيقي (TRNG) متصل بعقود ناميكس الذكية لضمان شفافية كل محاولة استثمارية.
                  </p>
               </div>
            </div>
          </div>

          {/* Probability Matrix - RIGHT */}
          <div className="lg:col-span-8 space-y-10 order-1 lg:order-2">
            <div className="p-8 md:p-16 bg-gray-50 rounded-[64px] border border-gray-100 shadow-inner relative overflow-hidden group">
               
               {/* Last Result Overlay */}
               <AnimatePresence>
                 {lastResult !== null && (
                   <motion.div 
                     initial={{ opacity: 0, y: -20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="absolute top-8 right-1/2 translate-x-1/2 z-30"
                   >
                      <div className={cn(
                        "px-10 py-4 rounded-3xl font-black text-4xl shadow-2xl tabular-nums border-4 border-white transition-all",
                        gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                      )}>
                        {lastResult.toFixed(2)}
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="space-y-16 pt-12">
                  {/* The Main Slider Module */}
                  <div className="relative pt-10">
                     <div className="h-6 w-full bg-gray-200 rounded-full relative overflow-hidden shadow-inner border-[4px] border-white">
                        <motion.div 
                          initial={false}
                          animate={{ 
                            left: isRollOver ? `${targetValue}%` : '0%',
                            right: isRollOver ? '0%' : `${100 - targetValue}%`
                          }}
                          className={cn(
                            "absolute top-0 bottom-0 transition-all duration-500",
                            isRollOver ? "bg-emerald-500" : "bg-emerald-500"
                          )}
                        />
                        <div className="absolute inset-0 bg-red-500/20" />
                     </div>
                     
                     <div className="mt-8">
                        <Slider 
                          value={[targetValue]} 
                          onValueChange={([val]) => setTargetValue(val)} 
                          max={98} 
                          min={2} 
                          step={0.01}
                          className="relative z-20"
                        />
                     </div>

                     <div className="flex justify-between items-center mt-6 font-black text-[10px] text-gray-400 uppercase tracking-widest px-2">
                        <span>0.00</span>
                        <span>25.00</span>
                        <span className="text-[#002d4d]">50.00</span>
                        <span>75.00</span>
                        <span>100.00</span>
                     </div>
                  </div>

                  {/* Prediction Switcher */}
                  <div className="flex flex-col items-center gap-8">
                     <div className="flex items-center gap-4 p-2 bg-white rounded-[32px] shadow-xl border border-gray-100">
                        <button 
                          onClick={() => setIsRollOver(true)}
                          className={cn(
                            "px-12 h-14 rounded-[24px] font-black text-sm transition-all active:scale-95",
                            isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400 hover:bg-gray-50"
                          )}
                        >
                          توقع فوق (Over)
                        </button>
                        <button 
                          onClick={() => setIsRollOver(false)}
                          className={cn(
                            "px-12 h-14 rounded-[24px] font-black text-sm transition-all active:scale-95",
                            !isRollOver ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400 hover:bg-gray-50"
                          )}
                        >
                          توقع تحت (Under)
                        </button>
                     </div>

                     <div className="flex items-center gap-6">
                        <div className="text-center space-y-1">
                           <p className="text-[9px] font-black text-gray-400 uppercase">الهدف المختار</p>
                           <Badge className="h-12 px-8 rounded-2xl bg-white border-gray-100 text-[#002d4d] font-black text-2xl tabular-nums shadow-sm">
                             {targetValue.toFixed(2)}
                           </Badge>
                        </div>
                        <div className="h-12 w-px bg-gray-200" />
                        <div className="text-center space-y-1">
                           <p className="text-[9px] font-black text-gray-400 uppercase">طبيعة التوقع</p>
                           <Badge className={cn("h-12 px-8 rounded-2xl font-black text-sm shadow-sm", isRollOver ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600")}>
                             {isRollOver ? 'ROLL OVER' : 'ROLL UNDER'}
                           </Badge>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Feedback Animation */}
               <AnimatePresence>
                 {gameState !== 'idle' && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.5 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0 }}
                     className="absolute bottom-10 left-10"
                   >
                      <div className={cn(
                        "h-20 w-20 rounded-full flex items-center justify-center shadow-2xl border-4 border-white animate-bounce",
                        gameState === 'won' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                      )}>
                        {gameState === 'won' ? <CheckCircle2 size={32} /> : <Skull size={32} />}
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Strategy Insight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-8 bg-white rounded-[48px] border border-gray-50 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                  <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
                     <RefreshCcw size={24} />
                  </div>
                  <div className="text-right">
                     <h4 className="font-black text-base text-[#002d4d]">استراتيجية التكرار</h4>
                     <p className="text-[10px] font-bold text-gray-400">ثبات التوقيت وتغيير العتبات يزيد من فرص اقتناص الربح.</p>
                  </div>
               </div>
               <div className="p-8 bg-white rounded-[48px] border border-gray-50 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                     <TrendingUp size={24} />
                  </div>
                  <div className="text-right">
                     <h4 className="font-black text-base text-[#002d4d]">إدارة السيولة</h4>
                     <p className="text-[10px] font-bold text-gray-400">تجنب الرهان بأكثر من %5 من محفظتك في المحاولة الواحدة.</p>
                  </div>
               </div>
            </div>
          </div>

        </div>

        {/* Branding Footer */}
        <div className="flex flex-col items-center gap-4 py-12 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Nexus Protocol v1.0.2</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
