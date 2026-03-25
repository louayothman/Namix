
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { ShieldCheck, Loader2 } from "lucide-react";

/**
 * @fileOverview صفحة الكراش السيادية v150.0 - Cloud Sovereign Engine (Vercel Ready)
 * تم استبدال خادم Node.js المنفصل بمحرك حالة سحابي يعتمد على Firestore كمصدر حقيقة.
 * يضمن هذا النظام التزامن المطلق بين كافة المستخدمين وسهولة النشر على Vercel.
 */
export default function CrashPage() {
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [multiplier, setMultiplier] = useState(1.0);
  const [status, setStatus] = useState<'waiting' | 'running' | 'crashed'>('waiting');
  const [timer, setTimer] = useState(10);
  const [history, setHistory] = useState<number[]>([]);
  const [currentBet, setCurrentBet] = useState<number | null>(null);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);
  const [gameState, setGameState] = useState<any>(null);

  // 1. مزامنة بيانات المستثمر السيادية
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

  // 2. محرك الحالة السيادي (The "Server" in Cloud)
  useEffect(() => {
    const gameRef = doc(db, "system_settings", "crash_game");
    
    const unsub = onSnapshot(gameRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setGameState(data);
        setStatus(data.status);
        setHistory(data.history || []);
      }
    });

    return () => unsub();
  }, [db]);

  // 3. حلقة التزامن اللحظي (The Tick Loop)
  useEffect(() => {
    if (!gameState) return;

    const interval = setInterval(() => {
      const now = Date.now();
      
      if (gameState.status === 'waiting') {
        const startAt = new Date(gameState.nextRoundAt).getTime();
        const diff = Math.max(0, Math.ceil((startAt - now) / 1000));
        setTimer(diff);
        setMultiplier(1.0);
        if (diff === 0 && !hasCashedOut) {
           // الجولة ستبدأ قريباً
        }
      } else if (gameState.status === 'running') {
        const startAt = new Date(gameState.startTime).getTime();
        const t = (now - startAt) / 1000;
        const currentMult = Math.exp(0.055 * t);
        
        // التحقق من الانهيار محلياً للتزامن البصري قبل وصول تحديث Firestore
        if (currentMult >= gameState.crashPoint) {
          setMultiplier(gameState.crashPoint);
          setStatus('crashed');
        } else {
          setMultiplier(currentMult);
        }
      } else if (gameState.status === 'crashed') {
        setMultiplier(gameState.crashPoint);
      }
    }, 50); // 50ms لضمان سلاسة Stake-Level

    return () => clearInterval(interval);
  }, [gameState, hasCashedOut]);

  const handlePlaceBet = async (amount: number) => {
    if (!dbUser || amount > (dbUser.totalBalance || 0) || status !== 'waiting' || currentBet) return;
    try {
      setLoading(true);
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amount) });
      
      // توثيق الرهان في الجولة الحالية
      await setDoc(doc(db, "crash_bets", `${gameState.roundId}_${dbUser.id}`), {
        roundId: gameState.roundId,
        userId: dbUser.id,
        user: dbUser.displayName,
        amount,
        status: 'active',
        createdAt: serverTimestamp()
      });

      setCurrentBet(amount);
      setHasCashedOut(false);
      setFeedback({ type: 'success', msg: 'تم قبول الرهان في المفاعل.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'فشل بروتوكول الرهان.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCashout = async () => {
    if (!dbUser || !currentBet || hasCashedOut || status !== 'running') return;
    
    const profit = currentBet * multiplier;
    setHasCashedOut(true);
    
    try {
      // عملية ذرية لحقن الأرباح
      await updateDoc(doc(db, "users", dbUser.id), { 
        totalBalance: increment(profit),
        totalProfits: increment(profit - currentBet)
      });

      await updateDoc(doc(db, "crash_bets", `${gameState.roundId}_${dbUser.id}`), {
        status: 'cashed',
        multiplier: multiplier,
        payout: profit
      });

      setFeedback({ type: 'success', msg: `تم تنفيذ الصرف السيادي: +$${profit.toFixed(2)}` });
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'خطأ في حقن العوائد.' });
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col h-[100dvh] bg-[#fcfdfe] overflow-hidden font-body" dir="rtl">
        <CrashHeader user={dbUser} />
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden relative">
          
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col relative border-l border-gray-100 bg-[#fcfdfe] overflow-hidden">
             <div className="p-4 z-40 bg-white/40 backdrop-blur-sm border-b border-gray-50">
                <CrashHistory results={history} />
             </div>

             <div className="flex-1 relative overflow-hidden">
                <CrashVisualizer multiplier={multiplier} state={status} />
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                   <CrashMultiplier multiplier={multiplier} state={status} />
                </div>
                <CrashStatus state={status} timer={timer} multiplier={multiplier} />
                
                <div className="absolute bottom-6 right-8 z-40 opacity-10 select-none hidden md:block">
                   <p className="text-[8px] font-black text-[#002d4d] uppercase tracking-[0.6em] [writing-mode:vertical-lr] rotate-180">NAMIX SOVEREIGN ENGINE</p>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 xl:col-span-3 flex flex-col bg-white shadow-[-20px_0_80px_rgba(0,45,77,0.03)] z-50 overflow-y-auto scrollbar-none border-r border-gray-50">
             <div className="p-6 border-b border-gray-50">
                <CrashControls 
                  state={status} 
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
                  state={status}
                  currentBet={currentBet}
                  hasCashedOut={hasCashedOut}
                  multiplier={multiplier}
                  roundId={gameState?.roundId}
                />
             </div>

             <div className="p-4 flex flex-col items-center gap-2 opacity-30 select-none">
                <div className="flex items-center gap-2">
                   <ShieldCheck size={10} className="text-blue-500" />
                   <p className="text-[7px] font-black uppercase tracking-widest text-[#002d4d]">Vercel Edge Ready Engine</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </Shell>
  );
}
