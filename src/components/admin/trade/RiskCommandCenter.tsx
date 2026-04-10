
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ShieldAlert, Loader2, Sparkles, Activity, ShieldCheck, HeartPulse, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskCommandCenterProps {
  data: any;
  onChange: (newData: any) => void;
  onSave: () => void;
  saving: boolean;
}

export function RiskCommandCenter({ data, onChange, onSave, saving }: RiskCommandCenterProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-12 text-right" dir="rtl">
      <div className="lg:col-span-8 space-y-10">
        <Card className="rounded-[56px] border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-red-50/20 p-10 border-b border-gray-50">
            <CardTitle className="text-xl font-black flex items-center gap-4 text-red-700">
              <div className="h-12 w-12 rounded-2xl bg-white shadow-inner flex items-center justify-center">
                <ShieldAlert className="h-6 w-6" />
              </div>
              بروتوكول حماية المستثمر وتأمين الصفقات
            </CardTitle>
          </CardHeader>
          <CardContent className="p-12 space-y-12">
            
            <div className="p-10 bg-gray-50 rounded-[48px] border border-gray-100 shadow-inner space-y-10">
               <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-5">
                     <div className="h-16 w-16 rounded-[24px] bg-white flex items-center justify-center shadow-sm text-[#002d4d]">
                        <Fingerprint size={32} />
                     </div>
                     <div className="text-right">
                        <h4 className="text-lg font-black text-[#002d4d]">تأمين التداول بـ PIN الخزنة</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sovereign Vault Verification</p>
                     </div>
                  </div>
                  <Switch 
                    checked={!!data.requirePinToTrade} 
                    onCheckedChange={val => onChange({...data, requirePinToTrade: val})} 
                    className="data-[state=checked]:bg-[#002d4d] scale-125 shadow-lg" 
                  />
               </div>

               <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100 flex items-start gap-6">
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                     <ShieldCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="space-y-1.5 pt-1">
                     <p className="text-xs font-black text-[#002d4d]">بروتوكول التحقق الثنائي</p>
                     <p className="text-[11px] font-bold text-blue-800/60 leading-relaxed text-right">
                        عند تفعيل هذا الخيار، سيُطلب من المستثمر إدخال رمز PIN الخزنة الخاص به قبل كل عملية تنفيذ صفقة، مما يمنع التداول غير المصرح به أو الناتج عن خطأ بشري.
                     </p>
                  </div>
               </div>
            </div>

            <Button onClick={onSave} disabled={saving} className="w-full h-20 rounded-full bg-[#002d4d] text-white font-black text-xl shadow-2xl transition-all active:scale-[0.98] group">
               {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
                 <div className="flex items-center gap-4">
                   <span>حفظ وتفعيل ميثاق الحماية</span>
                   <ShieldCheck className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
                 </div>
               )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 space-y-10">
         <div className="p-10 bg-red-600 rounded-[48px] text-white relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.1] pointer-events-none group-hover:scale-125 transition-transform duration-1000"><HeartPulse className="h-48 w-48" /></div>
            <div className="relative z-10 space-y-6">
               <div className="h-16 w-16 rounded-[24px] bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-inner"><ShieldAlert className="h-8 w-8 text-[#f9a885]" /></div>
               <div className="space-y-2">
                  <h4 className="text-2xl font-black">الأمان السيادي</h4>
                  <p className="text-[13px] font-bold text-red-50 leading-[2.2]">تعمل هذه الضوابط كخط دفاع أول لحماية أصول المستثمرين؛ الالتزام بالتحقق الثنائي هو المعيار الذهبي في منصة ناميكس.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
