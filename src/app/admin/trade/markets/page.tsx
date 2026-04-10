
"use client";

import { Shell } from "@/components/layout/Shell";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { MarketInventory } from "@/components/admin/trade/MarketInventory";
import { AssetForge } from "@/components/admin/trade/AssetForge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Globe, Sparkles, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMarketSync } from "@/hooks/use-market-sync";

/**
 * @fileOverview صفحة ضبط الأسواق العالمية v2.1
 * تم إصلاح خطأ استيراد Badge ودمج مفاعل صهر الأصول (Asset Forge) لسهولة الإدارة.
 */
export default function GlobalMarketsPage() {
  const router = useRouter();
  const db = useFirestore();

  const symbolsQuery = useMemoFirebase(() => query(collection(db, "trading_symbols"), orderBy("createdAt", "desc")), [db]);
  const { data: symbols, isLoading } = useCollection(symbolsQuery);

  // تفعيل المزامنة اللحظية للأسعار في لوحة الإدارة لضمان دقة العرض
  useMarketSync(symbols || []);

  return (
    <Shell isAdmin>
      <div className="max-w-7xl mx-auto space-y-12 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Page Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-[0.4em] justify-start">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Global Market Hub Protocol
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#002d4d] tracking-tight">ضبط الأسواق العالمية</h1>
            <p className="text-muted-foreground font-bold text-[11px] flex items-center gap-2">
               <Sparkles className="h-3.5 w-3.5 text-[#f9a885]" /> إدارة وإدراج الأصول المالية عبر بروتوكولات المزامنة الدولية.
            </p>
          </div>
          
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            className="rounded-full bg-white border border-gray-100 h-12 md:h-14 px-8 font-black text-[10px] text-[#002d4d] shadow-sm active:scale-95 transition-all hover:shadow-md"
          >
            <ChevronRight className="ml-2 h-5 w-5" /> العودة لقمرة التحكم
          </Button>
        </div>

        {/* 1. Integrated Asset Forge Section */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
           <AssetForge />
        </section>

        {/* 2. Market Inventory Section */}
        <section className="space-y-8 pt-6 border-t border-gray-50 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-[18px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                    <Activity size={20} />
                 </div>
                 <div className="text-right">
                    <h3 className="text-xl font-black text-[#002d4d]">جرد القنوات النشطة</h3>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Active Inventory Matrix</p>
                 </div>
              </div>
              <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-4 py-1.5 rounded-full shadow-inner animate-pulse">
                 SYNCING LIVE DATA
              </Badge>
           </div>
           
           <MarketInventory symbols={symbols || []} isLoading={isLoading} />
        </section>

        {/* Sovereign Footer Branding */}
        <div className="flex flex-col items-center gap-4 pt-20 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em] text-center">Namix Asset Infrastructure v2.0.1</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              ))}
           </div>
        </div>

      </div>
    </Shell>
  );
}
