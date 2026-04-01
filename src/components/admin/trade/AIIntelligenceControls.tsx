
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Zap, Sparkles, Loader2, Target, ShieldCheck, Activity, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { broadcastAISignal } from "@/app/actions/auth-actions";
import { toast } from "@/hooks/use-toast";

interface AIIntelligenceControlsProps {
  data: any;
  onChange: (newData: any) => void;
  onSave: () => void;
  saving: boolean;
}

export function AIIntelligenceControls({ data, onChange, onSave, saving }: AIIntelligenceControlsProps) {
  const [signalLoading, setSignalLoading] = useState(false);
  const [signalData, setSignalData] = useState({ title: "", message: "" });

  const handleBroadcastSignal = async () => {
    if (!signalData.title || !signalData.message) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى تعبئة عنوان ومحتوى الإشارة." });
      return;
    }
    setSignalLoading(true);
    try {
      const res = await broadcastAISignal(signalData.title, signalData.message);
      if (res.success) {
        toast({ title: "تم بث الإشارة", description: `تم إرسال التوصية لـ ${res.count} مستثمر بنجاح.` });
        setSignalData({ title: "", message: "" });
      } else {
        toast({ variant: "destructive", title: "فشل البث", description: res.error });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في الاتصال" });
    } finally {
      setSignalLoading(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 text-right" dir="rtl">
      <div className="lg:col-span-8 space-y-10">
        <Card className="rounded-[56px] border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-blue-50/20 p-10 border-b border-gray-50">
            <CardTitle className="text-xl font-black flex items-center gap-4 text-blue-700">
              <div className="h-12 w-12 rounded-2xl bg-white shadow-inner flex items-center justify-center">
                <BrainCircuit className="h-6 w-6" />
              </div>
              مفاعل معايرة الذكاء الاصطناعي <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mr-2">Neural Tuner</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-12 space-y-12">
            
            <div className="grid gap-10 md:grid-cols-2">
               <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-8">
                  <div className="flex items-center gap-3 pr-2">
                     <Target className="h-5 w-5 text-blue-500" />
                     <h4 className="font-black text-sm text-[#002d4d]">عتبات مؤشر RSI</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">منطقة التشبع (بيع)</Label>
                        <Input type="number" value={data.rsiOverbought || 70} onChange={e => onChange({...data, rsiOverbought: Number(e.target.value)})} className="h-12 rounded-xl bg-white border-none font-black text-center text-red-500 shadow-sm" />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">منطقة الدعم (شراء)</Label>
                        <Input type="number" value={data.rsiOversold || 30} onChange={e => onChange({...data, rsiOversold: Number(e.target.value)})} className="h-12 rounded-xl bg-white border-none font-black text-center text-emerald-600 shadow-sm" />
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-8">
                  <div className="flex items-center justify-between pr-2">
                     <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        <h4 className="font-black text-sm text-[#002d4d]">معايرة الثقة</h4>
                     </div>
                     <Badge className="bg-[#002d4d] text-[#f9a885] border-none font-black text-[8px] px-3 py-1 rounded-full shadow-lg">ACTIVE</Badge>
                  </div>
                  <div className="space-y-6 px-2">
                     <div className="flex justify-between text-[10px] font-black uppercase text-blue-400">
                        <span>أدنى حد للثقة</span>
                        <span className="text-blue-600 tabular-nums">%{data.aiConfidenceThreshold || 85}</span>
                     </div>
                     <Slider 
                       value={[data.aiConfidenceThreshold || 85]} 
                       min={50} max={100} step={1}
                       onValueChange={([val]) => onChange({...data, aiConfidenceThreshold: val})}
                       className="[&>span]:bg-blue-600"
                     />
                  </div>
               </div>
            </div>

            <Button onClick={onSave} disabled={saving} className="w-full h-20 rounded-full bg-[#002d4d] text-white font-black text-xl shadow-2xl transition-all active:scale-[0.98] group">
               {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
                 <div className="flex items-center gap-4">
                   <span>حفظ ومعايرة المحرك العصبي</span>
                   <Sparkles className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
                 </div>
               )}
            </Button>
          </CardContent>
        </Card>

        {/* Global Signal Forge */}
        <Card className="rounded-[56px] border-none shadow-xl bg-white overflow-hidden border border-orange-100/50">
           <CardHeader className="bg-orange-50/20 p-10 border-b border-orange-50">
              <CardTitle className="text-xl font-black flex items-center gap-4 text-orange-600">
                 <div className="h-12 w-12 rounded-2xl bg-white shadow-inner flex items-center justify-center">
                    <Send className="h-6 w-6" />
                 </div>
                 بث إشارة تداول عالمية <span className="text-[10px] font-bold text-orange-300 uppercase tracking-widest mr-2">Global Signal Hub</span>
              </CardTitle>
           </CardHeader>
           <CardContent className="p-12 space-y-8">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">عنوان الإشارة (مثلاً: فرصة شراء BTC/USDT)</Label>
                    <Input value={signalData.title} onChange={e => setSignalData({...signalData, title: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">محتوى التوصية التفصيلي</Label>
                    <textarea value={signalData.message} onChange={e => setSignalData({...signalData, message: e.target.value})} className="w-full min-h-[120px] rounded-[32px] bg-gray-50 border-none font-bold text-sm p-8 leading-loose shadow-inner outline-none focus:ring-2 focus:ring-orange-500/20" placeholder="اكتب تحليل الفرصة ونقاط الدخول المقترحة..." />
                 </div>
              </div>
              <Button onClick={handleBroadcastSignal} disabled={signalLoading} className="w-full h-18 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-xl active:scale-95 group transition-all">
                 {signalLoading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                   <div className="flex items-center gap-4">
                      <span>إرسال الإشارة لكافة المشتركين</span>
                      <Send className="h-5 w-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                   </div>
                 )}
              </Button>
           </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 space-y-10">
         <div className="p-10 bg-gray-50 rounded-[48px] border border-gray-100 space-y-8 shadow-inner group">
            <div className="h-16 w-16 rounded-[24px] bg-white flex items-center justify-center shadow-sm text-blue-600 transition-transform group-hover:rotate-12"><Activity size={32} /></div>
            <div className="space-y-2">
               <h4 className="text-lg font-black text-[#002d4d]">لماذا المعايرة؟</h4>
               <p className="text-[12px] font-bold text-gray-500 leading-[2.2]">
                 تسمح المعايرة بضبط "شخصية" الذكاء الاصطناعي؛ فرفع عتبة الثقة يجعل الإشارات نادرة ولكنها مؤكدة جداً، بينما خفض عتبات RSI يجعل المحرك أكثر عدوانية في اقتناص القيعان والقمم.
               </p>
            </div>
            <div className="pt-6 border-t border-gray-200">
               <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Real-time Feedback Active</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
