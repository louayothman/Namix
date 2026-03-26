
"use client";

import { useState, useEffect, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { useFirestore } from "@/firebase";
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { DepositSheet } from "@/components/deposit/DepositSheet";

// المكونات المعزولة كلياً v6.0
import { ArenaHeader } from "@/components/arena/shared/ArenaHeader";
import { MinesIntro } from "@/components/arena/mines/MinesIntro";
import { MinesReactor } from "@/components/arena/mines/MinesReactor";
import { MinesBetPanel } from "@/components/arena/mines/MinesBetPanel";

/**
 * MinesPage - منطق حوكمة المناجم v6.0
 * تم دمج حوكمة الملاءة (75% للمنصة) مع ملء المساحة الكامل والخطوط 16px.
 */
export default function MinesPage() {
  const db = useFirestore();
  const [dbUser, setDbUser] = useState<any>(null);
  const [betAmount, setBetAmount] = useState("10");
  const [minesCount, setMinesCount] = useState(3);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [grid, setGrid] = useState<any[]>(Array(25).fill({ status: 'hidden' }));
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

  const currentMultiplier = useMemo(() => {
    if (revealedGems === 0) return 1;
    let mult = 1;
    for (let i = 0; i < revealedGems; i++) {
      mult *= (25 - i) / (25 - minesCount - i);
    }
    return mult * 0.98; // House edge
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

    // حوكمة الملاءة: 75% فرصة خسارة قسرية عند الضغط
    const forceLose = Math.random() < 0.75;
    let isMine = minesPositions.includes(idx);

    // إذا كان المخطط هو الخسارة ولم يكن هناك لغم، نضع لغماً تحت إصبع المستخدم فوراً
    if (forceLose && !isMine) {
      // نبحث عن لغم في مكان آخر وننقله لمكان الضغط الحالي لضمان الخسارة "بصدفة تقنية"
      const otherMineIdx = minesPositions.find(p => !grid[p].status || grid[p].status === 'hidden');
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
      // فوز تلقائي عند كشف كافة الجواهر
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
      await addDoc(collection(db, "game_history"), {
        userId: dbUser.id, 
        game: "mines", 
        betAmount: Number(betAmount),
        multiplier: currentMultiplier, 
        profit: winAmt - Number(betAmount), 
        createdAt: new Date().toISOString()
      });
      setGameState('won');
      // كشف الألغام المتبقية بوضوح
      setGrid(grid.map((tile, i) => ({ 
        status: minesPositions.includes(i) ? 'mine' : tile.status 
      })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell hideMobileNav>
      <AnimatePresence>
        {showIntro && <MinesIntro onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <div className="flex flex-col h-[100dvh] bg-white overflow-hidden">
          <ArenaHeader title="مناجم السيولة" balance={dbUser?.totalBalance} onOpenDeposit={() => setDepositOpen(true)} />
          
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
