
"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { 
  CrashHeader, 
  CrashMultiplier, 
  CrashVisualizer, 
  CrashControls, 
  CrashHistory, 
  CrashStatus,
  CrashLiveBets
} from "@/components/arena/crash";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, setDoc } from "firebase/firestore";

type GameState = 'waiting' | 'running' | 'crashed';

/**
 * @fileOverview صفحة الكراش السيادية v12.0 - Precision Scale Edition
 * تم تقليل ارتفاع المفاعل بنسبة 25% إضافية لتحقيق توازن مثالي مع لوحة الرهان.
 */
export default function CrashPage() {
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [multiplier, setMultiplier] = useState(1.0);
  const [localState, setLocalState] = useState<GameState>('waiting');
  const [localTimer, setLocalTimer] = useState(10);
  const [currentBet, setCurrentBet] = useState<number | null>(null);
  const [hasCashedOut, setHasCashout] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);

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

  const gameStateRef = useMemoFirebase(() => doc(db, "system_settings", "crash_game"), [db]);
  const { data: globalGame } = useDoc(gameStateRef);

  useEffect(() => {
    if (!globalGame) {
      setDoc(gameStateRef, {
        status: 'waiting',
        startTime: new Date().toISOString(),
        crashPoint: 2.5,
        history: [1.45, 4.22, 1.05, 12.4, 2.11, 1.88, 3.45, 1.12, 6.78, 2.33]
      });
      return;
    }

    let interval: any;
    const startTime = new Date(globalGame.startTime).getTime();

    const tick = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;

      if (globalGame.status === 'waiting') {
        const remaining = Math.max(0, Math.ceil(10 - elapsed));
        setLocalTimer(remaining);
        setLocalState('waiting');
        setMultiplier(1.0);
        setHasCashout(false);

        if (elapsed >= 10) {
          const crashPoint = 1 + (Math.random() * Math.random() * 20);
          updateDoc(gameStateRef, {
            status: 'running',
            startTime: new Date().toISOString(),
            crashPoint: crashPoint
          }).catch(() => {});
        }
      } 
      else if (globalGame.status === 'running') {
        setLocalState('running');
        const currentMult = Math.pow(1.07, elapsed);
        setMultiplier(currentMult);

        if (currentMult >= globalGame.crashPoint) {
          const newHistory = [currentMult, ...(globalGame.history || [])].slice(0, 10);
          updateDoc(gameStateRef, {
            status: 'crashed',
            startTime: new Date().toISOString(),
            history: newHistory
          }).catch(() => {});
          setCurrentBet(null);
        }
      } 
      else if (globalGame.status === 'crashed') {
        setLocalState('crashed');
        setMultiplier(globalGame.crashPoint || 1.0);
        
        if (elapsed >= 4) {
          updateDoc(gameStateRef, {
            status: 'waiting',
            startTime: new Date().toISOString()
          }).catch(() => {});
        }
      }
    };

    interval = setInterval(tick, 50);
    return () => clearInterval(interval);
  }, [globalGame, gameStateRef]);

  const handlePlaceBet = async (amount: number) => {
    if (!dbUser || amount > dbUser.totalBalance || localState !== 'waiting') return;
    try {
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amount) });
      setCurrentBet(amount);
      setFeedback({ type: 'success', msg: 'تم قبول الرهان للجولة القادمة.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'فشل تنفيذ بروتوكول الرهان.' });
    }
  };

  const handleCashout = async () => {
    if (!dbUser || !currentBet || hasCashedOut || localState !== 'running') return;
    const profit = currentBet * multiplier;
    setHasCashout(true);
    try {
      await updateDoc(doc(db, "users", dbUser.id), { 
        totalBalance: increment(profit),
        totalProfits: increment(profit - currentBet)
      });
      setFeedback({ type: 'success', msg: `تم الصرف بنجاح! +$${profit.toFixed(2)}` });
      setCurrentBet(null);
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'خطأ في مزامنة الأرباح.' });
    }
  };

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col h-[100dvh] bg-white overflow-hidden font-body tracking-normal" dir="rtl">
        <CrashHeader user={dbUser} />
        
        <div className="flex-1 flex flex-col relative">
          
          {/* Top History Bar */}
          <div className="shrink-0 z-[100] px-4 py-3 bg-white border-b border-gray-50">
             <CrashHistory results={globalGame?.history || []} />
          </div>

          {/* Main Visualizer Area - Reduced flex weight by 25% for a more compact look */}
          <div className="flex-[0.9] relative flex flex-col items-center justify-center p-0 m-0 bg-white z-20">
             <div className="relative z-30">
                <CrashMultiplier multiplier={multiplier} state={localState} />
             </div>
             
             <CrashVisualizer multiplier={multiplier} state={localState} />
             
             <div className="absolute inset-0 z-40 pointer-events-none">
                <CrashStatus state={localState} timer={localTimer} />
             </div>
          </div>
          
          {/* Controls & Bets Area - Gains more visual weight */}
          <div className="flex-1 shrink-0 grid grid-cols-1 md:grid-cols-12 gap-0 bg-white border-t border-gray-100 shadow-[0_-20px_80px_rgba(0,45,77,0.05)] relative z-50 overflow-y-auto scrollbar-none">
             <div className="md:col-span-5 lg:col-span-4 p-6 border-l border-gray-50">
                <CrashControls 
                  state={localState} 
                  onPlaceBet={handlePlaceBet} 
                  onCashout={handleCashout}
                  currentBet={currentBet}
                  hasCashedOut={hasCashedOut}
                  multiplier={multiplier}
                  balance={dbUser?.totalBalance || 0}
                  feedback={feedback}
                />
             </div>
             <div className="md:col-span-7 lg:col-span-8 p-6 bg-gray-50/20">
                <CrashLiveBets 
                  state={localState}
                  currentBet={currentBet}
                  hasCashedOut={hasCashedOut}
                  multiplier={multiplier}
                />
             </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
