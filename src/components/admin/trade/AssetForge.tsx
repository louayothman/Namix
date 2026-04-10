
"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Cpu, 
  Zap, 
  Loader2, 
  Search, 
  Target, 
  Sparkles,
  Edit2,
  ShieldCheck,
  AlertCircle,
  History,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Globe
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { getBinanceExchangeSymbols } from "@/app/actions/binance-actions";
import { CRYPTO_ICONS_MAP, CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AssetForgeProps {
  initialData?: any;
  mode?: "add" | "edit";
}

export function AssetForge({ initialData, mode = "add" }: AssetForgeProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [binanceLoading, setBinanceLoading] = useState(false);
  const [binanceSymbols, setBinanceSymbols] = useState<any[]>([]);
  const [source, setSource] = useState<'internal' | 'binance' | 'twelvedata'>(initialData?.priceSource || 'internal');
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    code: initialData?.code || "",
    priceSource: initialData?.priceSource || "internal",
    binanceSymbol: initialData?.binanceSymbol || "",
    externalTicker: initialData?.externalTicker || "", // For Twelve Data
    minPrice: initialData?.minPrice || 100,
    maxPrice: initialData?.maxPrice || 1000,
    volatility: initialData?.volatility || 5,
    trendBias: initialData?.trendBias || "neutral",
    icon: initialData?.icon || "Coins",
    assistantRefreshTicks: initialData?.assistantRefreshTicks || 5
  });

  const db = useFirestore();

  useEffect(() => {
    if (open && source === 'binance' && binanceSymbols.length === 0) {
      fetchBinanceData();
    }
  }, [open, source]);

  const fetchBinanceData = async () => {
    setBinanceLoading(true);
    try {
      const res = await getBinanceExchangeSymbols();
      if (res.success && res.symbols) {
        setBinanceSymbols(res.symbols);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBinanceLoading(false);
    }
  };

  const handleSelectBinanceSymbol = (sym: string) => {
    const asset = binanceSymbols.find(s => s.symbol === sym);
    if (asset) {
      const possibleIcon = asset.baseAsset.toUpperCase();
      const hasSpecialized = CRYPTO_ICONS_MAP[possibleIcon] !== undefined;

      setFormData({
        ...formData,
        name: `${asset.baseAsset} / ${asset.quoteAsset}`,
        code: `${asset.baseAsset}/${asset.quoteAsset}`,
        binanceSymbol: asset.symbol,
        priceSource: 'binance',
        icon: hasSpecialized ? possibleIcon : 'Coins'
      });
    }
  };

  const handleAction = async () => {
    if (!formData.name || !formData.code) {
      toast({ variant: "destructive", title: "بيانات ناقصة" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        priceSource: source,
        currentPrice: (source === 'binance' || source === 'twelvedata') ? (initialData?.currentPrice || 0) : (Number(formData.minPrice) + Number(formData.maxPrice)) / 2,
        isActive: initialData?.isActive ?? true,
        updatedAt: new Date().toISOString()
      };

      let symbolId = initialData?.id;

      if (mode === 'add') {
        await addDoc(collection(db, "trading_symbols"), { ...payload, createdAt: new Date().toISOString() });
        toast({ title: "تم إطلاق الرمز بنجاح" });
      } else {
        await updateDoc(doc(db, "trading_symbols", symbolId), payload);
        toast({ title: "تم تحديث بيانات الرمز" });
      }

      setOpen(false);
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في القاعدة" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {mode === 'add' ? (
        <Button onClick={() => setOpen(true)} className="rounded-full h-14 md:h-16 px-10 bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-sm shadow-2xl active:scale-95 group transition-all">
          <Plus className="ml-2 h-5 w-5 text-[#f9a885] group-hover:rotate-90 transition-transform" /> إدراج أصل مالي جديد
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)} variant="ghost" size="sm" className="h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-black text-[10px]">
          <Edit2 className="ml-2 h-4 w-4" /> تعديل البيانات
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-[48px] border-none shadow-2xl p-0 max-w-[520px] overflow-hidden font-body text-right flex flex-col max-h-[90vh] z-[1100]" dir="rtl">
          <div className="bg-[#002d4d] p-8 md:p-10 text-white relative shrink-0">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 pointer-events-none"><Target className="h-40 w-40" /></div>
             <div className="flex items-center gap-6 relative z-10">
                <div className="h-16 w-16 rounded-[28px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                   <Zap className="h-8 w-8 text-[#f9a885]" />
                </div>
                <div className="space-y-0.5">
                   <DialogTitle className="text-2xl font-black">هندسة الأصول العالمية</DialogTitle>
                   <p className="text-[9px] font-bold text-blue-200/40 uppercase tracking-widest mt-1">Multi-Market Asset Forge</p>
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 bg-white scrollbar-none">
             
             <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner space-y-6">
                <div className="flex items-center justify-between">
                   <h4 className="font-black text-sm text-[#002d4d] flex items-center gap-3">
                      <Cpu className="h-4 w-4 text-orange-500" /> بروتوكول تزويد السعر
                   </h4>
                   <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-gray-100">
                      <button onClick={() => setSource('internal')} className={cn("px-4 h-8 rounded-xl font-black text-[9px] transition-all", source === 'internal' ? "bg-[#002d4d] text-white" : "text-gray-400")}>داخلي</button>
                      <button onClick={() => setSource('binance')} className={cn("px-4 h-8 rounded-xl font-black text-[9px] transition-all", source === 'binance' ? "bg-orange-50 text-orange-600" : "text-gray-400")}>بينانس</button>
                      <button onClick={() => setSource('twelvedata')} className={cn("px-4 h-8 rounded-xl font-black text-[9px] transition-all", source === 'twelvedata' ? "bg-blue-50 text-blue-600" : "text-gray-400")}>12Data</button>
                   </div>
                </div>

                {source === 'binance' && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                     <Label className="text-[9px] font-black text-gray-400 pr-2 uppercase">قائمة رموز بينانس</Label>
                     <Select value={formData.binanceSymbol} onValueChange={handleSelectBinanceSymbol}>
                        <SelectTrigger className="h-12 rounded-xl bg-white border-none font-black text-xs shadow-sm">
                           <SelectValue placeholder="اختر رمز الكريبتو..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl z-[1200]" dir="rtl" position="popper">
                           <ScrollArea className="h-[250px]">
                              {binanceSymbols.map(s => (
                                <SelectItem key={s.symbol} value={s.symbol} className="font-bold text-right">{s.symbol}</SelectItem>
                              ))}
                           </ScrollArea>
                        </SelectContent>
                     </Select>
                  </div>
                )}

                {source === 'twelvedata' && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                     <div className="flex items-center gap-2 pr-2 text-blue-600">
                        <Globe size={14} />
                        <Label className="text-[9px] font-black uppercase">الرمز العالمي (Twelve Data Ticker)</Label>
                     </div>
                     <Input 
                       value={formData.externalTicker} 
                       onChange={e => setFormData({...formData, externalTicker: e.target.value.toUpperCase()})}
                       className="h-12 rounded-xl bg-white border-none font-black text-blue-600 text-center shadow-sm"
                       placeholder="مثال: XAU/USD أو AAPL"
                       dir="ltr"
                     />
                     <p className="text-[8px] text-gray-400 font-bold pr-2">تأكد من مطابقة الرمز لمعايير Twelve Data (الذهب: XAU/USD، النفط: WTI/USD، آبل: AAPL).</p>
                  </div>
                )}
             </div>

             <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">اسم العرض</Label>
                      <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-black px-6 shadow-inner" placeholder="مثال: Gold / USD" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">كود الواجهة</Label>
                      <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-black px-6 text-left shadow-inner" dir="ltr" placeholder="XAUUSD" />
                   </div>
                </div>

                <div className="space-y-4">
                   <Label className="text-[10px] font-black text-[#002d4d] pr-4 uppercase tracking-widest">أيقونة الأصل المعتمدة</Label>
                   <Select value={formData.icon} onValueChange={val => setFormData({...formData, icon: val})}>
                      <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none font-black px-6 shadow-inner outline-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-3xl border-none shadow-2xl z-[1200]">
                         <ScrollArea className="h-[300px]">
                            {Object.keys(CRYPTO_ICONS_MAP).map(iconId => (
                              <SelectItem key={iconId} value={iconId} className="font-bold py-3">
                                 <div className="flex items-center gap-4">
                                   <CryptoIcon name={iconId} size={24} />
                                   <span className="text-xs">{iconId}</span>
                                 </div>
                              </SelectItem>
                            ))}
                         </ScrollArea>
                      </SelectContent>
                   </Select>
                </div>

                {source === 'internal' && (
                  <div className="p-6 bg-blue-50/30 rounded-[32px] border border-blue-100/50 space-y-6 animate-in zoom-in-95">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <Label className="text-[9px] font-black text-blue-900 uppercase pr-4">أقل سعر ($)</Label>
                           <Input type="number" value={formData.minPrice} onChange={e => setFormData({...formData, minPrice: Number(e.target.value)})} className="h-11 rounded-xl bg-white border-none font-black text-center shadow-sm" />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[9px] font-black text-blue-900 uppercase pr-4">أعلى سعر ($)</Label>
                           <Input type="number" value={formData.maxPrice} onChange={e => setFormData({...formData, maxPrice: Number(e.target.value)})} className="h-11 rounded-xl bg-white border-none font-black text-center shadow-sm" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <Label className="text-[9px] font-black text-blue-900 uppercase pr-4 text-center block">الانحياز الاستراتيجي</Label>
                        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-blue-100 shadow-inner">
                           {[
                             { id: 'up', label: 'صاعد', icon: TrendingUp, color: 'text-emerald-600', active: 'bg-emerald-500 text-white' },
                             { id: 'neutral', label: 'متذبذب', icon: Activity, color: 'text-gray-400', active: 'bg-gray-400 text-white' },
                             { id: 'down', label: 'هابط', icon: TrendingDown, color: 'text-red-600', active: 'bg-red-500 text-white' }
                           ].map(opt => (
                             <button key={opt.id} onClick={() => setFormData({...formData, trendBias: opt.id})} className={cn("flex-1 flex flex-col items-center py-2 rounded-xl transition-all duration-300 gap-1", formData.trendBias === opt.id ? opt.active : "text-gray-300 hover:bg-gray-50")}>
                                <opt.icon size={14} />
                                <span className="text-[8px] font-black">{opt.label}</span>
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
                )}
             </div>
          </div>

          <DialogFooter className="p-8 bg-gray-50 border-t border-gray-100 shrink-0">
             <Button onClick={handleAction} disabled={loading} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-lg shadow-xl active:scale-[0.98] group transition-all">
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                  <div className="flex items-center gap-4">
                    <span>{mode === 'add' ? 'تفعيل الأصل في المحرك' : 'حفظ التعديلات المعتمدة'}</span>
                    <ShieldCheck className="h-5 w-5 text-[#f9a885] group-hover:rotate-12 transition-transform" />
                  </div>
                )}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
