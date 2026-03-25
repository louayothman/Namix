
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
  Activity
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, addDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { getBinanceExchangeSymbols } from "@/app/actions/binance-actions";
import { CRYPTO_ICONS_MAP, CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface AssetForgeProps {
  initialData?: any;
  mode?: "add" | "edit";
}

export function AssetForge({ initialData, mode = "add" }: AssetForgeProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [binanceLoading, setBinanceLoading] = useState(false);
  const [binanceSymbols, setBinanceSymbols] = useState<any[]>([]);
  const [source, setSource] = useState<'internal' | 'binance'>(initialData?.priceSource || 'internal');
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    code: initialData?.code || "",
    priceSource: initialData?.priceSource || "internal",
    binanceSymbol: initialData?.binanceSymbol || "",
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
      } else {
        toast({ variant: "destructive", title: "فشل جلب الرموز", description: "تأكد من اتصال الإنترنت وحاول مجدداً." });
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
      setFormData({
        ...formData,
        name: `${asset.baseAsset} / ${asset.quoteAsset}`,
        code: `${asset.baseAsset}/${asset.quoteAsset}`,
        binanceSymbol: asset.symbol,
        priceSource: 'binance',
        icon: asset.baseAsset === 'BTC' ? 'Bitcoin' : asset.baseAsset === 'ETH' ? 'Ethereum' : 'Coins'
      });
    }
  };

  const handleAction = async () => {
    if (!formData.name || !formData.code) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى تعبئة الاسم والكود." });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        priceSource: source,
        currentPrice: source === 'binance' ? (initialData?.currentPrice || 0) : (Number(formData.minPrice) + Number(formData.maxPrice)) / 2,
        isActive: initialData?.isActive ?? true,
        updatedAt: new Date().toISOString()
      };

      let symbolId = initialData?.id;

      if (mode === 'add') {
        const docRef = await addDoc(collection(db, "trading_symbols"), { ...payload, createdAt: new Date().toISOString() });
        symbolId = docRef.id;
        toast({ title: "تم إطلاق الرمز بنجاح" });
      } else {
        await updateDoc(doc(db, "trading_symbols", symbolId), payload);
        toast({ title: "تم تحديث بيانات الرمز" });
      }

      if (source === 'internal') {
        await addDoc(collection(db, "symbol_settings_log"), {
          symbolId,
          minPrice: Number(formData.minPrice),
          maxPrice: Number(formData.maxPrice),
          volatility: Number(formData.volatility),
          trendBias: formData.trendBias,
          timestamp: Date.now()
        });
      }

      setOpen(false);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "خطأ في القاعدة" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {mode === 'add' ? (
        <Button onClick={() => setOpen(true)} className="rounded-full h-14 md:h-16 px-10 bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-sm shadow-2xl active:scale-95 group transition-all">
          <Plus className="ml-2 h-5 w-5 text-[#f9a885] group-hover:rotate-90 transition-transform" /> إدراج رمز سوق جديد
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
                   <DialogTitle className="text-2xl font-black">
                     {mode === 'add' ? 'هندسة رمز تداول' : 'تحديث الأصل'}
                     <span className="text-[10px] font-bold text-blue-200/40 uppercase mr-3">Asset Forge</span>
                   </DialogTitle>
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
                      <button onClick={() => setSource('internal')} className={cn("px-6 h-9 rounded-xl font-black text-[10px] transition-all", source === 'internal' ? "bg-[#002d4d] text-white" : "text-gray-400")}>داخلي</button>
                      <button onClick={() => setSource('binance')} className={cn("px-6 h-9 rounded-xl font-black text-[10px] transition-all", source === 'binance' ? "bg-orange-50 text-white" : "text-gray-400")}>بينانس</button>
                   </div>
                </div>

                {source === 'binance' && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                     <Label className="text-[9px] font-black text-gray-400 pr-2 uppercase">قائمة رموز بينانس الحية</Label>
                     <div className="relative">
                        <Select value={formData.binanceSymbol} onValueChange={handleSelectBinanceSymbol}>
                           <SelectTrigger className="h-14 rounded-2xl bg-white border-none font-black text-orange-600 px-10 shadow-sm outline-none">
                              <SelectValue placeholder={binanceLoading ? "جاري الجرد من السيرفر..." : "ابحث عن رمز..."} />
                           </SelectTrigger>
                           <SelectContent className="rounded-2xl border-none shadow-2xl z-[1200]" dir="rtl" position="popper" sideOffset={5}>
                              {binanceSymbols.length === 0 && !binanceLoading ? (
                                <div className="p-10 text-center space-y-4">
                                   <AlertCircle className="h-8 w-8 text-gray-200 mx-auto" />
                                   <p className="text-[10px] font-bold text-gray-400">فشل جلب القائمة. يرجى المحاولة لاحقاً.</p>
                                   <Button size="sm" variant="outline" onClick={fetchBinanceData} className="h-8 text-[9px] font-black">إعادة المحاولة</Button>
                                </div>
                              ) : (
                                binanceSymbols.map(s => (
                                  <SelectItem key={s.symbol} value={s.symbol} className="font-bold py-3 text-right cursor-pointer">
                                     <div className="flex items-center justify-between w-full min-w-[280px]">
                                        <span className="text-[9px] text-gray-400">{s.baseAsset} Pair</span>
                                        <span className="font-black text-[#002d4d]" dir="ltr">{s.symbol}</span>
                                     </div>
                                  </SelectItem>
                                ))
                              )}
                           </SelectContent>
                        </Select>
                        {binanceLoading ? <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-200 animate-spin" /> : <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-100" />}
                     </div>
                  </div>
                )}
             </div>

             <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">اسم العرض</Label>
                      <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-black px-6 shadow-inner" placeholder="مثال: Bitcoin / USDT" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">كود الرمز</Label>
                      <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-black px-6 text-left shadow-inner" dir="ltr" placeholder="BTC/USDT" />
                   </div>
                </div>

                <div className="space-y-2">
                   <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">أيقونة الأصل</Label>
                   <Select value={formData.icon} onValueChange={val => setFormData({...formData, icon: val})}>
                      <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-none font-black px-6 shadow-inner outline-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl z-[1200]" position="popper">
                         {Object.keys(CRYPTO_ICONS_MAP).map(iconId => (
                           <SelectItem key={iconId} value={iconId} className="font-bold py-3 cursor-pointer">
                              <div className="flex items-center gap-4 justify-start w-full">
                                <div className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center shadow-inner">
                                  <CryptoIcon name={iconId} size={20} />
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{iconId}</span>
                              </div>
                           </SelectItem>
                         ))}
                      </SelectContent>
                   </Select>
                </div>

                {source === 'internal' && (
                  <div className="p-6 bg-blue-50/30 rounded-[32px] border border-blue-100/50 space-y-6 animate-in zoom-in-95">
                     <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <History className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase">بروتوكول هندسة الماضي</span>
                     </div>
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
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <Label className="text-[9px] font-black text-blue-900 uppercase pr-4">التذبذب (1-10)</Label>
                           <Input type="number" value={formData.volatility} onChange={e => setFormData({...formData, volatility: Number(e.target.value)})} className="h-11 rounded-xl bg-white border-none font-black text-center shadow-sm" />
                        </div>
                        <div className="space-y-3">
                           <Label className="text-[9px] font-black text-blue-900 uppercase pr-4">الانحياز الاستراتيجي</Label>
                           <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-blue-100 shadow-inner">
                              {[
                                { id: 'up', label: 'صاعد', icon: TrendingUp, color: 'text-emerald-600', active: 'bg-emerald-500 text-white' },
                                { id: 'neutral', label: 'متذبذب', icon: Activity, color: 'text-gray-400', active: 'bg-gray-400 text-white' },
                                { id: 'down', label: 'هابط', icon: TrendingDown, color: 'text-red-600', active: 'bg-red-500 text-white' }
                              ].map(opt => (
                                <button
                                  key={opt.id}
                                  onClick={() => setFormData({...formData, trendBias: opt.id})}
                                  className={cn(
                                    "flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-300 gap-1",
                                    formData.trendBias === opt.id ? opt.active : "text-gray-300 hover:bg-gray-50"
                                  )}
                                >
                                   <opt.icon size={14} />
                                   <span className="text-[8px] font-black">{opt.label}</span>
                                </button>
                              ))}
                           </div>
                        </div>
                     </div>
                     <p className="text-[8px] text-blue-400 font-bold text-center leading-relaxed">
                        * سيتم حفظ هذه الإعدادات كخطوة زمنية؛ النظام سيقوم برسم الشموع التاريخية بناءً على تسلسل تعديلاتك.
                     </p>
                  </div>
                )}
             </div>
          </div>

          <DialogFooter className="p-8 bg-gray-50 border-t border-gray-100 shrink-0">
             <Button onClick={handleAction} disabled={loading} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-lg shadow-xl active:scale-[0.98] group transition-all">
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                  <div className="flex items-center gap-4">
                    <span>{mode === 'add' ? 'إطلاق الرمز في المحرك' : 'حفظ التحديثات المعتمدة'}</span>
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
