
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gift, Coins, Hash, Plus, Zap, Loader2 } from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

interface GiftVoucherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  dbUser: any;
  onIssueSuccess: (code: string) => void;
  onRedeemSuccess: (amt: number) => void;
}

export function GiftVoucherDialog({ open, onOpenChange, user, dbUser, onIssueSuccess, onRedeemSuccess }: GiftVoucherDialogProps) {
  const db = useFirestore();
  const [processing, setProcessing] = useState(false);
  const [voucherAmount, setVoucherAmount] = useState("");
  const [redeemCode, setRedeemCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  const voucherRulesRef = useMemoFirebase(() => doc(db, "system_settings", "voucher_rules"), [db]);
  const { data: vRules } = useDoc(voucherRulesRef);

  const handleCreateVoucher = async () => {
    setError(null);
    const amount = Number(voucherAmount);
    if (!dbUser || !vRules) return;
    if (!amount || amount < (vRules.minAmount || 10)) { 
      setError(`بروتوكول القيمة: الحد الأدنى هو $${vRules.minAmount || 10}.`); 
      return; 
    }
    if (dbUser.totalBalance < amount) { 
      setError("رصيد غير كافٍ."); 
      return; 
    }
    
    setProcessing(true);
    try {
      const code = 'GIFT-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      const expiry = new Date(); 
      expiry.setDate(expiry.getDate() + (vRules.validityDays || 30));
      
      await setDoc(doc(db, "gift_vouchers", code), { 
        code, 
        amount, 
        createdBy: user.id, 
        createdAt: new Date().toISOString(), 
        expiryDate: expiry.toISOString(), 
        isRedeemed: false 
      });
      
      await updateDoc(doc(db, "users", user.id), { totalBalance: increment(-amount) });
      onIssueSuccess(code);
      onOpenChange(false);
      setVoucherAmount("");
    } catch (e) { 
      setError("فشل فني في إصدار الصك."); 
    } finally { 
      setProcessing(false); 
    }
  };

  const handleRedeemVoucher = async () => {
    setRedeemError(null);
    if (!redeemCode.trim() || !dbUser) return;
    
    setProcessing(true);
    try {
      const vRef = doc(db, "gift_vouchers", redeemCode.trim().toUpperCase());
      const vSnap = await getDoc(vRef);
      
      if (!vSnap.exists() || vSnap.data().isRedeemed) { 
        setRedeemError("رمز غير صالح أو تم استخدامه مسبقاً."); 
        setProcessing(false); 
        return; 
      }
      
      const vData = vSnap.data();
      await updateDoc(vRef, { isRedeemed: true, redeemedBy: user.id, redeemedAt: new Date().toISOString() });
      await updateDoc(doc(db, "users", user.id), { totalBalance: increment(vData.amount) });
      
      onRedeemSuccess(vData.amount);
      onOpenChange(false);
      setRedeemCode("");
    } catch (e) { 
      setRedeemError("فشل في التحقق من الصك."); 
    } finally { 
      setProcessing(false); 
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[56px] border-none shadow-2xl p-0 max-w-[420px] overflow-hidden text-right flex flex-col max-h-[90vh]" dir="rtl">
        <div className="bg-[#002d4d] p-10 text-white relative shrink-0 text-center">
           <div className="absolute top-0 right-0 p-8 opacity-[0.05] -rotate-12 pointer-events-none"><Gift className="h-40 w-40" /></div>
           <div className="h-20 w-20 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-inner mx-auto mb-6"><Gift className="h-10 w-10 text-[#f9a885]" /></div>
           <DialogTitle className="text-2xl font-black mb-1">الصكوك والهدايا</DialogTitle>
           <p className="text-[10px] font-black text-blue-200/60 uppercase tracking-[0.3em]">Capital Gift Protocol</p>
        </div>
        <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-white scrollbar-none">
           <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <Plus className="h-4 w-4 text-blue-500" />
                 <h4 className="font-black text-sm text-[#002d4d]">إصدار صك جديد</h4>
              </div>
              <div className="space-y-4">
                 <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">المبلغ المراد إهداؤه ($)</Label>
                 <div className="relative">
                    <Input type="number" value={voucherAmount} onChange={e => setVoucherAmount(e.target.value)} className="h-16 rounded-[24px] bg-gray-50 border-none font-black text-center text-3xl text-emerald-600 shadow-inner" placeholder="0.00" />
                    <Coins className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-emerald-100" />
                 </div>
                 {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
                 <Button onClick={handleCreateVoucher} disabled={processing || !voucherAmount} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black shadow-xl active:scale-95 transition-all">
                    {processing ? <Loader2 className="animate-spin" /> : "إصدار الصك الآن"}
                 </Button>
              </div>
           </div>
           <div className="h-px bg-gray-100" />
           <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <Zap className="h-4 w-4 text-orange-500" />
                 <h4 className="font-black text-sm text-[#002d4d]">شحن صك استلام</h4>
              </div>
              <div className="space-y-4">
                 <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">رمز الصك المكون من 12 خانة</Label>
                 <div className="relative">
                    <Input value={redeemCode} onChange={e => setRedeemCode(e.target.value.toUpperCase())} className="h-16 rounded-[24px] bg-gray-50 border-none font-black text-center text-xl text-blue-600 shadow-inner" placeholder="GIFT-XXXX-XXXX" />
                    <Hash className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-100" />
                 </div>
                 {redeemError && <p className="text-red-500 text-[10px] font-bold text-center">{redeemError}</p>}
                 <Button onClick={handleRedeemVoucher} disabled={processing || !redeemCode} className="w-full h-14 rounded-full bg-[#f9a885] text-[#002d4d] font-black shadow-xl active:scale-95 transition-all">
                    {processing ? <Loader2 className="animate-spin" /> : "تحقق وشحن الرصيد"}
                 </Button>
              </div>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
