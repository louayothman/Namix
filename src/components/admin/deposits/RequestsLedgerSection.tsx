
"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Check, 
  X, 
  Loader2, 
  Wallet, 
  ShieldCheck, 
  TrendingUp, 
  Search,
  ArrowUpCircle,
  Cpu,
  Globe,
  CreditCard
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, updateDoc, addDoc, increment, query, orderBy, onSnapshot } from "firebase/firestore";
import { cn } from "@/lib/utils";

export function RequestsLedgerSection() {
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [approveAmount, setApproveAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const depositsQuery = useMemoFirebase(() => query(collection(db, "deposit_requests"), orderBy("createdAt", "desc")), [db]);
  const { data: allDeposits, isLoading } = useCollection(depositsQuery);

  const vaultBonusDocRef = useMemoFirebase(() => doc(db, "system_settings", "vault_bonus"), [db]);
  const { data: vaultBonusConfig } = useDoc(vaultBonusDocRef);

  const filteredDeposits = useMemo(() => {
    if (!allDeposits) return [];
    return allDeposits.filter(req => {
      const matchesStatus = activeTab === 'all' ? true : req.status === activeTab;
      const matchesSearch = req.userName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           req.userId?.includes(searchQuery) ||
                           req.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [allDeposits, activeTab, searchQuery]);

  useEffect(() => {
    if (selectedRequest?.userId) {
      const unsub = onSnapshot(doc(db, "users", selectedRequest.userId), (snap) => {
        if (snap.exists()) setTargetUser(snap.data());
      });
      setApproveAmount(selectedRequest.amount.toString());
      return () => unsub();
    } else {
      setTargetUser(null);
      setApproveAmount("");
    }
  }, [selectedRequest, db]);

  const onConfirmApprove = async () => {
    if (!selectedRequest || !approveAmount) return;
    setProcessing(true);
    try {
      const amount = Number(approveAmount);
      let bonus = 0;
      let bonusPercent = 0;
      if (vaultBonusConfig?.depositBonuses) {
        const tier = vaultBonusConfig.depositBonuses.find((t: any) => amount >= t.min && amount <= (t.max || Infinity));
        if (tier) { bonusPercent = tier.percent; bonus = (amount * bonusPercent) / 100; }
      }

      await updateDoc(doc(db, "deposit_requests", selectedRequest.id), { 
        status: "approved", approvedAmount: amount, bonusApplied: bonus, bonusPercent, updatedAt: new Date().toISOString()
      });
      await updateDoc(doc(db, "users", selectedRequest.userId), { totalBalance: increment(amount + bonus) });
      
      await addDoc(collection(db, "notifications"), {
        userId: selectedRequest.userId, title: "تم قبول الإيداع بنجاح",
        message: `تمت الموافقة على إيداع $${amount}. الرصيد متاح الآن في محفظتك.`,
        type: 'success', isRead: false, createdAt: new Date().toISOString()
      });

      toast({ title: "تم الاعتماد بنجاح" });
      setSelectedRequest(null);
    } catch (e) { toast({ variant: "destructive", title: "خطأ في المعالجة" }); } finally { setProcessing(false); }
  };

  const currentBonusPreview = useMemo(() => {
    const amount = Number(approveAmount);
    if (!amount || !vaultBonusConfig?.depositBonuses) return { bonus: 0, percent: 0 };
    const tier = vaultBonusConfig.depositBonuses.find((t: any) => amount >= t.min && amount <= (t.max || Infinity));
    if (tier && tier.percent > 0) return { bonus: (amount * tier.percent) / 100, percent: tier.percent };
    return { bonus: 0, percent: 0 };
  }, [approveAmount, vaultBonusConfig]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-6 duration-700 text-right" dir="rtl">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
         <div className="relative w-80">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            <Input placeholder="ابحث عن مستثمر أو معرف..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-12 rounded-full bg-white border-gray-100 shadow-sm pr-11 font-bold text-xs text-right" />
         </div>
         
         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="h-12 p-1 bg-gray-100 rounded-2xl border-none">
              <TabsTrigger value="pending" className="rounded-xl px-6 font-black text-[10px] data-[state=active]:bg-[#002d4d] data-[state=active]:text-white">المعلقة</TabsTrigger>
              <TabsTrigger value="approved" className="rounded-xl px-6 font-black text-[10px] data-[state=active]:bg-emerald-500 data-[state=active]:text-white">المكتملة</TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-xl px-6 font-black text-[10px] data-[state=active]:bg-red-500 data-[state=active]:text-white">المرفوضة</TabsTrigger>
            </TabsList>
         </Tabs>
      </div>

      <Card className="border-none shadow-sm rounded-[48px] overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 border-none">
                <TableHead className="pr-10 py-6 text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">المستثمر</TableHead>
                <TableHead className="text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">المبلغ</TableHead>
                <TableHead className="text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">بوابة الشحن</TableHead>
                <TableHead className="text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">المعرف (TXID)</TableHead>
                <TableHead className="text-center text-[9px] font-black uppercase text-gray-400 tracking-widest">التدقيق</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-32"><Loader2 className="h-8 w-8 animate-spin text-gray-200 mx-auto" /></TableCell></TableRow>
              ) : filteredDeposits.length > 0 ? (
                filteredDeposits.map((req) => (
                  <TableRow key={req.id} className="hover:bg-gray-50/30 border-gray-50 group">
                    <TableCell className="pr-10 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-xs font-black text-[#002d4d] shadow-inner group-hover:bg-white transition-all">{req.userName?.[0]}</div>
                        <div className="space-y-0.5 text-right">
                          <span className="font-black text-sm text-[#002d4d] block">{req.userName}</span>
                          <span className="text-[8px] text-gray-400 font-bold">ID: {req.userId?.slice(-8)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><span className="font-black text-sm text-emerald-600 tabular-nums">+${req.amount?.toLocaleString()}</span></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end">
                        {req.isAutoAudited && <Cpu className="h-3 w-3 text-blue-500 animate-pulse" />}
                        <Badge variant="outline" className="rounded-lg text-[8px] font-black border-blue-50 bg-blue-50/30 text-blue-600 px-2 py-0.5">{req.methodName}</Badge>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-[9px] font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-500 border border-gray-200/50 block max-w-[120px] truncate">{req.transactionId}</span></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button size="icon" onClick={() => setSelectedRequest(req)} className={cn("h-10 w-10 rounded-xl transition-all", req.status === 'pending' ? "bg-[#002d4d] text-[#f9a885]" : "bg-gray-50 text-gray-400")}>
                          <ShieldCheck className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="text-center py-40 opacity-20 flex flex-col items-center gap-4"><ArrowUpCircle size={64}/><p className="text-xs font-black uppercase tracking-widest">لا توجد سجلات في هذا النطاق</p></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="rounded-[56px] border-none shadow-2xl p-0 max-w-[520px] overflow-hidden font-body text-right" dir="rtl">
          <div className="bg-[#002d4d] p-10 text-white relative">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 pointer-events-none"><Globe className="h-40 w-40" /></div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="h-16 w-16 rounded-[28px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                   <CreditCard className="h-8 w-8 text-[#f9a885]" />
                </div>
                <div className="space-y-0.5">
                   <DialogTitle className="text-2xl font-black">تدقيق إثبات الإيداع</DialogTitle>
                   <p className="text-[10px] font-black text-blue-200/60 uppercase tracking-[0.3em]">Treasury Validation</p>
                </div>
             </div>
          </div>

          <div className="p-10 space-y-8 bg-white max-h-[70vh] overflow-y-auto scrollbar-none">
            <div className="grid grid-cols-2 gap-4">
               <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner space-y-1.5 text-center">
                  <Wallet className="h-4 w-4 text-emerald-500 mx-auto" />
                  <p className="text-[8px] font-black text-gray-400 uppercase">الرصيد الحالي</p>
                  <p className="text-sm font-black text-[#002d4d]">${targetUser?.totalBalance?.toLocaleString()}</p>
               </div>
               <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner space-y-1.5 text-center">
                  <TrendingUp className="h-4 w-4 text-blue-500 mx-auto" />
                  <p className="text-[8px] font-black text-gray-400 uppercase">استثمارات نشطة</p>
                  <p className="text-sm font-black text-[#002d4d]">${targetUser?.activeInvestmentsTotal?.toLocaleString()}</p>
               </div>
            </div>

            <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6">
               <div className="flex justify-between items-center px-2">
                  <div className="space-y-0.5 text-right">
                     <p className="text-[9px] font-black text-gray-400 uppercase">المبلغ المراد شحنه</p>
                     <h4 className="text-3xl font-black text-emerald-600 tabular-nums">+${selectedRequest?.amount?.toLocaleString()}</h4>
                  </div>
                  <Badge className="bg-[#002d4d] text-white border-none font-black text-[9px] px-3 py-1 rounded-lg">{selectedRequest?.methodName}</Badge>
               </div>
               <div className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase">TXID</span>
                  <span className="text-[11px] font-black text-[#002d4d] font-mono break-all max-w-[200px] text-left" dir="ltr">{selectedRequest?.transactionId}</span>
               </div>
            </div>

            {selectedRequest?.status === 'pending' && (
              <div className="space-y-6">
                <div className="space-y-3 px-2">
                  <Label className="font-black text-[11px] text-[#002d4d] uppercase pr-4 block text-right">المبلغ المعتمد للإيداع ($)</Label>
                  <Input type="number" value={approveAmount} onChange={e => setApproveAmount(e.target.value)} className="h-16 rounded-[28px] bg-gray-50 border-none font-black text-center text-3xl text-emerald-600 shadow-inner" />
                </div>
                {currentBonusPreview.bonus > 0 && (
                  <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black text-emerald-800 uppercase"><span>بروتوكول المكافأة التلقائي</span><Badge className="bg-emerald-600 text-white border-none text-[8px] font-black">+{currentBonusPreview.percent}%</Badge></div>
                    <div className="flex justify-between items-center"><p className="text-[10px] font-bold text-emerald-900">إجمالي الرصيد المُضاف</p><p className="text-2xl font-black text-emerald-600">${(Number(approveAmount) + currentBonusPreview.bonus).toLocaleString()}</p></div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-10 bg-gray-50 border-t border-gray-100">
            <DialogFooter className="flex flex-col gap-3">
              {selectedRequest?.status === 'pending' ? (
                <>
                  <Button onClick={onConfirmApprove} disabled={processing || !approveAmount} className="w-full h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl flex items-center justify-center gap-3 transition-all">
                    {processing ? <Loader2 className="animate-spin h-6 w-6" /> : "تأكيد الإيداع وتحديث الرصيد"}
                  </Button>
                  <Button onClick={async () => { await updateDoc(doc(db, "deposit_requests", selectedRequest.id), { status: "rejected" }); setSelectedRequest(null); }} disabled={processing} className="w-full h-14 rounded-full bg-white text-red-500 font-black text-xs border border-red-100">رفض الطلب</Button>
                </>
              ) : (
                <Button onClick={() => setSelectedRequest(null)} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-base">إغلاق المراجعة</Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
