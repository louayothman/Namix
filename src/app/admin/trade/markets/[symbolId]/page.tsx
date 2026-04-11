
"use client";

import { use, useState, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronRight, 
  Settings2, 
  Timer, 
  Plus, 
  Trash2, 
  Loader2, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  Activity,
  Type
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { CryptoIcon, ICON_OPTIONS } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * @fileOverview صفحة تفاصيل السوق السيادية v1.1
 * تم تحديث محرك الأيقونات ليدعم Cryptocurrency Color مع قائمة اختيار احترافية.
 */

const UNIT_OPTIONS = [
  { id: 'seconds', label: 'ثانية' },
  { id: 'minutes', label: 'دقيقة' },
  { id: 'hours', label: 'ساعة' },
  { id: 'days', label: 'يوم' }
];

export default function MarketDetailPage({ params }: { params: Promise<{ symbolId: string }> }) {
  const { symbolId } = use(params);
  const router = useRouter();
  const db = useFirestore();
  const [saving, setSaving] = useState(false);

  const symbolRef = useMemoFirebase(() => doc(db, "trading_symbols", symbolId), [db, symbolId]);
  const { data: asset, isLoading } = useDoc(symbolRef);

  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    if (asset) {
      setEditData({
        ...asset,
        durations: asset.durations || []
      });
    }
  }, [asset]);

  const handleSave = async () => {
    if (!editData) return;
    setSaving(true);
    try {
      await updateDoc(symbolRef, { ...editData, updatedAt: new Date().toISOString() });
      toast({ title: "تم تحديث بيانات السوق بنجاح" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل تحديث البيانات" });
    } finally {
      setSaving(false);
    }
  };

  const addDuration = () => {
    const next = [...(editData.durations || []), { value: 60, unit: 'seconds' }];
    setEditData({ ...editData, durations: next });
  };

  const removeDuration = (idx: number) => {
    const next = editData.durations.filter((_: any, i: number) => i !== idx);
    setEditData({ ...editData, durations: next });
  };

  const updateDuration = (idx: number, field: string, val: any) => {
    const next = [...editData.durations];
    next[idx] = { ...next[idx], [field]: val };
    setEditData({ ...editData, durations: next });
  };

  if (isLoading || !editData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white font-body">
         <Loader2 className="h-10 w-10 animate-spin text-[#002d4d]" />
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">جاري سحب بيانات الأصل...</p>
      </div>
    );
  }

  return (
    <Shell isAdmin>
      <div className="max-w-5xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-8">
           <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-[28px] bg-[#002d4d] flex items-center justify-center shadow-xl text-[#f9a885]">
                 <CryptoIcon name={editData.icon} size={32} />
              </div>
              <div className="text-right space-y-0.5">
                 <h1 className="text-2xl font-black text-[#002d4d]">{editData.name}</h1>
                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{editData.code} • {editData.priceSource?.toUpperCase()}</p>
              </div>
           </div>
           <Button onClick={() => router.back()} variant="ghost" className="rounded-full bg-white border border-gray-100 h-12 px-8 font-black text-[10px]">
              <ChevronRight className="ml-2 h-4 w-4" /> الرجوع للقائمة
           </Button>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
           
           {/* Section 1: Basic Info & Branding */}
           <div className="lg:col-span-7 space-y-10">
              <Card className="rounded-[48px] border-none shadow-sm bg-white overflow-hidden group">
                 <CardHeader className="bg-gray-50/50 p-8 border-b border-gray-100">
                    <CardTitle className="text-lg font-black flex items-center gap-3 text-[#002d4d]">
                       <Settings2 className="h-5 w-5 text-blue-500" /> الإعدادات الجوهرية
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">اسم العرض</Label>
                          <Input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-black px-6" />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">كود التداول</Label>
                          <Input value={editData.code} onChange={e => setEditData({...editData, code: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-black px-6 text-left" dir="ltr" />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">أيقونة الأصل (الملونة)</Label>
                       <Select value={editData.icon} onValueChange={val => setEditData({...editData, icon: val})}>
                          <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none font-black px-6 shadow-inner">
                             <SelectValue placeholder="اختر أيقونة من Cryptocurrency Color..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-[32px] border-none shadow-2xl">
                             <ScrollArea className="h-[300px]">
                                <div className="px-2 py-2 border-b border-gray-50 mb-2">
                                   <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Global Asset Library</p>
                                </div>
                                {ICON_OPTIONS.map(opt => (
                                  <SelectItem key={opt.id} value={opt.id} className="font-bold py-3 text-right cursor-pointer">
                                     <div className="flex items-center gap-4 justify-end">
                                        <span>{opt.label}</span>
                                        <CryptoIcon name={opt.id} size={24} />
                                     </div>
                                  </SelectItem>
                                ))}
                             </ScrollArea>
                          </SelectContent>
                       </Select>
                    </div>

                    {editData.priceSource === 'internal' && (
                      <div className="p-6 bg-blue-50/30 rounded-[32px] border border-blue-100/50 space-y-6 animate-in zoom-in-95">
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <Label className="text-[9px] font-black text-blue-900 uppercase pr-4">أقل سعر ($)</Label>
                               <Input type="number" value={editData.minPrice} onChange={e => setEditData({...editData, minPrice: Number(e.target.value)})} className="h-11 rounded-xl bg-white border-none font-black text-center shadow-sm" />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[9px] font-black text-blue-900 uppercase pr-4">أعلى سعر ($)</Label>
                               <Input type="number" value={editData.maxPrice} onChange={e => setEditData({...editData, maxPrice: Number(e.target.value)})} className="h-11 rounded-xl bg-white border-none font-black text-center shadow-sm" />
                            </div>
                         </div>
                      </div>
                    )}
                 </CardContent>
              </Card>

              <Button onClick={handleSave} disabled={saving} className="w-full h-18 rounded-full bg-[#002d4d] text-white font-black text-lg shadow-xl active:scale-[0.98] group">
                 {saving ? <Loader2 className="animate-spin h-6 w-6" /> : (
                   <div className="flex items-center gap-4">
                      <span>تثبيت التعديلات المعتمدة</span>
                      <ShieldCheck className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
                   </div>
                 )}
              </Button>
           </div>

           {/* Section 2: Specific Market Durations */}
           <div className="lg:col-span-5 space-y-8">
              <Card className="rounded-[48px] border-none shadow-sm bg-white overflow-hidden">
                 <CardHeader className="bg-emerald-50/20 p-8 border-b border-gray-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-black flex items-center gap-3 text-emerald-700">
                       <Timer className="h-5 w-5 text-emerald-600" /> مدد العقود المخصصة
                    </CardTitle>
                    <Button onClick={addDuration} size="sm" variant="ghost" className="h-9 rounded-xl bg-emerald-100 text-emerald-700 text-[10px] font-black px-4 active:scale-95">
                       <Plus size={14} className="ml-1" /> إضافة مدة
                    </Button>
                 </CardHeader>
                 <CardContent className="p-8 space-y-6">
                    <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner space-y-4">
                       <div className="flex items-center gap-3 text-emerald-600 px-2">
                          <Sparkles className="h-4 w-4" />
                          <p className="text-[10px] font-black uppercase">بروتوكول التخصيص</p>
                       </div>
                       <p className="text-[11px] font-bold text-gray-400 leading-relaxed px-2">إذا كانت القائمة فارغة، سيعتمد هذا السوق تلقائياً على المدد الزمنية العالمية المحددة في قمة التحكم.</p>
                    </div>

                    <div className="grid gap-3">
                       {editData.durations?.map((dur: any, i: number) => (
                         <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-100 group/dur animate-in fade-in slide-in-from-top-1">
                            <Input 
                              type="number" 
                              value={dur.value} 
                              onChange={e => updateDuration(i, 'value', Number(e.target.value))}
                              className="h-10 flex-1 rounded-xl bg-white border-none font-black text-center text-sm shadow-sm"
                            />
                            <Select value={dur.unit} onValueChange={val => updateDuration(i, 'unit', val)}>
                               <SelectTrigger className="h-10 w-28 rounded-xl bg-white border-none font-black text-[10px] shadow-sm">
                                  <SelectValue />
                               </SelectTrigger>
                               <SelectContent className="rounded-2xl border-none shadow-2xl">
                                  {UNIT_OPTIONS.map(u => (
                                    <SelectItem key={u.id} value={u.id} className="font-bold text-right py-2">{u.label}</SelectItem>
                                  ))}
                               </SelectContent>
                            </Select>
                            <button onClick={() => removeDuration(i)} className="h-10 w-10 rounded-xl bg-white text-red-400 flex items-center justify-center hover:bg-red-50 opacity-0 group-hover/dur:opacity-100 transition-all">
                               <Trash2 size={14} />
                            </button>
                         </div>
                       ))}
                       {(!editData.durations || editData.durations.length === 0) && (
                         <div className="py-12 text-center opacity-20 flex flex-col items-center gap-3">
                            <Activity size={32} />
                            <p className="text-[10px] font-black uppercase tracking-widest">Custom Nodes Empty</p>
                         </div>
                       )}
                    </div>
                 </CardContent>
              </Card>
           </div>

        </div>
      </div>
    </Shell>
  );
}
