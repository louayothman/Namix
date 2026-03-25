
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Clock, Loader2, Target, Coins, ShieldAlert, Zap, History, ArrowDown, Wallet, ShieldCheck, UserCheck } from "lucide-react";

interface WithdrawLogicSectionProps {
  data: any;
  onChange: (newData: any) => void;
  onSave: () => void;
  saving: boolean;
}

export function WithdrawLogicSection({ data, onChange, onSave, saving }: WithdrawLogicSectionProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-6 duration-700">
      <Card className="border-none shadow-xl rounded-[56px] bg-white overflow-hidden">
        <CardHeader className="px-12 py-10 border-b border-gray-50 bg-orange-50/20">
          <CardTitle className="text-xl font-black flex items-center gap-4 text-orange-700">
            <div className="h-12 w-12 rounded-2xl bg-white shadow-inner flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            بروتوكول قيود وحوكمة سحب السيولة المتكامل
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 space-y-12">
          
          <div className="grid gap-10 lg:grid-cols-2">
            
            {/* Time-Based Rules */}
            <div className="space-y-8">
              <div className="p-10 bg-gray-50 rounded-[48px] space-y-8 border border-gray-100 shadow-inner">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pr-4">
                    <History className="h-4 w-4 text-orange-500" />
                    <Label className="font-black text-[#002d4d] text-sm">فترة الانتظار بعد آخر إيداع</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      type="number" 
                      value={data.minTimeValue ?? ""} 
                      onChange={e => onChange({...data, minTimeValue: Number(e.target.value)})} 
                      className="h-14 rounded-2xl bg-white border-none font-black text-center text-xl shadow-sm" 
                    />
                    <Select value={data.minTimeUnit || "days"} onValueChange={val => onChange({...data, minTimeUnit: val})}>
                      <SelectTrigger className="h-14 rounded-2xl bg-white border-none font-black shadow-sm text-xs px-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="minutes" className="font-bold">دقيقة</SelectItem>
                        <SelectItem value="hours" className="font-bold">ساعة</SelectItem>
                        <SelectItem value="days" className="font-bold">يوم</SelectItem>
                        <SelectItem value="months" className="font-bold">شهر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 pr-4">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <Label className="font-black text-[#002d4d] text-sm">الفترة الفاصلة بين السحوبات (Cooldown)</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      type="number" 
                      value={data.cooldownValue ?? ""} 
                      onChange={e => onChange({...data, cooldownValue: Number(e.target.value)})} 
                      className="h-14 rounded-2xl bg-white border-none font-black text-center text-xl shadow-sm" 
                    />
                    <Select value={data.cooldownUnit || "hours"} onValueChange={val => onChange({...data, cooldownUnit: val})}>
                      <SelectTrigger className="h-14 rounded-2xl bg-white border-none font-black shadow-sm text-xs px-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="minutes" className="font-bold">دقيقة</SelectItem>
                        <SelectItem value="hours" className="font-bold">ساعة</SelectItem>
                        <SelectItem value="days" className="font-bold">يوم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-emerald-50/30 rounded-[48px] border border-emerald-100/50 space-y-6">
                 <div className="flex items-center gap-2 pr-4">
                    <Wallet className="h-4 w-4 text-emerald-600" />
                    <Label className="font-black text-[#002d4d] text-sm">الحد الأدنى لإجمالي الإيداعات المعتمدة ($)</Label>
                 </div>
                 <div className="relative">
                    <Input type="number" value={data.minTotalDeposits ?? ""} onChange={e => onChange({...data, minTotalDeposits: Number(e.target.value)})} className="h-16 rounded-[24px] bg-white border-none font-black text-center text-2xl text-emerald-600 shadow-md px-12" />
                    <Coins className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-emerald-100" />
                 </div>
                 <p className="text-[10px] text-emerald-800/60 font-bold px-4 leading-relaxed">
                   يمنع المستثمر من السحب حتى يتجاوز مجموع إيداعاته المعتمدة هذا المبلغ.
                 </p>
              </div>
            </div>

            {/* Amount & Threshold Rules */}
            <div className="space-y-8">
              <div className="p-10 bg-white border border-gray-100 rounded-[48px] shadow-sm space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">أقل مبلغ سحب ($)</Label>
                    <Input type="number" value={data.minWithdrawalAmount ?? ""} onChange={e => onChange({...data, minWithdrawalAmount: Number(e.target.value)})} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-lg shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">أقصى مبلغ سحب ($)</Label>
                    <Input type="number" value={data.maxWithdrawalAmount ?? ""} onChange={e => onChange({...data, maxWithdrawalAmount: Number(e.target.value)})} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-lg shadow-inner" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">بقاء الرصيد الأدنى ($)</Label>
                    <Input type="number" value={data.minAccountBalance ?? ""} onChange={e => onChange({...data, minAccountBalance: Number(e.target.value)})} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-lg shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">رسوم السحب (%)</Label>
                    <Input type="number" value={data.withdrawalFee ?? ""} onChange={e => onChange({...data, withdrawalFee: Number(e.target.value)})} className="h-14 rounded-2xl bg-orange-50/50 border-none font-black text-center text-lg text-orange-600 shadow-inner" />
                  </div>
                </div>

                <div className="h-px bg-gray-50 mx-4" />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">الاستثمار التاريخي ($)</Label>
                    <Input type="number" value={data.minHistoricalInvest ?? ""} onChange={e => onChange({...data, minHistoricalInvest: Number(e.target.value)})} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-lg shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">الأرباح المحققة ($)</Label>
                    <Input type="number" value={data.minTotalProfits ?? ""} onChange={e => onChange({...data, minTotalProfits: Number(e.target.value)})} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-lg shadow-inner" />
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-4">
                   <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-3">
                         <UserCheck className="h-4 w-4 text-blue-600" />
                         <span className="text-[10px] font-black text-[#002d4d]">اشتراط توثيق الهوية (KYC)</span>
                      </div>
                      <Switch checked={!!data.requireVerificationToWithdraw} onCheckedChange={val => onChange({...data, requireVerificationToWithdraw: val})} className="data-[state=checked]:bg-blue-600" />
                   </div>
                </div>
              </div>

              <div className="p-8 bg-blue-50/30 rounded-[40px] border border-blue-100/50 flex items-start gap-5">
                 <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                 </div>
                 <p className="text-[11px] font-bold text-blue-800/70 leading-relaxed pr-1">
                   تعمل هذه القيود بشكل متزامن لضمان استدامة سيولة المنصة؛ لن يتمكن المستثمر من المتابعة إلا إذا استوفى كافة الشروط المحددة أعلاه.
                 </p>
              </div>
            </div>
          </div>

          <Button onClick={onSave} disabled={saving} className="w-full h-20 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl transition-all active:scale-95 group">
            {saving ? <Loader2 className="animate-spin h-8 w-8" /> : (
              <div className="flex items-center gap-4">
                <span>حفظ ميثاق حوكمة السحب المطور</span>
                <ArrowDown className="h-6 w-6 group-hover:translate-y-1 transition-transform" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
