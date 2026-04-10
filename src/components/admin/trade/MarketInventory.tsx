
"use client";

import { 
  Trash2, 
  Cpu,
  Loader2,
  Zap,
  TrendingUp,
  Activity,
  ShieldAlert,
  AlertTriangle,
  Briefcase,
  Globe,
  Coins,
  Layers,
  TrendingDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { AssetForge } from "./AssetForge";
import { CryptoIcon } from "@/lib/crypto-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useMarketStore } from "@/store/use-market-store";

interface MarketInventoryProps {
  symbols: any[];
  isLoading: boolean;
}

/**
 * @fileOverview جرد الأسواق المبوب v102.0 - Multi-Source Edition
 * تم تصنيف الأصول تحت قطاعات تكتيكية لتسهيل الإشراف المباشر.
 */
export function MarketInventory({ symbols, isLoading }: MarketInventoryProps) {
  const db = useFirestore();
  const prices = useMarketStore(state => state.prices);
  const changes = useMarketStore(state => state.dailyChanges);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteDoc(doc(db, "trading_symbols", deleteConfirmId));
      toast({ title: "تم حذف الرمز نهائياً" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الحذف" });
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleToggleStatus = async (id: string, current: boolean) => {
    await updateDoc(doc(db, "trading_symbols", id), { isActive: !current });
  };

  const categorizedSymbols = useMemo(() => {
    const groups: Record<string, { label: string, icon: any, items: any[] }> = {
      equity: { label: "الأسهم العالمية", icon: Briefcase, items: [] },
      commodity: { label: "السلع والمعادن", icon: Zap, items: [] },
      forex: { label: "سوق العملات (Forex)", icon: Globe, items: [] },
      crypto: { label: "العملات الرقمية", icon: Coins, items: [] },
      internal: { label: "أصول المنظومة الداخلية", icon: Activity, items: [] },
      other: { label: "أصول متنوعة", icon: Layers, items: [] }
    };

    symbols.forEach(s => {
      if (s.priceSource === 'internal') groups.internal.items.push(s);
      else if (s.priceSource === 'binance') groups.crypto.items.push(s);
      else {
        const type = (s.type || "").toLowerCase();
        if (type.includes('equity') || type.includes('stock')) groups.equity.items.push(s);
        else if (type.includes('commodity') || type.includes('physical')) groups.commodity.items.push(s);
        else if (type.includes('forex')) groups.forex.items.push(s);
        else groups.other.items.push(s);
      }
    });

    return Object.entries(groups).filter(([_, g]) => g.items.length > 0);
  }, [symbols]);

  if (isLoading) {
    return (
      <div className="py-40 text-center flex flex-col items-center gap-4">
         <Loader2 className="h-12 w-12 animate-spin text-gray-200" />
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory Nodes Syncing...</p>
      </div>
    );
  }

  return (
    <div className="space-y-20 text-right" dir="rtl">
      {categorizedSymbols.map(([key, group]) => (
        <section key={key} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between px-6">
             <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-gray-50 text-[#002d4d] flex items-center justify-center shadow-inner">
                   <group.icon size={20} />
                </div>
                <div className="text-right">
                   <h3 className="text-xl font-black text-[#002d4d]">{group.label}</h3>
                   <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{group.items.length} ACTIVE NODES</p>
                </div>
             </div>
             <div className="h-px flex-1 bg-gray-100 mx-8 opacity-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {group.items.map((sym) => {
              const livePrice = prices[sym.id] || sym.currentPrice;
              const change = changes[sym.id] || 0;
              const isUp = change >= 0;
              
              return (
                <div key={sym.id} className={cn(
                  "p-8 bg-white rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col gap-6",
                  !sym.isActive && "opacity-60 saturate-0"
                )}>
                  <div className="flex items-center justify-between relative z-10">
                     <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-[22px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] transition-all duration-500">
                          <CryptoIcon name={sym.icon} size={28} color={sym.isActive ? "#002d4d" : "#94a3b8"} />
                        </div>
                        <div className="text-right">
                          <h4 className="font-black text-base text-[#002d4d]">{sym.name}</h4>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{sym.code}</p>
                        </div>
                     </div>
                     <Switch checked={!!sym.isActive} onCheckedChange={() => handleToggleStatus(sym.id, sym.isActive)} className="data-[state=checked]:bg-emerald-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 relative z-10">
                     <div className="p-5 bg-gray-50 rounded-[32px] space-y-1.5 shadow-inner border border-gray-100">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">مصدر السعر</p>
                        <Badge className={cn(
                          "border-none font-black text-[7px] px-2.5 py-1 rounded-lg flex items-center gap-1",
                          sym.priceSource === 'binance' ? "bg-orange-50 text-orange-600" :
                          sym.priceSource === 'alphavantage' ? "bg-emerald-50 text-emerald-600" :
                          sym.priceSource === 'twelvedata' ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
                        )}>
                           <Cpu size={10} /> {sym.priceSource?.toUpperCase()}
                        </Badge>
                     </div>
                     <div className="p-5 bg-gray-50 rounded-[32px] space-y-1.5 shadow-inner border border-gray-100">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">تغير 24س</p>
                        <div className={cn("flex items-center gap-1 font-black text-[10px]", isUp ? "text-emerald-600" : "text-red-500")}>
                           {isUp ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                           <span className="tabular-nums">%{Math.abs(change).toFixed(2)}</span>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 bg-white border border-gray-100 rounded-[32px] flex items-center justify-between relative z-10 shadow-sm">
                     <div className="text-right">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">السعر اللحظي</p>
                        <p className={cn(
                          "text-2xl font-black text-[#002d4d] tabular-nums tracking-tighter transition-all duration-300",
                          sym.isActive && (isUp ? "text-emerald-600" : "text-red-600")
                        )}>
                          ${livePrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </p>
                     </div>
                     <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center animate-pulse">
                        <div className={cn("h-2 w-2 rounded-full", isUp ? "bg-emerald-500" : "bg-red-500")} />
                     </div>
                  </div>

                  <div className="flex items-center gap-3 relative z-10 pt-4 border-t border-gray-50">
                     <AssetForge initialData={sym} mode="edit" />
                     <Button onClick={() => setDeleteConfirmId(sym.id)} variant="ghost" className="flex-1 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 font-black text-[10px]">
                        <Trash2 className="ml-2 h-4 w-4" /> حذف الرمز
                     </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
      
      {symbols.length === 0 && (
        <div className="col-span-full py-40 text-center opacity-20 flex flex-col items-center gap-6 border-2 border-dashed border-gray-100 rounded-[64px]">
           <Activity className="h-20 w-20 text-[#002d4d]" />
           <p className="text-xs font-black uppercase tracking-[0.5em]">لا توجد أصول مدرجة في الجرد حالياً</p>
        </div>
      )}

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="rounded-[48px] border-none shadow-2xl p-10 max-w-[420px] font-body text-right" dir="rtl">
          <AlertDialogHeader className="items-center gap-6">
            <div className="h-20 w-20 rounded-[32px] bg-red-50 text-red-500 flex items-center justify-center animate-bounce shadow-inner">
              <ShieldAlert className="h-10 w-10" />
            </div>
            <div className="space-y-2 text-center">
              <AlertDialogTitle className="text-2xl font-black text-[#002d4d]">تحذير حذف سيادي</AlertDialogTitle>
              <div className="flex items-center justify-center gap-2 text-red-400 font-black text-[9px] uppercase tracking-[0.3em]">
                <ShieldAlert className="h-3 w-3" />
                Asset Termination Protocol
              </div>
            </div>
            <AlertDialogDescription className="text-[13px] font-bold text-gray-500 leading-[2.2] px-2 text-center">
              أنت على وشك حذف هذا الأصل المالي نهائياً من محرك التداول. هل أنت متأكد؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col gap-3 sm:flex-col mt-8">
            <AlertDialogAction onClick={executeDelete} className="w-full h-14 rounded-full bg-red-500 hover:bg-red-600 text-white font-black text-base shadow-xl">تأكيد الحذف</AlertDialogAction>
            <AlertDialogCancel className="w-full h-14 rounded-full bg-gray-50 text-gray-400 border-none font-black text-xs hover:bg-gray-100">إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
