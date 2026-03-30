
"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase";
import { Gift, Clock, CheckCircle2, ChevronRight, Sparkles, Zap, Coins, Hash, UserCheck, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function MyVouchersPage() {
  const router = useRouter();
  const [localUser, setLocalUser] = useState<any>(null);
  const db = useFirestore();

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) setLocalUser(JSON.parse(session));
  }, []);

  // Vouchers issued by user
  const issuedQuery = useMemoFirebase(() => {
    if (!localUser?.id) return null;
    return query(
      collection(db, "gift_vouchers"),
      where("createdBy", "==", localUser.id),
      orderBy("createdAt", "desc")
    );
  }, [db, localUser?.id]);

  // Vouchers redeemed by user
  const redeemedQuery = useMemoFirebase(() => {
    if (!localUser?.id) return null;
    return query(
      collection(db, "gift_vouchers"),
      where("redeemedBy", "==", localUser.id),
      orderBy("redeemedAt", "desc")
    );
  }, [db, localUser?.id]);

  const { data: issuedVouchers, isLoading: loadingIssued } = useCollection(issuedQuery);
  const { data: redeemedVouchers, isLoading: loadingRedeemed } = useCollection(redeemedQuery);

  return (
    <Shell>
      <div className="max-w-2xl mx-auto space-y-10 px-6 pt-10 pb-24">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-[0.3em]">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Capital Asset Inventory
            </div>
            <h1 className="text-3xl font-black text-[#002d4d]">القسائم والهدايا</h1>
            <p className="text-muted-foreground font-bold text-[10px]">سجل الصكوك الاستثمارية الصادرة والمستلمة.</p>
          </div>
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full bg-white shadow-sm h-14 w-14 border border-gray-50 transition-all hover:shadow-md">
            <ChevronRight className="h-6 w-6 text-[#002d4d]" />
          </Button>
        </div>

        <Tabs defaultValue="issued" className="w-full space-y-8">
          <TabsList className="h-14 p-1.5 bg-gray-100 rounded-[24px] border-none w-full max-w-sm mx-auto flex">
            <TabsTrigger value="issued" className="flex-1 rounded-xl font-black text-[11px] data-[state=active]:bg-[#002d4d] data-[state=active]:text-white">الصكوك الصادرة</TabsTrigger>
            <TabsTrigger value="redeemed" className="flex-1 rounded-xl font-black text-[11px] data-[state=active]:bg-[#002d4d] data-[state=active]:text-white">الصكوك المستلمة</TabsTrigger>
          </TabsList>

          <TabsContent value="issued" className="space-y-4 outline-none">
            {loadingIssued ? (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-gray-200" />
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Scanning Ledger...</p>
              </div>
            ) : issuedVouchers && issuedVouchers.length > 0 ? (
              issuedVouchers.map((v) => (
                <Card key={v.id} className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white group transition-all hover:shadow-md">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "h-14 w-14 rounded-[22px] flex items-center justify-center shadow-inner transition-all duration-500 group-hover:scale-105",
                          v.isRedeemed ? "bg-gray-50 text-gray-300" : "bg-emerald-50 text-emerald-600"
                        )}>
                          <Gift className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="font-black text-[#002d4d] text-lg tracking-tight">${v.amount.toLocaleString()}</h3>
                          <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase mt-0.5">
                            <Clock className="h-3 w-3" />
                            {v.createdAt && format(new Date(v.createdAt), "dd MMM yyyy", { locale: ar })}
                          </div>
                        </div>
                      </div>
                      <Badge className={cn(
                        "font-black text-[9px] border-none px-4 py-1.5 rounded-full shadow-sm tracking-widest",
                        v.isRedeemed ? "bg-gray-100 text-gray-400" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {v.isRedeemed ? "تم الشحن" : "متاح للإهداء"}
                      </Badge>
                    </div>

                    <div className="p-5 bg-gray-50/50 rounded-[28px] border border-gray-100 shadow-inner flex items-center justify-between min-w-0">
                       <div className="space-y-1 flex-1 min-w-0">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Voucher Code</p>
                          <p className="text-sm font-mono font-black text-[#002d4d] select-all break-all">{v.code}</p>
                       </div>
                       {v.isRedeemed && (
                         <div className="text-right shrink-0">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Redeemed By</p>
                            <p className="text-[10px] font-black text-blue-600">ID: {v.redeemedBy?.slice(-8)}</p>
                         </div>
                       )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-32 bg-white/40 rounded-[56px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-6">
                <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <Gift className="h-10 w-10 text-gray-200" />
                </div>
                <div className="space-y-1">
                  <p className="text-gray-300 font-black text-sm uppercase tracking-widest">No Vouchers Issued</p>
                  <p className="text-[10px] text-gray-200 font-bold">لم تقم بإصدار أي صكوك هدايا بعد.</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="redeemed" className="space-y-4 outline-none">
            {loadingRedeemed ? (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-gray-200" />
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Syncing Receipts...</p>
              </div>
            ) : redeemedVouchers && redeemedVouchers.length > 0 ? (
              redeemedVouchers.map((v) => (
                <Card key={v.id} className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white group transition-all hover:shadow-md">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-700">
                          <Coins className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="font-black text-emerald-600 text-lg tracking-tight">+${v.amount.toLocaleString()}</h3>
                          <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase mt-0.5">
                            <Clock className="h-3 w-3" />
                            شُحن في: {v.redeemedAt && format(new Date(v.redeemedAt), "dd MMM, HH:mm", { locale: ar })}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-blue-50 text-blue-600 font-black text-[9px] border-none px-4 py-1.5 rounded-full shadow-sm tracking-widest">
                        VERIFIED
                      </Badge>
                    </div>

                    <div className="p-5 bg-blue-50/20 rounded-[28px] border border-blue-100/30 flex items-center justify-between min-w-0">
                       <div className="space-y-1 flex-1 min-w-0">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Source Node</p>
                          <p className="text-[10px] font-black text-[#002d4d]">NODE: {v.createdBy?.slice(-8).toUpperCase()}</p>
                       </div>
                       <div className="text-left shrink-0 max-w-[120px]">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Transaction Ref</p>
                          <p className="text-[10px] font-mono text-blue-400 truncate">{v.id}</p>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-32 bg-white/40 rounded-[56px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-6">
                <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <Coins className="h-10 w-10 text-gray-200" />
                </div>
                <div className="space-y-1">
                  <p className="text-gray-300 font-black text-sm uppercase tracking-widest">No Redeemed Vouchers</p>
                  <p className="text-[10px] text-gray-200 font-bold">سجل استقبال الهدايا فارغ حالياً.</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Global Action Banner */}
        <div className="p-8 bg-[#002d4d] rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 transition-transform duration-1000 group-hover:scale-150">
             <Gift className="h-32 w-32" />
          </div>
          <div className="space-y-1 text-right relative z-10">
            <h3 className="font-black text-lg">أرسل هدية الآن</h3>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Encrypted Gift Protocol</p>
          </div>
          <Link href="/profile?action=issue-voucher">
            <Button className="rounded-full h-14 px-8 bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-xs shadow-xl transition-all active:scale-95 relative z-10">
              توجه لمركز الإصدار
            </Button>
          </Link>
        </div>
      </div>
    </Shell>
  );
}
