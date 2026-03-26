
"use client";

import { useState, useEffect, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Gem, 
  Bomb, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  RotateCcw,
  Coins,
  Loader2,
  Plus,
  CheckCircle2,
  Activity,
  Sparkles,
  Layers,
  Search,
  Radar
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DepositSheet } from "@/components/deposit/DepositSheet";

const GRID_SIZE = 25;

/**
 * 1. شريط التحكم العلوي النخبوي
 */
function MinesHeader({ balance, onOpenDeposit }: { balance: number, onOpenDeposit: () => void }) {
  return (
    <header className="px-8 py-6 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-xl z-50 shrink-0 shadow-sm sticky top-0">
      <div className="flex items-center gap-4">
         <Link href="/arena">
           <Button variant="ghost" size="icon" className="h-12 w-12 rounded-[20px] bg-gray-50 text-[#002d4d] active:scale-90 transition-all hover:bg-[#002d4d] hover:text-white">
             <ChevronRight className="h-6 w-6" />
           </Button>
         </Link>
         <div className="space-y-0.5 text-right">
            <h1 className="text-xl font-black text-[#002d4d] leading-none tracking-tight">مناجم السيولة</h1>
            <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Liquid Mines Sovereign</p>
         </div>
      </div>
      
      <div className="flex items-center gap-3 bg-gray-50/80 p-1.5 pr-5 rounded-full border border-gray-100 shadow-inner">
         <div className="text-right">
            <p className="text-[7px] font-black text-gray-400 uppercase leading-none tracking-widest">المحفظة الجارية</p>
            <p className="text-sm font-black text-[#002d4d] tabular-nums mt-1">${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
         </div>
         <button onClick={onOpenDeposit} className="h-9 w-9 rounded-full bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-xl active:scale-90 transition-all">
            <Plus size={18} />
         </button>
      </div>
    </header>
  );
}

/**
 * 2. مفاعل الاستكشاف (The Reactor) - ترقية بصرية شاملة
 */
function MinesReactor({ 
  grid, 
  gameState, 
  onTileClick, 
  betAmount, 
  currentMultiplier 
}: any) {
  return (
    <section className="relative aspect-square w-full max-w-[460px] mx-auto bg-white rounded-[48px] p-6 border border-gray-50 shadow-[0_32px_64px_-16px_rgba(0,45,77,0.12)] overflow-hidden group">
      
      {/* Dynamic Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:scale-105 transition-transform duration-[8s]">
         <div className="grid grid-cols-5 h-full w-full">
            {[...Array(25)].map((_, i) => <div key={i} className="border border-[#002d4d]" />)}
         </div>
      </div>

      <div className="grid grid-cols-5 gap-3.5 h-full relative z-10">
        {grid.map((tile: any, i: number) => (
          <motion.button
            key={i}
            whileHover={gameState === 'playing' && tile.status === 'hidden' ? { scale: 1.05, rotate: 2 } : {}}
            whileTap={gameState === 'playing' && tile.status === 'hidden' ? { scale: 0.95 } : {}}
            onClick={() => onTileClick(i)}
            className={cn(
              "relative rounded-[20px] shadow-sm transition-all duration-500 flex items-center justify-center overflow-hidden border",
              tile.status === 'hidden' && "bg-gray-50 border-gray-100 hover:bg-white hover:shadow-xl hover:border-blue-100",
              tile.status === 'gem' && "bg-[#002d4d] text-[#f9a885] border-[#002d4d] shadow-2xl",
              tile.status === 'mine' && tile.isExploded ? "bg-red-500 text-white border-red-600 shadow-2xl animate-shake" : 
              tile.status === 'mine' ? "bg-red-50 text-red-200 border-red-100 opacity-40" : ""
            )}
          >
            <AnimatePresence mode="wait">
              {tile.status === 'gem' && (
                <motion.div key="gem" initial={{ scale: 0, rotate: -45, y: 20 }} animate={{ scale: 1, rotate: 0, y: 0 }} transition={{ type: 'spring', damping: 12 }}>
                  <Gem className="h-8 w-8 fill-current drop-shadow-[0_0_15px_rgba(249,168,133,0.5)]" />
                </motion.div>
              )}
              {tile.status === 'mine' && (
                <motion.div key="mine" initial={{ scale: 0, rotate: 45, y: -20 }} animate={{ scale: 1, rotate: 0, y: 0 }} transition={{ type: 'spring' }}>
                  <Bomb className="h-8 w-8 fill-current" />
                </motion.div>
              )}
              {tile.status === 'hidden' && gameState === 'playing' && (
                <motion.div key="hidden" className="h-2 w-2 rounded-full bg-blue-100/50 animate-pulse" />
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Result Overlays */}
      <AnimatePresence>
        {(gameState === 'won' || gameState === 'lost') && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }} 
            className="absolute inset-0 z-50 flex items-center justify-center p-8 pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              className={cn(
                "p-12 rounded-[48px] shadow-2xl border border-white/20 text-center space-y-6", 
                gameState === 'won' ? "bg-emerald-600/90" : "bg-red-600/90"
              )}
            >
              <div className="h-24 w-24 rounded-[32px] bg-white/20 flex items-center justify-center mx-auto shadow-inner border border-white/10">
                {gameState === 'won' ? <CheckCircle2 size={48} className="text-white"/> : <RotateCcw size={48} className="text-white"/>}
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">{gameState === 'won' ? 'استخراج ناجح!' : 'عطل تقني'}</h2>
                <p className="text-[13px] font-bold text-white/80 leading-relaxed">
                  {gameState === 'won' ? `لقد تم حقن أرباح قدرها $${(Number(betAmount) * currentMultiplier).toFixed(2)} في محفظتك.` : 'لقد اصطدمت بعقدة معطلة، حاول معايرة البحث مجدداً.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/**
 * 3. لوحة الرهان النخبوية (Betting Panel)
 */
function BettingPanel({ 
  betAmount, 
  setBetAmount, 
  minesCount, 
  setMinesCount, 
  gameState, 
  loading, 
  dbUser, 
  startGame, 
  cashout, 
  setGameState,
  currentMultiplier
}: any) {
  return (
    <section className="space-y-6">
      <Card className="border-none shadow-sm rounded-[40px] bg-white border border-gray-50 overflow-hidden transition-all hover:shadow-xl">
        <CardContent className="p-10 space-y-10">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-4">
              <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-[0.2em]">مبلغ الاستكشاف ($)</Label>
              <div className="relative group">
                <Input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(e.target.value)} 
                  disabled={gameState === 'playing'} 
                  className="h-20 rounded-[32px] bg-gray-50 border-none font-black text-center text-3xl text-[#002d4d] shadow-inner focus-visible:ring-4 focus-visible:ring-blue-500/5 transition-all" 
                />
                <Coins className="absolute left-8 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-200 group-focus-within:text-blue-200 transition-colors" />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-[0.2em]">عدد الأعطال (Mines)</Label>
              <div className="grid grid-cols-4 gap-3">
                {[3, 5, 10, 24].map(num => (
                  <button 
                    key={num} 
                    onClick={() => setMinesCount(num)} 
                    disabled={gameState === 'playing'} 
                    className={cn(
                      "h-14 rounded-[20px] font-black text-base transition-all active:scale-90", 
                      minesCount === num ? "bg-[#002d4d] text-[#f9a885] shadow-xl scale-105" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {gameState === 'playing' ? (
              <Button 
                onClick={cashout} 
                disabled={loading} 
                className="w-full h-24 rounded-[36px] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-2xl shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-6 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                {loading ? <Loader2 className="animate-spin h-10 w-10" /> : (
                  <>
                    <span>سحب الأرباح الآن</span>
                    <Badge className="bg-white/20 text-white border-none font-black text-lg tabular-nums px-6 py-2 rounded-2xl shadow-lg">$ {(Number(betAmount) * currentMultiplier).toFixed(2)}</Badge>
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={startGame} 
                disabled={loading || !dbUser || Number(betAmount) > (dbUser?.totalBalance || 0)} 
                className="w-full h-24 rounded-[36px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-2xl shadow-2xl active:scale-[0.98] transition-all group"
              >
                {loading ? <Loader2 className="animate-spin h-10 w-10" /> : (
                  <div className="flex items-center gap-6">
                    <span>بدء المحاولة</span>
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner group-hover:rotate-12 transition-transform">
                       <Zap className="h-7 w-7 text-[#f9a885] fill-current" />
                    </div>
                  </div>
                )}
              </Button>
            )}
            {(gameState === 'won' || gameState === 'lost') && (
              <button onClick={() => setGameState('idle')} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] hover:text-[#002d4d] flex items-center justify-center gap-4 transition-all py-2 group">
                <RotateCcw className="h-4 w-4 group-hover:rotate-[-180deg] transition-transform duration-700" /> جولة استكشاف جديدة
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

/**
 * 4. تفاصيل الميثاق (Details)
 */
function MinesDetails({ currentMultiplier, nextMultiplier }: any) {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="p-8 bg-white rounded-[40px] border border-gray-50 shadow-sm text-center space-y-2 group transition-all hover:shadow-md">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المضاعف الحالي</p>
          <p className="text-3xl font-black text-emerald-600 tabular-nums transition-transform group-hover:scale-110">x{currentMultiplier.toFixed(2)}</p>
        </div>
        <div className="p-8 bg-white rounded-[40px] border border-gray-50 shadow-sm text-center space-y-2 group transition-all hover:shadow-md">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">العقدة القادمة</p>
          <p className="text-3xl font-black text-blue-600 tabular-nums transition-transform group-hover:scale-110">x{nextMultiplier.toFixed(2)}</p>
        </div>
      </div>

      <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 flex items-start gap-6 group transition-all hover:bg-white">
        <div className="h-14 w-14 rounded-[24px] bg-white flex items-center justify-center text-emerald-500 shadow-inner shrink-0 group-hover:rotate-12 transition-transform">
           <ShieldCheck size={32} />
        </div>
        <div className="text-right space-y-1 pt-1">
           <p className="text-base font-black text-[#002d4d]">نظام التوثيق والنزاهة</p>
           <p className="text-[11px] font-bold text-gray-400 leading-[1.8]">يخضع محرك البحث لبروتوكول الملاءة المالية السيادي بنسبة 25% (Sovereign Accuracy Standard).</p>
        </div>
      </div>
    </section>
  );
}

export default function MinesPage() {
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [betAmount, setBetAmount] = useState("10");
  const [minesCount, setMinesCount] = useState(3);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [grid, setGrid] = useState<any[]>(Array(GRID_SIZE).fill({ status: 'hidden' }));
  const [minesPositions, setMinesPositions] = useState<number[]>([]);
  const [revealedGems, setRevealedGems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
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

  const calculateMultiplier = (gems: number, totalMines: number) => {
    if (gems === 0) return 1;
    let mult = 1;
    for (let i = 0; i < gems; i++) {
      mult *= (GRID_SIZE - i) / (GRID_SIZE - totalMines - i);
    }
    return mult * 0.98;
  };

  const currentMultiplier = useMemo(() => calculateMultiplier(revealedGems, minesCount), [revealedGems, minesCount]);
  const nextMultiplier = useMemo(() => calculateMultiplier(revealedGems + 1, minesCount), [revealedGems, minesCount]);

  const startGame = async () => {
    if (!dbUser || gameState === 'playing') return;
    const amt = Number(betAmount);
    if (amt > dbUser.totalBalance || amt < 1) return;

    setLoading(true);
    setShowIntro(true);

    // شاشة الانترو السينمائية لمدة 2.5 ثانية
    setTimeout(async () => {
      setShowIntro(false);
      try {
        const positions: number[] = [];
        while (positions.length < minesCount) {
          const r = Math.floor(Math.random() * GRID_SIZE);
          if (!positions.includes(r)) positions.push(r);
        }
        await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amt) });
        setMinesPositions(positions);
        setGrid(Array(GRID_SIZE).fill({ status: 'hidden' }));
        setRevealedGems(0);
        setGameState('playing');
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 2500);
  };

  const handleTileClick = (idx: number) => {
    if (gameState !== 'playing' || grid[idx].status !== 'hidden') return;

    // حوكمة مالية: 75% فوز للمنصة (25% للمستخدم)
    const forceLoseDecision = Math.random() < 0.75;
    let isMine = minesPositions.includes(idx);

    if (forceLoseDecision && !isMine) {
      // إذا كان المفروض يخسر والخانة مش لغم، نحولها للغم وننقل اللغم القديم
      const otherMineIdx = minesPositions.find(p => !grid[p].revealed);
      if (otherMineIdx !== undefined) {
        setMinesPositions(prev => prev.map(p => p === otherMineIdx ? idx : p));
        isMine = true;
      }
    }

    if (isMine) {
      setGrid(grid.map((tile, i) => ({ 
        status: minesPositions.includes(i) ? 'mine' : 'hidden', 
        isExploded: i === idx 
      })));
      setGameState('lost');
    } else {
      const newGrid = [...grid];
      newGrid[idx] = { status: 'gem' };
      setGrid(newGrid);
      setRevealedGems(prev => prev + 1);
      if (revealedGems + 1 === GRID_SIZE - minesCount) cashout();
    }
  };

  const cashout = async () => {
    if (gameState !== 'playing' || revealedGems === 0) return;
    setLoading(true);
    try {
      const winAmt = Number(betAmount) * currentMultiplier;
      await updateDoc(doc(db, "users", dbUser.id), { 
        totalBalance: increment(winAmt),
        totalProfits: increment(winAmt - Number(betAmount))
      });
      await addDoc(collection(db, "game_history"), {
        userId: dbUser.id,
        game: "mines",
        betAmount: Number(betAmount),
        multiplier: currentMultiplier,
        profit: winAmt - Number(betAmount),
        createdAt: new Date().toISOString()
      });
      setGameState('won');
      setGrid(grid.map((tile, i) => ({ status: minesPositions.includes(i) ? 'mine' : tile.status })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col h-screen bg-[#fcfdfe] font-body text-right overflow-hidden" dir="rtl">
        
        <MinesHeader balance={dbUser?.totalBalance} onOpenDeposit={() => setDepositOpen(true)} />

        <div className="flex-1 overflow-y-auto pb-32">
          <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">
            <MinesReactor 
              grid={grid}
              gameState={gameState}
              onTileClick={handleTileClick}
              betAmount={betAmount}
              currentMultiplier={currentMultiplier}
            />

            <BettingPanel 
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              minesCount={minesCount}
              setMinesCount={setMinesCount}
              gameState={gameState}
              loading={loading}
              dbUser={dbUser}
              startGame={startGame}
              cashout={cashout}
              setGameState={setGameState}
              currentMultiplier={currentMultiplier}
            />

            <MinesDetails 
              currentMultiplier={currentMultiplier}
              nextMultiplier={nextMultiplier}
            />
          </div>
        </div>

        {/* إنفوجرافيك الافتتاحية النخبوية */}
        <AnimatePresence>
          {showIntro && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[100] bg-[#002d4d] backdrop-blur-3xl flex flex-col items-center justify-center gap-12"
            >
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                 transition={{ duration: 2.5, repeat: Infinity }}
                 className="h-44 w-44 rounded-[56px] bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden"
               >
                  <Layers size={80} className="text-[#f9a885] animate-pulse" />
                  <motion.div 
                    animate={{ y: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent"
                  />
               </motion.div>
               <div className="text-center space-y-4">
                  <div className="flex flex-col items-center gap-2">
                     <h2 className="text-3xl font-black text-white tracking-tight">مسح حقول السيولة...</h2>
                     <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#f9a885] to-transparent rounded-full" />
                  </div>
                  <div className="flex items-center gap-3 justify-center text-blue-300">
                     <Radar size={16} className="text-emerald-500 animate-spin" />
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Scanning Geodesic Nodes</p>
                  </div>
               </div>
               
               {/* رادار استخباراتي صغير في الزاوية */}
               <div className="absolute top-12 right-12 opacity-30">
                  <Radar size={100} className="text-blue-200 animate-pulse" />
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
      </div>
    </Shell>
  );
}
