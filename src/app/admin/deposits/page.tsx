
"use client";

import { useState, useMemo, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Check, 
  X, 
  Eye, 
  Loader2, 
  Wallet, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  ArrowUpCircle, 
  Search,
  History,
  Zap,
  Globe,
  Cpu,
  KeyRound,
  Database,
  Save,
  Activity,
  CreditCard,
  Hash
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, updateDoc, addDoc, increment, query, orderBy, onSnapshot, setDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale/ar";

export default function AdminDepositsPage() {
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [approveAmount, setApproveAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [savingAPI, setSavingAPI] = useState(false);

  // 1. Connectivity Settings Logic
  const connectivityRef = useMemoFirebase(() => doc(db, "system_settings", "connectivity"), [db]);
  const { data: remoteConnectivity } = useDoc(connectivityRef);
  const [apiData, setApiData] = useState({ 
    binanceApiKey: "", 
    binanceApiSecret: "",
    nowPaymentsApiKey: "",
    nowPaymentsIpnSecret: ""
  });

  useEffect(() => {
    if (remoteConnectivity) setApiData({
      binanceApiKey: remoteConnectivity.binanceApiKey || "",
      binanceApiSecret: remoteConnectivity.binanceApiSecret || "",
      nowPaymentsApiKey: remoteConnectivity.nowPaymentsApiKey || "",
      nowPaymentsIpnSecret: remoteConnectivity.nowPaymentsIpnSecret || ""
    });
  }, [remoteConnectivity]);

  const handleSaveAPI = async () => {
    setSavingAPI(true);
    try {
      await setDoc(connectivityRef, { ...apiData, updatedAt: new Date().toISOString() }, { merge: true });
      toast({ title: "تم تحديث البروتوكولات", description: "تم تفعيل مفاتيح الربط الجديدة بنجاح." });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الحفظ" });
    } finally {
      setSavingAPI(false);
    }
  };

  // 2. Deposit Requests Logic
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
      return activeTab === 'connectivity' ? false : matchesStatus && matchesSearch;
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
    <Shell isAdmin>
      <div className="space-y-10 px-6 pt-10 pb-24 max-w-[1600px] mx-auto font-body text-right" dir="rtl">
        
        {/* Unified Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] justify-end">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Treasury & API Node Hub
            </div>
            <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">إدارة تدفقات الخزينة</h1>
            <p className="text-muted-foreground font-bold text-xs">مركز موحد لمراجعة الإيداعات وتكوين بوابات الدفع اللحظية.</p>
          </div>
          
          {activeTab !== 'connectivity' && (
            <div className="flex items-center gap-4">
               <div className="relative w-72">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <Input placeholder="ابحث عن مستثمر أو معرف..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-12 rounded-full bg-white border-gray-100 shadow-sm pr-11 font-bold text-xs text-right" />
               </div>
               <div className="h-10 w-px bg-gray-100 mx-2" />
               <div className="text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">طلبات معلقة</p>
                  <p className="text-xl font-black text-emerald-600 tabular-nums">{allDeposits?.filter(d => d.status === 'pending').length || 0}</p>
               </div>
            </div>
          )}
        </div>

        {/* Tactical Switching System */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <TabsList className="h-14 p-1.5 bg-gray-100 rounded-[24px] border-none">
              <TabsTrigger value="pending" className="rounded-xl px-8 font-black text-[11px] data-[state=active]:bg-[#002d4d] data-[state=active]:text-white">الطلبات المعلقة</TabsTrigger>
              <TabsTrigger value="approved" className="rounded-xl px-8 font-black text-[11px] data-[state=active]:bg-emerald-500 data-[state=active]:text-white">الإيداعات المكتملة</TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-xl px-8 font-black text-[11px] data-[state=active]:bg-red-500 data-[state=active]:text-white">المرفوضة</TabsTrigger>
              <div className="w-px h-6 bg-gray-300 mx-2 hidden md:block" />
              <TabsTrigger value="connectivity" className="rounded-xl px-8 font-black text-[11px] data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2">
                <Zap size={14} className="fill-current" /> بروتوكولات الربط (API)
              </TabsTrigger>
            </TabsList>
            
            {activeTab !== 'connectivity' && (
              <Button variant="ghost" className="rounded-full font-black text-[10px] text-gray-400 hover:bg-gray-100 px-6">
                 <History className="ml-2 h-4 w-4" /> السجل التاريخي الشامل
              </Button>
            )}
          </div>

          {/* Tab 1-3: Request Lists */}
          <TabsContent value={activeTab} className="mt-0">
            {activeTab === 'connectivity' ? (
              <div className="grid gap-10 lg:grid-cols-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="lg:col-span-8 space-y-8">
                  <Card className="rounded-[48px] border-none shadow-xl overflow-hidden bg-white">
                    <CardHeader className="bg-[#002d4d] p-10 text-white relative">
                      <div className="absolute top-0 right-0 p-8 opacity-10"><Globe className="h-32 w-32" /></div>
                      <CardTitle className="text-2xl font-black flex items-center gap-4 relative z-10">
                        <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
                          <Cpu className="h-8 w-8 text-[#f9a885]" />
                        </div>
                        تكوين مفاتيح المزامنة والمدفوعات
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-12">
                      <div className="space-y-8">
                        <div className="flex items-center gap-3 px-2">
                          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner"><KeyRound size={20} /></div>
                          <h3 className="font-black text-lg text-[#002d4d]">بروتوكول NOWPayments (الإيداع الآلي)</h3>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">API Key</Label>
                            <Input value={apiData.nowPaymentsApiKey} onChange={e => setApiData({...apiData, nowPaymentsApiKey: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-mono text-xs px-6 shadow-inner text-left" dir="ltr" />
                          </div>
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">IPN Secret Key</Label>
                            <Input type="password" value={apiData.nowPaymentsIpnSecret} onChange={e => setApiData({...apiData, nowPaymentsIpnSecret: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-mono text-xs px-6 shadow-inner text-left" dir="ltr" />
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-gray-100" />

                      <div className="space-y-8">
                        <div className="flex items-center gap-3 px-2">
                          <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner"><Database size={20} /></div>
                          <h3 className="font-black text-lg text-[#002d4d]">بروتوكول Binance (مزامنة السوق)</h3>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">Binance API Key</Label>
                            <Input value={apiData.binanceApiKey} onChange={e => setApiData({...apiData, binanceApiKey: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-mono text-xs px-6 shadow-inner text-left" dir="ltr" />
                          </div>
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">Binance API Secret</Label>
                            <Input type="password" value={apiData.binanceApiSecret} onChange={e => setApiData({...apiData, binanceApiSecret: e.target.value})} className="h-12 rounded-xl bg-gray-50 border-none font-mono text-xs px-6 shadow-inner text-left" dir="ltr" />
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleSaveAPI} disabled={savingAPI} className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-xl transition-all active:scale-95 group">
                        {savingAPI ? <Loader2 className="animate-spin h-6 w-6" /> : (
                          <div className="flex items-center gap-3">
                            <span>تثبيت بروتوكولات المزامنة السيادية</span>
                            <Save className="h-5 w-5 text-[#f9a885]" />
                          </div>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-4 space-y-8">
                   <div className="p-10 bg-blue-600 rounded-[48px] text-white relative overflow-hidden shadow-2xl group">
                      <div className="absolute top-0 left-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><Zap size={160} /></div>
                      <div className="relative z-10 space-y-6">
                         <div className="h-16 w-16 rounded-[24px] bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-inner"><ShieldCheck size={32} /></div>
                         <div className="space-y-2">
                            <h4 className="text-2xl font-black">أمن البيانات</h4>
                            <p className="text-[13px] font-bold text-blue-50 leading-[2.2]">يتم تشفير كافة المفاتيح السيادية قبل تخزينها. تأكد من تفعيل الـ Webhook في لوحة تحكم NOWPayments لضمان الأتمتة.</p>
                         </div>
                      </div>
                   </div>
                   <div className="p-8 bg-gray-50 rounded-[48px] border border-gray-100 space-y-6 shadow-inner">
                      <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-widest px-2">إحصائيات الأتمتة</h4>
                      <div className="space-y-3">
                         {[
                           { label: "الإيداعات الآلية", val: allDeposits?.filter(d => d.isAutoAudited).length || 0, icon: Cpu, c: "text-blue-500" },
                           { label: "الإيداعات اليدوية", val: allDeposits?.filter(d => !d.isAutoAudited).length || 0, icon: Activity, c: "text-orange-500" },
                         ].map((s, i) => (
                           <div key={i} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                              <div className="flex items-center gap-3">
                                 <s.icon size={14} className={s.c} />
                                 <span className="text-[10px] font-black text-[#002d4d]">{s.label}</span>
                              </div>
                              <span className="text-sm font-black tabular-nums">{s.val}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <Card className="border-none shadow-sm rounded-[48px] overflow-hidden bg-white animate-in fade-in duration-700">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
                        <TableHead className="pr-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">المستثمر</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">المبلغ</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">بوابة الشحن</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">المعرف (TXID)</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">الحالة</TableHead>
                        <TableHead className="text-center text-[10px] font-black uppercase text-gray-400 tracking-widest">التدقيق</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow><TableCell colSpan={6} className="text-center py-32"><Loader2 className="h-8 w-8 animate-spin text-gray-200 mx-auto" /></TableCell></TableRow>
                      ) : filteredDeposits.length > 0 ? (
                        filteredDeposits.map((req) => (
                          <TableRow key={req.id} className="hover:bg-gray-50/30 transition-all border-gray-50 group">
                            <TableCell className="pr-10 py-5">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-[20px] bg-gray-50 flex items-center justify-center text-sm font-black text-[#002d4d] shadow-inner group-hover:bg-white transition-all">{req.userName?.[0] || 'U'}</div>
                                <div className="space-y-0.5">
                                  <span className="font-black text-sm text-[#002d4d] block">{req.userName}</span>
                                  <span className="text-[9px] text-gray-400 font-bold">ID: {req.userId?.slice(-8)}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell><span className="font-black text-sm text-emerald-600 tabular-nums">+${req.amount?.toLocaleString()}</span></TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="rounded-lg text-[9px] font-black border-blue-50 bg-blue-50/30 text-blue-600 px-2.5 py-1">{req.methodName}</Badge>
                                {req.isAutoAudited && <Cpu className="h-3.5 w-3.5 text-blue-500 animate-pulse" title="آلي" />}
                              </div>
                            </TableCell>
                            <TableCell><span className="text-[9px] font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-500 border border-gray-200/50 block max-w-[120px] truncate">{req.transactionId}</span></TableCell>
                            <TableCell>
                              <Badge className={cn(
                                "font-black text-[8px] border-none px-4 py-1.5 rounded-full shadow-inner",
                                req.status === 'pending' ? "bg-orange-50 text-orange-600" : 
                                req.status === 'approved' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                              )}>{req.status === 'pending' ? 'بانتظار المراجعة' : req.status === 'approved' ? 'إيداع معتمد' : 'مرفوض'}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Button size="icon" onClick={() => setSelectedRequest(req)} className={cn("h-10 w-10 rounded-xl transition-all", req.status === 'pending' ? "bg-[#002d4d] text-[#f9a885]" : "bg-gray-50 text-gray-400")}>
                                  <ShieldCheck className="h-5 w-5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow><TableCell colSpan={6} className="text-center py-40 opacity-20 flex flex-col items-center gap-4"><ArrowUpCircle size={64}/><p className="text-xs font-black uppercase tracking-widest">لا توجد طلبات في هذا القطاع</p></TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Advanced Audit Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="rounded-[56px] border-none shadow-2xl p-0 max-w-[520px] overflow-hidden font-body text-right" dir="rtl">
          <div className="bg-[#002d4d] p-10 text-white relative">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 pointer-events-none"><Globe className="h-40 w-40" /></div>
             <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                   <div className="h-16 w-16 rounded-[28px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                      <CreditCard className="h-8 w-8 text-[#f9a885]" />
                   </div>
                   <div className="space-y-0.5 text-right">
                      <DialogTitle className="text-2xl font-black">تدقيق إثبات الإيداع</DialogTitle>
                      <p className="text-[10px] font-black text-blue-200/60 uppercase tracking-[0.3em]">Treasury Validation</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="p-10 space-y-8 bg-white max-h-[70vh] overflow-y-auto scrollbar-none">
            {selectedRequest?.isAutoAudited && (
              <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-start gap-4 shadow-sm">
                 <Cpu className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                 <div className="space-y-1">
                    <p className="text-xs font-black text-blue-900">توثيق آلي عبر Webhook</p>
                    <p className="text-[11px] font-bold text-blue-800/60 leading-relaxed">تم التحقق من هذه العملية برمجياً ومطابقتها مع سجلات البوابة لحظياً.</p>
                 </div>
              </div>
            )}

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
                  <Button onClick={onConfirmApprove} disabled={processing || !approveAmount} className="w-full h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl flex items-center justify-center gap-3">
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
    </Shell>
  );
}
