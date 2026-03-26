
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
  Layers,
  Search,
  Radar,
  Minus
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DepositSheet } from "@/components/deposit/DepositSheet";

const GRID_SIZE = 25;

/**
 * 1. افتتاحية الرسم الضوئي (Light-Streak Intro)
 */
function LightStreakIntro({ onComplete, gameName, Icon }: { onComplete: () => void, gameName: string, Icon: any }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center overflow-hidden"
    >
      {/* الشريط الضوئي الناعم */}
      <motion.div
        initial={{ y: "100vh", opacity: 0, height: 0 }}
        animate={{ y: "0vh", opacity: [0, 1, 1], height: 40 }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className="w-[1px] bg-[#002d4d] relative"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#002d4d] rounded-full blur-md opacity-20" />
      </motion.div>

      {/* رسم الأيقونة */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "backOut" }}
        className="relative mt-4"
      >
        <div className="h-16 w-16 flex items-center justify-center text-[#002d4d]">
          <Icon size={40} strokeWidth={1.5} />
        </div>
        
        {/* الإطار الدائري */}
        <svg className="absolute inset-0 -m-2 h-20 w-20 rotate-[-90deg]">
          <motion.circle
            cx="40"
            cy="40"
            r="38"
            stroke="#002d4d"
            strokeWidth="0.5"
            fill="transparent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.8, duration: 1, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      {/* رسم اسم اللعبة */}
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 2.6, duration: 0.6 }}
        className="mt-8"
      >
        <h2 className="text-[13px] font-black text-[#002d4d] tracking-[0.3em] uppercase">{gameName}</h2>
      </motion.div>
    </motion.div>
  );
}

/**
 * 2. شريط التحكم العلوي الرشيق
 */
function MinesHeader({ balance, onOpenDeposit }: { balance: number, onOpenDeposit: () => void }) {
  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-gray-50 bg-white/80 backdrop-blur-md z-50 shrink-0 sticky top-0">
      <div className="flex items-center gap-3">
         <Link href="/arena">
           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-gray-50 text-[#002d4d] active:scale-90 transition-all hover:bg-[#002d4d] hover:text-white">
             <ChevronRight className="h-5 w-5" />
           </Button>
         </Link>
         <div className="space-y-0 text-right">
            <h1 className="text-sm font-black text-[#002d4d] leading-none">مناجم السيولة</h1>
            <p className="text-[7px] font-bold text-blue-500 uppercase tracking-widest mt-1">Liquid Mines Hub</p>
         </div>
      </div>
      
      <div className="flex items-center gap-2 bg-gray-50/50 px-2.5 py-1 rounded-full border border-gray-100">
         <div className="text-right">
            <p className="text-[6px] font-black text-gray-400 uppercase leading-none">Balance</p>
            <p className="text-[11px] font-black text-[#002d4d] tabular-nums mt-0.5">${balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
         </div>
         <button onClick={onOpenDeposit} className="h-7 w-7 rounded-lg bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all mr-1">
            <Plus size={14} />
         </button>
      </div>
    </header>
  );
}

/**
 * 3. مفاعل الاستكشاف (The Reactor) - رشيق وزوايا ناعمة طفيفة
 */
function MinesReactor({ grid, gameState, onTileClick, betAmount, currentMultiplier }: any) {
  return (
    <section className="relative w-full max-w-[340px] mx-auto bg-white rounded-[32px] p-4 border border-gray-50 shadow-sm overflow-hidden group">
      <div className="grid grid-cols-5 gap-2 h-full relative z-10">
        {grid.map((tile: any, i: number) => (
          <motion.button
            key={i}
            whileHover={gameState === 'playing' && tile.status === 'hidden' ? { scale: 1.02 } : {}}
            whileTap={gameState === 'playing' && tile.status === 'hidden' ? { scale: 0.98 } : {}}
            onClick={() => onTileClick(i)}
            className={cn(
              "aspect-square rounded-xl shadow-sm transition-all duration-500 flex items-center justify-center overflow-hidden border",
              tile.status === 'hidden' && "bg-gray-50/50 border-gray-100 hover:bg-white hover:border-blue-100",
              tile.status === 'gem' && "bg-[#002d4d] text-[#f9a885] border-[#002d4d] shadow-lg",
              tile.status === 'mine' && tile.isExploded ? "bg-red-500 text-white border-red-600 shadow-lg" : 
              tile.status === 'mine' ? "bg-red-50/50 text-red-200 border-red-100 opacity-40" : ""
            )}
          >
            <AnimatePresence mode="wait">
              {tile.status === 'gem' && (
                <motion.div key="gem" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[#f9a885]">
                  <Gem className="h-5 w-5 fill-current" />
                </motion.div>
              )}
              {tile.status === 'mine' && (
                <motion.div key="mine" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Bomb className="h-5 w-5 fill-current" />
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
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/10 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 10 }} 
              animate={{ scale: 1, y: 0 }} 
              className={cn(
                "p-8 rounded-[32px] shadow-2xl border border-white/20 text-center space-y-4", 
                gameState === 'won' ? "bg-emerald-600/90" : "bg-red-600/90"
              )}
            >
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto">
                {gameState === 'won' ? <CheckCircle2 size={32} className="text-white"/> : <RotateCcw size={32} className="text-white"/>}
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-black text-white">{gameState === 'won' ? 'استخراج ناجح' : 'عطل تقني'}</h2>
                <p className="text-[10px] font-bold text-white/80 leading-relaxed">
                  {gameState === 'won' ? `تم حقن أرباح قدرها $${(Number(betAmount) * currentMultiplier).toFixed(2)}` : 'اصطدمت بعقدة معطلة، حاول مجدداً.'}
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
 * 4. لوحة الرهان الرشيقة
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
    <section className="space-y-4 max-w-[340px] mx-auto">
      <Card className="border-none shadow-sm rounded-[32px] bg-white border border-gray-50 overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[8px] font-black text-gray-400 uppercase pr-3 tracking-widest">قيمة المحاولة ($)</Label>
              <div className="relative group">
                <Input 
                  type="number" 
                  value={betAmount} 
                  onChange={e => setBetAmount(e.target.value)} 
                  disabled={gameState === 'playing'} 
                  className="h-12 rounded-xl bg-gray-50 border-none font-black text-center text-sm text-[#002d4d] shadow-inner" 
                />
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[8px] font-black text-gray-400 uppercase pr-3 tracking-widest">عدد الألغام</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {[3, 5, 10, 24].map(num => (
                  <button 
                    key={num} 
                    onClick={() => setMinesCount(num)} 
                    disabled={gameState === 'playing'} 
                    className={cn(
                      "h-9 rounded-lg font-black text-[10px] transition-all", 
                      minesCount === num ? "bg-[#002d4d] text-[#f9a885] shadow-md" : "bg-gray-50 text-gray-400"
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
              <Button 
                onClick={cashout} 
                disabled={loading} 
                className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    <span>سحب الأرباح</span>
                    <Badge className="bg-white/20 text-white border-none font-black text-[10px] tabular-nums">$ {(Number(betAmount) * currentMultiplier).toFixed(2)}</Badge>
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={startGame} 
                disabled={loading || !dbUser || Number(betAmount) > (dbUser?.totalBalance || 0)} 
                className="w-full h-14 rounded-2xl bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-sm shadow-lg active:scale-[0.98] transition-all group"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <div className="flex items-center gap-3">
                    <span>بدء المحاولة</span>
                    <Zap className="h-4 w-4 text-[#f9a885] fill-current" />
                  </div>
                )}
              </Button>
            )}
            {(gameState === 'won' || gameState === 'lost') && (
              <button onClick={() => setGameState('idle')} className="w-full text-[8px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] flex items-center justify-center gap-2 transition-all">
                <RotateCcw className="h-3 w-3" /> محاولة جديدة
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

/**
 * 5. تفاصيل الساحة
 */
function MinesDetails({ currentMultiplier, nextMultiplier }: any) {
  return (
    <section className="max-w-[340px] mx-auto space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-gray-50 shadow-sm text-center space-y-1">
          <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">المضاعف الحالي</p>
          <p className="text-sm font-black text-emerald-600 tabular-nums">x{currentMultiplier.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-center space-y-1">
          <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">العقدة القادمة</p>
          <p className="text-sm font-black text-blue-600 tabular-nums">x{nextMultiplier.toFixed(2)}</p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
        <div className="text-right space-y-0.5">
           <p className="text-[9px] font-black text-[#002d4d]">نظام النزاهة</p>
           <p className="text-[7px] font-bold text-gray-400 leading-tight">معايرة البحث تتبع معايير السيادة بنسبة 25% فوز.</p>
        </div>
        <ShieldCheck size={20} className="text-emerald-500 opacity-40" />
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

    const forceLoseDecision = Math.random() < 0.75;
    let isMine = minesPositions.includes(idx);

    if (forceLoseDecision && !isMine) {
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
        {showIntro && <LightStreakIntro onComplete={() => setShowIntro(false)} gameName="Sovereign Mines" Icon={Layers} />}
      </AnimatePresence>

      {!showIntro && (
        <div className="flex flex-col h-screen bg-[#fcfdfe] font-body text-right overflow-hidden" dir="rtl">
          <MinesHeader balance={dbUser?.totalBalance} onOpenDeposit={() => setDepositOpen(true)} />
          <div className="flex-1 overflow-y-auto pb-32">
            <div className="max-w-xl mx-auto px-6 py-8 space-y-8">
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
