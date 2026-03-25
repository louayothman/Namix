
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
  Filter, 
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  ArrowUpCircle, 
  Search,
  User,
  History,
  FileWarning,
  Zap,
  ChevronLeft,
  Info,
  CreditCard,
  Hash,
  ArrowDownLeft,
  Globe,
  Cpu
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, updateDoc, addDoc, increment, query, orderBy, getDoc, onSnapshot } from "firebase/firestore";
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

  // Fetch all deposit requests
  const depositsQuery = useMemoFirebase(() => query(collection(db, "deposit_requests"), orderBy("createdAt", "desc")), [db]);
  const { data: allDeposits, isLoading } = useCollection(depositsQuery);

  // Fetch vault bonus config for preview
  const vaultBonusDocRef = useMemoFirebase(() => doc(db, "system_settings", "vault_bonus"), [db]);
  const { data: vaultBonusConfig } = useDoc(vaultBonusDocRef);

  // Filter deposits based on active tab and search
  const filteredDeposits = useMemo(() => {
    if (!allDeposits) return [];
    return allDeposits.filter(req => {
      const matchesStatus = req.status === activeTab;
      const matchesSearch = req.userName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           req.userId?.includes(searchQuery) ||
                           req.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [allDeposits, activeTab, searchQuery]);

  // Real-time user stats when a request is selected
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

  const sendNotification = async (userId: string, title: string, message: string, type: 'success' | 'error') => {
    await addDoc(collection(db, "notifications"), {
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  };

  const onConfirmApprove = async () => {
    if (!selectedRequest || !approveAmount) return;
    setProcessing(true);
    try {
      const amount = Number(approveAmount);
      
      // Calculate bonus based on percentage tiers
      let bonus = 0;
      let bonusPercent = 0;
      if (vaultBonusConfig?.depositBonuses) {
        const applicableTier = vaultBonusConfig.depositBonuses.find((t: any) => amount >= t.min && amount <= (t.max || Infinity));
        if (applicableTier && applicableTier.percent > 0) {
          bonusPercent = applicableTier.percent;
          bonus = (amount * bonusPercent) / 100;
        }
      }

      const totalToAdd = amount + bonus;

      await updateDoc(doc(db, "deposit_requests", selectedRequest.id), { 
        status: "approved",
        approvedAmount: amount,
        bonusApplied: bonus,
        bonusPercent: bonusPercent,
        updatedAt: new Date().toISOString()
      });

      await updateDoc(doc(db, "users", selectedRequest.userId), {
        totalBalance: increment(totalToAdd)
      });

      await sendNotification(
        selectedRequest.userId,
        bonus > 0 ? "تم قبول الإيداع مع مكافأة استراتيجية" : "تم قبول الإيداع بنجاح",
        bonus > 0 
          ? `تمت الموافقة على إيداع مبلغ $${amount} وحصلت على مكافأة شحن بنسبة ${bonusPercent}% بقيمة $${bonus.toFixed(2)}. تم تحديث رصيدك الإجمالي الآن.` 
          : `تمت الموافقة على إيداع مبلغ $${amount} بنجاح. تم تحديث رصيدك الآن.`,
        'success'
      );

      toast({ title: "تم قبول الإيداع", description: bonus > 0 ? `تم إضافة مبلغ الإيداع مع مكافأة بنسبة ${bonusPercent}%` : "تم تحديث رصيد المستخدم بنجاح." });
      setSelectedRequest(null);
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في المعالجة" });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (request: any) => {
    try {
      await updateDoc(doc(db, "deposit_requests", request.id), { 
        status: "rejected",
        updatedAt: new Date().toISOString()
      });
      
      await sendNotification(
        request.userId,
        "تم رفض طلب الإيداع",
        `نأسف، تم رفض طلب الإيداع الخاص بك لمبلغ $${request.amount}. يرجى مراجعة الدعم أو التأكد من بيانات التحويل.`,
        'error'
      );
      
      toast({ variant: "destructive", title: "تم رفض الطلب" });
      setSelectedRequest(null);
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في المعالجة" });
    }
  };

  const currentBonusPreview = useMemo(() => {
    const amount = Number(approveAmount);
    if (!amount || !vaultBonusConfig?.depositBonuses) return { bonus: 0, percent: 0 };
    const tier = vaultBonusConfig.depositBonuses.find((t: any) => amount >= t.min && amount <= (t.max || Infinity));
    if (tier && tier.percent > 0) {
      return { bonus: (amount * tier.percent) / 100, percent: tier.percent };
    }
    return { bonus: 0, percent: 0 };
  }, [approveAmount, vaultBonusConfig]);

  return (
    <Shell isAdmin>
      <div className="space-y-10 px-6 pt-10 pb-24 max-w-[1600px] mx-auto font-body">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Treasury Liquidity Inflow
            </div>
            <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">إدارة تدفقات الخزينة</h1>
            <p className="text-muted-foreground font-bold text-xs">مراجعة أمنية لطلبات شحن الرصيد والتحقق من إثباتات التحويل الرقمية.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative w-72">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                <Input 
                  placeholder="ابحث عن مستثمر أو معرف..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-12 rounded-full bg-white border-gray-100 shadow-sm pr-11 font-bold text-xs focus-visible:ring-2 focus-visible:ring-emerald-500" 
                />
             </div>
             <div className="h-10 w-px bg-gray-100 mx-2" />
             <div className="text-right">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">إيداعات بانتظار المراجعة</p>
                <p className="text-xl font-black text-emerald-600 tabular-nums">
                  {allDeposits?.filter(d => d.status === 'pending').length || 0}
                </p>
             </div>
          </div>
        </div>

        {/* Dynamic Filters & Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
          <div className="flex items-center justify-between">
            <TabsList className="h-14 p-1.5 bg-gray-100 rounded-[24px] border-none">
              <TabsTrigger value="pending" className="rounded-xl px-8 font-black text-[11px] data-[state=active]:bg-[#002d4d] data-[state=active]:text-white">
                طلبات معلقة
              </TabsTrigger>
              <TabsTrigger value="approved" className="rounded-xl px-8 font-black text-[11px] data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                إيداعات مكتملة
              </TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-xl px-8 font-black text-[11px] data-[state=active]:bg-red-500 data-[state=active]:text-white">
                إيداعات مرفوضة
              </TabsTrigger>
            </TabsList>
            
            <Button variant="ghost" className="rounded-full font-black text-[10px] text-gray-400 hover:bg-gray-100 px-6">
               <History className="ml-2 h-4 w-4" /> عرض السجل التاريخي
            </Button>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <Card className="border-none shadow-sm rounded-[48px] overflow-hidden bg-white group animate-in fade-in slide-in-from-bottom-2 duration-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
                      <TableHead className="pr-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">المستثمر</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest">المبلغ</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest">بوابة الشحن</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest">المعرف (TXID)</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest">التوقيت الزمني</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest">حالة الطلب</TableHead>
                      <TableHead className="text-center text-[10px] font-black uppercase text-gray-400 tracking-widest">التدقيق</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-32"><Loader2 className="h-8 w-8 animate-spin text-gray-200 mx-auto" /></TableCell></TableRow>
                    ) : filteredDeposits.length > 0 ? (
                      filteredDeposits.map((req) => (
                        <TableRow key={req.id} className="hover:bg-gray-50/30 transition-all border-gray-50 group/row">
                          <TableCell className="pr-10 py-5">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-[20px] bg-gray-50 flex items-center justify-center text-sm font-black text-[#002d4d] shadow-inner group-hover/row:bg-white transition-all">
                                {req.userName?.[0] || 'U'}
                              </div>
                              <div className="space-y-0.5">
                                <span className="font-black text-sm text-[#002d4d] block">{req.userName}</span>
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">ID: {req.userId?.slice(-8)}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-black text-sm text-emerald-600 tabular-nums">+${req.amount?.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                               <Badge variant="outline" className="rounded-lg text-[9px] font-black border-blue-50 bg-blue-50/30 text-blue-600 px-2.5 py-1">
                                 {req.methodName}
                               </Badge>
                               {req.isAutoAudited && (
                                 <Cpu className="h-3.5 w-3.5 text-blue-500 animate-pulse" title="تم التدقيق آلياً عبر Binance" />
                               )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-[10px] font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-500 border border-gray-200/50 block max-w-[120px] truncate">{req.transactionId}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                               <span className="text-[10px] text-gray-500 font-bold">{req.createdAt && format(new Date(req.createdAt), "dd MMM yyyy", { locale: ar })}</span>
                               <span className="text-[9px] text-gray-300 font-bold">{req.createdAt && format(new Date(req.createdAt), "HH:mm", { locale: ar })}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "font-black text-[8px] border-none px-4 py-1.5 rounded-full shadow-inner tracking-widest",
                              req.status === 'pending' ? "bg-orange-50 text-orange-600" : 
                              req.status === 'approved' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>
                              {req.status === 'pending' ? 'بانتظار المراجعة' : req.status === 'approved' ? (req.isAutoAudited ? 'مقبول آلياً' : 'إيداع معتمد') : 'مرفوض'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              {req.status === 'pending' ? (
                                <Button 
                                  size="icon" 
                                  onClick={() => setSelectedRequest(req)}
                                  className="h-10 w-10 rounded-xl bg-[#002d4d] text-[#f9a885] hover:bg-[#001d33] shadow-lg transition-all active:scale-90"
                                >
                                  <ShieldCheck className="h-5 w-5" />
                                </Button>
                              ) : (
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => setSelectedRequest(req)}
                                  className="h-10 w-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all"
                                >
                                  <Eye className="h-5 w-5" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-40">
                          <div className="flex flex-col items-center gap-4 opacity-20">
                             <ArrowUpCircle className="h-16 w-16 text-[#002d4d]" />
                             <p className="text-xs font-black uppercase tracking-[0.4em]">لا توجد طلبات إيداع في هذا القطاع</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Advanced Deposit Audit Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="rounded-[56px] border-none shadow-2xl p-0 max-w-[520px] overflow-hidden font-body">
          <div className="bg-[#002d4d] p-10 text-white relative">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 pointer-events-none">
                <Globe className="h-40 w-40" />
             </div>
             <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                   <div className="h-16 w-16 rounded-[28px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                      <CreditCard className="h-8 w-8 text-[#f9a885]" />
                   </div>
                   <div className="space-y-0.5">
                      <DialogTitle className="text-2xl font-black">تدقيق إثبات الإيداع</DialogTitle>
                      <p className="text-[10px] font-black text-blue-200/60 uppercase tracking-[0.3em]">Treasury Validation Protocol</p>
                   </div>
                </div>
                <Badge className={cn("text-white border-none font-black text-[9px] px-4 py-1.5 rounded-full shadow-lg", selectedRequest?.isAutoAudited ? "bg-blue-600" : "bg-emerald-500")}>
                   {selectedRequest?.status === 'pending' ? 'قيد التدقيق' : (selectedRequest?.isAutoAudited ? 'تدقيق آلي' : 'سجل المعاملة')}
                </Badge>
             </div>
          </div>

          <div className="p-10 space-y-8 bg-white max-h-[70vh] overflow-y-auto scrollbar-none">
            
            {/* Binance Auto-Audit Notice */}
            {selectedRequest?.isAutoAudited && (
              <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-start gap-4 shadow-sm">
                 <Cpu className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                 <div className="space-y-1">
                    <p className="text-xs font-black text-blue-900">توثيق آلي عبر Binance API</p>
                    <p className="text-[11px] font-bold text-blue-800/60 leading-relaxed">تم التحقق من هذه العملية برمجياً ومطابقتها مع سجلات المحفظة لحظياً. لا تتطلب مراجعة بشرية.</p>
                 </div>
              </div>
            )}

            {/* User Intelligence Section */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 px-2">
                  <Zap className="h-3 w-3 text-blue-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">استخبارات حساب المستثمر</span>
               </div>
               
               {targetUser ? (
                 <div className="grid grid-cols-3 gap-3">
                    <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner space-y-1.5 text-center group">
                       <Wallet className="h-4 w-4 text-emerald-500 mx-auto group-hover:scale-110 transition-transform" />
                       <p className="text-[8px] font-black text-gray-400 uppercase">الرصيد الحالي</p>
                       <p className="text-sm font-black text-[#002d4d] tabular-nums">${targetUser.totalBalance?.toLocaleString()}</p>
                    </div>
                    <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner space-y-1.5 text-center group">
                       <TrendingUp className="h-4 w-4 text-blue-500 mx-auto group-hover:scale-110 transition-transform" />
                       <p className="text-[8px] font-black text-gray-400 uppercase">استثمارات نشطة</p>
                       <p className="text-sm font-black text-[#002d4d] tabular-nums">${targetUser.activeInvestmentsTotal?.toLocaleString()}</p>
                    </div>
                    <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner space-y-1.5 text-center group">
                       <ArrowUpCircle className="h-4 w-4 text-emerald-600 mx-auto group-hover:scale-110 transition-transform" />
                       <p className="text-[8px] font-black text-gray-400 uppercase">الحالة</p>
                       <p className="text-[10px] font-black text-emerald-600 uppercase">نشط</p>
                    </div>
                 </div>
               ) : (
                 <div className="h-24 flex items-center justify-center bg-gray-50 rounded-[32px] animate-pulse">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">جاري جلب ملف المستثمر...</p>
                 </div>
               )}
            </div>

            {/* Proof Data Section */}
            <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6">
               <div className="flex justify-between items-center px-2">
                  <div className="space-y-0.5">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">المبلغ المراد شحنه</p>
                     <h4 className="text-3xl font-black text-emerald-600 tabular-nums">+${selectedRequest?.amount?.toLocaleString()}</h4>
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">بوابة الاستقبال</p>
                     <Badge className="bg-[#002d4d] text-white border-none font-black text-[9px] px-3 py-1 rounded-lg shadow-md">{selectedRequest?.methodName}</Badge>
                  </div>
               </div>

               <div className="h-px bg-gray-200/50 mx-2" />

               <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2 text-blue-600">
                     <Hash className="h-3.5 w-3.5" />
                     <span className="text-[10px] font-black uppercase">بيانات إثبات التحويل المقدمة</span>
                  </div>
                  
                  <div className="grid gap-3">
                     {selectedRequest?.details && Object.entries(selectedRequest.details).map(([key, val]: any) => (
                        <div key={key} className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                           <span className="text-[10px] font-black text-gray-400 uppercase">{key}</span>
                           <span className="text-[11px] font-black text-[#002d4d] font-mono break-all max-w-[240px] text-left" dir="ltr">{val}</span>
                        </div>
                     ))}
                     {(!selectedRequest?.details || Object.keys(selectedRequest.details).length === 0) && (
                        <div className="space-y-3">
                           <div className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm flex items-center justify-between">
                              <span className="text-[10px] font-black text-gray-400 uppercase">TXID</span>
                              <span className="text-[11px] font-black text-[#002d4d] font-mono" dir="ltr">{selectedRequest?.transactionId}</span>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Approval Input with Bonus Preview */}
            {selectedRequest?.status === 'pending' && (
              <div className="space-y-6">
                <div className="space-y-3 px-2">
                  <Label className="font-black text-[11px] text-[#002d4d] uppercase tracking-widest pr-4">المبلغ المعتمد للإيداع ($)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={approveAmount}
                      onChange={e => setApproveAmount(e.target.value)}
                      className="h-16 rounded-[28px] bg-gray-50 border-none font-black text-center text-3xl text-emerald-600 shadow-inner focus-visible:ring-2 focus-visible:ring-emerald-500 transition-all"
                    />
                    <Zap className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-emerald-100" />
                  </div>
                </div>

                {currentBonusPreview.bonus > 0 && (
                  <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 space-y-3 animate-in zoom-in-95">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">بروتوكول المكافأة التلقائي</p>
                       <Badge className="bg-emerald-600 text-white border-none font-black text-[8px] px-3 py-1 rounded-full">ACTIVE BONUS</Badge>
                    </div>
                    <div className="flex justify-between items-end">
                       <div className="space-y-0.5">
                          <p className="text-[8px] font-bold text-emerald-600/60 uppercase">نسبة الحافز</p>
                          <p className="text-xl font-black text-emerald-700">+{currentBonusPreview.percent}%</p>
                       </div>
                       <div className="text-right space-y-0.5">
                          <p className="text-[8px] font-bold text-emerald-600/60 uppercase">المبلغ الإضافي</p>
                          <p className="text-xl font-black text-emerald-700">+${currentBonusPreview.bonus.toFixed(2)}</p>
                       </div>
                    </div>
                    <div className="h-px bg-emerald-200/30" />
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black text-emerald-900 uppercase">إجمالي الرصيد المُضاف</p>
                       <p className="text-2xl font-black text-emerald-600">${(Number(approveAmount) + currentBonusPreview.bonus).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-10 bg-gray-50 border-t border-gray-100">
            <DialogFooter className="flex flex-col gap-3 sm:flex-col">
              {selectedRequest?.status === 'pending' ? (
                <>
                  <Button 
                    onClick={onConfirmApprove} 
                    disabled={processing || !approveAmount}
                    className="w-full h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                  >
                    {processing ? <Loader2 className="animate-spin h-6 w-6" /> : (
                      <>
                        تأكيد الإيداع وتحديث الرصيد
                        <Check className="h-5 w-5 group-hover:scale-125 transition-transform" />
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => handleReject(selectedRequest)}
                    disabled={processing}
                    className="w-full h-14 rounded-full bg-white text-red-500 hover:bg-red-50 border border-red-100 font-black text-xs transition-all active:scale-95"
                  >
                    رفض الطلب وإلغاء العملية
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setSelectedRequest(null)}
                  className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl"
                >
                  إغلاق نافذة المراجعة
                </Button>
              )}
              
              <div className="flex items-center justify-center gap-6 mt-4 opacity-30">
                 <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[8px] font-black text-[#002d4d] uppercase tracking-widest">End-to-End Encryption</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3 text-blue-500" />
                    <p className="text-[8px] font-black text-[#002d4d] uppercase tracking-widest">Verified by Namix Core</p>
                 </div>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
