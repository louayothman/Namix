
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
import { toast } from "@/hooks/use-toast";

type GameState = 'waiting' | 'running' | 'crashed';

export default function CrashPage() {
  const [dbUser, setDbUser] = useState<any>(null);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [multiplier, setMultiplier] = useState(1.0);
  const [timer, setTimer] = useState(10); // Waiting timer
  const [history, setHistory] = useState<number[]>([1.45, 4.22, 1.05, 12.4, 2.11]);
  const [currentBet, setCurrentBet] = useState<number | null>(null);
  const [hasCashedOut, setHasCashout] = useState(false);
  
  const db = useFirestore();

  // 1. Sync User Balance
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

  // 2. Game Loop Simulation
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
      const crashPoint = Math.random() * 10 + 1; // Simplified random crash
      let currentMult = 1.0;
      
      interval = setInterval(() => {
        currentMult += currentMult * 0.05; // Exponential growth
        setMultiplier(currentMult);

        if (currentMult >= crashPoint) {
          setGameState('crashed');
          setHistory(prev => [currentMult, ...prev].slice(0, 8));
          clearInterval(interval);
          setTimeout(() => setGameState('waiting'), 3000);
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
      toast({ title: "تم قبول الرهان", description: "بالتوفيق في جولة النبض الحالية." });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل تنفيذ العملية" });
    }
  };

  const handleCashout = async () => {
    if (!dbUser || !currentBet || hasCashedOut || gameState !== 'running') return;
    const profit = currentBet * multiplier;
    setHasCashout(true);
    try {
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(profit) });
      toast({ title: "تم سحب الأرباح!", description: `حققت عائداً قدره $${profit.toFixed(2)} بمضاعف ${multiplier.toFixed(2)}x` });
      setCurrentBet(null);
    } catch (e) {}
  };

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col h-screen bg-[#fcfdfe] overflow-hidden font-body" dir="rtl">
        <CrashHeader user={dbUser} />
        
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Main Game Visual Area */}
          <div className="flex-1 flex flex-col relative bg-gray-50/20">
             <div className="flex-1 relative flex flex-col items-center justify-center p-6">
                <CrashMultiplier multiplier={multiplier} state={gameState} />
                <CrashVisualizer multiplier={multiplier} state={gameState} />
                <CrashStatus state={gameState} timer={timer} />
             </div>
             
             <div className="p-4 bg-white border-t border-gray-100 lg:hidden">
                <CrashControls 
                  state={gameState} 
                  onPlaceBet={handlePlaceBet} 
                  onCashout={handleCashout}
                  currentBet={currentBet}
                  hasCashedOut={hasCashedOut}
                  multiplier={multiplier}
                  balance={dbUser?.totalBalance || 0}
                />
             </div>
          </div>

          {/* Side Info Panel */}
          <div className="lg:w-[380px] bg-white border-r border-gray-100 flex flex-col shrink-0 overflow-y-auto scrollbar-none pb-20 lg:pb-0">
             <div className="hidden lg:block p-6 border-b border-gray-50">
                <CrashControls 
                  state={gameState} 
                  onPlaceBet={handlePlaceBet} 
                  onCashout={handleCashout}
                  currentBet={currentBet}
                  hasCashedOut={hasCashedOut}
                  multiplier={multiplier}
                  balance={dbUser?.totalBalance || 0}
                />
             </div>
             <div className="p-6 space-y-8">
                <CrashHistory results={history} />
                <CrashLiveBets state={gameState} currentBet={currentBet} hasCashedOut={hasCashedOut} multiplier={multiplier} />
             </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
