
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
  Plus,
  Loader2,
  CheckCircle2,
  Coins,
  Sparkles,
  Layers
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DepositSheet } from "@/components/deposit/DepositSheet";

const GRID_SIZE = 25;

/**
 * 1. الافتتاحية السينمائية (Sovereign Drawing Intro)
 */
function SovereignIntro({ onComplete, title }: { onComplete: () => void, title: string }) {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#002d4d] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative flex flex-col items-center gap-8">
        <svg width="120" height="120" viewBox="0 0 100 100" className="relative z-10">
          {/* رسم الأيقونة (جوهرة مبسطة) */}
          <motion.path
            d="M50 20 L80 40 L80 60 L50 85 L20 60 L20 40 Z M20 40 L80 40 M50 20 L50 85"
            fill="none"
            stroke="#f9a885"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
          {/* رسم الإطار الدائري */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="3 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ delay: 1.8, duration: 1 }}
          />
          
          {/* تفاعل الأيقونة بعد الرسم */}
          <motion.g
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.2, 1.15],
              filter: ["brightness(1)", "brightness(1.8)", "brightness(1.3)"]
            }}
            transition={{ delay: 3, duration: 0.8 }}
          >
             <Gem className="text-[#f9a885]" style={{ x: 25, y: 25, width: 50, height: 50 }} />
          </motion.g>

          {/* نجمة اللمعان الذكية */}
          <motion.path
            d="M75 25 L77 32 L83 34 L77 36 L75 43 L73 36 L67 34 L73 32 Z"
            fill="white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
            transition={{ delay: 3.5, duration: 0.6 }}
          />
        </svg>

        {/* رسم اسم اللعبة */}
        <div className="relative h-8 flex items-center justify-center">
           <motion.span
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 4, duration: 0.8 }}
             className="text-white font-black text-sm tracking-[0.4em] uppercase"
           >
             {title}
           </motion.span>
           <motion.div 
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ delay: 4, duration: 1.2 }}
             className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f9a885] to-transparent origin-center"
           />
        </div>
      </div>

      {/* شعار ناميكس في الأسفل */}
      <div className="absolute bottom-12 flex items-center gap-3 opacity-25">
         <div className="grid grid-cols-2 gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
         </div>
         <span className="text-[10px] font-black tracking-[0.5em] text-white uppercase">Namix</span>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.5 }}
        onAnimationComplete={() => setTimeout(onComplete, 500)}
      />
    </motion.div>
  );
}

/**
 * 2. شريط التحكم العلوي (Sovereign Header)
 */
function MinesHeader({ balance, onOpenDeposit }: { balance: number, onOpenDeposit: () => void }) {
  return (
    <header className="px-6 py-3 flex items-center justify-between border-b border-gray-50 bg-white/80 backdrop-blur-md z-50 shrink-0 sticky top-0 font-body">
      <div className="flex items-center gap-3">
         <Link href="/arena">
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl bg-gray-50 text-[#002d4d] active:scale-90 transition-all">
             <ChevronRight className="h-4 w-4" />
           </Button>
         </Link>
         <div className="text-right">
            <h1 className="text-[11px] font-black text-[#002d4d] leading-none uppercase">مناجم السيولة</h1>
            <p className="text-[7px] font-bold text-blue-500 uppercase tracking-widest mt-1">Sovereign Matrix</p>
         </div>
      </div>
      <div className="flex items-center gap-2 bg-gray-50/80 px-2 py-1 rounded-full border border-gray-100 shadow-inner">
         <div className="text-right pr-1">
            <p className="text-[6px] font-black text-gray-400 uppercase leading-none">Liquidity</p>
            <p className="text-[10px] font-black text-[#002d4d] tabular-nums mt-0.5">${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
         </div>
         <button onClick={onOpenDeposit} className="h-6 w-6 rounded-lg bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all">
            <Plus size={12} />
         </button>
      </div>
    </header>
  );
}

/**
 * 3. مفاعل اللعبة (The Reactor)
 */
function MinesReactor({ grid, gameState, onTileClick, betAmount, currentMultiplier }: any) {
  return (
    <section className="relative w-full max-w-[260px] mx-auto bg-white rounded-2xl p-2.5 border border-gray-100 shadow-sm overflow-hidden group">
      <div className="grid grid-cols-5 gap-1.5 h-full relative z-10">
        {grid.map((tile: any, i: number) => (
          <motion.button
            key={i}
            whileHover={gameState === 'playing' && tile.status === 'hidden' ? { scale: 1.05, y: -1 } : {}}
            whileTap={gameState === 'playing' && tile.status === 'hidden' ? { scale: 0.95 } : {}}
            onClick={() => onTileClick(i)}
            className={cn(
              "aspect-square rounded-xl shadow-sm transition-all duration-500 flex items-center justify-center overflow-hidden border",
              tile.status === 'hidden' && "bg-gray-50 border-gray-100/50 hover:bg-white hover:border-blue-100 shadow-inner",
              tile.status === 'gem' && "bg-[#002d4d] text-[#f9a885] border-[#002d4d] shadow-xl",
              tile.status === 'mine' && tile.isExploded ? "bg-red-500 text-white border-red-600 shadow-2xl" : 
              tile.status === 'mine' ? "bg-red-50/30 text-red-200 border-red-50 opacity-40" : ""
            )}
          >
            <AnimatePresence mode="wait">
              {tile.status === 'gem' && (
                <motion.div key="gem" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} className="text-[#f9a885]">
                  <Gem className="h-3.5 w-3.5 fill-current" />
                </motion.div>
              )}
              {tile.status === 'mine' && (
                <motion.div key="mine" initial={{ scale: 0, scaleY: 0 }} animate={{ scale: 1, scaleY: 1 }}>
                  <Bomb className="h-3.5 w-3.5 fill-current" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {(gameState === 'won' || gameState === 'lost') && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/20 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 10 }} 
              animate={{ scale: 1, y: 0 }} 
              className={cn(
                "p-5 rounded-[28px] shadow-2xl border border-white/20 text-center space-y-2", 
                gameState === 'won' ? "bg-emerald-600/95" : "bg-red-600/95"
              )}
            >
              <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center mx-auto shadow-inner">
                {gameState === 'won' ? <CheckCircle2 size={24} className="text-white"/> : <RotateCcw size={24} className="text-white"/>}
              </div>
              <div className="space-y-0.5">
                <h2 className="text-[11px] font-black text-white">{gameState === 'won' ? 'استخراج ناجح' : 'عطل فني'}</h2>
                <p className="text-[8px] font-bold text-white/80">
                  {gameState === 'won' ? `تم حقن $${(Number(betAmount) * currentMultiplier).toFixed(2)}` : 'اصطدمت بعقدة معطلة.'}
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
 * 4. لوحة الرهان (Betting Panel)
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
    <section className="space-y-3 max-w-[280px] mx-auto font-body">
      <Card className="border-none shadow-sm rounded-2xl bg-white border border-gray-50">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 text-right">
              <Label className="text-[8px] font-black text-gray-400 uppercase pr-2 tracking-widest">المبلغ ($)</Label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(e.target.value)} 
                  disabled={gameState === 'playing'} 
                  className="h-9 rounded-xl bg-gray-50 border-none font-black text-center text-xs text-[#002d4d] shadow-inner" 
                />
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-200" />
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              <Label className="text-[8px] font-black text-gray-400 uppercase pr-2 tracking-widest">الألغام</Label>
              <div className="grid grid-cols-4 gap-1">
                {[3, 10, 15, 24].map(num => (
                  <button 
                    key={num} 
                    onClick={() => setMinesCount(num)} 
                    disabled={gameState === 'playing'} 
                    className={cn(
                      "h-7 rounded-lg font-black text-[8px] transition-all", 
                      minesCount === num ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "bg-gray-50 text-gray-400"
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {gameState === 'playing' ? (
              <Button onClick={cashout} disabled={loading} className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] shadow-xl transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : (
                  <>
                    <span>سحب الأرباح</span>
                    <Badge className="bg-white/20 text-white border-none font-black text-[8px] tabular-nums">
                      $ {(Number(betAmount) * currentMultiplier).toFixed(2)}
                    </Badge>
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={startGame} disabled={loading || !dbUser || Number(betAmount) > (dbUser?.totalBalance || 0)} className="w-full h-10 rounded-xl bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[10px] shadow-xl transition-all group">
                {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : (
                  <div className="flex items-center gap-2">
                    <span>بدء المحاولة</span>
                    <Zap className="h-3 w-3 text-[#f9a885] fill-current" />
                  </div>
                )}
              </Button>
            )}
            {(gameState === 'won' || gameState === 'lost') && (
              <button onClick={() => setGameState('idle')} className="w-full text-[7px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] flex items-center justify-center gap-2 py-1">
                <RotateCcw className="h-2.5 w-2.5" /> محاولة جديدة
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

/**
 * 5. تفاصيل الساحة (Arena Details)
 */
function MinesDetails({ currentMultiplier, nextMultiplier }: any) {
  return (
    <section className="max-w-[280px] mx-auto space-y-2.5 font-body">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 bg-white rounded-xl border border-gray-50 shadow-sm text-center">
          <p className="text-[6px] font-black text-gray-400 uppercase tracking-widest">المضاعف الحالي</p>
          <p className="text-xs font-black text-emerald-600 tabular-nums">x{currentMultiplier.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-[6px] font-black text-gray-400 uppercase tracking-widest">العقدة القادمة</p>
          <p className="text-xs font-black text-blue-600 tabular-nums">x{nextMultiplier.toFixed(2)}</p>
        </div>
      </div>

      <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center justify-between">
        <div className="text-right">
           <p className="text-[8px] font-black text-[#002d4d]">نظام المعايرة</p>
           <p className="text-[6px] font-bold text-gray-400 leading-tight">معايرة الفوز تتبع معايير الاستدامة بنسبة 25%.</p>
        </div>
        <ShieldCheck size={14} className="text-emerald-500 opacity-20" />
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
  const [showIntro, setShowIntro] = useState(true);
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
    if (!dbUser || gameState === 'playing' || loading) return;
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
    if (gameState !== 'playing' || grid[idx].status !== 'hidden' || loading) return;

    const forceLose = Math.random() < 0.75;
    let isMine = minesPositions.includes(idx);

    if (forceLose && !isMine) {
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
    if (gameState !== 'playing' || revealedGems === 0 || loading) return;
    setLoading(true);
    try {
      const winAmt = Number(betAmount) * currentMultiplier;
      await updateDoc(doc(db, "users", dbUser.id), { 
        totalBalance: increment(winAmt),
        totalProfits: increment(winAmt - Number(betAmount))
      });
      await addDoc(collection(db, "game_history"), {
        userId: dbUser.id, game: "mines", betAmount: Number(betAmount),
        multiplier: currentMultiplier, profit: winAmt - Number(betAmount), createdAt: new Date().toISOString()
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
      <AnimatePresence>
        {showIntro && <SovereignIntro onComplete={() => setShowIntro(false)} title="Sovereign Mines" />}
      </AnimatePresence>

      {!showIntro && (
        <div className="flex flex-col h-screen bg-[#fcfdfe] font-body text-right overflow-hidden" dir="rtl">
          <MinesHeader balance={dbUser?.totalBalance} onOpenDeposit={() => setDepositOpen(true)} />
          <div className="flex-1 overflow-y-auto pb-24">
            <div className="max-w-xl mx-auto px-6 py-6 space-y-6">
              <MinesReactor grid={grid} gameState={gameState} onTileClick={handleTileClick} betAmount={betAmount} currentMultiplier={currentMultiplier} />
              <BettingPanel betAmount={betAmount} setBetAmount={setBetAmount} minesCount={minesCount} setMinesCount={setMinesCount} gameState={gameState} loading={loading} dbUser={dbUser} startGame={startGame} cashout={cashout} setGameState={setGameState} currentMultiplier={currentMultiplier} />
              <MinesDetails currentMultiplier={currentMultiplier} nextMultiplier={nextMultiplier} />
            </div>
          </div>
          <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
        </div>
      )}
    </Shell>
  );
}
