
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Gem, 
  Bomb, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  Wallet, 
  ShieldCheck, 
  RotateCcw,
  Coins,
  Loader2,
  AlertTriangle,
  History,
  TrendingUp
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * @fileOverview Sovereign Mines v1.0 - Liquidity Node Protocol
 * لعبة مناجم السيولة: استكشاف العقد الربحية وتجنب الأعطال التقنية.
 */

const GRID_SIZE = 25;

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

  // Sync User Session
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

  // Calculate Multiplier based on current logic
  const calculateMultiplier = (gems: number, totalMines: number) => {
    if (gems === 0) return 1;
    let mult = 1;
    for (let i = 0; i < gems; i++) {
      mult *= (GRID_SIZE - i) / (GRID_SIZE - totalMines - i);
    }
    return mult * 0.98; // 2% House Edge
  };

  const currentMultiplier = useMemo(() => calculateMultiplier(revealedGems, minesCount), [revealedGems, minesCount]);
  const nextMultiplier = useMemo(() => calculateMultiplier(revealedGems + 1, minesCount), [revealedGems, minesCount]);

  const startGame = async () => {
    if (!dbUser || gameState === 'playing') return;
    const amt = Number(betAmount);
    if (amt > dbUser.totalBalance || amt < 1) return;

    setLoading(true);
    try {
      // 1. Generate Mines Positions
      const positions: number[] = [];
      while (positions.length < minesCount) {
        const r = Math.floor(Math.random() * GRID_SIZE);
        if (!positions.includes(r)) positions.push(r);
      }

      // 2. Deduct Balance
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amt) });

      // 3. Set State
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

    if (minesPositions.includes(idx)) {
      // LOSE
      const newGrid = grid.map((tile, i) => ({
        status: minesPositions.includes(i) ? 'mine' : 'hidden',
        isExploded: i === idx
      }));
      setGrid(newGrid);
      setGameState('lost');
    } else {
      // WIN GEM
      const newGrid = [...grid];
      newGrid[idx] = { status: 'gem' };
      setGrid(newGrid);
      setRevealedGems(prev => prev + 1);
      
      // Auto-win if all gems found
      if (revealedGems + 1 === GRID_SIZE - minesCount) {
        cashout();
      }
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

      // Log Transaction
      await addDoc(collection(db, "game_history"), {
        userId: dbUser.id,
        game: "mines",
        betAmount: Number(betAmount),
        multiplier: currentMultiplier,
        profit: winAmt - Number(betAmount),
        createdAt: new Date().toISOString()
      });

      setGameState('won');
      // Show all mines
      setGrid(grid.map((tile, i) => ({
        status: minesPositions.includes(i) ? 'mine' : tile.status
      })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setGrid(Array(GRID_SIZE).fill({ status: 'hidden' }));
    setRevealedGems(0);
  };

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-8 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Header - Sovereign Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] justify-start">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Sovereign Mines Protocol
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#002d4d] tracking-tight">مناجم السيولة</h1>
            <p className="text-muted-foreground font-bold text-xs">استكشف عقد السيولة الربحية في الشبكة وتجنب الأعطال التقنية المفاجئة.</p>
          </div>
          <Link href="/arena">
            <Button variant="ghost" className="rounded-full bg-white shadow-sm h-14 px-8 border border-gray-100 active:scale-95 transition-all hover:shadow-md font-black text-[10px] text-[#002d4d]">
              <ChevronRight className="ml-2 h-5 w-5" /> العودة للساحة
            </Button>
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          
          {/* Controls Panel - LEFT */}
          <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
            <Card className="border-none shadow-sm rounded-[48px] bg-white overflow-hidden group">
              <CardContent className="p-8 space-y-8">
                
                {/* Bet Amount */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">قيمة الرهان ($)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={betAmount} 
                      onChange={e => setBetAmount(e.target.value)}
                      disabled={gameState === 'playing'}
                      className="h-16 rounded-[24px] bg-gray-50 border-none font-black text-center text-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-blue-500" 
                    />
                    <Coins className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-200" />
                  </div>
                </div>

                {/* Mines Count */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">عدد الأعطال (Mines)</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 5, 10, 24].map(num => (
                      <button
                        key={num}
                        onClick={() => setMinesCount(num)}
                        disabled={gameState === 'playing'}
                        className={cn(
                          "h-12 rounded-xl font-black text-xs transition-all active:scale-95",
                          minesCount === num ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        )}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-50" />

                {/* Action Buttons */}
                <div className="space-y-3">
                  {gameState === 'idle' || gameState === 'won' || gameState === 'lost' ? (
                    <Button 
                      onClick={startGame}
                      disabled={loading || !dbUser || Number(betAmount) > (dbUser?.totalBalance || 0)}
                      className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-2xl active:scale-95 transition-all group"
                    >
                      {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                        <div className="flex items-center gap-3">
                          <span>بدء البروتوكول</span>
                          <Zap className="h-5 w-5 text-[#f9a885] fill-current" />
                        </div>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      onClick={cashout}
                      disabled={loading || revealedGems === 0}
                      className="w-full h-18 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-2xl active:scale-95 transition-all group"
                    >
                      {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                        <div className="flex flex-col items-center">
                          <span className="text-xs opacity-60">سحب الأرباح</span>
                          <span className="tabular-nums">${(Number(betAmount) * currentMultiplier).toFixed(2)}</span>
                        </div>
                      )}
                    </Button>
                  )}

                  { (gameState === 'won' || gameState === 'lost') && (
                    <button onClick={resetGame} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#002d4d] flex items-center justify-center gap-2 py-2">
                      <RotateCcw className="h-3 w-3" /> جولة جديدة
                    </button>
                  )}
                </div>

                {/* Stats Ledger */}
                <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 space-y-4">
                   <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-400">
                      <span>المضاعف الحالي</span>
                      <span className="text-emerald-600 tabular-nums">x{currentMultiplier.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-400">
                      <span>العقدة القادمة</span>
                      <span className="text-blue-600 tabular-nums">x{nextMultiplier.toFixed(2)}</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-4">
               <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
               <p className="text-[10px] font-bold text-blue-800/60 leading-relaxed">
                 يتم توزيع الأعطال والسيولة برمجياً عبر خوارزمية SHA-256 لضمان النزاهة المطلقة لكل جولة استكشاف.
               </p>
            </div>
          </div>

          {/* Grid Area - CENTER */}
          <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
            <div className="relative aspect-square max-w-[500px] mx-auto bg-gray-50 rounded-[56px] p-4 md:p-8 shadow-inner border border-gray-100 group">
               
               {/* Background Glows */}
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-[#f9a885]/5 pointer-events-none rounded-[56px]" />
               
               <div className="grid grid-cols-5 gap-3 h-full">
                  {grid.map((tile, i) => (
                    <motion.button
                      key={i}
                      whileHover={gameState === 'playing' && tile.status === 'hidden' ? { scale: 1.05 } : {}}
                      whileTap={gameState === 'playing' && tile.status === 'hidden' ? { scale: 0.95 } : {}}
                      onClick={() => handleTileClick(i)}
                      className={cn(
                        "relative rounded-[18px] md:rounded-[24px] shadow-sm transition-all duration-500 flex items-center justify-center overflow-hidden",
                        tile.status === 'hidden' && "bg-white hover:shadow-lg border border-gray-100",
                        tile.status === 'gem' && "bg-[#002d4d] text-[#f9a885] shadow-xl",
                        tile.status === 'mine' && tile.isExploded ? "bg-red-500 text-white shadow-xl animate-shake" : 
                        tile.status === 'mine' ? "bg-red-50 text-red-400 opacity-60" : ""
                      )}
                    >
                      <AnimatePresence mode="wait">
                        {tile.status === 'gem' && (
                          <motion.div key="gem" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring' }}>
                            <Gem className="h-6 w-6 md:h-8 md:w-8 fill-current" />
                          </motion.div>
                        )}
                        {tile.status === 'mine' && (
                          <motion.div key="mine" initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring' }}>
                            <Bomb className="h-6 w-6 md:h-8 md:w-8 fill-current" />
                          </motion.div>
                        )}
                        {tile.status === 'hidden' && gameState === 'playing' && (
                          <motion.div key="hidden" className="h-1.5 w-1.5 rounded-full bg-gray-100" />
                        )}
                      </AnimatePresence>

                      {/* Sparkle Effect on Gem */}
                      {tile.status === 'gem' && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                           <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg]" />
                        </div>
                      )}
                    </motion.button>
                  ))}
               </div>

               {/* Overlay Status */}
               <AnimatePresence>
                 {(gameState === 'won' || gameState === 'lost') && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }} 
                     animate={{ opacity: 1, scale: 1 }} 
                     className="absolute inset-0 z-50 flex items-center justify-center p-8 pointer-events-none"
                   >
                      <div className={cn(
                        "p-10 rounded-[48px] shadow-2xl backdrop-blur-xl border border-white/20 text-center space-y-4",
                        gameState === 'won' ? "bg-emerald-600/90 text-white" : "bg-red-600/90 text-white"
                      )}>
                         <div className="h-20 w-20 rounded-[32px] bg-white/20 flex items-center justify-center mx-auto shadow-inner">
                            {gameState === 'won' ? <CheckCircle2 size={40} /> : <AlertTriangle size={40} />}
                         </div>
                         <div className="space-y-1">
                            <h2 className="text-3xl font-black">{gameState === 'won' ? 'انتصار نخبوي!' : 'عطل في الشبكة'}</h2>
                            <p className="text-xs font-bold opacity-80">
                              {gameState === 'won' 
                                ? `حققت عائداً سيادياً قدره $${(Number(betAmount) * currentMultiplier).toFixed(2)}` 
                                : 'لقد اصطدمت بخلل تقني، حاول مجدداً باستراتيجية مختلفة.'}
                            </p>
                         </div>
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Live Feed - Dynamic Placeholder */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 px-4">
                  <History className="h-4 w-4 text-gray-300" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network Activity Feed</span>
               </div>
               <div className="grid gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 bg-white rounded-3xl border border-gray-50 flex items-center justify-between opacity-40">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center"><UserCircle size={16}/></div>
                          <span className="text-[10px] font-black text-[#002d4d]">Investor_{821 + i}</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-2 py-0.5">x{ (1.2 + i * 0.4).toFixed(2) }</Badge>
                          <span className="text-[10px] font-black text-emerald-600 tabular-nums">+${(10 + i * 25).toLocaleString()}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col items-center gap-4 py-12 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Gaming Infrastructure v1.0.4</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
           </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </Shell>
  );
}
