
"use client";

import { useState, useEffect, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { DepositSheet } from "@/components/deposit/DepositSheet";
import { RefreshCcw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { ArenaHeader } from "@/components/arena/shared/ArenaHeader";
import { ArenaIntro } from "@/components/arena/shared/ArenaIntro";
import { WheelReactor } from "@/components/arena/wheel/WheelReactor";
import { WheelBetPanel } from "@/components/arena/wheel/WheelBetPanel";
import { hapticFeedback } from "@/lib/haptic-engine";

/**
 * @fileOverview صفحة لعبة عجلة السيولة v1.0
 * تم تطهير المصطلحات لتعكس هوية ناميكس الاحترافية.
 */

const SEGMENTS = [1.5, 0, 2, 1.2, 0, 5, 1.2, 0, 1.5, 0, 2, 10];

export default function WheelPage() {
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [betAmount, setBetAmount] = useState("10");
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'won' | 'lost'>('idle');
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

  const handleSpin = async () => {
    if (!dbUser || isSpinning) return;
    const amt = Number(betAmount);
    if (amt > (dbUser.totalBalance || 0) || amt < 1) return;

    hapticFeedback.medium();
    setIsSpinning(true);
    setGameState('idle');
    setResult(null);

    try {
      // خصم مبلغ الدخول
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amt) });
      
      // منطق الاحتمالات: 70% خسارة أو ربح طفيف، 30% فرصة للنمو الكبير
      const forceRestrict = Math.random() < 0.7;
      let targetIndex: number;
      
      if (forceRestrict) {
        // اختر عشوائياً من الـ 0 أو 1.2
        const limitedIndices = SEGMENTS.map((val, i) => (val === 0 || val === 1.2) ? i : -1).filter(i => i !== -1);
        targetIndex = limitedIndices[Math.floor(Math.random() * limitedIndices.length)];
      } else {
        targetIndex = Math.floor(Math.random() * SEGMENTS.length);
      }

      const segmentAngle = 360 / SEGMENTS.length;
      const extraSpins = (5 + Math.floor(Math.random() * 5)) * 360;
      const finalRotation = rotation + extraSpins + (targetIndex * segmentAngle);
      
      setRotation(finalRotation);

      // الانتظار حتى انتهاء الأنيميشن
      setTimeout(async () => {
        const winMultiplier = SEGMENTS[targetIndex];
        setResult(winMultiplier);
        
        if (winMultiplier > 0) {
          const winAmt = amt * winMultiplier;
          await updateDoc(doc(db, "users", dbUser.id), { 
            totalBalance: increment(winAmt), 
            totalProfits: increment(winAmt - amt) 
          });
          setGameState('won');
          hapticFeedback.success();
        } else {
          setGameState('lost');
          hapticFeedback.error();
        }
        setIsSpinning(false);
      }, 4000);

    } catch (e) {
      setIsSpinning(false);
    }
  };

  return (
    <Shell hideMobileNav>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <ArenaIntro 
            key="intro"
            icon={RefreshCcw} 
            title="LIQUID WHEEL" 
            onComplete={() => setShowIntro(false)} 
          />
        ) : (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-screen bg-white overflow-hidden font-body"
            dir="rtl"
          >
            <ArenaHeader 
              title="عجلة السيولة" 
              balance={dbUser?.totalBalance} 
              onOpenDeposit={() => setDepositOpen(true)} 
            />
            
            <WheelReactor 
              rotation={rotation}
              isSpinning={isSpinning}
              result={result}
              gameState={gameState}
              segments={SEGMENTS}
            />
            
            <WheelBetPanel 
              betAmount={betAmount} 
              setBetAmount={setBetAmount} 
              loading={isSpinning} 
              canBet={!!dbUser && Number(betAmount) <= (dbUser.totalBalance || 0)} 
              onSpin={handleSpin} 
            />
            
            <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}
