
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
 * @fileOverview صفحة الكراش العالمية v110.0 - Professional Casino Architecture
 * تم إعادة بناء الواجهة لتكون Grid-based تضاهي المنصات العالمية (Stake/Roobet).
 */
export default function CrashPage() {
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [multiplier, setMultiplier] = useState(1.0);
  const [localState, setLocalState] = useState<GameState>('waiting');
  const [localTimer, setLocalTimer] = useState(10);
  const [currentBet, setCurrentBet] = useState<number | null>(null);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);

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

  // حساب المضاعف الفيزيائي المتزامن
  const updateMultiplier = (startTime: number) => {
    const now = Date.now();
    const elapsed = (now - startTime) / 1000;
    // معادلة النمو الأسي العالمية لناميكس
    const currentMult = Math.exp(0.055 * elapsed);
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
      setLocalTimer(Math.max(0, Math.ceil(8 - elapsed))); // 8 seconds betting phase
      setMultiplier(1.0);
      setHasCashedOut(false);

      // محاكاة السيرفر المركزي لتنفيذ الجولة
      if (elapsed >= 8) {
        const crashPoint = 1 + (Math.random() * (1 / (1 - Math.random())) * 0.96);
        updateDoc(gameStateRef, {
          status: 'running',
          startTime: new Date().toISOString(),
          crashPoint: Math.max(1.01, crashPoint)
        }).catch(() => {});
      }
    } 
    else if (globalGame.status === 'running') {
      setLocalState('running');
      requestRef.current = requestAnimationFrame(() => updateMultiplier(startTime));

      const currentMult = Math.exp(0.055 * elapsed);
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
      
      if (elapsed >= 4) {
        updateDoc(gameStateRef, {
          status: 'waiting',
          startTime: new Date().toISOString()
        }).catch(() => {});
      }
    }

    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [globalGame]);

  const handlePlaceBet = async (amount: number) => {
    if (!dbUser || amount > (dbUser.totalBalance || 0) || localState !== 'waiting' || currentBet) return;
    try {
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amount) });
      setCurrentBet(amount);
      setFeedback({ type: 'success', msg: 'تم إيداع الرهان في المفاعل.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'فشل بروتوكول الرهان.' });
    }
  };

  const handleCashout = async () => {
    if (!dbUser || !currentBet || hasCashedOut || localState !== 'running') return;
    const profit = currentBet * multiplier;
    setHasCashedOut(true);
    try {
      await updateDoc(doc(db, "users", dbUser.id), { 
        totalBalance: increment(profit),
        totalProfits: increment(profit - currentBet)
      });
      setFeedback({ type: 'success', msg: `تم الصرف: +$${profit.toFixed(2)}` });
      setCurrentBet(null);
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'خطأ في مزامنة الأرباح.' });
    }
  };

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col h-[100dvh] bg-[#fcfdfe] overflow-hidden font-body" dir="rtl">
        <CrashHeader user={dbUser} />
        
        {/* Main Grid Layout: Interactive Area + Stats */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden relative">
          
          {/* Section 1: The Sovereign Reactor (Left - Desktop) */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col relative border-l border-gray-100 bg-[#fcfdfe] overflow-hidden">
             
             {/* History Rail - Top Fixed */}
             <div className="p-4 z-40 bg-white/40 backdrop-blur-sm border-b border-gray-50">
                <CrashHistory results={globalGame?.history || []} />
             </div>

             {/* Dynamic Visualizer Area */}
             <div className="flex-1 relative overflow-hidden">
                <CrashVisualizer multiplier={multiplier} state={localState} />
                
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                   <CrashMultiplier multiplier={multiplier} state={localState} />
                </div>

                <CrashStatus state={localState} timer={localTimer} multiplier={multiplier} />
                
                {/* Branding vertical rail */}
                <div className="absolute bottom-6 right-8 z-40 opacity-10 select-none hidden md:block">
                   <p className="text-[8px] font-black text-[#002d4d] uppercase tracking-[0.6em] [writing-mode:vertical-lr] rotate-180">NAMIX SOVEREIGN ENGINE</p>
                </div>
             </div>
          </div>

          {/* Section 2: Command & Control Panel (Right - Desktop) */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col bg-white shadow-[-20px_0_80px_rgba(0,45,77,0.03)] z-50 overflow-y-auto scrollbar-none border-r border-gray-50">
             
             {/* Betting Controls */}
             <div className="p-6 border-b border-gray-50">
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

             {/* Live Activity Radar */}
             <div className="flex-1 p-6 bg-gray-50/20">
                <CrashLiveBets 
                  state={localState}
                  currentBet={currentBet}
                  hasCashedOut={hasCashedOut}
                  multiplier={multiplier}
                />
             </div>

             {/* Footer Protection Label */}
             <div className="p-4 flex flex-col items-center gap-2 opacity-30 select-none">
                <div className="flex items-center gap-2">
                   <ShieldCheck size={10} className="text-blue-500" />
                   <p className="text-[7px] font-black uppercase tracking-widest text-[#002d4d]">Provably Fair Protocol v4.0</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </Shell>
  );
}
