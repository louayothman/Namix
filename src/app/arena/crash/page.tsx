
"use client";

import { useState, useEffect, useCallback } from "react";
import { Shell } from "@/components/layout/Shell";
import { 
  CrashHeader, 
  CrashMultiplier, 
  CrashVisualizer, 
  CrashControls, 
  CrashHistory, 
  CrashLiveBets, 
  CrashStatus 
} from "@/components/arena/crash";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment } from "firebase/firestore";

/**
 * @fileOverview مفاعل Namix Crash السيادي v2.0 - Modern Pulse Edition
 * تم تحديث محرك اللعبة ليدعم التنويهات المدمجة وتطهير الطباعة العربية.
 */

type GameState = 'waiting' | 'running' | 'crashed';

export default function CrashPage() {
  const [dbUser, setDbUser] = useState<any>(null);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [multiplier, setMultiplier] = useState(1.0);
  const [timer, setTimer] = useState(10); 
  const [history, setHistory] = useState<number[]>([1.45, 4.22, 1.05, 12.4, 2.11]);
  const [currentBet, setCurrentBet] = useState<number | null>(null);
  const [hasCashedOut, setHasCashout] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);
  
  const db = useFirestore();

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

  useEffect(() => {
    let interval: any;

    if (gameState === 'waiting') {
      setMultiplier(1.0);
      setHasCashout(false);
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setGameState('running');
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === 'running') {
      // Realistic crash simulation logic
      const crashPoint = 1 + (Math.random() * Math.random() * 15); 
      let currentMult = 1.0;
      
      interval = setInterval(() => {
        const increment = currentMult < 2 ? 0.01 : currentMult < 5 ? 0.02 : 0.05;
        currentMult += increment;
        setMultiplier(currentMult);

        if (currentMult >= crashPoint) {
          setGameState('crashed');
          setHistory(prev => [currentMult, ...prev].slice(0, 10));
          setCurrentBet(null);
          clearInterval(interval);
          setTimeout(() => setGameState('waiting'), 4000);
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [gameState]);

  const handlePlaceBet = async (amount: number) => {
    if (!dbUser || amount > dbUser.totalBalance || gameState !== 'waiting') return;
    try {
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amount) });
      setCurrentBet(amount);
      setFeedback({ type: 'success', msg: 'تم قبول الرهان بنجاح. بانتظار الانطلاق...' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'فشل تنفيذ بروتوكول الرهان.' });
    }
  };

  const handleCashout = async () => {
    if (!dbUser || !currentBet || hasCashedOut || gameState !== 'running') return;
    const profit = currentBet * multiplier;
    setHasCashout(true);
    try {
      await updateDoc(doc(db, "users", dbUser.id), { 
        totalBalance: increment(profit),
        totalProfits: increment(profit - currentBet)
      });
      setFeedback({ type: 'success', msg: `تم السحب بنجاح! +$${profit.toFixed(2)}` });
      setCurrentBet(null);
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'خطأ في مزامنة الأرباح.' });
    }
  };

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col h-screen bg-[#fcfdfe] overflow-hidden font-body tracking-normal" dir="rtl">
        <CrashHeader user={dbUser} />
        
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Main Game Visual Area */}
          <div className="flex-1 flex flex-col relative bg-gray-50/10">
             <div className="flex-1 relative flex flex-col items-center justify-center p-6 overflow-hidden">
                <CrashMultiplier multiplier={multiplier} state={gameState} />
                <CrashVisualizer multiplier={multiplier} state={gameState} />
                <CrashStatus state={gameState} timer={timer} />
             </div>
             
             <div className="p-4 bg-white border-t border-gray-100 lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.02)] relative z-50">
                <CrashControls 
                  state={gameState} 
                  onPlaceBet={handlePlaceBet} 
                  onCashout={handleCashout}
                  currentBet={currentBet}
                  hasCashedOut={hasCashedOut}
                  multiplier={multiplier}
                  balance={dbUser?.totalBalance || 0}
                  feedback={feedback}
                />
             </div>
          </div>

          {/* Side Info Panel - Unified for Desktop/Large Screens */}
          <div className="lg:w-[400px] bg-white border-r border-gray-100 flex flex-col shrink-0 overflow-y-auto scrollbar-none pb-24 lg:pb-0 z-40">
             <div className="hidden lg:block p-8 border-b border-gray-50">
                <CrashControls 
                  state={gameState} 
                  onPlaceBet={handlePlaceBet} 
                  onCashout={handleCashout}
                  currentBet={currentBet}
                  hasCashedOut={hasCashedOut}
                  multiplier={multiplier}
                  balance={dbUser?.totalBalance || 0}
                  feedback={feedback}
                />
             </div>
             <div className="p-8 space-y-10">
                <CrashHistory results={history} />
                <CrashLiveBets state={gameState} currentBet={currentBet} hasCashedOut={hasCashedOut} multiplier={multiplier} />
             </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
