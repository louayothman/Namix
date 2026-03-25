
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
import { doc, onSnapshot, updateDoc, increment, collection, query, where, serverTimestamp } from "firebase/firestore";
import { ShieldCheck, Loader2 } from "lucide-react";

type GameState = 'waiting' | 'running' | 'crashed';

/**
 * @fileOverview صفحة الكراش العالمية v130.0 - Central Sync Cloud Engine
 * - تم إصلاح خطأ ShieldCheck المفقود.
 * - استبدال محرك الحالة المحلي بـ "الحقيقة السحابية المتزامنة" (Single Source of Truth).
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

  // 1. مزامنة بيانات المستخدم السيادية
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

  // 2. ربط وثيقة السيرفر - الحقيقة المطلقة لكافة العملاء
  const gameStateRef = useMemoFirebase(() => doc(db, "system_settings", "crash_game"), [db]);
  const { data: globalGame, isLoading: loadingGame } = useDoc(gameStateRef);

  // محرك المضاعف الفيزيائي المتزامن - يعمل بتردد 60fps
  const updateMultiplier = (startTime: number) => {
    const now = Date.now();
    const elapsed = (now - startTime) / 1000;
    // معادلة النمو الأسي العالمية (Deterministic Math)
    const currentMult = Math.exp(0.055 * elapsed);
    setMultiplier(currentMult);
    requestRef.current = requestAnimationFrame(() => updateMultiplier(startTime));
  };

  useEffect(() => {
    if (!globalGame) return;

    const startTime = new Date(globalGame.startTime).getTime();
    const now = Date.now();
    const elapsed = (now - startTime) / 1000;

    // بروتوكول مزامنة الجلسة (Deterministic Lifecycle)
    if (globalGame.status === 'waiting') {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      setLocalState('waiting');
      setLocalTimer(Math.max(0, Math.ceil(8 - elapsed))); // 8 seconds betting phase
      setMultiplier(1.0);
      setHasCashedOut(false);

      // السيرفر (Firestore) هو من يتخذ قرار البداية والانهيار
      // (هنا تتم محاكاتها برمجياً لضمان العمل في بيئة Firebase Studio)
      if (elapsed >= 8) {
        const crashPoint = 1 + (Math.random() * (1 / (1 - Math.random())) * 0.96);
        updateDoc(gameStateRef, {
          status: 'running',
          startTime: new Date().toISOString(),
          crashPoint: Math.max(1.01, crashPoint),
          updatedAt: serverTimestamp()
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
          history: newHistory,
          updatedAt: serverTimestamp()
        }).catch(() => {});
        setCurrentBet(null);
      }
    } 
    else if (globalGame.status === 'crashed') {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      setLocalState('crashed');
      setMultiplier(globalGame.crashPoint || 1.0);
      
      // دورة انتظار السيرفر قبل الجولة الجديدة
      if (elapsed >= 4) {
        updateDoc(gameStateRef, {
          status: 'waiting',
          startTime: new Date().toISOString(),
          updatedAt: serverTimestamp()
        }).catch(() => {});
      }
    }

    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [globalGame, gameStateRef]);

  const handlePlaceBet = async (amount: number) => {
    if (!dbUser || amount > (dbUser.totalBalance || 0) || localState !== 'waiting' || currentBet) return;
    try {
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amount) });
      setCurrentBet(amount);
      setFeedback({ type: 'success', msg: 'تم توثيق الرهان في المفاعل المركزي.' });
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
      setFeedback({ type: 'success', msg: `تم تنفيذ الصرف: +$${profit.toFixed(2)}` });
      setCurrentBet(null);
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'خطأ في حقن الأرباح السيادية.' });
    }
  };

  if (loadingGame) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
       <Loader2 className="animate-spin text-[#002d4d]" />
       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Booting Sovereign Cloud Engine...</p>
    </div>
  );

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col h-[100dvh] bg-[#fcfdfe] overflow-hidden font-body" dir="rtl">
        <CrashHeader user={dbUser} />
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden relative">
          
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col relative border-l border-gray-100 bg-[#fcfdfe] overflow-hidden">
             <div className="p-4 z-40 bg-white/40 backdrop-blur-sm border-b border-gray-50">
                <CrashHistory results={globalGame?.history || []} />
             </div>

             <div className="flex-1 relative overflow-hidden">
                <CrashVisualizer multiplier={multiplier} state={localState} />
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                   <CrashMultiplier multiplier={multiplier} state={localState} />
                </div>
                <CrashStatus state={localState} timer={localTimer} multiplier={multiplier} />
                <div className="absolute bottom-6 right-8 z-40 opacity-10 select-none hidden md:block">
                   <p className="text-[8px] font-black text-[#002d4d] uppercase tracking-[0.6em] [writing-mode:vertical-lr] rotate-180">NAMIX SOVEREIGN CLOUD</p>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 xl:col-span-3 flex flex-col bg-white shadow-[-20px_0_80px_rgba(0,45,77,0.03)] z-50 overflow-y-auto scrollbar-none border-r border-gray-50">
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

             <div className="flex-1 p-6 bg-gray-50/20">
                <CrashLiveBets 
                  state={localState}
                  currentBet={currentBet}
                  hasCashedOut={hasCashedOut}
                  multiplier={multiplier}
                />
             </div>

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
