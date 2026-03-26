
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
  AlertTriangle,
  ArrowUpCircle
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DepositSheet } from "@/components/deposit/DepositSheet";

const GRID_SIZE = 25;

/**
 * Sovereign Mines - المكونات النمطية المحدثة v90.0
 */

// 1. الشريط العلوي الموحد
function MinesHeader({ balance, onOpenDeposit }: { balance: number, onOpenDeposit: () => void }) {
  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-gray-50 bg-white z-50 shrink-0">
      <div className="flex items-center gap-3">
         <Link href="/arena">
           <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-gray-50 text-[#002d4d] active:scale-90 transition-all">
             <ChevronRight className="h-5 w-5" />
           </Button>
         </Link>
         <div className="space-y-0 text-right">
            <h1 className="text-lg font-black text-[#002d4d] leading-none">مناجم السيولة</h1>
            <p className="text-[7px] font-black text-blue-500 uppercase tracking-widest mt-1">Sovereign Mines Hub</p>
         </div>
      </div>
      
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 shadow-inner">
         <div className="text-right">
            <p className="text-[6px] font-black text-gray-400 uppercase leading-none">رصيدك المتاح</p>
            <p className="text-[11px] font-black text-[#002d4d] tabular-nums mt-0.5">${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
         </div>
         <button onClick={onOpenDeposit} className="h-7 w-7 rounded-lg bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all ml-1">
            <Plus size={14} />
         </button>
      </div>
    </header>
  );
}

// 2. مفاعل اللعبة (The Reactor)
function MinesReactor({ 
  grid, 
  gameState, 
  onTileClick, 
  betAmount, 
  currentMultiplier 
}: any) {
  return (
    <section className="relative aspect-square w-full max-w-[420px] mx-auto bg-gray-50/50 rounded-2xl p-4 border border-gray-100 shadow-inner overflow-hidden">
      <div className="grid grid-cols-5 gap-2.5 h-full">
        {grid.map((tile: any, i: number) => (
          <motion.button
            key={i}
            whileHover={gameState === 'playing' && tile.status === 'hidden' ? { scale: 1.02 } : {}}
            whileTap={gameState === 'playing' && tile.status === 'hidden' ? { scale: 0.98 } : {}}
            onClick={() => onTileClick(i)}
            className={cn(
              "relative rounded-xl shadow-sm transition-all duration-500 flex items-center justify-center overflow-hidden border",
              tile.status === 'hidden' && "bg-white border-gray-100 hover:shadow-md",
              tile.status === 'gem' && "bg-[#002d4d] text-[#f9a885] border-[#002d4d] shadow-lg",
              tile.status === 'mine' && tile.isExploded ? "bg-red-500 text-white border-red-600 shadow-xl" : 
              tile.status === 'mine' ? "bg-red-50 text-red-400 opacity-60 border-red-100" : ""
            )}
          >
            <AnimatePresence mode="wait">
              {tile.status === 'gem' && (
                <motion.div key="gem" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <Gem className="h-6 w-6 fill-current" />
                </motion.div>
              )}
              {tile.status === 'mine' && (
                <motion.div key="mine" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <Bomb className="h-6 w-6 fill-current" />
                </motion.div>
              )}
              {tile.status === 'hidden' && gameState === 'playing' && (
                <motion.div key="hidden" className="h-1 w-1 rounded-full bg-gray-100" />
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {(gameState === 'won' || gameState === 'lost') && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
            <div className={cn("p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20 text-center space-y-3", gameState === 'won' ? "bg-emerald-600/90" : "bg-red-600/90")}>
              <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto shadow-inner">
                {gameState === 'won' ? <CheckCircle2 size={32} className="text-white"/> : <RotateCcw size={32} className="text-white"/>}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white">{gameState === 'won' ? 'انتصار نخبوي!' : 'عطل في الشبكة'}</h2>
                <p className="text-[10px] font-bold text-white/80">
                  {gameState === 'won' ? `حققت عائداً قدره $${(Number(betAmount) * currentMultiplier).toFixed(2)}` : 'اصطدمت بخلل تقني، حاول مجدداً.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// 3. لوحة الرهان (Betting Panel)
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
      <Card className="border-none shadow-sm rounded-2xl bg-white border border-gray-50 overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">قيمة الرهان ($)</Label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(e.target.value)} 
                  disabled={gameState === 'playing'} 
                  className="h-12 rounded-xl bg-gray-50 border-none font-black text-center text-lg shadow-inner" 
                />
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">عدد الأعطال (Mines)</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {[3, 5, 10, 24].map(num => (
                  <button 
                    key={num} 
                    onClick={() => setMinesCount(num)} 
                    disabled={gameState === 'playing'} 
                    className={cn(
                      "h-10 rounded-xl font-black text-[10px] transition-all", 
                      minesCount === num ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {gameState === 'playing' ? (
              <Button onClick={cashout} disabled={loading} className="w-full h-16 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl active:scale-95 transition-all">
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : `سحب أرباح $${(Number(betAmount) * currentMultiplier).toFixed(2)}`}
              </Button>
            ) : (
              <Button onClick={startGame} disabled={loading || !dbUser || Number(betAmount) > (dbUser?.totalBalance || 0)} className="w-full h-16 rounded-xl bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-xl active:scale-95 transition-all group">
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                  <div className="flex items-center gap-3"><span>بدء المحاولة</span><Zap className="h-5 w-5 text-[#f9a885] fill-current" /></div>
                )}
              </Button>
            )}
            {(gameState === 'won' || gameState === 'lost') && (
              <button onClick={() => setGameState('idle')} className="w-full text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-[#002d4d] flex items-center justify-center gap-2">
                <RotateCcw className="h-3 w-3" /> محاولة جديدة
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// 4. تفاصيل الساحة (Arena Details)
function MinesDetails({ currentMultiplier, nextMultiplier }: any) {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-center space-y-1">
          <p className="text-[8px] font-black text-gray-400 uppercase">المضاعف الحالي</p>
          <p className="text-base font-black text-emerald-600 tabular-nums">x{currentMultiplier.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-center space-y-1">
          <p className="text-[8px] font-black text-gray-400 uppercase">العقدة القادمة</p>
          <p className="text-base font-black text-blue-600 tabular-nums">x{nextMultiplier.toFixed(2)}</p>
        </div>
      </div>

      <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
        <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
        <div className="text-right">
           <p className="text-[10px] font-black text-[#002d4d]">نظام التوثيق والعدالة</p>
           <p className="text-[9px] font-bold text-gray-400 leading-relaxed">يخضع هذا المحرك لنظام ضبط الملاءة المالية بنسبة 25% (Sovereign Governance).</p>
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
  };

  const handleTileClick = (idx: number) => {
    if (gameState !== 'playing' || grid[idx].status !== 'hidden') return;

    /**
     * خوارزمية الحوكمة المالية: 75% فرصة للمنصة
     * إذا قرر النظام أن اللاعب يجب أن يخسر في هذه النقرة (75%)
     */
    const forceLoseDecision = Math.random() < 0.75;
    let isMine = minesPositions.includes(idx);

    if (forceLoseDecision && !isMine) {
      // نقل لغم من مكان آخر إلى تحت مؤشر اللاعب حالاً لإجباره على الخسارة
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
      <div className="flex flex-col h-screen bg-[#fcfdfe] font-body text-right" dir="rtl">
        
        <MinesHeader balance={dbUser?.totalBalance} onOpenDeposit={() => setDepositOpen(true)} />

        <div className="flex-1 overflow-y-auto pb-32">
          <div className="max-w-xl mx-auto px-6 py-8 space-y-8">
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

        <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
      </div>
    </Shell>
  );
}
