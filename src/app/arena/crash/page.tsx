
"use client";

import { useState, useEffect, useRef } from "react";
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
import { doc, onSnapshot, updateDoc, increment } from "firebase/firestore";

type GameState = 'waiting' | 'running' | 'crashed';

/**
 * @fileOverview صفحة الكراش العالمية v105.0 - High Performance Engine
 * تم فصل منطق المحاكاة البصري عن نبض قاعدة البيانات لضمان سلاسة Stake-level.
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

  // مرجع لتحديث الـ Multiplier في الـ RequestAnimationFrame لضمان 60fps
  const requestRef = useRef<number | null>(null);

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

  const updateMultiplier = (startTime: number) => {
    const now = Date.now();
    const elapsed = (now - startTime) / 1000;
    const currentMult = Math.pow(1.07, elapsed);
    setMultiplier(currentMult);
    requestRef.current = requestAnimationFrame(() => updateMultiplier(startTime));
  };

  useEffect(() => {
    if (!globalGame) return;

    const startTime = new Date(globalGame.startTime).getTime();
    const now = Date.now();
    const elapsed = (now - startTime) / 1000;

    if (globalGame.status === 'waiting') {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      setLocalState('waiting');
      setLocalTimer(Math.max(0, Math.ceil(10 - elapsed)));
      setMultiplier(1.0);
      setHasCashout(false);

      if (elapsed >= 10) {
        // محاكاة السيرفر: الانتقال للجولة القادمة
        const crashPoint = 1 + (Math.random() * Math.random() * 15);
        updateDoc(gameStateRef, {
          status: 'running',
          startTime: new Date().toISOString(),
          crashPoint: crashPoint
        }).catch(() => {});
      }
    } 
    else if (globalGame.status === 'running') {
      setLocalState('running');
      requestRef.current = requestAnimationFrame(() => updateMultiplier(startTime));

      // التحقق من الانهيار (في السيرفر الحقيقي هذا يتم هناك)
      const currentMult = Math.pow(1.07, elapsed);
      if (currentMult >= globalGame.crashPoint) {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        const newHistory = [currentMult, ...(globalGame.history || [])].slice(0, 20);
        updateDoc(gameStateRef, {
          status: 'crashed',
          startTime: new Date().toISOString(),
          history: newHistory
        }).catch(() => {});
        setCurrentBet(null);
      }
    } 
    else if (globalGame.status === 'crashed') {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      setLocalState('crashed');
      setMultiplier(globalGame.crashPoint || 1.0);
      
      if (elapsed >= 5) {
        updateDoc(gameStateRef, {
          status: 'waiting',
          startTime: new Date().toISOString()
        }).catch(() => {});
      }
    }

    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [globalGame]);

  const handlePlaceBet = async (amount: number) => {
    if (!dbUser || amount > (dbUser.totalBalance || 0) || localState !== 'waiting') return;
    try {
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amount) });
      setCurrentBet(amount);
      setFeedback({ type: 'success', msg: 'تم تسجيل الرهان في الشبكة.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'فشل بروتوكول الرهان.' });
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
      setFeedback({ type: 'success', msg: `اكتمال الصرف: +$${profit.toFixed(2)}` });
      setCurrentBet(null);
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'خطأ في مزامنة العوائد.' });
    }
  };

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col h-[100dvh] bg-[#fcfdfe] overflow-hidden font-body" dir="rtl">
        <CrashHeader user={dbUser} />
        
        <div className="flex-1 flex flex-col relative">
          {/* Main Visualizer Area - Balanced height for mobile visibility */}
          <div className="flex-[0.7] md:flex-[1.2] relative overflow-hidden">
             <CrashVisualizer multiplier={multiplier} state={localState} />
             <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                <CrashMultiplier multiplier={multiplier} state={localState} />
             </div>
             <CrashStatus state={localState} timer={localTimer} multiplier={multiplier} />
             <div className="absolute top-4 left-4 right-4 z-40">
                <CrashHistory results={globalGame?.history || []} />
             </div>
             {/* Sovereign Protocol Label */}
             <div className="absolute bottom-4 right-6 z-40 opacity-20 select-none">
                <p className="text-[7px] font-black text-[#002d4d] uppercase tracking-[0.4em]">Active Node Protocol</p>
             </div>
          </div>
          
          {/* Controls Area - High tactile area */}
          <div className="flex-1 shrink-0 grid grid-cols-1 md:grid-cols-12 gap-0 bg-white border-t border-gray-100 shadow-[0_-20px_100px_rgba(0,45,77,0.05)] relative z-50 overflow-y-auto scrollbar-none">
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
             <div className="md:col-span-7 lg:col-span-8 p-6 bg-gray-50/30">
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
