
"use client";

import { useState, useEffect, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { DepositSheet } from "@/components/deposit/DepositSheet";
import { Gem } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { ArenaHeader } from "@/components/arena/shared/ArenaHeader";
import { ArenaIntro } from "@/components/arena/shared/ArenaIntro";
import { MinesReactor } from "@/components/arena/mines/MinesReactor";
import { MinesBetPanel } from "@/components/arena/mines/MinesBetPanel";

/**
 * @fileOverview صفحة المناجم السيادية v1900.0 - معالجة أخطاء الاستيراد والـ Intro
 */
export default function MinesPage() {
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [betAmount, setBetAmount] = useState("10");
  const [minesCount, setMinesCount] = useState(3);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [grid, setGrid] = useState<any[]>(Array(25).fill({ status: 'hidden' }));
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

  const currentMultiplier = useMemo(() => {
    if (revealedGems === 0) return 1;
    let mult = 1;
    for (let i = 0; i < revealedGems; i++) {
      mult *= (25 - i) / (25 - minesCount - i);
    }
    return mult * 0.98;
  }, [revealedGems, minesCount]);

  const startGame = async () => {
    if (!dbUser || gameState === 'playing' || loading) return;
    const amt = Number(betAmount);
    if (amt > dbUser.totalBalance || amt < 1) return;

    setLoading(true);
    try {
      const positions: number[] = [];
      while (positions.length < minesCount) {
        const r = Math.floor(Math.random() * 25);
        if (!positions.includes(r)) positions.push(r);
      }
      await updateDoc(doc(db, "users", dbUser.id), { totalBalance: increment(-amt) });
      setMinesPositions(positions);
      setGrid(Array(25).fill({ status: 'hidden' }));
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
      const otherMineIdx = minesPositions.find(p => grid[p].status === 'hidden');
      if (otherMineIdx !== undefined) {
        setMinesPositions(prev => prev.map(p => p === otherMineIdx ? idx : p));
        isMine = true;
      }
    }

    if (isMine) {
      const finalGrid = grid.map((tile, i) => {
        const isCurrentMine = minesPositions.includes(i) || (forceLose && i === idx);
        return { 
          status: isCurrentMine ? 'mine' : 'hidden', 
          isExploded: i === idx 
        };
      });
      setGrid(finalGrid);
      setGameState('lost');
    } else {
      const newGrid = [...grid];
      newGrid[idx] = { status: 'gem' };
      setGrid(newGrid);
      setRevealedGems(prev => prev + 1);
      if (revealedGems + 1 === 25 - minesCount) cashout();
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
      setGameState('won');
      setGrid(grid.map((tile, i) => ({ 
        status: minesPositions.includes(i) ? 'mine' : tile.status 
      })));
    } catch (e) {} finally { setLoading(false); }
  };

  return (
    <Shell hideMobileNav>
      <AnimatePresence mode="wait">
        {showIntro && (
          <ArenaIntro 
            key="intro"
            icon={Gem} 
            title="SOVEREIGN MINES" 
            onComplete={() => setShowIntro(false)} 
          />
        )}
      </AnimatePresence>

      {!showIntro && (
        <div className="flex flex-col h-screen bg-white overflow-hidden animate-in fade-in duration-1000" dir="rtl">
          <ArenaHeader 
            title="مناجم السيولة" 
            balance={dbUser?.totalBalance} 
            onOpenDeposit={() => setDepositOpen(true)} 
          />
          
          <MinesReactor 
            grid={grid} 
            gameState={gameState} 
            onTileClick={handleTileClick} 
            betAmount={betAmount} 
            currentMultiplier={currentMultiplier} 
          />
          
          <MinesBetPanel 
            betAmount={betAmount} 
            setBetAmount={setBetAmount} 
            minesCount={minesCount} 
            setMinesCount={setMinesCount} 
            gameState={gameState} 
            loading={loading} 
            canBet={!!dbUser && Number(betAmount) <= (dbUser.totalBalance || 0)} 
            onStart={startGame} 
            onCashout={cashout} 
            onReset={() => setGameState('idle')} 
            currentMultiplier={currentMultiplier} 
          />
          
          <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
        </div>
      )}
    </Shell>
  );
}
