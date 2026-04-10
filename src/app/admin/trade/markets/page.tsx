
"use client";

import { Shell } from "@/components/layout/Shell";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { MarketInventory } from "@/components/admin/trade/MarketInventory";
import { AssetForge } from "@/components/admin/trade/AssetForge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Globe, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMarketSync } from "@/hooks/use-market-sync";

export default function GlobalMarketsPage() {
  const router = useRouter();
  const db = useFirestore();

  const symbolsQuery = useMemoFirebase(() => query(collection(db, "trading_symbols"), orderBy("createdAt", "desc")), [db]);
  const { data: symbols, isLoading } = useCollection(symbolsQuery);

  useMarketSync(symbols || []);

  return (
    <Shell isAdmin>
      <div className="max-w-6xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        <div className="flex items-center justify-between gap-6 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-[#002d4d] flex items-center gap-3">
              <Globe className="h-6 w-6 text-orange-500" />
              ضبط الأسواق العالمية
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global Asset Repository</p>
          </div>
          <div className="flex items-center gap-3">
            <AssetForge />
            <Button onClick={() => router.back()} variant="ghost" className="rounded-full bg-white border border-gray-100 h-12 px-6 font-black text-[10px] active:scale-95">
              <ChevronRight className="ml-2 h-4 w-4" /> العودة للقمرة
            </Button>
          </div>
        </div>

        <MarketInventory symbols={symbols || []} isLoading={isLoading} />
      </div>
    </Shell>
  );
}
