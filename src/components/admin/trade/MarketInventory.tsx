
"use client";

import { 
  Trash2, 
  Cpu,
  Loader2,
  Zap,
  TrendingUp,
  Activity,
  ShieldAlert,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
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

interface MarketInventoryProps {
  symbols: any[];
  isLoading: boolean;
}

/**
 * @fileOverview جرد الأسواق v100.0 - Sovereign Deletion Engine
 */
export function MarketInventory({ symbols, isLoading }: MarketInventoryProps) {
  const db = useFirestore();
  const [localPrices, setLocalPrices] = useState<Record<string, number>>({});
  const [pulse, setPulse] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWS = () => {
      if (wsRef.current) wsRef.current.close();
      const ws = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const priceMap: Record<string, number> = {};
        data.forEach((ticker: any) => {
          priceMap[ticker.s] = parseFloat(ticker.c);
        });
        setLocalPrices(prev => ({ ...prev, ...priceMap }));
        setPulse(true);
        setTimeout(() => setPulse(false), 200);
      };

      ws.onclose = () => setTimeout(connectWS, 3000);
      wsRef.current = ws;
    };

    connectWS();
    return () => wsRef.current?.close();
  }, []);

  const handleToggleStatus = async (id: string, current: boolean) => {
    await updateDoc(doc(db, "trading_symbols", id), { isActive: !current });
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteDoc(doc(db, "trading_symbols", deleteConfirmId));
      toast({ title: "تم حذف الرمز نهائياً", description: "تمت إزالة الأصل المالي من كافة سجلات التداول الحية." });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل تنفيذ الحذف" });
    } finally {
      setDeleteConfirmId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-40 text-center flex flex-col items-center gap-4">
         <Loader2 className="h-12 w-12 animate-spin text-gray-200" />
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory Nodes Syncing...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-right" dir="rtl">
      {symbols.map((sym) => {
        const livePrice = sym.priceSource === 'binance' ? (localPrices[sym.binanceSymbol] || sym.currentPrice) : sym.currentPrice;
        
        return (
          <div key={sym.id} className={cn(
            "p-8 bg-white rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col gap-6",
            !sym.isActive && "opacity-60 saturate-0"
          )}>
            <div className="flex items-center justify-between relative z-10">
               <div className="flex items-center gap-4">
                  <div className={cn("h-14 w-14 rounded-[22px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] transition-all duration-500")}>
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
                  <div className="flex items-center gap-2">
                     {sym.priceSource === 'binance' ? (
                       <Badge className="bg-orange-50 text-orange-600 border-none font-black text-[7px] px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Cpu size={10} /> BINANCE API
                       </Badge>
                     ) : (
                       <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[7px] px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Zap size={10} /> INTERNAL CORE
                     </Badge>
                     )}
                  </div>
               </div>
               <div className="p-5 bg-gray-50 rounded-[32px] space-y-1.5 shadow-inner border border-gray-100">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">نبض القناة</p>
                  <div className="flex items-center gap-2">
                     <div className={cn("h-1.5 w-1.5 rounded-full transition-all", pulse ? "bg-emerald-500 scale-150 shadow-[0_0_8px_#10b981]" : "bg-gray-300")} />
                     <span className="text-[9px] font-black text-gray-400">
                       Direct Feed Active
                     </span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-white border border-gray-100 rounded-[32px] flex items-center justify-between relative z-10 shadow-sm">
               <div className="text-right">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">السعر اللحظي</p>
                  <p className={cn(
                    "text-2xl font-black text-[#002d4d] tabular-nums tracking-tighter transition-all duration-300",
                    sym.isActive && "text-emerald-600"
                  )}>
                    ${livePrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </p>
               </div>
               <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="text-emerald-500 border-emerald-100 bg-emerald-50 font-black text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1">
                     <TrendingUp size={10} /> +{(Math.random() * 2).toFixed(2)}%
                  </Badge>
               </div>
            </div>

            <div className="flex items-center gap-3 relative z-10 pt-4 border-t border-gray-50">
               <AssetForge initialData={sym} mode="edit" />
               <Button onClick={() => setDeleteConfirmId(sym.id)} variant="ghost" className="flex-1 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 font-black text-[10px]">
                  <Trash2 className="ml-2 h-4 w-4" /> حذف الرمز
               </Button>
            </div>
          </div>
        );
      })}
      
      {symbols.length === 0 && (
        <div className="col-span-full py-40 text-center opacity-20 flex flex-col items-center gap-6 border-2 border-dashed border-gray-100 rounded-[64px]">
           <Activity className="h-20 w-20 text-[#002d4d]" />
           <p className="text-xs font-black uppercase tracking-[0.5em]">لا توجد أصول مدرجة في الجرد حالياً</p>
        </div>
      )}

      {/* SOVEREIGN DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="rounded-[48px] border-none shadow-2xl p-10 max-w-[420px] font-body text-right" dir="rtl">
          <AlertDialogHeader className="items-center gap-6">
            <div className="h-20 w-20 rounded-[32px] bg-red-50 text-red-500 flex items-center justify-center animate-bounce shadow-inner">
              <ShieldAlert className="h-10 w-10" />
            </div>
            <div className="space-y-2 text-center">
              <AlertDialogTitle className="text-2xl font-black text-[#002d4d] tracking-normal">تحذير حذف سيادي</AlertDialogTitle>
              <div className="flex items-center justify-center gap-2 text-red-400 font-black text-[9px] uppercase tracking-[0.3em]">
                <ShieldAlert className="h-3 w-3" />
                Asset Termination Protocol
              </div>
            </div>
            <AlertDialogDescription className="text-[13px] font-bold text-gray-500 leading-[2.2] px-2 text-center">
              أنت على وشك حذف هذا الأصل المالي نهائياً من محرك التداول. سيؤدي هذا الإجراء إلى توقف كافة الرسوم البيانية المرتبطة به. هل أنت متأكد من قرارك؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col gap-3 sm:flex-col mt-8">
            <AlertDialogAction 
              onClick={executeDelete}
              className="w-full h-14 rounded-full bg-red-500 hover:bg-red-600 text-white font-black text-base shadow-xl active:scale-95 transition-all"
            >
              تأكيد الحذف النهائي
            </AlertDialogAction>
            <AlertDialogCancel className="w-full h-14 rounded-full bg-gray-50 text-gray-400 border-none font-black text-xs hover:bg-gray-100 transition-all">
              إلغاء والعودة للجرد
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
