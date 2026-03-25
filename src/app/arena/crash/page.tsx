
"use client";

import { useState, useEffect } from "react";
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
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, setDoc } from "firebase/firestore";

/**
 * @fileOverview مفاعل Namix Crash السيادي v4.0 - Global Unified Sync
 * تم تكبير مساحة المفاعل بنسبة 200% وتثبيت سجل الجولات في القمة مع مزامنة Firestore كاملة.
 */

type GameState = 'waiting' | 'running' | 'crashed';

export default function CrashPage() {
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [multiplier, setMultiplier] = useState(1.0);
  const [localState, setLocalState] = useState<GameState>('waiting');
  const [localTimer, setLocalTimer] = useState(10);
  const [currentBet, setCurrentBet] = useState<number | null>(null);
  const [hasCashedOut, setHasCashout] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);

  // 1. مزامنة بيانات المستخدم
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

  // 2. الاستماع لحالة اللعبة العالمية من Firestore
  const gameStateRef = useMemoFirebase(() => doc(db, "system_settings", "crash_game"), [db]);
  const { data: globalGame, isLoading: loadingGame } = useDoc(gameStateRef);

  // 3. محرك المزامنة اللحظي (Global Master Logic)
  useEffect(() => {
    if (!globalGame) {
      // تهيئة اللعبة لأول مرة
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
          updateDoc(gameStateRef, {
            status: 'running',
            startTime: new Date().toISOString(),
            crashPoint: 1 + (Math.random() * Math.random() * 20) // مضاعفات أكثر جرأة
          }).catch(() => {});
        }
      } 
      else if (globalGame.status === 'running') {
        setLocalState('running');
        // معادلة صعود أسي أكثر إثارة
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

    interval = setInterval(tick, 50); // دقة أعلى (50ms)
    return () => clearInterval(interval);
  }, [globalGame, gameStateRef]);

  const handlePlaceBet = async (amount: number) => {
    if (!dbUser || amount > dbUser.totalBalance || localState !== 'waiting') return;
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
    if (!dbUser || !currentBet || hasCashedOut || localState !== 'running') return;
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
      <div className="flex flex-col h-screen bg-[#fcfdfe] overflow-hidden font-body" dir="rtl">
        <CrashHeader user={dbUser} />
        
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* Main Game Visual Area - High Focus */}
          <div className="flex-1 flex flex-col relative bg-gray-50/5">
             
             {/* History Rail - Absolute Top Position */}
             <div className="absolute top-0 left-0 right-0 z-40 p-4 bg-gradient-to-b from-white via-white/90 to-transparent">
                <CrashHistory results={globalGame?.history || []} />
             </div>

             {/* Expanded Visualizer Container */}
             <div className="flex-1 relative flex flex-col items-center justify-center p-6 overflow-hidden">
                <div className="relative z-20 scale-110 md:scale-125 mb-12">
                   <CrashMultiplier multiplier={multiplier} state={localState} />
                </div>
                
                <CrashVisualizer multiplier={multiplier} state={localState} />
                
                <div className="relative z-30">
                   <CrashStatus state={localState} timer={localTimer} />
                </div>
             </div>
             
             {/* Mobile Controls Position */}
             <div className="p-4 bg-white border-t border-gray-100 lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.02)] relative z-50">
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
          </div>

          {/* Side Info Panel - Desktop/Tablet */}
          <div className="lg:w-[420px] bg-white border-r border-gray-100 flex flex-col shrink-0 overflow-y-auto scrollbar-none pb-24 lg:pb-0 z-40">
             <div className="hidden lg:block p-10 border-b border-gray-50">
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
             <div className="p-8 space-y-10">
                <CrashLiveBets state={localState} currentBet={currentBet} hasCashedOut={hasCashedOut} multiplier={multiplier} />
             </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
