
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { 
  Settings2, 
  Loader2, 
  ShieldCheck, 
  Zap, 
  History, 
  ArrowDown, 
  Wallet,
  ShieldAlert,
  Coins,
  Lock
} from "lucide-react";

/**
 * @fileOverview بروتوكول حوكمة السحب v1.1
 * يتضمن منطق حماية الرصيد الترحيبي (Locked Welcome Bonus) لضمان نزاهة العمليات المالية.
 */

export function WithdrawSettingsSection() {
  const db = useFirestore();
  const [saving, setSaving] = useState(false);
  const rulesRef = useMemoFirebase(() => doc(db, "system_settings", "withdrawal_rules"), [db]);
  const { data: remoteRules } = useDoc(rulesRef);

  const [data, setData] = useState({
    withdrawalFee: 5,
    minWithdrawalAmount: 10,
    maxWithdrawalAmount: 1000,
    minTotalDeposits: 50,
    requireVerificationToWithdraw: true,
    minTimeValue: 24,
    minTimeUnit: 'hours',
    lockWelcomeBonus: true // تفعيل قفل المكافأة برمجياً بشكل دائم
  });

  useEffect(() => {
    if (remoteRules) setData({ ...data, ...remoteRules });
  }, [remoteRules]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(rulesRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
      toast({ title: "تم تحديث ميثاق السحب بنجاح" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الحفظ" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 text-right" dir="rtl">
      <div className="lg:col-span-8">
        <Card className="rounded-[48px] border-none shadow-xl overflow-hidden bg-white">
          <CardHeader className="bg-[#002d4d] p-10 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldAlert className="h-32 w-32" /></div>
            <CardTitle className="text-2xl font-black flex items-center gap-4 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
                <Settings2 className="h-8 w-8 text-[#f9a885]" />
              </div>
              بروتوكول حوكمة السيولة
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-12">
            
            <div className="space-y-8">
               <div className="flex items-center gap-3 px-2">
                  <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm"><Zap size={20} /></div>
                  <h3 className="font-black text-lg text-[#002d4d]">إعدادات العمولات والحدود</h3>
               </div>
               <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">رسوم السحب (%)</Label>
                    <Input type="number" value={data.withdrawalFee} onChange={e => setData({...data, withdrawalFee: Number(e.target.value)})} className="h-14 rounded-xl bg-gray-50 border-none font-black text-center text-xl text-orange-600" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">أدنى مبلغ للسحب ($)</Label>
                    <Input type="number" value={data.minWithdrawalAmount} onChange={e => setData({...data, minWithdrawalAmount: Number(e.target.value)})} className="h-14 rounded-xl bg-gray-50 border-none font-black text-center text-xl" />
                  </div>
               </div>
            </div>

            <div className="p-10 bg-emerald-50/50 rounded-[40px] border border-emerald-100 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm"><Lock size={20} /></div>
                    <div className="text-right">
                      <h4 className="font-black text-[#002d4d]">قفل الرصيد الترحيبي (Sovereign Lock)</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Anti-Withdrawal Protocol</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-600 text-white border-none font-black text-[9px] px-3 py-1 rounded-full shadow-lg">HARD LOCKED</Badge>
               </div>
               
               <div className="space-y-4">
                  <Label className="text-[10px] font-black text-gray-400 pr-4">الحد الأدنى لمجموع الإيداعات قبل أول سحب ($)</Label>
                  <Input 
                    type="number" 
                    value={data.minTotalDeposits} 
                    onChange={e => setData({...data, minTotalDeposits: Number(e.target.value)})}
                    className="h-16 rounded-[24px] bg-white border-none font-black text-center text-3xl text-emerald-600 shadow-md"
                  />
                  <p className="text-[10px] font-bold text-emerald-700/60 leading-relaxed px-4">
                    ملاحظة: الرصيد الترحيبي الممنوح للمستخدم يتم استبعاده تلقائياً من المبلغ القابل للسحب. لا يمكن للمستثمر سحب أي سنت من "الهدية"؛ السحب متاح فقط لإيداعاته الشخصية وأرباحه المحققة بعد استيفاء الشرط أعلاه.
                  </p>
               </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full h-20 rounded-full bg-[#002d4d] text-white font-black text-lg shadow-2xl active:scale-95 group transition-all">
              {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
                <div className="flex items-center gap-4">
                  <span>تثبيت ميثاق السحب والحماية</span>
                  <ShieldCheck className="h-6 w-6 text-[#f9a885]" />
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-4 space-y-8">
         <div className="p-10 bg-blue-600 rounded-[48px] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 p-8 opacity-10"><Zap size={160} /></div>
            <div className="relative z-10 space-y-6">
               <div className="h-16 w-16 rounded-[24px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner"><ShieldCheck size={32} /></div>
               <h4 className="text-2xl font-black">حوكمة السيولة</h4>
               <p className="text-[13px] font-bold text-blue-50 leading-[2.2]">لقد تم حقن منطق "الرصيد المحجوز" برمجياً؛ النظام الآن لا يحسب المكافأة الترحيبية ضمن سقف السحب المتاح للمستثمر إطلاقاً.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
