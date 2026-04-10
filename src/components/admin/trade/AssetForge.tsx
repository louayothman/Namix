
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Cpu, 
  Zap, 
  Loader2, 
  Target, 
  Sparkles,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  Database,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { CryptoIcon, ICON_OPTIONS } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

export function AssetForge() {
  const db = useFirestore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'internal' | 'binance'>('internal');
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "Crypto",
    priceSource: "internal",
    binanceSymbol: "",
    minPrice: 100,
    maxPrice: 1000,
    volatility: 5,
    trendBias: "neutral",
    icon: "COINS",
  });

  const handleCreate = async () => {
    if (!formData.name || !formData.code) {
      toast({ variant: "destructive", title: "بيانات ناقصة" });
      return;
    }

    setLoading(true);
    try {
      const docId = formData.code.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
      const payload = {
        ...formData,
        priceSource: source,
        id: docId,
        currentPrice: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, "trading_symbols", docId), payload);
      
      toast({ title: "تم تفعيل الأصل بنجاح" });
      setFormData({ name: "", code: "", type: "Crypto", priceSource: "internal", binanceSymbol: "", minPrice: 100, maxPrice: 1000, volatility: 5, trendBias: "neutral", icon: "COINS" });
      setIsOpen(false);
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في القاعدة" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[48px] border-none shadow-xl bg-white overflow-hidden group transition-all">
        <CardHeader className="bg-[#002d4d] p-8 text-white relative flex flex-row items-center justify-between border-b border-white/5">
           <div className="absolute top-0 right-0 p-4 opacity-[0.03] -rotate-12 pointer-events-none transition-transform group-hover:rotate-0 duration-1000">
              <Database size={120} />
           </div>
           
           <div className="flex items-center gap-5 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner group-hover:rotate-12 transition-transform">
                 <Zap className="h-7 w-7 text-[#f9a885]" />
              </div>
              <div className="text-right">
                 <CardTitle className="text-xl font-black">مفاعل صهر الأصول</CardTitle>
                 <p className="text-[9px] font-bold text-blue-200/40 uppercase tracking-widest mt-1">Sovereign Asset Forge v3.0</p>
              </div>
           </div>

           <Button 
             variant="ghost" 
             onClick={() => setIsOpen(!isOpen)}
             className="rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-[10px] px-6 h-10 border border-white/10"
           >
              {isOpen ? "إخفاء المفاعل" : "إضافة أصل مالي جديد"}
           </Button>
        </CardHeader>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "circOut" }}
            >
              <CardContent className="p-10 space-y-10 border-t border-gray-50">
                 
                 <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1 text-right">
                       <h4 className="font-black text-sm text-[#002d4d] flex items-center gap-3 justify-end">
                          تحديد مصدر البيانات
                          <Cpu className="h-4 w-4 text-orange-500" />
                       </h4>
                       <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Select Operational Node</p>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                       <button onClick={() => setSource('internal')} className={cn("px-8 h-10 rounded-xl font-black text-[9px] transition-all", source === 'internal' ? "bg-[#002d4d] text-white shadow-lg" : "text-gray-400 hover:bg-gray-50")}>أصول داخلية</button>
                       <button onClick={() => setSource('binance')} className={cn("px-8 h-10 rounded-xl font-black text-[9px] transition-all", source === 'binance' ? "bg-orange-50 text-orange-600 shadow-lg" : "text-gray-400 hover:bg-gray-50")}>بينانس (Binance)</button>
                    </div>
                 </div>

                 <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-7 space-y-8">
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2 text-right">
                             <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">اسم الأصل</Label>
                             <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 shadow-inner text-right" placeholder="Bitcoin / USDT" />
                          </div>
                          <div className="space-y-2 text-right">
                             <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">كود التداول</Label>
                             <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 text-left shadow-inner" dir="ltr" placeholder="BTCUSDT" />
                          </div>
                       </div>

                       {source === 'binance' && (
                         <div className="space-y-2 text-right animate-in fade-in zoom-in-95">
                            <Label className="text-[10px] font-black text-orange-600 pr-4 uppercase">Binance Symbol (Exact)</Label>
                            <Input value={formData.binanceSymbol} onChange={e => setFormData({...formData, binanceSymbol: e.target.value.toUpperCase()})} className="h-14 rounded-2xl bg-orange-50/30 border border-orange-100 font-mono font-black px-8 text-left" dir="ltr" placeholder="e.g. BTCUSDT" />
                         </div>
                       )}

                       <div className="space-y-2 text-right">
                          <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">أيقونة الهوية</Label>
                          <Select value={formData.icon} onValueChange={val => setFormData({...formData, icon: val})}>
                             <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 shadow-inner">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent className="rounded-[32px] border-none shadow-2xl">
                                <ScrollArea className="h-[300px]">
                                   {ICON_OPTIONS.map(opt => (
                                     <SelectItem key={opt.id} value={opt.id} className="font-bold py-3">
                                        <div className="flex items-center gap-4">
                                          <CryptoIcon name={opt.id} size={24} />
                                          <span className="text-xs">{opt.label}</span>
                                        </div>
                                     </SelectItem>
                                   ))}
                                </ScrollArea>
                             </SelectContent>
                          </Select>
                       </div>

                       {source === 'internal' && (
                         <div className="p-8 bg-blue-50/30 rounded-[40px] border border-blue-100/50 space-y-8 animate-in zoom-in-95">
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-2">
                                  <Label className="text-[9px] font-black text-blue-900 uppercase pr-4">أدنى سعر ($)</Label>
                                  <Input type="number" value={formData.minPrice} onChange={e => setFormData({...formData, minPrice: Number(e.target.value)})} className="h-12 rounded-xl bg-white border-none font-black text-center shadow-sm" />
                               </div>
                               <div className="space-y-2">
                                  <Label className="text-[9px] font-black text-blue-900 uppercase pr-4">أعلى سعر ($)</Label>
                                  <Input type="number" value={formData.maxPrice} onChange={e => setFormData({...formData, maxPrice: Number(e.target.value)})} className="h-12 rounded-xl bg-white border-none font-black text-center shadow-sm" />
                               </div>
                            </div>
                            <div className="space-y-3">
                               <Label className="text-[9px] font-black text-blue-900 uppercase pr-4 text-center block">منحنى الاتجاه اللحظي</Label>
                               <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-blue-100 shadow-inner">
                                  {[
                                    { id: 'up', label: 'صاعد', icon: TrendingUp, active: 'bg-emerald-500 text-white shadow-lg' },
                                    { id: 'neutral', label: 'متذبذب', icon: Activity, active: 'bg-gray-400 text-white shadow-lg' },
                                    { id: 'down', label: 'هابط', icon: TrendingDown, active: 'bg-red-500 text-white shadow-lg' }
                                  ].map(opt => (
                                    <button key={opt.id} onClick={() => setFormData({...formData, trendBias: opt.id})} className={cn("flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all duration-500 gap-1", formData.trendBias === opt.id ? opt.active : "text-gray-300 hover:bg-gray-50")}>
                                       <opt.icon size={16} />
                                       <span className="text-[8px] font-black">{opt.label}</span>
                                    </button>
                                  ))}
                               </div>
                            </div>
                         </div>
                       )}
                    </div>

                    <div className="lg:col-span-5 flex flex-col justify-between gap-8">
                       <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6">
                          <div className="flex items-center gap-3 text-[#002d4d]">
                             <ShieldCheck size={20} />
                             <h4 className="font-black text-sm">ميثاق التنشيط</h4>
                          </div>
                          <p className="text-[11px] font-bold text-gray-400 leading-[2.2] text-right">
                            عند تفعيل هذا الأصل، سيبدأ محرك التداول فوراً بجلب الأسعار من المصدر المختار. تأكد من صحة رمز Binance Symbol لضمان نجاح الاتصال اللحظي بالأسواق العالمية.
                          </p>
                          <div className="h-px bg-gray-200" />
                          <Badge className="w-full h-10 bg-emerald-50 text-emerald-600 border-none font-black text-[9px] flex items-center justify-center rounded-xl shadow-sm tracking-widest">READY FOR DEPLOYMENT</Badge>
                       </div>

                       <Button 
                         onClick={handleCreate} 
                         disabled={loading || !formData.name || !formData.code} 
                         className="w-full h-20 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl transition-all active:scale-[0.98] group"
                       >
                          {loading ? <Loader2 className="animate-spin h-8 w-8" /> : (
                            <div className="flex items-center gap-4">
                               <span>تفعيل الأصل في المفاعل</span>
                               <Sparkles className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
                            </div>
                          )}
                       </Button>
                    </div>
                 </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
