
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Gift, Loader2, Coins, Calendar, ShieldCheck, Zap, Users, TrendingUp, Briefcase, ShieldAlert } from "lucide-react";

interface VoucherLogicSectionProps {
  data: any;
  onChange: (newData: any) => void;
  onSave: () => void;
  saving: boolean;
}

export function VoucherLogicSection({ data, onChange, onSave, saving }: VoucherLogicSectionProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-6 duration-700">
      <Card className="border-none shadow-xl rounded-[56px] bg-white overflow-hidden">
        <CardHeader className="px-12 py-10 border-b border-gray-50 bg-emerald-50/20">
          <CardTitle className="text-xl font-black flex items-center gap-4 text-emerald-700">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-inner flex items-center justify-center">
              <Gift className="h-6 w-6" />
            </div>
            بروتوكول حوكمة قسائم الهدايا الاستراتيجي
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 space-y-12">
          <div className="grid gap-10 lg:grid-cols-2">
            
            {/* Issuance Rules - Advanced */}
            <div className="space-y-8">
              <div className="p-10 bg-gray-50 rounded-[48px] space-y-8 border border-gray-100 shadow-inner">
                <div className="flex items-center gap-2 pr-4">
                  <ShieldAlert className="h-4 w-4 text-[#002d4d]" />
                  <Label className="font-black text-[#002d4d] text-sm uppercase">متطلبات إصدار الصكوك</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-gray-400 uppercase pr-4">أقل رصيد متاح ($)</p>
                    <Input type="number" value={data.minBalanceToIssue ?? ""} onChange={e => onChange({...data, minBalanceToIssue: Number(e.target.value)})} className="h-12 rounded-xl bg-white border-none font-black text-center shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-gray-400 uppercase pr-4">أقل أرباح محققة ($)</p>
                    <Input type="number" value={data.minTotalProfitsToIssue ?? ""} onChange={e => onChange({...data, minTotalProfitsToIssue: Number(e.target.value)})} className="h-12 rounded-xl bg-white border-none font-black text-center shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-gray-400 uppercase pr-4">أقل حجم استثمار ($)</p>
                    <Input type="number" value={data.minHistoricalInvestToIssue ?? ""} onChange={e => onChange({...data, minHistoricalInvestToIssue: Number(e.target.value)})} className="h-12 rounded-xl bg-white border-none font-black text-center shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-gray-400 uppercase pr-4">أقل عدد شركاء</p>
                    <Input type="number" value={data.minInvitesToIssue ?? ""} onChange={e => onChange({...data, minInvitesToIssue: Number(e.target.value)})} className="h-12 rounded-xl bg-white border-none font-black text-center shadow-sm" />
                  </div>
                </div>

                <div className="h-px bg-gray-200/50" />

                <div className="grid gap-4">
                   <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
                      <Label className="text-[10px] font-black text-[#002d4d]">تفعيل رمز PIN للإصدار</Label>
                      <Switch checked={!!data.requirePinToIssue} onCheckedChange={val => onChange({...data, requirePinToIssue: val})} className="data-[state=checked]:bg-[#002d4d]" />
                   </div>
                   <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
                      <Label className="text-[10px] font-black text-[#002d4d]">حساب موثق حصرياً</Label>
                      <Switch checked={!!data.requireVerificationToIssue} onCheckedChange={val => onChange({...data, requireVerificationToIssue: val})} className="data-[state=checked]:bg-[#002d4d]" />
                   </div>
                </div>
              </div>

              <div className="p-10 bg-emerald-50/30 rounded-[48px] border border-emerald-100/50 space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 pr-4">
                       <Zap className="h-4 w-4 text-emerald-600" />
                       <Label className="font-black text-[#002d4d] text-sm">إمكانية الشحن الذاتي</Label>
                    </div>
                    <Switch checked={!!data.allowSelfRedeem} onCheckedChange={val => onChange({...data, allowSelfRedeem: val})} className="data-[state=checked]:bg-emerald-500" />
                 </div>
                 <p className="text-[10px] text-emerald-800/60 font-bold px-4 leading-relaxed">
                   عند التفعيل، سيتمكن المستثمر من شحن القسيمة التي قام بإصدارها في محفظته الخاصة.
                 </p>
              </div>
            </div>

            {/* Redemption & Constraints */}
            <div className="space-y-8">
              <div className="p-10 bg-white border border-gray-100 rounded-[48px] shadow-sm space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pr-4">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    <Label className="font-black text-[#002d4d] text-sm">ضوابط مبالغ القسائم ($)</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[8px] font-black text-gray-400 uppercase pr-4">أقل مبلغ</p>
                      <Input type="number" value={data.minAmount} onChange={e => onChange({...data, minAmount: Number(e.target.value)})} className="h-12 rounded-xl bg-gray-50 border-none font-black text-center" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[8px] font-black text-gray-400 uppercase pr-4">أقصى مبلغ</p>
                      <Input type="number" value={data.maxAmount} onChange={e => onChange({...data, maxAmount: Number(e.target.value)})} className="h-12 rounded-xl bg-gray-50 border-none font-black text-center" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 pr-4">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    <Label className="font-black text-[#002d4d] text-sm">مدة الصلاحية (أيام)</Label>
                  </div>
                  <Input type="number" value={data.validityDays} onChange={e => onChange({...data, validityDays: Number(e.target.value)})} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-xl text-emerald-600" />
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 pr-4">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <Label className="font-black text-[#002d4d] text-sm uppercase">متطلبات شحن واستلام الصكوك</Label>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                      <Label className="text-[10px] font-black text-[#002d4d]">يتطلب رمز PIN مفعل</Label>
                      <Switch checked={!!data.requirePinToRedeem} onCheckedChange={val => onChange({...data, requirePinToRedeem: val})} className="data-[state=checked]:bg-blue-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                      <Label className="text-[10px] font-black text-[#002d4d]">يتطلب هوية موثقة</Label>
                      <Switch checked={!!data.requireVerificationToRedeem} onCheckedChange={val => onChange({...data, requireVerificationToRedeem: val})} className="data-[state=checked]:bg-blue-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-blue-50/30 rounded-[40px] border border-blue-100/50 flex items-start gap-5">
                 <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                 </div>
                 <p className="text-[11px] font-bold text-blue-800/70 leading-relaxed pr-1">
                   تعمل هذه القواعد كصمام أمان مزدوج؛ تضمن أن عمليات الإهداء تتم من قبل مستثمرين فاعلين وموثقين، وأن السيولة يتم استلامها ضمن إطار أمني محكم.
                 </p>
              </div>
            </div>
          </div>

          <Button onClick={onSave} disabled={saving} className="w-full h-20 rounded-full bg-[#002d4d] text-white font-black text-xl shadow-2xl transition-all active:scale-95 group">
            {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
              <div className="flex items-center gap-4">
                <span>اعتماد بروتوكول الحوكمة المطور</span>
                <Gift className="h-6 w-6 group-hover:rotate-12 transition-transform" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
