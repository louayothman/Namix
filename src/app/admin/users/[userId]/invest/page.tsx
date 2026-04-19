
"use client";

import { useState, useEffect, use } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, Calendar, ShieldCheck, Loader2, Coins, AlertCircle, ChevronRight, Star } from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, doc, updateDoc, addDoc, increment, onSnapshot } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addMinutes, addHours, addDays } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ManagedInvestPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const [dbUser, setDbUser] = useState<any>(null);
  const db = useFirestore();
  const plansQuery = useMemoFirebase(() => collection(db, "investment_plans"), [db]);
  const { data: plans, isLoading } = useCollection(plansQuery);

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [investAmount, setInvestAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const userRef = doc(db, "users", userId);
      const unsub = onSnapshot(userRef, (snap) => {
        if (snap.exists()) setDbUser(snap.data());
      });
      return () => unsub();
    }
  }, [userId, db]);

  const calculateEndDate = (value: number, unit: string) => {
    const now = new Date();
    switch(unit) {
      case 'minutes': return addMinutes(now, value).toISOString();
      case 'hours': return addHours(now, value).toISOString();
      default: return addDays(now, value).toISOString();
    }
  };

  const handleInvest = async () => {
    setError(null);
    if (!userId || !selectedPlan || !investAmount) return;
    const amount = Number(investAmount);

    if (amount < selectedPlan.min) {
      setError(`الحد الأدنى لهذه الخطة هو $${selectedPlan.min}`);
      return;
    }
    if (amount > selectedPlan.max && selectedPlan.max !== Infinity) {
      setError(`الحد الأعلى لهذه الخطة هو $${selectedPlan.max}`);
      return;
    }
    if (dbUser && dbUser.totalBalance < amount) {
      setError("رصيد المستخدم الحالي غير كافٍ.");
      return;
    }

    setProcessing(true);
    try {
      const endTime = selectedPlan.isScheduled && selectedPlan.closeTime 
        ? selectedPlan.closeTime 
        : calculateEndDate(selectedPlan.durationValue, selectedPlan.durationUnit);

      const profitAmount = (amount * selectedPlan.profitPercent) / 100;

      await addDoc(collection(db, "investments"), {
        userId: userId,
        userName: dbUser?.displayName || "مستثمر",
        planId: selectedPlan.id,
        planTitle: selectedPlan.title,
        amount: amount,
        profitPercent: selectedPlan.profitPercent,
        expectedProfit: profitAmount,
        status: "active",
        isProcessed: false,
        startTime: new Date().toISOString(),
        endTime: endTime,
        createdAt: new Date().toISOString()
      });

      await updateDoc(doc(db, "users", userId), {
        totalBalance: increment(-amount),
        activeInvestmentsTotal: increment(amount)
      });

      await addDoc(collection(db, "notifications"), {
        userId: userId,
        title: "بدء استثمار جديد",
        message: `تم تفعيل خطة استثمارية بقيمة $${amount} في حسابك. يمكنك متابعة الأرباح من خلال لوحة التحكم الخاصة بك.`,
        type: "info",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      setSelectedPlan(null);
      setInvestAmount("");
    } catch (e) {
      setError("فشل في بدء الاستثمار.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Shell isAdmin managedUserId={userId} managedUserName={dbUser?.displayName}>
      <div className="max-w-5xl mx-auto space-y-6 px-4">
        <div className="pt-8 flex items-center justify-between">
          <h1 className="text-2xl font-black text-[#002d4d]">تفعيل استثمار للمستخدم</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3 pb-20">
          {isLoading ? (
            <div className="col-span-3 text-center py-20 font-bold text-gray-400">جاري التحميل...</div>
          ) : plans?.filter(p => p.isActive !== false).map((plan) => (
            <Card key={plan.id} className={cn(
              "relative flex flex-col border-none shadow-sm overflow-hidden bg-white rounded-[28px]",
              plan.isPopular && "ring-2 ring-[#f9a885]"
            )}>
              <CardHeader className="text-center pb-4 pt-8">
                <CardDescription className="text-[10px] font-bold text-primary">{plan.title}</CardDescription>
                <CardTitle className="text-4xl font-black text-emerald-600">%{plan.profitPercent}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-5 px-6">
                <div className="p-4 bg-gray-50/50 rounded-[24px] space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-bold">الرصيد المتاح</span>
                    <span className="font-black text-[#002d4d]">${dbUser?.totalBalance?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-bold">المدة</span>
                    <span className="font-black text-[#002d4d]">{plan.isScheduled ? 'محددة بالجدولة' : `${plan.durationValue} ${plan.durationUnit}`}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 px-6 pb-8">
                <button 
                  onClick={() => setSelectedPlan(plan)}
                  className="w-full h-12 rounded-full bg-[#002d4d] text-white font-black text-sm"
                >
                  اختيار هذه الخطة
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="rounded-[32px] p-6 max-w-[360px]">
          <DialogHeader className="items-center">
            <DialogTitle className="text-xl font-black text-[#002d4d]">تأكيد الاستثمار للمستخدم</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <Label className="font-bold text-xs text-[#002d4d]">أدخل مبلغ الاستثمار ($)</Label>
            <input 
              type="number" 
              value={investAmount}
              onChange={e => setInvestAmount(e.target.value)}
              className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-xl text-emerald-600 outline-none w-full"
            />
            {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button onClick={handleInvest} disabled={processing} className="w-full h-14 rounded-full bg-[#f9a885] text-[#002d4d] font-black">
              {processing ? <Loader2 className="animate-spin" /> : "تفعيل الاستثمار الآن"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
