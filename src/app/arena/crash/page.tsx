
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
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { ShieldCheck, Loader2 } from "lucide-react";

type GameState = 'waiting' | 'running' | 'crashed';

/**
 * @fileOverview صفحة الكراش العالمية v140.0 - Real Node.js Server Integration
 * تم ربط الصفحة بخادم WebSocket حقيقي لاستلام الحقيقة السحابية المتزامنة.
 */
export default function CrashPage() {
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [multiplier, setMultiplier] = useState(1.0);
  const [status, setStatus] = useState<GameState>('waiting');
  const [timer, setTimer] = useState(10);
  const [history, setHistory] = useState<number[]>([]);
  const [currentBet, setCurrentBet] = useState<number | null>(null);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', msg: string } | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);

  // 1. مزامنة بيانات المستخدم السيادية من Firestore
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

  // 2. الاتصال بسيرفر Node.js الحقيقي عبر WebSockets
  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket('ws://localhost:3001');
      
      ws.onopen = () => {
        setFeedback({ type: 'info', msg: 'تم الاتصال بالمفاعل المركزي.' });
        setTimeout(() => setFeedback(null), 2000);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'WAITING':
            setStatus('waiting');
            setTimer(data.timer);
            setMultiplier(1.0);
            setHasCashedOut(false);
            break;
          case 'ROUND_START':
            setStatus('running');
            break;
          case 'MULTIPLIER_UPDATE':
            setMultiplier(data.multiplier);
            setStatus('running');
            break;
          case 'ROUND_CRASHED':
            setStatus('crashed');
            setMultiplier(data.multiplier);
            setHistory(data.history);
            setCurrentBet(null);
            break;
          case 'SYNC_STATE':
            setStatus(data.state.status);
            setHistory(data.state.history);
            setMultiplier(data.state.multiplier);
            break;
          case 'ROUND_INIT':
            setHasCashedOut(false);
            setCurrentBet(null);
            break;
        }
      };

      ws.onclose = () => {
        setFeedback({ type: 'error', msg: 'فقد الاتصال بالمفاعل. جاري إعادة المحاولة...' });
        setTimeout(connect, 3000);
      };

      socketRef.current = ws;
    };

    connect();
    return () => socketRef.current?.close();
  }, []);

  const handlePlaceBet = async (amount: number) => {
    if (!dbUser || amount > (dbUser.totalBalance || 0) || status !== 'waiting' || currentBet) return;
    try {
      // تنفيذ المعاملة المالية في Firestore (نظام الرصيد)
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amount) });
      
      // إرسال إشارة الرهان للسيرفر الحقيقي
      socketRef.current?.send(JSON.stringify({ 
        type: 'PLACE_BET', 
        user: dbUser.displayName, 
        amount 
      }));

      setCurrentBet(amount);
      setFeedback({ type: 'success', msg: 'تم توثيق الرهان في السيرفر.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'فشل بروتوكول الرهان.' });
    }
  };

  const handleCashout = async () => {
    if (!dbUser || !currentBet || hasCashedOut || status !== 'running') return;
    const profit = currentBet * multiplier;
    setHasCashedOut(true);
    try {
      // إرسال إشارة الانسحاب للسيرفر
      socketRef.current?.send(JSON.stringify({ 
        type: 'CASHOUT', 
        user: dbUser.displayName 
      }));

      // تحديث الرصيد الحقيقي في Firestore
      await updateDoc(doc(db, "users", dbUser.id), { 
        totalBalance: increment(profit),
        totalProfits: increment(profit - currentBet)
      });

      setFeedback({ type: 'success', msg: `تم تنفيذ الصرف: +$${profit.toFixed(2)}` });
      setCurrentBet(null);
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'خطأ في حقن الأرباح.' });
    }
  };

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
                   <p className="text-[8px] font-black text-[#002d4d] uppercase tracking-[0.6em] [writing-mode:vertical-lr] rotate-180">NAMIX NODE SERVER</p>
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
                />
             </div>

             <div className="p-4 flex flex-col items-center gap-2 opacity-30 select-none">
                <div className="flex items-center gap-2">
                   <ShieldCheck size={10} className="text-blue-500" />
                   <p className="text-[7px] font-black uppercase tracking-widest text-[#002d4d]">Node.js Engine Active</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </Shell>
  );
}
