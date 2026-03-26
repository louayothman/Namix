
"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase";
import { ArrowDownCircle, Clock, Wallet, ExternalLink, AlertCircle, Loader2, ChevronRight, Sparkles, Zap, Landmark } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MyWithdrawalsPage() {
  const router = useRouter();
  const [localUser, setLocalUser] = useState<any>(null);
  const db = useFirestore();

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) setLocalUser(JSON.parse(session));
  }, []);

  const withdrawalsQuery = useMemoFirebase(() => {
    if (!localUser?.id) return null;
    return query(
      collection(db, "withdraw_requests"),
      where("userId", "==", localUser.id),
      orderBy("createdAt", "desc")
    );
  }, [db, localUser?.id]);

  const { data: withdrawals, isLoading, error } = useCollection(withdrawalsQuery);

  return (
    <Shell>
      <div className="max-w-2xl mx-auto space-y-8 px-6 pt-10 pb-24">
        {/* Page Header - Soft UI */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-orange-500 font-black text-[9px] uppercase tracking-[0.3em]">
              <Sparkles className="h-3 w-3" />
              Liquidity Outflow Monitor
            </div>
            <h1 className="text-2xl font-black text-[#002d4d] tracking-tight">سحوباتي</h1>
            <p className="text-muted-foreground font-bold text-[10px]">متابعة طلبات تحويل الأرباح المستحقة.</p>
          </div>
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full bg-white shadow-sm h-12 w-12 border border-gray-50">
            <ChevronRight className="h-6 w-6 text-[#002d4d]" />
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="rounded-[32px] border-red-100 bg-red-50 text-red-900 p-6 shadow-sm">
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
                  اضغط هنا لإنشاء الفهرس المطلوب
                </a>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-200" />
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">جاري تتبع طلبات السحب...</p>
            </div>
          ) : withdrawals && withdrawals.length > 0 ? (
            withdrawals.map((req) => (
              <Card key={req.id} className="border-none shadow-sm rounded-[36px] overflow-hidden bg-white group transition-all hover:shadow-md active:scale-[0.99]">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-[22px] bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
                        <ArrowDownCircle className="h-7 w-7 rotate-180" />
                      </div>
                      <div>
                        <h3 className="font-black text-[#002d4d] text-xl tracking-tighter">-${req.amount?.toLocaleString()}</h3>
                        <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                          <Clock className="h-3 w-3" />
                          {req.createdAt && format(new Date(req.createdAt), "dd MMM yyyy", { locale: ar })}
                        </div>
                      </div>
                    </div>
                    <Badge className={cn(
                      "font-black text-[9px] border-none px-4 py-1.5 rounded-full shadow-sm",
                      req.status === 'pending' ? "bg-orange-50 text-orange-600" : 
                      req.status === 'approved' ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
                    )}>
                      {req.status === 'pending' ? 'قيد التنفيذ' : req.status === 'approved' ? 'مكتمل' : 'مرفوض'}
                    </Badge>
                  </div>

                  <div className="p-5 bg-gray-50/50 rounded-[28px] border border-gray-100 shadow-inner space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Landmark className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-widest">{req.methodName || "USDT TRC20"}</p>
                    </div>
                    <div className="space-y-1 pr-1">
                      <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.2em]">Target Wallet Address</p>
                      <p className="text-[10px] font-mono text-gray-500 break-all leading-relaxed bg-white/50 p-2 rounded-lg border border-gray-100/50">
                        {req.walletAddress || (req.details && Object.values(req.details)[0]) || "N/A"}
                      </p>
                    </div>
                  </div>

                  {req.status === 'approved' && (
                    <div className="flex items-center justify-end gap-2 text-[9px] font-black text-blue-500 hover:text-blue-600 transition-colors cursor-pointer px-2">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>عرض المعاملة في البلوكشين (Explorer)</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : !error && (
            <div className="text-center py-40 bg-white/40 rounded-[48px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-6">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center">
                <ArrowDownCircle className="h-10 w-10 text-gray-200 rotate-180" />
              </div>
              <div className="space-y-1">
                <p className="text-gray-300 font-black text-sm uppercase tracking-widest">No Outflows Found</p>
                <p className="text-[10px] text-gray-200 font-bold">لا يوجد سجل عمليات سحب حالياً.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
