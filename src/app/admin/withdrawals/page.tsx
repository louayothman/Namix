
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
  Landmark, 
  Sparkles, 
  Filter, 
  ShieldCheck, 
  Wallet, 
  TrendingUp, 
  Coins, 
  ArrowDownCircle, 
  Search,
  User,
  History,
  FileWarning,
  Zap,
  ChevronLeft,
  Info,
  ArrowUpRight,
  Briefcase,
  PieChart,
  Globe
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, updateDoc, addDoc, increment, query, where, getDocs, orderBy, getDoc, onSnapshot } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale/ar";

export default function AdminWithdrawalsPage() {
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [userStats, setUserStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalProfits: 0,
    activeInvestments: 0,
    completedInvestments: 0
  });
  const [processing, setProcessing] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all withdrawal requests
  const withdrawalsQuery = useMemoFirebase(() => query(collection(db, "withdraw_requests"), orderBy("createdAt", "desc")), [db]);
  const { data: allWithdrawals, isLoading } = useCollection(withdrawalsQuery);

  // Filter withdrawals based on active tab and search
  const filteredWithdrawals = useMemo(() => {
    if (!allWithdrawals) return [];
    return allWithdrawals.filter(req => {
      const matchesStatus = req.status === activeTab;
      const matchesSearch = req.userName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           req.userId?.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [allWithdrawals, activeTab, searchQuery]);

  // Real-time user stats and aggregate intelligence
  useEffect(() => {
    if (selectedRequest?.userId) {
      setLoadingStats(true);
      const userRef = doc(db, "users", selectedRequest.userId);
      const unsub = onSnapshot(userRef, (snap) => {
        if (snap.exists()) setTargetUser(snap.data());
      });

      // Fetch Aggregates
      const fetchAggregates = async () => {
        try {
          const uid = selectedRequest.userId;
          
          // Deposits
          const depSnap = await getDocs(query(collection(db, "deposit_requests"), where("userId", "==", uid), where("status", "==", "approved")));
          const totalDep = depSnap.docs.reduce((sum, d) => sum + (d.data().amount || 0), 0);

          // Withdrawals
          const withSnap = await getDocs(query(collection(db, "withdraw_requests"), where("userId", "==", uid), where("status", "==", "approved")));
          const totalWith = withSnap.docs.reduce((sum, d) => sum + (d.data().amount || 0), 0);

          // Investments
          const invSnap = await getDocs(query(collection(db, "investments"), where("userId", "==", uid)));
          const activeInv = invSnap.docs.filter(d => d.data().status === 'active').reduce((sum, d) => sum + (d.data().amount || 0), 0);
          const completedInv = invSnap.docs.filter(d => d.data().status === 'completed').reduce((sum, d) => sum + (d.data().amount || 0), 0);

          setUserStats({
            totalDeposits: totalDep,
            totalWithdrawals: totalWith,
            totalProfits: 0, // Will be taken from user doc
            activeInvestments: activeInv,
            completedInvestments: completedInv
          });
        } catch (e) {
          console.error("Error fetching stats:", e);
        } finally {
          setUserStats(prev => ({ ...prev, totalProfits: targetUser?.totalProfits || 0 }));
          setLoadingStats(false);
        }
      };

      fetchAggregates();
      return () => unsub();
    } else {
      setTargetUser(null);
      setUserStats({ totalDeposits: 0, totalWithdrawals: 0, totalProfits: 0, activeInvestments: 0, completedInvestments: 0 });
    }
  }, [selectedRequest, db, targetUser?.totalProfits]);

  const sendNotification = async (userId: string, title: string, message: string, type: 'success' | 'error' | 'warning') => {
    await addDoc(collection(db, "notifications"), {
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  };

  const handleApprove = async (request: any) => {
    setProcessing(true);
    try {
      const userRef = doc(db, "users", request.userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) throw new Error("المستخدم غير موجود");
      
      const currentBalance = userSnap.data().totalBalance || 0;
      if (currentBalance < request.amount) {
        toast({ variant: "destructive", title: "رصيد غير كافٍ", description: "المستثمر لا يملك رصيداً كافياً لإتمام هذه العملية حالياً." });
        setProcessing(false);
        return;
      }

      await updateDoc(userRef, {
        totalBalance: increment(-request.amount)
      });

      await updateDoc(doc(db, "withdraw_requests", request.id), { 
        status: "approved",
        updatedAt: new Date().toISOString()
      });

      await sendNotification(
        request.userId,
        "اكتمال تحويل الأرباح",
        `تم قبول وتفيذ طلب سحب مبلغ $${request.amount} بنجاح. يرجى مراجعة وسيلة الاستلام الخاصة بك خلال دقائق.`,
        'success'
      );

      toast({ title: "تم تنفيذ السحب", description: "تم خصم الرصيد وتأكيد الحوالة بنجاح." });
      setSelectedRequest(null);
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في البروتوكول" });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (request: any) => {
    try {
      await updateDoc(doc(db, "withdraw_requests", request.id), { 
        status: "rejected",
        updatedAt: new Date().toISOString()
      });
      
      await sendNotification(
        request.userId,
        "تعذر تنفيذ السحب",
        `نعتذر، لم نتمكن من إتمام طلب السحب لمبلغ $${request.amount}. لمزيد من التفاصيل، يرجى التواصل مع الدعم الفني.`,
        'error'
      );
      
      toast({ variant: "destructive", title: "تم رفض الطلب" });
      setSelectedRequest(null);
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الإجراء" });
    }
  };

  return (
    <Shell isAdmin>
      <div className="space-y-10 px-6 pt-10 pb-24 max-w-[1600px] mx-auto font-body">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              Liquidity Outflow Monitor
            </div>
            <h1 className="text-4xl font-black text-[#002d4d] tracking-tight">إدارة تدفق السيولة</h1>
            <p className="text-muted-foreground font-bold text-xs">مراجعة أمنية متقدمة لطلبات سحب الأرباح والتحقق من الملاءة المالية.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative w-72">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                <Input 
                  placeholder="ابحث عن مستثمر..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-12 rounded-full bg-white border-gray-100 shadow-sm pr-11 font-bold text-xs focus-visible:ring-2 focus-visible:ring-orange-500" 
                />
             </div>
             <div className="h-10 w-px bg-gray-100 mx-2" />
             <div className="text-right">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">طلبات بانتظار المراجعة</p>
                <p className="text-xl font-black text-orange-600 tabular-nums">
                  {allWithdrawals?.filter(w => w.status === 'pending').length || 0}
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
                سحوبات مكتملة
              </TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-xl px-8 font-black text-[11px] data-[state=active]:bg-red-500 data-[state=active]:text-white">
                طلبات مرفوضة
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
                      <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest">المبلغ المطلوب</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest">وسيلة الاستلام</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest">التوقيت الزمني</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-widest">حالة البروتوكول</TableHead>
                      <TableHead className="text-center text-[10px] font-black uppercase text-gray-400 tracking-widest">التدقيق</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-32"><Loader2 className="h-8 w-8 animate-spin text-gray-200 mx-auto" /></TableCell></TableRow>
                    ) : filteredWithdrawals.length > 0 ? (
                      filteredWithdrawals.map((req) => (
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
                            <span className="font-black text-sm text-red-600 tabular-nums">-${req.amount?.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="rounded-lg text-[9px] font-black border-blue-50 bg-blue-50/30 text-blue-600 px-2.5 py-1">
                              {req.methodName}
                            </Badge>
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
                              {req.status === 'pending' ? 'بانتظار التدقيق' : req.status === 'approved' ? 'حوالة مكتملة' : 'تم الرفض'}
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
                        <TableCell colSpan={6} className="text-center py-40">
                          <div className="flex flex-col items-center gap-4 opacity-20">
                             <ArrowDownCircle className="h-16 w-16 text-[#002d4d] rotate-180" />
                             <p className="text-xs font-black uppercase tracking-[0.4em]">لا توجد طلبات في هذا القطاع</p>
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

      {/* Advanced Audit Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="rounded-[56px] border-none shadow-2xl p-0 max-w-[580px] overflow-hidden font-body flex flex-col max-h-[90vh]">
          
          <div className="bg-[#002d4d] p-10 text-white relative shrink-0">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 pointer-events-none">
                <Landmark className="h-40 w-40" />
             </div>
             <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                   <div className="h-16 w-16 rounded-[28px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                      <ShieldCheck className="h-8 w-8 text-[#f9a885]" />
                   </div>
                   <div className="space-y-0.5">
                      <DialogTitle className="text-2xl font-black">تدقيق مالي متقدم</DialogTitle>
                      <p className="text-[10px] font-black text-blue-200/60 uppercase tracking-[0.3em]">Comprehensive Compliance Protocol</p>
                   </div>
                </div>
                <Badge className="bg-orange-500 text-white border-none font-black text-[9px] px-4 py-1.5 rounded-full shadow-lg">
                   {selectedRequest?.status === 'pending' ? 'قيد المراجعة الفورية' : 'أرشيف المعلومات'}
                </Badge>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-white scrollbar-none">
            
            {/* Advanced User Intelligence Section */}
            <div className="space-y-5">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-[11px] font-black text-[#002d4d] uppercase tracking-widest">استخبارات المركز المالي للمستثمر</span>
                  </div>
                  {loadingStats && <Loader2 className="h-4 w-4 animate-spin text-blue-200" />}
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "الرصيد الحالي", val: targetUser?.totalBalance, icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "إجمالي الإيداعات", val: userStats.totalDeposits, icon: ArrowUpRight, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "إجمالي السحوبات", val: userStats.totalWithdrawals, icon: ArrowDownCircle, color: "text-red-500", bg: "bg-red-50" },
                    { label: "صافي الأرباح", val: targetUser?.totalProfits, icon: Coins, color: "text-orange-500", bg: "bg-orange-50" },
                    { label: "استثمارات نشطة", val: userStats.activeInvestments, icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "استثمارات سابقة", val: userStats.completedInvestments, icon: History, color: "text-gray-500", bg: "bg-gray-100" }
                  ].map((stat, i) => (
                    <div key={i} className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner space-y-2 text-center transition-all hover:bg-white hover:shadow-md group">
                       <stat.icon className={cn("h-4 w-4 mx-auto group-hover:scale-110 transition-transform", stat.color)} />
                       <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{stat.label}</p>
                       <p className={cn("text-sm font-black tabular-nums", stat.color.includes('red') ? 'text-red-600' : 'text-[#002d4d]')}>
                         ${stat.val?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Request Details Section */}
            <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-8">
               <div className="flex justify-between items-end px-2">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المبلغ المطلوب سحبه</p>
                     <h4 className="text-4xl font-black text-red-600 tabular-nums">-${selectedRequest?.amount?.toLocaleString()}</h4>
                  </div>
                  <div className="text-right space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المبلغ الصافي للتحويل</p>
                     <h4 className="text-2xl font-black text-emerald-600 tabular-nums">${((selectedRequest?.amount || 0) - (selectedRequest?.fee || 0)).toLocaleString()}</h4>
                     <p className="text-[8px] font-bold text-gray-300">رسوم السحب: ${selectedRequest?.fee?.toFixed(2) || '0.00'}</p>
                  </div>
               </div>

               <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-2" />

               <div className="space-y-5">
                  <div className="flex items-center gap-2 px-2 text-blue-600">
                     <PieChart className="h-4 w-4" />
                     <span className="text-[11px] font-black uppercase tracking-widest">بيانات استلام الحوالة المعتمدة</span>
                  </div>
                  
                  <div className="grid gap-3">
                     {selectedRequest?.details && Object.entries(selectedRequest.details).map(([key, val]: any) => (
                        <div key={key} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                           <span className="text-[10px] font-black text-gray-400 uppercase">{key}</span>
                           <span className="text-[12px] font-black text-[#002d4d] font-mono break-all max-w-[280px] text-left" dir="ltr">{val}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Compliance Warnings */}
            {targetUser && targetUser.totalBalance < selectedRequest?.amount && (
              <div className="p-6 bg-red-50 rounded-[32px] border border-red-100 flex items-start gap-5 animate-pulse">
                 <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                    <FileWarning className="h-6 w-6 text-red-600" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs font-black text-red-900">تحذير الملاءة المالية:</p>
                    <p className="text-[11px] font-bold text-red-800 leading-[1.8]">
                       رصيد المستثمر الحالي ($ {targetUser.totalBalance.toLocaleString()}) أقل من المبلغ المطلوب سحبه. يرجى تجميد الطلب والتحقق يدوياً من العمليات.
                    </p>
                 </div>
              </div>
            )}
          </div>

          <div className="p-10 bg-gray-50 border-t border-gray-100 shrink-0">
            <DialogFooter className="flex flex-col gap-3 sm:flex-col">
              {selectedRequest?.status === 'pending' ? (
                <>
                  <Button 
                    onClick={() => handleApprove(selectedRequest)} 
                    disabled={processing || (targetUser && targetUser.totalBalance < selectedRequest.amount)}
                    className="w-full h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                  >
                    {processing ? <Loader2 className="animate-spin h-6 w-6" /> : (
                      <>
                        تأكيد وتنفيذ الحوالة المالية
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
