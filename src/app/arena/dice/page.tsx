
"use client";

import { useState, useEffect, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { DepositSheet } from "@/components/deposit/DepositSheet";

import { ArenaHeader } from "@/components/arena/shared/ArenaHeader";
import { DiceIntro } from "@/components/arena/dice/DiceIntro";
import { DiceReactor } from "@/components/arena/dice/DiceReactor";
import { DiceBetPanel } from "@/components/arena/dice/DiceBetPanel";

/**
 * DicePage - Container v900.0
 * يدير الحالة المنطقية للعبة وحوكمة السيولة (75% خسارة مبرمجة).
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
      
      // GOVERNANCE: 75% Force Lose
      const forceLose = Math.random() < 0.75;
      let result: number;
      
      if (!forceLose) {
        result = Math.random() * 100;
      } else {
        // Generate a losing result
        if (isRollOver) {
          result = Math.random() * targetValue; // Definitely below target
        } else {
          result = targetValue + (Math.random() * (100 - targetValue)); // Definitely above target
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
    } catch (e) {} finally { setLoading(false); }
  };

  return (
    <Shell hideMobileNav>
      <AnimatePresence>
        {showIntro && <DiceIntro onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <div className="flex flex-col h-screen bg-white overflow-hidden" dir="rtl">
          <ArenaHeader 
            title="نكسوس الاحتمالات" 
            balance={dbUser?.totalBalance} 
            onOpenDeposit={() => setDepositOpen(true)} 
          />
          
          <DiceReactor 
            lastResult={lastResult} 
            gameState={gameState} 
            isRollOver={isRollOver} 
            targetValue={targetValue} 
            setTargetValue={setTargetValue} 
            setIsRollOver={setIsRollOver} 
          />
          
          <DiceBetPanel 
            betAmount={betAmount} 
            setBetAmount={setBetAmount} 
            loading={loading} 
            canBet={!!dbUser && Number(betAmount) <= (dbUser.totalBalance || 0)} 
            multiplier={multiplier} 
            winChance={winChance} 
            onRoll={handleRoll} 
          />
          
          <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
        </div>
      )}
    </Shell>
  );
}
