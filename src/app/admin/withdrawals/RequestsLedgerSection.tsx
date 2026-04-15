
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, 
  X, 
  Loader2, 
  ShieldCheck, 
  Search,
  ArrowDownCircle,
  Activity
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { cn } from "@/lib/utils";

/**
 * @fileOverview سجل طلبات السحب والمراجعة v1.0
 */

export function RequestsLedgerSection() {
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const withdrawalsQuery = useMemoFirebase(() => query(collection(db, "withdraw_requests"), orderBy("createdAt", "desc")), [db]);
  const { data: allWithdrawals, isLoading } = useCollection(withdrawalsQuery);

  const filtered = useMemo(() => {
    if (!allWithdrawals) return [];
    return allWithdrawals.filter(req => {
      const matchesStatus = req.status === activeTab;
      const matchesSearch = req.userName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           req.userId?.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [allWithdrawals, activeTab, searchQuery]);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    setProcessingId(id);
    try {
      await updateDoc(doc(db, "withdraw_requests", id), { status, updatedAt: new Date().toISOString() });
      toast({ title: status === 'approved' ? "تم قبول السحب" : "تم رفض السحب" });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في المعالجة" });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-right" dir="rtl">
       <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="relative w-80">
             <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
             <Input placeholder="ابحث عن مستثمر..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-12 rounded-full bg-white border-gray-100 shadow-sm pr-11 font-bold text-xs" />
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
                   <TableHead className="text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">المبلغ الصافي</TableHead>
                   <TableHead className="text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">بوابة الصرف</TableHead>
                   <TableHead className="text-center text-[9px] font-black uppercase text-gray-400 tracking-widest">الإجراءات</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {isLoading ? (
                   <TableRow><TableCell colSpan={4} className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-200" /></TableCell></TableRow>
                 ) : filtered.length > 0 ? (
                   filtered.map(req => (
                     <TableRow key={req.id} className="hover:bg-gray-50/30 border-gray-50">
                        <TableCell className="pr-10 py-5">
                          <div className="text-right">
                             <p className="font-black text-sm text-[#002d4d]">{req.userName}</p>
                             <p className="text-[8px] text-gray-400">ID: {req.userId?.slice(-6)}</p>
                          </div>
                        </TableCell>
                        <TableCell><span className="font-black text-sm text-red-600">-${req.amount?.toLocaleString()}</span></TableCell>
                        <TableCell><Badge variant="outline" className="bg-blue-50 text-blue-600 border-none font-black text-[8px]">{req.methodName}</Badge></TableCell>
                        <TableCell>
                          {activeTab === 'pending' && (
                            <div className="flex items-center justify-center gap-2">
                               <Button onClick={() => handleStatusUpdate(req.id, 'approved')} disabled={!!processingId} size="icon" className="h-9 w-9 rounded-xl bg-emerald-500 text-white shadow-lg"><Check size={18}/></Button>
                               <Button onClick={() => handleStatusUpdate(req.id, 'rejected')} disabled={!!processingId} size="icon" className="h-9 w-9 rounded-xl bg-red-100 text-red-600"><X size={18}/></Button>
                            </div>
                          )}
                        </TableCell>
                     </TableRow>
                   ))
                 ) : (
                   <TableRow><TableCell colSpan={4} className="text-center py-32 opacity-20"><Activity size={48} className="mx-auto mb-4" /><p className="text-xs font-black uppercase">لا توجد سجلات</p></TableCell></TableRow>
                 )}
               </TableBody>
             </Table>
          </CardContent>
       </Card>
    </div>
  );
}
