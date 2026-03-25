
"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase";
import { ArrowUpCircle, Clock, Wallet, Hash, AlertCircle, ExternalLink, Loader2, ChevronRight, Sparkles, Zap } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyDepositsPage() {
  const [localUser, setLocalUser] = useState<any>(null);
  const db = useFirestore();

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) setLocalUser(JSON.parse(session));
  }, []);

  const depositsQuery = useMemoFirebase(() => {
    if (!localUser?.id) return null;
    return query(
      collection(db, "deposit_requests"),
      where("userId", "==", localUser.id),
      orderBy("createdAt", "desc")
    );
  }, [db, localUser?.id]);

  const { data: deposits, isLoading, error } = useCollection(depositsQuery);

  return (
    <Shell>
      <div className="max-w-2xl mx-auto space-y-8 px-6 pt-10 pb-24">
        {/* Page Header - Soft UI */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-[0.3em]">
              <Sparkles className="h-3 w-3" />
              Capital Infusion History
            </div>
            <h1 className="text-2xl font-black text-[#002d4d] tracking-tight">إيداعاتي</h1>
            <p className="text-muted-foreground font-bold text-[10px]">تتبع كافة طلبات شحن الرصيد والعمليات المؤكدة.</p>
          </div>
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm h-12 w-12 border border-gray-50">
              <ChevronRight className="h-6 w-6 text-[#002d4d]" />
            </Button>
          </Link>
        </div>

        {error && (
          <Alert variant="destructive" className="rounded-[32px] border-red-100 bg-red-50 text-red-900 p-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-black text-sm">مطلوب إنشاء فهرس للبيانات</AlertTitle>
            <AlertDescription className="text-[10px] font-bold mt-2">
              {error.message.includes("https://") && (
                <a 
                  href={"https://" + error.message.split("https://")[1].split(" ")[0]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  اضغط هنا لإنشاء الفهرس المطلوب في Firebase Console
                </a>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-200" />
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">جاري مسح سجل الإيداعات...</p>
            </div>
          ) : deposits && deposits.length > 0 ? (
            deposits.map((dep) => (
              <Card key={dep.id} className="border-none shadow-sm rounded-[36px] overflow-hidden bg-white transition-all hover:shadow-md group active:scale-[0.99]">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-[22px] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                        <ArrowUpCircle className="h-7 w-7" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-[#002d4d] text-xl tracking-tighter">${dep.amount?.toLocaleString()}</h3>
                        <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">
                          <Clock className="h-3 w-3" />
                          {dep.createdAt && format(new Date(dep.createdAt), "dd MMMM yyyy", { locale: ar })}
                        </div>
                      </div>
                    </div>
                    <Badge className={cn(
                      "font-black text-[9px] border-none px-4 py-1.5 rounded-full shadow-sm shrink-0",
                      dep.status === 'pending' ? "bg-orange-50 text-orange-600" : 
                      dep.status === 'approved' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                      {dep.status === 'pending' ? 'قيد المراجعة' : dep.status === 'approved' ? 'تم القبول' : 'مرفوض'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-gray-50/50 rounded-[24px] space-y-1 border border-gray-100 shadow-inner min-w-0">
                      <p className="text-[8px] text-gray-400 font-black uppercase flex items-center gap-1.5 tracking-widest">
                        <Wallet className="h-3 w-3" /> طريقة الدفع
                      </p>
                      <p className="text-[11px] font-black text-[#002d4d] truncate">{dep.methodName}</p>
                    </div>
                    <div className="p-4 bg-gray-50/50 rounded-[24px] space-y-1 border border-gray-100 shadow-inner min-w-0">
                      <p className="text-[8px] text-gray-400 font-black uppercase flex items-center gap-1.5 tracking-widest">
                        <Hash className="h-3 w-3" /> معرف العملية
                      </p>
                      <p className="text-[10px] font-mono text-gray-500 break-all">{dep.transactionId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : !error && (
            <div className="text-center py-40 bg-white/40 rounded-[48px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-6">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center">
                <ArrowUpCircle className="h-10 w-10 text-gray-200" />
              </div>
              <div className="space-y-1">
                <p className="text-gray-300 font-black text-sm uppercase tracking-widest">No Deposits Found</p>
                <p className="text-[10px] text-gray-200 font-bold">لم تقم بأي عمليات إيداع بعد.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
