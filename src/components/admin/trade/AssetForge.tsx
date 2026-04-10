
"use client";

import { useState, useEffect, useMemo } from "react";
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
  Globe,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Info,
  Layers,
  Coins
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { getBinanceExchangeSymbols } from "@/app/actions/binance-actions";
import { searchFinnhubSymbols } from "@/app/actions/finnhub-actions";
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
  const [syncLoading, setSyncLoading] = useState(false);
  const [marketSymbols, setMarketSymbols] = useState<any[]>([]);
  const [source, setSource] = useState<'internal' | 'binance' | 'finnhub'>(initialData?.priceSource === 'alphavantage' ? 'internal' : initialData?.priceSource || 'internal');
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    code: initialData?.code || "",
    type: initialData?.type || "Equity",
    priceSource: initialData?.priceSource || "internal",
    binanceSymbol: initialData?.binanceSymbol || "",
    externalTicker: initialData?.externalTicker || "", 
    minPrice: initialData?.minPrice || 100,
    maxPrice: initialData?.maxPrice || 1000,
    volatility: initialData?.volatility || 5,
    trendBias: initialData?.trendBias || "neutral",
    icon: initialData?.icon || "COINS",
    assistantRefreshTicks: initialData?.assistantRefreshTicks || 5
  });

  const db = useFirestore();

  useEffect(() => {
    if (open && source === 'binance') {
      fetchBinanceData();
    }
  }, [open, source]);

  const fetchBinanceData = async () => {
    setSyncLoading(true);
    setMarketSymbols([]);
    try {
      const res = await getBinanceExchangeSymbols();
      if (res.success && res.symbols) {
        setMarketSymbols(res.symbols);
      } else if (res.error) {
        toast({ variant: "destructive", title: "خطأ في المزامنة", description: res.error });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleGlobalSearch = async () => {
    if (searchTerm.length < 2) return;
    setSyncLoading(true);
    setMarketSymbols([]);
    try {
      if (source === 'finnhub') {
        const res = await searchFinnhubSymbols(searchTerm);
        if (res?.success) {
          setMarketSymbols(res.symbols || []);
        } else {
          toast({ variant: "destructive", title: "فشل البحث", description: res?.error });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleSelectMarketSymbol = (sym: string) => {
    const asset = marketSymbols.find(s => s.symbol === sym);
    if (!asset) return;

    if (source === 'binance') {
      const possibleIcon = asset.baseAsset.toUpperCase();
      const hasIcon = CRYPTO_ICONS_MAP[possibleIcon] !== undefined;
      setFormData({
        ...formData,
        name: `${asset.baseAsset} / ${asset.quoteAsset}`,
        code: `${asset.baseAsset}/${asset.quoteAsset}`,
        type: 'Crypto',
        binanceSymbol: asset.symbol,
        priceSource: 'binance',
        icon: hasIcon ? possibleIcon : 'COINS'
      });
    } else if (source === 'finnhub') {
      let autoIcon = 'STOCK';
      const upperName = (asset.name || "").toUpperCase();
      const upperSym = (asset.symbol || "").toUpperCase();

      if (upperSym.includes('XAU') || upperName.includes('GOLD')) autoIcon = 'GOLD';
      else if (upperSym.includes('WTI') || upperName.includes('OIL') || upperSym.includes('BRN')) autoIcon = 'OIL';
      else if (upperSym === 'AAPL') autoIcon = 'APPLE';
      else if (upperSym === 'GOOGL' || upperSym === 'GOOG') autoIcon = 'GOOGLE';
      else if (upperSym === 'MSFT') autoIcon = 'MICROSOFT';
      else if (upperSym === 'TSLA') autoIcon = 'TESLA';
      else if (upperSym === 'NVDA') autoIcon = 'NVIDIA';
      else if (upperSym === 'AMZN') autoIcon = 'AMAZON';
      else if (asset.type === 'Forex') autoIcon = 'FOREX';

      setFormData({
        ...formData,
        name: asset.name || asset.symbol,
        code: asset.symbol,
        type: asset.type || 'Equity',
        externalTicker: asset.symbol,
        priceSource: 'finnhub',
        icon: autoIcon
      });
    }
  };

  const filteredSymbols = useMemo(() => {
    if (source === 'finnhub') return marketSymbols;
    if (!searchTerm) return marketSymbols.slice(0, 50);
    return marketSymbols
      .filter(s => s.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) || (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())))
      .slice(0, 50);
  }, [marketSymbols, searchTerm, source]);

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
        currentPrice: (source !== 'internal') ? (initialData?.currentPrice || 0) : (Number(formData.minPrice) + Number(formData.maxPrice)) / 2,
        isActive: initialData?.isActive ?? true,
        updatedAt: new Date().toISOString()
      };

      if (mode === 'add') {
        await addDoc(collection(db, "trading_symbols"), { ...payload, createdAt: new Date().toISOString() });
        toast({ title: "تم إطلاق الرمز بنجاح" });
      } else {
        await updateDoc(doc(db, "trading_symbols", initialData.id), payload);
        toast({ title: "تم تحديث بيانات الرمز" });
      }

      setOpen(false);
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في القاعدة" });
    } finally {
      setLoading(false);
    }
  };

  const iconOptions = useMemo(() => Object.keys(CRYPTO_ICONS_MAP), []);

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
          <div className="bg-[#002d4d] p-8 md:p-10 text-white relative shrink-0 text-center border-b border-white/5">
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
                   <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-gray-100">
                      <button onClick={() => setSource('internal')} className={cn("px-4 h-8 rounded-xl font-black text-[8px] transition-all", source === 'internal' ? "bg-[#002d4d] text-white shadow-md" : "text-gray-400")}>داخلي</button>
                      <button onClick={() => setSource('binance')} className={cn("px-4 h-8 rounded-xl font-black text-[8px] transition-all", source === 'binance' ? "bg-orange-50 text-orange-600 shadow-md" : "text-gray-400")}>بينانس</button>
                      <button onClick={() => setSource('finnhub')} className={cn("px-4 h-8 rounded-xl font-black text-[8px] transition-all", source === 'finnhub' ? "bg-blue-50 text-blue-600 shadow-md" : "text-gray-400")}>Finnhub</button>
                   </div>
                </div>

                {(source !== 'internal') && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                     <div className="relative">
                        <Input 
                          placeholder="ابحث عن رمز (BTC, Gold, Apple)..." 
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (source === 'finnhub') && handleGlobalSearch()}
                          className="h-11 rounded-xl bg-white border-none font-black text-xs pr-10 shadow-sm"
                        />
                        {(source === 'finnhub') ? (
                          <button onClick={handleGlobalSearch} className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center active:scale-90 transition-all">
                             <Search size={14} />
                          </button>
                        ) : (
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                        )}
                     </div>
                     
                     <div className="space-y-2">
                        <Label className="text-[9px] font-black text-gray-400 pr-2 uppercase">النتائج المتوفرة من {source.toUpperCase()}</Label>
                        <Select onValueChange={handleSelectMarketSymbol}>
                           <SelectTrigger className="h-12 rounded-xl bg-white border-none font-black text-xs shadow-sm">
                              <SelectValue placeholder={syncLoading ? "جاري البحث..." : "اختر من القائمة..."} />
                           </SelectTrigger>
                           <SelectContent className="rounded-2xl border-none shadow-2xl z-[1200]" dir="rtl" position="popper">
                              <ScrollArea className="h-[250px]">
                                 {syncLoading ? (
                                   <div className="p-10 text-center"><Loader2 className="animate-spin h-6 w-6 mx-auto text-blue-500" /></div>
                                 ) : filteredSymbols.map((s, idx) => (
                                   <SelectItem key={`${s.symbol}-${idx}`} value={s.symbol} className="font-bold text-right py-3">
                                      <div className="flex items-center justify-between gap-4">
                                         <div className="flex flex-col items-start text-right">
                                            <span className="text-xs">{s.symbol}</span>
                                            <span className="text-[8px] text-gray-400 font-bold uppercase">{s.name || s.type}</span>
                                         </div>
                                      </div>
                                   </SelectItem>
                                 ))}
                              </ScrollArea>
                           </SelectContent>
                        </Select>
                     </div>
                  </div>
                )}
             </div>

             <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">اسم العرض</Label>
                      <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-black px-6 shadow-inner text-right" placeholder="مثال: Gold / USD" />
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
                            {iconOptions.map(iconId => (
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
